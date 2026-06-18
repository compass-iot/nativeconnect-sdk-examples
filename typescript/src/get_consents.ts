import { createNodeClient } from "./client"
import { create, toJsonString } from "@bufbuild/protobuf";
import {
  GetConsentsRequestSchema,
  GetConsentsResponseSchema
} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(GetConsentsRequestSchema)

const response = await client.getConsents(request)

console.log(toJsonString(GetConsentsResponseSchema, response, { prettySpaces: 2 }))
