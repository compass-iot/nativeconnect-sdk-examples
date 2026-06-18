# Python Examples

## Quickstart

1. Install the required modules:
```bash
pip install -r requirements.txt --extra-index-url https://buf.build/gen/python
```

2. Set your API key in the `SECRET` constant in `client.py`

3. Run any of the examples, e.g. to run `initiate_vehicle_signup.py`:
```bash
python3 initiate_vehicle_signup.py
```

Note: Please find our API documentation [here](https://api.compassiot.cloud/docs). The proto files for our APIs, can be found [here](https://buf.build/compassiot/api).

## FAQ

### Long-lived Streaming

The HTTP/2 protocol was designed to buffer payload too large to be sent over HTTP/1.1. Hence HTTP timeouts still exist in the streaming world. RPCs which may have long periods of inactivity, such as `RawPointsByVins`, suffer from [HTTP 504](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) timeout if there are no data sent within 5 minutes.

To support such use case, we expose a utility function from `client.py` to create a new stream whenever it gets disconnected due to no data (see `raw_points_by_vins.py` and `realtime_stitched_points_by_vins.py`):
```py
from client import create_native_client, retry_stream, TIMEOUT_SEC

client = create_native_client()

for response in retry_stream(lambda: client.RawPointsByVins(request, timeout=TIMEOUT_SEC)):
    print(response)
```
