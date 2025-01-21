import { createNodeClient } from "./client"
import {create} from "@bufbuild/protobuf";
import {
  InitiateVehicleSignUpRequestSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(InitiateVehicleSignUpRequestSchema, {
  email: "sujith@compassiot.com.au",
  vin: "LRW3F7FS9PC893577"
})

await client.initiateVehicleSignUp(request)
