from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native

def main():
    client = create_native_client()

    request = native.GetLivePointRequest(
        vin="LRW3F7FS9PC893577"
    )

    response = client.GetLivePoint(request)

    print(response)

     
if __name__ == "__main__":
    main()
