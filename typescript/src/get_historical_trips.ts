import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  GetHistoricalTripsRequestSchema,
  GetHistoricalTripsResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(GetHistoricalTripsRequestSchema, {
  vins: ["LRW3F7FS9PC893577"],
  // date range end can be omitted and the current time will be used instead
  filterDates: {
    start: { day: 1, month: 5, year: 2026 },
    end: { day: 31, month: 5, year: 2026 }
  }
})

const response = await client.getHistoricalTrips(request)

console.log(toJsonString(GetHistoricalTripsResponseSchema, response, { prettySpaces: 2 }))
