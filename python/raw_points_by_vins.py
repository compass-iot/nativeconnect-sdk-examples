from client import create_native_client, retry_stream, TIMEOUT_SEC
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.RawPointsByVinsRequest(
        vins=["LRW3F7FS9PC893577", "1C4RJHKG2P8863343"],
        # a unique name to identify the stream and track which packets have already
        # been sent. Reuse the same name on every consecutive stream retry to avoid
        # data duplication.
        unique_identifier="my-raw-points-stream"
    )

    for response in retry_stream(lambda: client.RawPointsByVins(request, timeout=TIMEOUT_SEC)):
        print(response)


if __name__ == "__main__":
    main()
