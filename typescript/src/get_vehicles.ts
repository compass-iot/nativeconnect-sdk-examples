import { EmptySchema } from "@bufbuild/protobuf/wkt";
import { create } from "@bufbuild/protobuf";

import { createNodeClient } from "./client"

const client = createNodeClient()

const request = create(EmptySchema)

const response = await client.getVehicles(request)

console.log(response.toJsonString({ prettySpaces: 2 }))
