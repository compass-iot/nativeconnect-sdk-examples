import { EmptySchema } from "@bufbuild/protobuf/wkt";
import { create, toJsonString } from "@bufbuild/protobuf";
import { GetVehiclesResponseSchema } from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

import { createNodeClient } from "./client"

const client = createNodeClient()

const request = create(EmptySchema)

const response = await client.getVehicles(request)

console.log(toJsonString(GetVehiclesResponseSchema, response, { prettySpaces: 2 }))
