import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  CheckCompatibilityRequestSchema,
  CheckCompatibilityResponseSchema,
  Region,
  Usecase
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(CheckCompatibilityRequestSchema, {
  vin: "LRW3F7FS9PC893577",
  region: Region.COUNTRY_AUS,
  usecase: Usecase.B2C
})

const response = await client.checkCompatibility(request)

console.log(toJsonString(CheckCompatibilityResponseSchema, response, { prettySpaces: 2 }))
