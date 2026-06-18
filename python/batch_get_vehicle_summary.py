from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.BatchGetVehicleSummaryRequest(
        vins=["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"]
    )

    response = client.BatchGetVehicleSummary(request)

    print(response)


if __name__ == "__main__":
    main()
