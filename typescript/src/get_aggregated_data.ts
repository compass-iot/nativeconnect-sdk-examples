import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  AggregatedDataRequestSchema,
  AggregatedResponseSchema,
  AggregateVariant,
  VehicleGroupBy
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";
import { TimeUnit } from "@buf/compassiot_model.bufbuild_es/compassiot/compass/v1/time_pb";

const client = createNodeClient()

const request = create(AggregatedDataRequestSchema, {
  aggregateVariant: AggregateVariant.COST,
  // if vins is empty, aggregates over all vehicles in the workspace
  vins: ["LRW3F7FS9PC893577"],
  dateTimeRange: {
    start: { day: 1, month: 5, year: 2026 },
    end: { day: 31, month: 5, year: 2026 }
  },
  // GroupBy
  granularity: TimeUnit.DAY,
  vehicleGroupBy: VehicleGroupBy.VIN
})

const response = await client.getAggregatedData(request)

console.log(toJsonString(AggregatedResponseSchema, response, { prettySpaces: 2 }))
