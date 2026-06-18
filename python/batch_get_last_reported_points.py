from client import create_native_client
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.BatchGetLastReportedPointsRequest(
        vins=["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
        points=5
    )

    response = client.BatchGetLastReportedPoints(request)

    print(response)


if __name__ == "__main__":
    main()
