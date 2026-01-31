import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const formatDateKey = (year, monthIndex, day) => {
  // monthIndex is zero-based
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const CalendarRangePicker = ({
  selectedDate,
  onDateChange,
  highlightedDates = [],
}) => {
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date()
  );

  // Keep viewed month in sync with externally selected date
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        )
      );
    }
  }, [selectedDate]);

  const highlightedSet = useMemo(
    () => new Set(highlightedDates || []),
    [highlightedDates]
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const getPreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const getNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isWeekend = (dayIndex) => {
    return dayIndex === 5 || dayIndex === 6; // Saturday or Sunday in our grid
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (onDateChange) {
      onDateChange(clickedDate);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayIndex = firstDay - 1 - i;
      days.push(
        <div
          key={`prev-${daysInPrevMonth - i}`}
          className={`flex items-center justify-center w-9 h-9 text-gray-300 text-sm cursor-pointer rounded-xl transition-all duration-200 hover:bg-gray-50 ${isWeekend(dayIndex) ? 'text-gray-300' : ''}`}
        >
          {daysInPrevMonth - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelected =
        selectedDate &&
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      const dateKey = formatDateKey(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const hasEvent = highlightedSet.has(dateKey);
      const dayIndex = (firstDay + day - 1) % 7;

      let className =
        "relative flex items-center justify-center w-9 h-9 text-sm cursor-pointer transition-all duration-200 rounded-xl font-medium ";

      if (isSelected) {
        className +=
          "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-200 scale-105 ";
      } else if (isCurrentDay) {
        className +=
          "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-100 ";
      } else if (hasEvent) {
        className +=
          "bg-violet-50 text-violet-700 hover:bg-violet-100 ";
      } else if (isWeekend(dayIndex)) {
        className +=
          "text-gray-400 hover:bg-gray-50 ";
      } else {
        className +=
          "text-gray-700 hover:bg-gray-100 ";
      }

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={className}
        >
          <span className="relative z-10">{day}</span>
          {hasEvent && !isSelected && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-violet-500" />
          )}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      const dayIndex = (firstDay + daysInMonth + day - 1) % 7;
      days.push(
        <div
          key={`next-${day}`}
          className={`flex items-center justify-center w-9 h-9 text-gray-300 text-sm cursor-pointer rounded-xl transition-all duration-200 hover:bg-gray-50 ${isWeekend(dayIndex) ? 'text-gray-300' : ''}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      {/* Modern Header with gradient accent */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-purple-200">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={getPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={getNextMonth}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Week days header with modern styling */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map((day, index) => (
          <div 
            key={day} 
            className={`flex items-center justify-center h-9 text-xs font-semibold uppercase tracking-wider ${
              index >= 5 ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid with enhanced styling */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-full bg-violet-100 border-2 border-violet-300" />
          <span>Event</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarRangePicker;
