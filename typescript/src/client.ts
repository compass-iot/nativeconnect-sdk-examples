import {createConnectTransport as createNodeTransport} from "@connectrpc/connect-node"
import {
	createConnectTransport as createWebTransport,
	ConnectTransportOptions as WebTransportOptions
} from "@connectrpc/connect-web"
import {Code, ConnectError, createClient, Client, type Interceptor} from "@connectrpc/connect"
import {Service} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const HOST = "https://nativeconnect.cloud"
const SECRET = "<!!!!! INSERT YOUR API KEY HERE !!!!!>"
const TIMEOUT_MS = 1000 * 60 * 3  // used by retryStream

// Backoff constant (Base Multiplier)
const BACKOFF_CONSTANT = 5_000;
const baseBackoff = () => ({stage: 0, at: new Date()})

let backoffState: { stage: number, at: Date } = baseBackoff();

async function exponentialBackoff() {
	// Increment Backoff Stage - Do immediately to prevent race condition
	backoffState = {stage: backoffState.stage + 1, at: new Date()};

	// Wait $t = b * log(c)$ milliseconds.
	const waitTimeMs = BACKOFF_CONSTANT * Math.log(backoffState.stage)
	await new Promise((resolve) => {
		console.debug(`Buffering Error Handling ${waitTimeMs}ms`);
		setTimeout(resolve, waitTimeMs);
	});
}

function resetBackoff() {
	// Reset the backoff stage to 0 (initial).
	backoffState = {stage: Math.max(backoffState.stage - 1, 0), at: new Date() }
}

function createAuthInterceptor(secret: string, client: Client<typeof Service>): Interceptor {
	// Need a `let` so we can replace the access token for long-lived usage
	let at = ""

	return next => async req => {
		try {
			if (at === "") {
				const {accessToken} = await client.authenticate({token: secret})
				at = accessToken
			}
			req.header.set("Authorization", `Bearer ${at}`)
			return await next(req)
		} catch (err) {
			if (err instanceof ConnectError) {
				if (err.code === Code.Unauthenticated) {
					const {accessToken} = await client.authenticate({token: secret})
					at = accessToken
					req.header.set("Authorization", `Bearer ${at}`)
					return await next(req)
				}
			}
			throw err
		}
	}
}

function createNodeClient(): Client<typeof Service> {
	const noauthClient = createClient(Service, createNodeTransport({
		baseUrl: HOST,
		httpVersion: "1.1",
	}))
	const transport = createNodeTransport({
		baseUrl: HOST,
		httpVersion: "2",
		interceptors: [createAuthInterceptor(SECRET, noauthClient)]
	})
	return createClient(Service, transport);
}

function createWebClient(options?: Omit<WebTransportOptions, "baseUrl">): Client<typeof Service> {
	const noauthClient = createClient(Service, createWebTransport({
		baseUrl: HOST,
	}))
	const transport = createWebTransport({
		baseUrl: HOST,
		interceptors: [createAuthInterceptor(SECRET, noauthClient)],
		...options,
	})
	return createClient(Service, transport);
}

function createAbortListener<T>(abortController: AbortController): Promise<T> {
	return new Promise((_, reject) => {
		abortController.signal.addEventListener(
			"abort",
			() => {
				console.warn("Stream Aborted by abortController.");
				reject(new Error("Operation aborted"));
			},
			{once: true},
		);
	})
}

async function* retryStream<T>(
	stream: () => AsyncIterable<T>,
	abortController?: AbortController,
): AsyncIterable<T> {
	for (; ;) {
		try {
			const iterable = stream();
			for await (const item of iterable) {
				const promised = await Promise.race(abortController ? [createAbortListener<T>(abortController), item] : [item]);
				yield promised;
			}

			if (abortController && abortController.signal.aborted) {
				console.debug("Iterable experienced external call for abort.")
				return
			}

			// Made valid connection, we can reset the backoff.
			resetBackoff();
			console.log("Backoff Reset.");
			console.debug("Iterable terminated nominally, restarting...");
		} catch (err) {
			const asConnect = ConnectError.from(err).code;
			switch (asConnect) {
				case Code.DeadlineExceeded:
					console.warn("DeadlineExceeded, retrying stream");
					continue;
				case Code.Unknown: {
					console.error(
						`Unknown error code: ${asConnect}. Retrying Stream.`,
						err,
					);
					break;
				}
				default: {
					console.warn("Backoff-expected connect code: ", err);
					break;
				}
			}
		}

		console.log("Awaiting stream backoff timeout");
		await exponentialBackoff();
	}
}

export {createNodeClient, createWebClient, retryStream, TIMEOUT_MS}
