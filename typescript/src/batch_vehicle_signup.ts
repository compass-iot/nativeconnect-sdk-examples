import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import { EmptySchema } from "@bufbuild/protobuf/wkt";
import {
  BatchVehicleSignUpRequestSchema,
  BatchVehicleSignUpResponseSchema,
  Region
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(BatchVehicleSignUpRequestSchema, {
  consentEmail: "consent_owner@email.com",
  consents: [
    {
      region: Region.COUNTRY_AUS,
      providerAuth: {
        vin: "LRW3F7FS9PC893577",
        additionalAuthInfo: { case: "empty", value: create(EmptySchema) }
      }
    },
    {
      region: Region.COUNTRY_AUS,
      providerAuth: {
        vin: "1C4RJHKG2P8863343",
        additionalAuthInfo: { case: "odometer", value: { odometer: 12345 } }
      }
    },
    {
      region: Region.COUNTRY_AUS,
      providerAuth: {
        vin: "JTMAAABJ004070717",
        additionalAuthInfo: {
          case: "usernamePassword",
          value: { username: "owner@example.com", password: "<<<PASSWORD>>>" }
        }
      }
    }
  ]
})

const response = await client.batchVehicleSignUp(request)

console.log(toJsonString(BatchVehicleSignUpResponseSchema, response, { prettySpaces: 2 }))
