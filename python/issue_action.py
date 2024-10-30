from client import create_native_client
import compassiot.native.v1.native_pb2 as native


def main():
    client = create_native_client()

    request = native.IssueActionRequest(
        vin="",
        lock=native.SetLockCommand(
            locked=True
        )
    )

    # Returns empty, check using NativeGetLatestPoint
    client.NativeIssueAction(request)

     
if __name__ == "__main__":
    main()
