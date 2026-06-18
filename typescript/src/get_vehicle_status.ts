import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  GetVehicleStatusRequestSchema,
  GetVehicleStatusResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(GetVehicleStatusRequestSchema, {
  vin: "LRW3F7FS9PC893577"
})

const response = await client.getVehicleStatus(request)

console.log(toJsonString(GetVehicleStatusResponseSchema, response, { prettySpaces: 2 }))
