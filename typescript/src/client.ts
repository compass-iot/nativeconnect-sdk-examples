import { Service } from "@buf/nativeconnect_api.connectrpc_es/nativeconnect/api/v1/nativeconnect_connect"
import { createConnectTransport as createNodeTransport } from "@connectrpc/connect-node"
import { createConnectTransport as createWebTransport, ConnectTransportOptions as WebTransportOptions } from "@connectrpc/connect-web"
import { Code, ConnectError, createPromiseClient, PromiseClient, type Interceptor } from "@connectrpc/connect"

const HOST = "https://nativeconnect.cloud"
const SECRET = "<<!!!!! INSERT YOUR API KEY HERE !!!!!>"
const TIMEOUT_MS = 1000 * 60 * 5  // used by retryStream

// Backoff constant (Base Multiplier)
const BACKOFF_CONSTANT = 5_000;
const baseBackoff = () => ({ stage: 0, at: new Date() })

const backoffState: { stage: number, at: Date } = baseBackoff();

async function exponentialBackoff() {
	const backoffStage = getDefaultStore().get(backoffStateAtom);

	// Increment Backoff Stage - Do immediately to prevent race condition
  backoffState = { stage: backoffState.stage + 1, at: new Date() };

	// Wait $t = b * log(c)$ milliseconds.
	const waitTimeMs = BACKOFF_CONSTANT * Math.log(backoffStage.stage)
	await new Promise((resolve) => {
		console.debug(`Buffering Error Handling ${waitTimeMs}ms`);
		setTimeout(resolve, waitTimeMs);
	});
}

function resetBackoff() {
	// Reset the backoff stage to 0 (initial).
  backoffState = { stage: Math.max(backoffStage.stage - 1, 0), at: new Date() });
}

function createAuthInterceptor(secret: string, client: PromiseClient<typeof Service>): Interceptor {
  // Need a `let` so we can replace the access token for long-lived usage
  let at = ""

  return next => async req => {
    try {
      if (at === "") {
        const { accessToken } = await client.authenticate({ token: secret })
        at = accessToken
      }
      req.header.set("Authorization", `Bearer ${at}`)
      return await next(req)
    }
    catch (err) {
      if (err instanceof ConnectError) {
        if (err.code === Code.Unauthenticated) {
          const { accessToken } = await client.authenticate({ token: secret })
          at = accessToken
          req.header.set("Authorization", `Bearer ${at}`)
          return await next(req)
        }
      }
      throw err
    }
  }
}

function createNodeClient(): PromiseClient<typeof Service> {
  const noauthClient = createPromiseClient(Service, createNodeTransport({
    baseUrl: HOST,
    httpVersion: "1.1",
  }))
  const transport = createNodeTransport({
    baseUrl: HOST,
    httpVersion: "2",
    interceptors: [createAuthInterceptor(SECRET, noauthClient)]
  })
  return createPromiseClient(Service, transport)
}

function createWebClient(options?: Omit<WebTransportOptions, "baseUrl">): PromiseClient<typeof Service> {
  const noauthClient = createPromiseClient(Service, createWebTransport({
    baseUrl: HOST,
  }))
  const transport = createWebTransport({
    baseUrl: HOST,
    interceptors: [createAuthInterceptor(SECRET, noauthClient)],
    ...options,
  })
  return createPromiseClient(Service, transport)
}

function createAbortListener<T>(abortController: AbortController): Promise<T> {
  return new Promise((_, reject) => {
		abortController.signal.addEventListener(
			"abort",
			() => {
				console.warn("Stream Aborted by abortController.");
				reject(new Error("Operation aborted"));
			},
			{ once: true },
		);
	})
}

async function* retryStream<T>(
	stream: () => AsyncIterable<T>,
	abortController?: AbortController,
): AsyncIterable<T> {
	for (;;) {
		try {
			const iterable = stream();
			for await (const item of iterable) {
				const promised = await Promise.race(abortController ? [createAbortListener(abortController), item] : [item]);
				yield promised;
			}

			const isAborted = abortController.current.signal.aborted;
			if (isAborted) {
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
					console.error("Unknown, non-connect code: ", err);
					break;
				}
			}
		}

		console.log("Awaiting stream backoff timeout");
		await exponentialBackoff();
	}
}

export { createNodeClient, createWebClient, retryStream, TIMEOUT_MS }
