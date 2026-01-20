import React, { useState } from "react";
import { Button, Heading, Img, Text } from "..";
// import { ReactComponent as Icon } from "../../../../assets/img/undraw_time-management_fedt.svg";
// Placeholder Icon component for Next.js
const Icon = ({ className, style }) => (
  <div className={className} style={style}>
    <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="3" />
      <path d="M50 20 L50 50 L70 50" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  </div>
);
import { ClockCircleOutlined } from '@ant-design/icons';
export default function ScheduleOverview1({ filteredSchedule }) {

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : `${hour === 12 ? 12 : hour - 12}:00 PM`;
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  console.log('Re_ran_Template-ScheduleOverview1', filteredSchedule);

  const formatTime = (time) => {
    if (time) {
      const [hour, minute] = time.split(":");
      const formattedHour = parseInt(hour);
      const suffix = formattedHour < 12 ? "AM" : "PM";
      const formattedHour12 = formattedHour === 0 ? 12 : formattedHour > 12 ? formattedHour - 12 : formattedHour;
      return `${formattedHour12}:${minute} ${suffix}`;
    }
  };

  return (

    <>
      {
        filteredSchedule.length > 0 ? (

          <div className="grid customScrollbar h-[400px] border rounded-lg m-1 p-1 pl-0 overflow-y-scroll  grid-cols-[100px_1fr]  gap-4 shadow-lg">
            {/* Time Column */}
            <div className="flex flex-col border-r border-gray-300">
              {timeSlots.map((time, index) => (
                <div
                  key={index}
                  className="h-16 flex items-center justify-end pr-4 text-sm text-[#000000] border-b "
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Events Column */}
            <div className="relative border-b flex flex-col  ">
              {filteredSchedule?.map((item, index) => {
                const { startTime, endTime } = item.dateTimeSlot || {};
                const startHour = parseInt(startTime?.split(":")[0]);
                const startIndex = timeSlots.findIndex((time) =>
                  time.includes(startHour === 0 ? "12:00 AM" : startHour > 12 ? `${startHour - 12}` : `${startHour}`)
                );

                return (
                  <div
                    key={index}
                    className="absolute left-0  cursor-pointer   text-[#000000] rounded-lg shadow-sm  p-2 text-sm"
                    style={{
                      top: `${startIndex * 4}rem`,
                      height: "3.4rem",
                      width: "90%",
                      borderWidth: "1px 1px 1px 4px",
                      borderStyle: "solid",
                      borderColor: "var(--primary-color)",
                      background: "var(--primary-light-3)"
                    }}
                    onMouseEnter={() => setHoveredIndex(index)} // Set hovered index on mouse enter
                    onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
                  >
                    <div className="font-semibold">{item?.eventTitle}</div>
                    <div className="text-xs">
                      <ClockCircleOutlined style={{ fontSize: '10px', color: "#000" }} />{" "}{formatTime(startTime)}{" "} - {" "}{formatTime(endTime)}
                    </div>

                    {hoveredIndex === index && (

                      <div className="absolute z-50 top-12 text-white right-0  border rounded-lg shadow-lg p-4 text-sm"
                        style={{ background: "var(--primary-color)" }}
                      >
                        <div className="font-semibold pb-1">{item?.eventTitle}</div>
                        <div className="text-xs pb-1">
                          <ClockCircleOutlined style={{ fontSize: '10px', color: "#fff" }} />{" "}{formatTime(startTime)}{" "} - {" "}{formatTime(endTime)}
                        </div>
                        <div >
                          {item?.description || "No description available"}
                        </div>
                      </div>

                    )}
                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          <>
            <div className="flex flex-col items-center justify-center  h-[400px] text-slate-900 text-md-start border p-1  gap-4">
              <Text size={"text2xl"}>No tasks on the agenda today. Enjoy the freedom!</Text>
              <Icon className="w-50 h-50 text-blue-500" />

            </div>
          </>
        )
      }

    </>
  );
}
