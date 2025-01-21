import * as native from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb"


import { TIMEOUT_MS, createNodeClient, retryStream } from "./client"

const client = createNodeClient()

const request = new native.RealtimeRawPointByVinsRequest({
  vins: ["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
  maxStalenessMinutes: 3n,
})

for await (const response of retryStream(() => client.realtimeRawPointByVins(request, { timeoutMs: TIMEOUT_MS }))) {
  console.log(response.toJsonString({ prettySpaces: 2 }))
}
