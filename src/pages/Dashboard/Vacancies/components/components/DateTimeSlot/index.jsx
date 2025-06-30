import { TimePicker, Space } from "antd";
import React from "react";
import dayjs from "dayjs";

const DateTimeSlot = ({ onDateChange, value }) => {
  console.log("DateTimeSlotValue", value);

  // Parse the initial value if it exists
  const initialStartTime =
    value && value.startTime ? dayjs(value.startTime, "HH:mm") : null;

  const initialEndTime =
    value && value.endTime ? dayjs(value.endTime, "HH:mm") : null;

  const onStartTimeChange = (time) => {
    const startTime = time ? time.format("HH:mm") : "";

    // Prepare the object to pass to the parent
    const dateTimeObject = {
      ...value,
      startTime,
    };

    onDateChange(dateTimeObject);
  };

  const onEndTimeChange = (time) => {
    const endTime = time ? time.format("HH:mm") : "";

    // Prepare the object to pass to the parent
    const dateTimeObject = {
      ...value,
      endTime,
    };

    onDateChange(dateTimeObject);
  };

  return (
    <Space direction="vertical" size={12} className="w-full">
      <div className="flex flex-row gap-2 items-center">
        <TimePicker
          format="HH:mm"
          placeholder="Start Time"
          value={initialStartTime}
          onChange={onStartTimeChange}
          className="flex-1"
        />
        <span>to</span>
        <TimePicker
          format="HH:mm"
          placeholder="End Time"
          value={initialEndTime}
          onChange={onEndTimeChange}
          className="flex-1"
        />
      </div>
    </Space>
  );
};

export { DateTimeSlot };
