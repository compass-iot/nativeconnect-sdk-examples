import { createNodeClient } from "./client"
import {create} from "@bufbuild/protobuf";
import {IssueActionRequestSchema} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb";

const client = createNodeClient()

const request = create(IssueActionRequestSchema, {
  vin: "",
  command: {
    case: "lock",
    value: {
      locked: true
    }
  }
})

// Returns empty
await client.issueAction(request)
