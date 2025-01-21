import { createNodeClient } from "./client"
import {RemoveVehicleRequestSchema} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";
import {create} from "@bufbuild/protobuf";

const client = createNodeClient()

const request = create(RemoveVehicleRequestSchema, {
  vins: [""],
})

// Returns empty
await client.removeVehicle(request)
