from client import create_native_client
import compassiot.compass.v1.time_pb2 as time
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.GetHistoricalTripsRequest(
        vins=["LRW3F7FS9PC893577"],
        # date range end can be omitted and the current time will be used instead
        filter_dates=time.DateTimeRange(
            start=time.LocalDate(day=1, month=10, year=2024),
            end=time.LocalDate(day=31, month=10, year=2024)
        )
    )

    response = client.GetHistoricalTrips(request)

    print(response)


if __name__ == "__main__":
    main()
