from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native
from google.protobuf.empty_pb2 import Empty


def main():
    client = create_native_client()

    request = native.BatchVehicleSignUpRequest(
        consent_email="consent_owner@email.com",
        consents=[
            native.Consent(
                region=native.Region.COUNTRY_AUS,
                provider_auth=native.AuthRequest(
                    vin="LRW3F7FS9PC893577",
                    empty=Empty()
                )
            ),
            native.Consent(
                region=native.Region.COUNTRY_AUS,
                provider_auth=native.AuthRequest(
                    vin="1C4RJHKG2P8863343",
                    odometer=native.OdometerAuth(odometer=12345)
                )
            ),
            native.Consent(
                region=native.Region.COUNTRY_AUS,
                provider_auth=native.AuthRequest(
                    vin="JTMAAABJ004070717",
                    username_password=native.UsernamePasswordAuth(
                        username="owner@example.com",
                        password="<<<PASSWORD>>>"
                    )
                )
            ),
        ]
    )

    response = client.BatchVehicleSignUp(request)

    print(response)


if __name__ == "__main__":
    main()
