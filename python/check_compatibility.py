from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.CheckCompatibilityRequest(
        vin="LRW3F7FS9PC893577",
        region=native.Region.COUNTRY_AUS,
        usecase=native.Usecase.USECASE_B2C
    )

    response = client.CheckCompatibility(request)

    print(response)


if __name__ == "__main__":
    main()