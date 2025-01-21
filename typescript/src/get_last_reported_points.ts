import { createNodeClient } from "./client"
import {
  GetLastReportedPointsRequestSchema, GetLastReportedPointsResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";
import {create, toJsonString} from "@bufbuild/protobuf";

const client = createNodeClient()


const request = create(GetLastReportedPointsRequestSchema, {
  vin: "LRW3F7FS9PC893577",
  points: 3,
})


const response = await client.getLastReportedPoints(request)

console.log(toJsonString(GetLastReportedPointsResponseSchema, response, { prettySpaces: 2 }))
