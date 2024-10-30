import * as native from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb"
import { createNodeClient } from "./client"

const client = createNodeClient()

const request = new native.InitiateVehicleSignUpRequest({
  email: "sujith@compassiot.com.au",
  vin: "LRW3F7FS9PC893577"
})

const response = await client.initiateVehicleSignUp(request)

console.log(response.toJsonString({ prettySpaces: 2 }))
