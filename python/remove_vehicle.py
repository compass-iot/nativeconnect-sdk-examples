from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.RemoveVehicleRequest(
        vins=["LRW3F7FS9PC893577"]
    )

    # Returns empty, check using NativeGetVehicles
    client.RemoveVehicle(request)

     
if __name__ == "__main__":
    main()
