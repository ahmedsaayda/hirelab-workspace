import React, { useState } from "react";
import {Text } from '../Text'
const IconButton = ({ onClick, Icon }) => {
  return (
    <button
      className="text-lg font-bold text-gray-700 hover:text-blue-500"
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};

const IncrementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

const DecrementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const TimeSection = ({ label, time, onIncrement, onDecrement, onTogglePeriod }) => {
  return (
    <div className="">
      <Text size={"xl"} as="p" className="!font-normal !text-blue_gray-700_01 p-1" >{label}</Text>
      <div className="flex justify-center items-center p-1 gap-3 border border-slate-300 rounded-lg">
        {/* Hour */}
        <div className="flex flex-col items-center">
          <IconButton onClick={() => onIncrement("hour")} Icon={IncrementIcon} />
          <div className="w-10 text-center font-semibold border border-slate-300 rounded-lg">
            <Text size={"xl"} as="p" className="!font-normal !text-blue_gray-700_01 p-1" >{String(time.hour).padStart(2, "0")}  </Text>
          </div>
          <IconButton onClick={() => onDecrement("hour")} Icon={DecrementIcon} />
        </div>
        <span className="text-lg font-bold">:</span>
        {/* Minute */}
        <div className="flex flex-col items-center">
          <IconButton onClick={() => onIncrement("minute")} Icon={IncrementIcon} />
          <div className="w-10 text-center font-semibold border border-slate-300 rounded-lg">

            <Text size={"xl"} as="p" className="!font-normal !text-blue_gray-700_01 p-1" >{String(time.minute).padStart(2, "0")} </Text>
          </div>
          <IconButton onClick={() => onDecrement("minute")} Icon={DecrementIcon} />
        </div>
        {/* AM/PM Toggle */}
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center ">
          <IconButton onClick={onTogglePeriod} Icon={IncrementIcon} />
          <div className="w-10 text-center font-semibold border border-slate-300 rounded-lg">     <Text size={"xl"} as="p" className="!font-normal !text-blue_gray-700_01 p-1" >{time.period}  </Text></div>
          <IconButton onClick={onTogglePeriod} Icon={DecrementIcon} />
        </div>
      </div>
    </div>
  );
};

const TimeSlot = ({ onTimeChange }) => {
  const [time, setTime] = useState({
    start: { hour: 12, minute: 0, period: "AM" },
    end: { hour: 12, minute: 0, period: "AM" },
  });

  const handleIncrement = (field, type) => {
    setTime((prevTime) => {
      const updated = { ...prevTime };
      const { hour, minute, period } = updated[field];

      if (type === "hour") {
        const newHour = (hour % 12) + 1;
        updated[field] = { hour: newHour, minute, period };
      } else if (type === "minute") {
        const newMinute = (minute + 1) % 60;
        updated[field] = { hour, minute: newMinute, period };
      }

      onTimeChange({ ...updated });
      return updated;
    });
  };

  const handleDecrement = (field, type) => {
    setTime((prevTime) => {
      const updated = { ...prevTime };
      const { hour, minute, period } = updated[field];

      if (type === "hour") {
        const newHour = (hour - 1 + 12) % 12 || 12;
        updated[field] = { hour: newHour, minute, period };
      } else if (type === "minute") {
        const newMinute = (minute - 1 + 60) % 60;
        updated[field] = { hour, minute: newMinute, period };
      }

      onTimeChange({ ...updated });
      return updated;
    });
  };

  const togglePeriod = (field) => {
    setTime((prevTime) => {
      const updated = { ...prevTime };
      updated[field].period = updated[field].period === "AM" ? "PM" : "AM";
      onTimeChange({ ...updated });
      return updated;
    });
  };

  return (
    <div className="w-full flex items-center justify-start gap-4">
      <TimeSection
        label="Start"
        time={time.start}
        onIncrement={(type) => handleIncrement("start", type)}
        onDecrement={(type) => handleDecrement("start", type)}
        onTogglePeriod={() => togglePeriod("start")}
      />
      <TimeSection
        label="End"
        time={time.end}
        onIncrement={(type) => handleIncrement("end", type)}
        onDecrement={(type) => handleDecrement("end", type)}
        onTogglePeriod={() => togglePeriod("end")}
      />
    </div>
  );
};

export { TimeSlot };
