from client import create_native_client, retry_stream
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.RealtimeRawPointByVinsRequest(
        vins=["LRW3F7FS9PC893577","1C4RJHKG2P8863343"],
        max_staleness_minutes=7
    )

    for response in retry_stream(lambda: client.RealtimeRawPointByVins(request, timeout= 3 * 60)):
        print(response)


if __name__ == "__main__":
    main()
