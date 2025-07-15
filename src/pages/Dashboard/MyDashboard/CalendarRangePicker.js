import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { pickersLayoutClasses } from "@mui/x-date-pickers/PickersLayout";
import dayjs from "dayjs";
import * as React from "react";

export default function CalendarRangePicker() {
  return (
    <div className="mx-auto">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateRangePicker
        displayStaticWrapperAs=""
        displayWeekNumber=""
        calendars={1}
        toolbar={<></>}
        // defaultValue={[dayjs("2022-04-17"), dayjs("2022-04-21")]}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          pt: 1,
          pb: 0,
          maxWidth: "280px",
          transform: "scale(0.85)",
          transformOrigin: "top center",
          '& .MuiPickersCalendarHeader-root': {
            paddingLeft: 1,
            paddingRight: 1,
            marginBottom: 0.5,
          },
          '& .MuiDayCalendar-weekDayLabel': {
            width: '32px',
            height: '32px',
            fontSize: '0.75rem',
          },
          '& .MuiPickersDay-root': {
            width: '32px',
            height: '32px',
            fontSize: '0.75rem',
          },
      [`& .MuiPickersDay-today`]: {
        backgroundColor: '#5207CD',
        borderRadius: '50%', 
        border: '1px solid black',
        color: 'white',
      },
      [`& .MuiPickersDay-root.Mui-selected`]: {
        backgroundColor: '#5207CD',
        color: 'white',
        borderRadius: '50%',
      },
    }}

      />
    </LocalizationProvider>
    </div>
  );
}
