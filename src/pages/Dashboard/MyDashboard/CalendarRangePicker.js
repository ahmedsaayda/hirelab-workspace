import React, { useState } from "react";

const CalendarRangePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    
    const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return currentDateObj >= startDate && currentDateObj <= endDate;
  };

  const isRangeStart = (day) => {
    if (!startDate) return false;
    return (
      day === startDate.getDate() &&
      currentDate.getMonth() === startDate.getMonth() &&
      currentDate.getFullYear() === startDate.getFullYear()
    );
  };

  const isRangeEnd = (day) => {
    if (!endDate) return false;
    return (
      day === endDate.getDate() &&
      currentDate.getMonth() === endDate.getMonth() &&
      currentDate.getFullYear() === endDate.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      // Start new range
      setStartDate(clickedDate);
      setEndDate(null);
      setIsSelectingRange(true);
    } else if (startDate && !endDate) {
      // Complete the range
      if (clickedDate < startDate) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
      setIsSelectingRange(false);
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
      days.push(
        <div
          key={`prev-${daysInPrevMonth - i}`}
          className="flex items-center justify-center w-8 h-8 text-gray-400 text-sm cursor-pointer hover:bg-gray-100 hover:rounded-full"
        >
          {daysInPrevMonth - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isStart = isRangeStart(day);
      const isEnd = isRangeEnd(day);
      const inRange = isInRange(day);
      
      let className = "flex items-center justify-center w-8 h-8 text-sm cursor-pointer transition-colors ";
      
      if (isStart || isEnd) {
        className += "bg-blue-500 text-white font-medium rounded-full ";
      } else if (inRange) {
        className += "bg-blue-100 text-blue-700 font-medium rounded-full ";
      } else if (isCurrentDay) {
        className += "bg-gray-200 text-gray-900 font-medium rounded-full ";
      } else {
        className += "text-gray-700 hover:bg-gray-100 hover:rounded-full ";
      }
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={className}
        >
          {day}
        </div>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="flex items-center justify-center w-8 h-8 text-gray-400 text-sm cursor-pointer hover:bg-gray-100 hover:rounded-full"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={getPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={getNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="flex items-center justify-center h-8 text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CalendarRangePicker;
