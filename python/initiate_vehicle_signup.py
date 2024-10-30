from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.InitiateVehicleSignUpRequest(
        vin="LRW3F7FS9PC893577",
        email="sujith@compassiot.com.au"
    )

    response = client.InitiateVehicleSignUp(request)

    print(response)


if __name__ == "__main__":
    main()
