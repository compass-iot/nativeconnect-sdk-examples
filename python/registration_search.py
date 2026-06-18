from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.RegistrationSearchRequest(
        registration=native.Registration(
            plate_number="ABC123",
            registration_region=native.RegistrationRegion.REGISTRATION_AUS_NSW
        )
    )

    response = client.RegistrationSearch(request)

    print(response)


if __name__ == "__main__":
    main()
