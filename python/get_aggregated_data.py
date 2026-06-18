from client import create_native_client
import compassiot.compass.v1.time_pb2 as time
import nativeconnect.api.v1.nativeconnect_pb2 as native


def main():
    client = create_native_client()

    request = native.AggregatedDataRequest(
        aggregate_variant=native.AggregateVariant.AGGREGATE_VARIANT_COST,
        # if vins is empty, aggregates over all vehicles in the workspace
        vins=["LRW3F7FS9PC893577"],
        date_time_range=time.DateTimeRange(
            start=time.LocalDate(day=1, month=5, year=2026),
            end=time.LocalDate(day=31, month=5, year=2026)
        ),
        # GroupBy
        granularity=time.TimeUnit.DAY,
        vehicle_group_by=native.VehicleGroupBy.VEHICLE_GROUP_BY_VIN
    )

    response = client.GetAggregatedData(request)

    print(response)


if __name__ == "__main__":
    main()
