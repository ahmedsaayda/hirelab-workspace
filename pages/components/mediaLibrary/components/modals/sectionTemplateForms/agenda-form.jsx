import React, { useState } from "react";
import { Input, Button, Collapse, Popconfirm } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { message } from 'antd';

const { Panel } = Collapse;
const { TextArea } = Input;



const AgendaForm = ({ 
  initialData, 
  onSave, 
  isSaving 
}) => {
  const defaultSchedule = {
    dateTimeSlot: {
      startTime: "09:00",
      endTime: "17:00"
    },
    eventTitle: "",
    description: ""
  };

  const [formData, setFormData] = useState({
    agendaTitle: initialData?.agendaTitle || "Daily Schedule",
    agendaDescription: initialData?.agendaDescription || "",
    dailyScheduleList: initialData?.dailyScheduleList || [defaultSchedule],
    type: 'agenda'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = formData.dailyScheduleList.map((schedule, i) => 
      i === index ? { ...schedule, [field]: value } : schedule
    );
    handleChange('dailyScheduleList', updatedSchedules);
  };

  const handleTimeChange = (index, timeType, value) => {
    const updatedSchedules = [...formData.dailyScheduleList];
    updatedSchedules[index].dateTimeSlot[timeType] = value;
    handleChange('dailyScheduleList', updatedSchedules);
  };

  const addSchedule = () => {
    handleChange('dailyScheduleList', [...formData.dailyScheduleList, defaultSchedule]);
  };

  const removeSchedule = (index) => {
    handleChange('dailyScheduleList', formData.dailyScheduleList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      message.success("Agenda saved successfully");
    } catch (error) {
      message.error("Failed to save agenda");
      console.error("Error saving agenda:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full !text-blue_gray-700">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <p>Section Title</p>
        <p>{formData.agendaTitle.length}/40</p>
      </div>
      <Input
        value={formData.agendaTitle}
        onChange={(e) => handleChange('agendaTitle', e.target.value)}
        maxLength={40}
        className="w-full border border-solid border-blue_gray-100 rounded-lg"
      />

      {/* Section Description */}
      <div className="flex justify-between items-center">
        <p>Description</p>
        <p>{formData.agendaDescription.length}/120</p>
      </div>
      <TextArea
        value={formData.agendaDescription}
        onChange={(e) => handleChange('agendaDescription', e.target.value)}
        rows={3}
        maxLength={120}
        className="rounded-lg border border-solid border-blue_gray-100"
      />

      {/* Schedule Items */}
      <div className="mt-4">
        <Collapse
          ghost
          className="!border-none"
          expandIconPosition="end"
        >
          {formData.dailyScheduleList.map((schedule, index) => (
            <Panel
              key={index}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{schedule.eventTitle || `Schedule ${index + 1}`}</span>
                  </div>
                  <Popconfirm
                    title="Delete this schedule?"
                    onConfirm={() => removeSchedule(index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="text-red-500 hover:text-red-700">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </Popconfirm>
                </div>
              }
            >
              <div className="flex flex-col gap-4 p-4 border rounded-lg border-blue_gray-100">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p>Event Title</p>
                    <p>{schedule.eventTitle.length}/40</p>
                  </div>
                  <Input
                    value={schedule.eventTitle}
                    onChange={(e) => handleScheduleChange(index, 'eventTitle', e.target.value)}
                    maxLength={40}
                    className="rounded-lg border border-solid border-blue_gray-100"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p>Start Time</p>
                    <Input
                      type="time"
                      value={schedule.dateTimeSlot.startTime}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="rounded-lg border border-solid border-blue_gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <p>End Time</p>
                    <Input
                      type="time"
                      value={schedule.dateTimeSlot.endTime}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="rounded-lg border border-solid border-blue_gray-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p>Description</p>
                    <p>{schedule.description.length}/400</p>
                  </div>
                  <TextArea
                    value={schedule.description}
                    onChange={(e) => handleScheduleChange(index, 'description', e.target.value)}
                    rows={3}
                    maxLength={400}
                    className="rounded-lg border border-solid border-blue_gray-100"
                  />
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>

        <Button
          onClick={addSchedule}
          className="mt-4 flex items-center gap-2"
          icon={<PlusOutlined />}
        >
          Add Schedule
        </Button>
      </div>

      <Button
        onClick={handleSave}
        loading={isSaving}
        className="mt-6 rounded-lg bg-[#0E87FE] text-white hover:bg-[#0B6ECD] transition-colors"
      >
        {initialData ? "Update Agenda" : "Create Agenda"}
      </Button>
    </div>
  );
};

export default AgendaForm;