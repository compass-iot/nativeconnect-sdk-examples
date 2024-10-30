import * as native from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb"

import { createNodeClient } from "./client"

const client = createNodeClient()

const request = new native.RemoveVehicleRequest({
  vins: [""],
})

// Returns empty
await client.removeVehicle(request)
