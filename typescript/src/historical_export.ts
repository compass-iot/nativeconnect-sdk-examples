import * as time from "@buf/compassiot_model.bufbuild_es/compassiot/compass/v1/time_pb"
import * as native from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb"
import {HistoricalExportFilterType} from "@buf/nativeconnect_api.bufbuild_es/nativeconnect/api/v1/nativeconnect_pb"

import {createNodeClient} from "./client"

const client = createNodeClient()

const request = new native.HistoricalExportRequest({
  filterVins: ["LRW3F7FS9PC893577"],
  filterDates: new time.DateTimeRange({
    start: new time.LocalDate({
      day: 1,
      month: 10,
      year: 2024
    }),
    end: new time.LocalDate({
      day: 31,
      month: 10,
      year: 2024
    }),
    dayOfWeek: [
      time.DayOfWeek.SATURDAY,
      time.DayOfWeek.SUNDAY
    ],
    hourOfDay: Array.from(Array(24).keys())  // 0 to 23
  }),
  filterType: HistoricalExportFilterType.TRIP
})

const response = await client.historicalExport(request)

console.log(response.toJsonString({ prettySpaces: 2 }))
