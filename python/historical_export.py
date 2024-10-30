from client import create_native_client
import compassiot.compass.v1.time_pb2 as time
import nativeconnect.api.v1.nativeconnect_pb2 as native



def main():
    client = create_native_client()

    request = native.HistoricalExportRequest(
        filter_vins=["LRW3F7FS9PC893577"],
        filter_type=native.HistoricalExportFilterType.TRIP,
        filter_dates=time.DateTimeRange(
            start=time.LocalDate(
                day=1,
                month=10,
                year=2023
            ),
            end=time.LocalDate(
                day=10,
                month=10,
                year=2023
            ),
            day_of_week=[
                time.DayOfWeek.MONDAY,
                time.DayOfWeek.WEDNESDAY,
                time.DayOfWeek.FRIDAY,
                time.DayOfWeek.SUNDAY
            ],
            hour_of_day=[i for i in range(24)]  # 0 to 23
        )
    )

    response = client.HistoricalExport(request)

    print(response)

     
if __name__ == "__main__":
    main()
