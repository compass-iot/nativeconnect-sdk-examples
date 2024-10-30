from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native

def main():
    client = create_native_client()

    request = native.GetLastReportedPointsRequest(
        vin="LRW3F7FS9PC893577",
        points=5
    )

    response = client.GetLastReportedPoints(request)

    print(response)

     
if __name__ == "__main__":
    main()
