import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  BatchGetLastReportedPointsRequestSchema,
  BatchGetLastReportedPointsResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(BatchGetLastReportedPointsRequestSchema, {
  vins: ["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
  points: 5
})

const response = await client.batchGetLastReportedPoints(request)

console.log(toJsonString(BatchGetLastReportedPointsResponseSchema, response, { prettySpaces: 2 }))
