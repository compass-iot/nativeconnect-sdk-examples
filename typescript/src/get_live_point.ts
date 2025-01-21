import { createNodeClient } from "./client"
import {create, toJsonString} from "@bufbuild/protobuf";
import {
  GetLivePointRequestSchema,
  GetLivePointResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(GetLivePointRequestSchema, {
  vin: "LRW3F7FS9PC893577"
})

const response = await client.getLivePoint(request)

console.log(toJsonString(GetLivePointResponseSchema, response, { prettySpaces: 2 }))
