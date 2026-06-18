import { TIMEOUT_MS, createNodeClient, retryStream } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  RawPointsByVinsRequestSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";
import { PositionEventSchema } from "@buf/compassiot_model.bufbuild_es/compassiot/compass/v1/vehicle_pb";

const client = createNodeClient()

const request = create(RawPointsByVinsRequestSchema, {
  vins: ["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
  // a unique name to identify the stream and track which packets have already been
  // sent. Reuse the same name on every consecutive stream retry to avoid data
  // duplication.
  uniqueIdentifier: "my-raw-points-stream"
})

for await (const response of retryStream(() => client.rawPointsByVins(request, { timeoutMs: TIMEOUT_MS }))) {
  console.log(toJsonString(PositionEventSchema, response, { prettySpaces: 2 }))
}
