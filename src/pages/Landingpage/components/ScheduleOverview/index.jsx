import React from "react";
import { Phone, Video, MessageCircle, Users } from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
export default function ScheduleOverview({ dailyScheduleList }) {
  const generateTimeLabel = (hour, minute) => {
    const isPM = hour >= 12;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${isPM ? "PM" : "AM"}`;
  };
  const schedulesByDate = dailyScheduleList.reduce((acc, schedule) => {
    const date = schedule?.dateTimeSlot?.startDate ?? new Date();
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {});

  const participants = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  ];

  console.log("schedulesByDate", schedulesByDate);

  const colors = ["#2196F3", "#FFC107", "#E91E63", "#4CAF50", "#FF5722"];
  const formatDate = (dateString) => {
    console.log("eeeeeeeeeeeeeeeee", dateString);
    const currentDate = new Date();
    const targetDate = new Date(dateString);

    // Check if the target date is today, tomorrow, or yesterday
    if (isToday(targetDate)) {
      return "";
    } else if (isTomorrow(targetDate)) {
      return "Tomorrow";
    } else if (isYesterday(targetDate)) {
      return "Yesterday";
    } else {
      return format(targetDate ?? currentDate, "dd MMM yyyy"); // Format as "21 Jan 2025"
    }
  };

  return (
    <div className="p-2 md:px-6   mx-auto border rounded-lg shadow-sm  customScrollbar h-[400px] overflow-y-scroll ">
      {schedulesByDate &&
        Object.entries(schedulesByDate).map(([date, schedules], index) => (
          <div key={date} className="p-2 mb-8 rounded-lg border shadow-sm">
            {/* <h5 className="text-xl font-semibold">{date}</h5> */}
            {/* <div className="grid h-auto overflow-y-auto grid-cols-[100px_1fr] gap-4"> */}
            <div className="">
              {/* <div className="flex flex-col">
                {schedules.map((schedule, idx) => (
                  <div
                    key={idx}
                    className="flex justify-end items-center pr-4 h-16 text-sm border-b text-[#000000]"
                  >
                    {schedule?.dateTimeSlot?.startTime &&
                      generateTimeLabel(
                        parseInt(
                          schedule?.dateTimeSlot?.startTime.split(":")[0],
                          10
                        ),
                        parseInt(
                          schedule?.dateTimeSlot?.startTime.split(":")[1],
                          10
                        )
                      )}
                  </div>
                ))}
              </div> */}
              <div className="flex flex-col gap-1">
                {schedules &&
                  schedules?.map((schedule, idx) => (
                    <div
                      key={schedule._id}
                      // className="flex flex-col flex-wrap justify-center items-start px-4 rounded-md shadow-md md:flex-row md:items-center md:justify-between"
                      className="px-4 py-2 rounded-md shadow-md"
                      style={{
                        backgroundColor: `${colors[idx % colors.length]}12`,
                        borderLeft: colors[idx % colors.length],
                        borderStyle: "solid",
                        borderWidth: "1px 1px 1px 4px ",
                        color: "black",
                      }}
                    >
                      <div className="">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col">
                            <h4
                              className="py-1 font-semibold"
                              style={{
                                color: `${colors[idx % colors.length]}`,
                              }}
                            >
                              {schedule.eventTitle || "Event Title"}
                            </h4>
                            <p className="py-1 text-sm text-wrap">
                              {schedule.description || "event description"}
                            </p>
                          </div>
                          <div className="flex flex-col  justify-end min-w-[145px] text-gray-600">
                            <span className="ml-auto">
                              {date && formatDate(date)}
                            </span>
                            <span className="ml-auto text-sm">
                              {schedule?.dateTimeSlot?.startTime &&
                                generateTimeLabel(
                                  parseInt(
                                    schedule?.dateTimeSlot?.startTime.split(
                                      ":"
                                    )[0],
                                    10
                                  ),
                                  parseInt(
                                    schedule?.dateTimeSlot?.startTime.split(
                                      ":"
                                    )[1],
                                    10
                                  )
                                )}{" "}
                              -{" "}
                              {schedule?.dateTimeSlot?.endTime &&
                                generateTimeLabel(
                                  parseInt(
                                    schedule?.dateTimeSlot?.endTime.split(
                                      ":"
                                    )[0],
                                    10
                                  ),
                                  parseInt(
                                    schedule?.dateTimeSlot?.endTime.split(
                                      ":"
                                    )[1],
                                    10
                                  )
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-between items-center">
                        <div className="flex overflow-hidden -space-x-2">
                          {participants?.map((avatar, index) => (
                            <img
                              key={index}
                              className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                              src={avatar}
                              alt={`Participant ${index + 1}`}
                            />
                          ))}
                        </div>
                        <div className="flex gap-3 items-center md:gap-4">
                          <button className="p-2 bg-white rounded-full shadow-sm transition-colors hover:bg-gray-50">
                            <Phone
                              className="w-5 h-5"
                              style={{
                                color: `${colors[idx % colors.length]}`,
                              }}
                            />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-sm transition-colors hover:bg-gray-50">
                            <Video
                              className="w-5 h-5 text-gray-600"
                              style={{
                                color: `${colors[idx % colors.length]}`,
                              }}
                            />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-sm transition-colors hover:bg-gray-50">
                            <MessageCircle
                              className="w-5 h-5 text-gray-600"
                              style={{
                                color: `${colors[idx % colors.length]}`,
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
