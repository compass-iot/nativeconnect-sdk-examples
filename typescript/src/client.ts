import { Service } from "@buf/nativeconnect_api.connectrpc_es/nativeconnect/api/v1/nativeconnect_connect"
import { createConnectTransport as createNodeTransport } from "@connectrpc/connect-node"
import { createConnectTransport as createWebTransport, ConnectTransportOptions as WebTransportOptions } from "@connectrpc/connect-web"
import { Code, ConnectError, createPromiseClient, PromiseClient, type Interceptor } from "@connectrpc/connect"

const HOST = "https://nativeconnect.cloud"
const SECRET = "<<!!!!! INSERT YOUR API KEY HERE !!!!!>"
const TIMEOUT_MS = 1000 * 60 * 5  // used by retryStream

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

async function* retryStream<T>(stream: () => AsyncIterable<T>): AsyncIterable<T> {
  let iterable = stream()
  for (; ;) {
    try {
      for await (const r of iterable) {
        yield r
      }
    } catch (err) {
      switch (ConnectError.from(err).code) {
        case Code.DeadlineExceeded:
          console.log(`DeadlineExceeded, retrying stream`)
          iterable = stream()
          continue
        default:
          throw err
      }
    }
  }
}

export { createNodeClient, createWebClient, retryStream, TIMEOUT_MS }
