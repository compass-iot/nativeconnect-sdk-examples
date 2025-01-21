import { TIMEOUT_MS, createNodeClient, retryStream } from "./client"
import {create, toJsonString} from "@bufbuild/protobuf";
import {
  RealtimeRawPointByVinsRequestSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";
import {PositionEventSchema} from "@buf/compassiot_model.bufbuild_es/compassiot/compass/v1/vehicle_pb";

const client = createNodeClient()

const request = create(RealtimeRawPointByVinsRequestSchema, {
  vins: ["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
  maxStalenessMinutes: 3n,
})

for await (const response of retryStream(() => client.realtimeRawPointByVins(request, { timeoutMs: TIMEOUT_MS }))) {
  console.log(toJsonString(PositionEventSchema, response, { prettySpaces: 2 }))
}
