import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  BatchGetVehicleSummaryRequestSchema,
  BatchGetVehicleSummaryResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(BatchGetVehicleSummaryRequestSchema, {
  vins: ["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"]
})

const response = await client.batchGetVehicleSummary(request)

console.log(toJsonString(BatchGetVehicleSummaryResponseSchema, response, { prettySpaces: 2 }))
