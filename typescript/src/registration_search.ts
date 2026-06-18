import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  RegistrationSearchRequestSchema,
  RegistrationSearchResponseSchema,
  RegistrationRegion
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(RegistrationSearchRequestSchema, {
  registration: {
    plateNumber: "ABC123",
    registrationRegion: RegistrationRegion.REGISTRATION_AUS_NSW
  }
})

const response = await client.registrationSearch(request)

console.log(toJsonString(RegistrationSearchResponseSchema, response, { prettySpaces: 2 }))
