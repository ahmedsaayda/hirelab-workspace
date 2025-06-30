import {
  Alert,
  Button,
  Divider,
  InputNumber,
  Skeleton,
  Space,
  Tooltip,
  message,
  Input
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { GrInfo } from "react-icons/gr";
import { Mention, MentionsInput } from "react-mentions";
import CrudService from "../../../services/CrudService";
import classNamesBody from "../Message/body.module.css";
import classNames from "../Message/example.module.css";
import { removeAtIndex, replaceAtIndex } from "../PartnerSettings";
import { MdOutlineMedicalServices } from "react-icons/md";

const DelayedAutomations = ({ stageId, setDelayedAutomationModal }) => {
  const [softValue, setSoftValue] = useState(null);

  useEffect(() => {
    if (!stageId) return;

    CrudService.getSingle("VacancyStage", stageId).then(({ data }) => {
      setSoftValue(data);
    });
  }, [stageId]);

  const handleUpdate = useCallback(async () => {
    if (!softValue) return;
    if (!stageId) return;

    CrudService.update("VacancyStage", stageId, softValue).then(() => {
      message.success("Saved");
    });
  }, [stageId, softValue]);

  if (!softValue) return <Skeleton active />;
  return (
    <>
      <br />
      {!localStorage.closedAutomatedStageMessageInfo && (
        <Alert
          type="info"
          className="my-1"
          message="You have the option to set up a series of automated messages for candidates who remain inactive at this stage. Each message will be dispatched if a candidate's status remains unchanged in this particular stage for a duration exceeding the time limit you specify in hours. This feature is to enable consistent communication and engagement with candidates throughout the recruitment pipeline."
          banner
          closable
          onClose={() => {
            localStorage.closedAutomatedStageMessageInfo = "true";
          }}
          showIcon
          icon={<img src={"/images/icons/alertIcon.png"}/>}
        />
      )}

      <div className="px-4 py-6 sm:p-8">
        <div className="mt-2">
          {softValue?.messagingAutomation?.map?.((messageTemplate, index) => (
            <div key={index}>
              <div className="space-x-2">
                <div>
                  <div className="flex justify-between">
                    <label className="custom-label">Subject</label>
                    <FaDeleteLeft
                      size={25}
                      title="Delete"
                      className="cursor-pointer text-indigo-500"
                      onClick={() =>
                        setSoftValue((v) => ({
                          ...v,
                          messagingAutomation: removeAtIndex(
                            v.messagingAutomation,
                            index
                          ),
                        }))
                      }
                    />
                  </div>

                  <MentionsInput
                    placeholder="Type # to browse variables"
                    value={messageTemplate.subject}
                    onChange={(_, value) => {
                      setSoftValue((v) => ({
                        ...v,
                        messagingAutomation: replaceAtIndex(
                          v.messagingAutomation,
                          index,
                          {
                            subject: value,
                            body: v.messagingAutomation[index].body,
                            hours: v.messagingAutomation[index].hours,
                          }
                        ),
                      }));
                    }}
                    classNames={classNames}
                    a11ySuggestionsListLabel={"Possible variables"}
                  >
                    <Mention
                      trigger="#"
                      className={"bg-indigo-100"}
                      data={[
                        {
                          id: "candidateFirstname",
                          display: "Candidate's Firstname",
                        },
                        {
                          id: "candidateLastname",
                          display: "Candidate's Lastname",
                        },
                        { id: "candidateEmail", display: "Candidate's Email" },
                        { id: "candidatePhone", display: "Candidate's Phone" },
                        { id: "jobTitle", display: "Job Title" },
                        { id: "jobLocation", display: "Job Location" },
                        {
                          id: "jobApplicationLink",
                          display: "Job Application Link",
                        },
                        { id: "interviewDate", display: "Interview Date" },
                        { id: "interviewTime", display: "Interview Time" },
                        {
                          id: "interviewDateEnd",
                          display: "Interview Ending Date",
                        },
                        {
                          id: "interviewTimeEnd",
                          display: "Interview Ending Time",
                        },
                        {
                          id: "interviewMeetingLink",
                          display: "Interview Meeting Link",
                        },
                        {
                          id: "calendly_cancel_url",
                          display: "Calendly Cancel URL",
                        },
                        {
                          id: "calendly_reschedule_url",
                          display: "Calendly Reschedule URL",
                        },
                        { id: "companyName", display: "Company Name" },
                        { id: "companyWebsite", display: "Company Website" },
                        { id: "companyAddress", display: "Company Address" },
                        {
                          id: "applicationStatus",
                          display: "Application Status",
                        },
                        { id: "rejectionReason", display: "Rejection Reason" },
                        { id: "calendarLink", display: "Calendar Link" },
                        {
                          id: "userCalendarLink",
                          display: "User Calendar Link",
                        },
                        { id: "currentDate", display: "Current Date" },
                        { id: "currentTime", display: "Current Time" },
                        { id: "userFirstname", display: "User Firstname" },
                        { id: "userLastname", display: "User Lastname" },
                        { id: "userEmail", display: "User Email" },
                        { id: "userPhone", display: "User Phone" },
                        { id: "cvLink", display: "CV Submission Link" },
                        { id: "surveyLink", display: "Survey Link" },
                        {
                          id: "interviewTimeRemaining",
                          display: "Interview Remaining Time",
                        },
                      ]}
                    />
                  </MentionsInput>

                  <label className="custom-label">Body</label>
                  <MentionsInput
                    placeholder="Type # to browse variables"
                    value={messageTemplate.body}
                    onChange={(_, value) => {
                      setSoftValue((v) => ({
                        ...v,
                        messagingAutomation: replaceAtIndex(
                          v.messagingAutomation,
                          index,
                          {
                            subject: v.messagingAutomation[index].subject,
                            hours: v.messagingAutomation[index].hours,
                            body: value,
                          }
                        ),
                      }));
                    }}
                    classNames={classNamesBody}
                    a11ySuggestionsListLabel={"Possible variables"}
                  >
                    <Mention
                      trigger="#"
                      className={"bg-indigo-100"}
                      data={[
                        {
                          id: "candidateFirstname",
                          display: "Candidate's Firstname",
                        },
                        {
                          id: "candidateLastname",
                          display: "Candidate's Lastname",
                        },
                        { id: "candidateEmail", display: "Candidate's Email" },
                        { id: "candidatePhone", display: "Candidate's Phone" },
                        { id: "jobTitle", display: "Job Title" },
                        { id: "jobLocation", display: "Job Location" },
                        {
                          id: "jobApplicationLink",
                          display: "Job Application Link",
                        },
                        { id: "interviewDate", display: "Interview Date" },
                        { id: "interviewTime", display: "Interview Time" },
                        {
                          id: "interviewDateEnd",
                          display: "Interview Ending Date",
                        },
                        {
                          id: "interviewTimeEnd",
                          display: "Interview Ending Time",
                        },
                        {
                          id: "interviewMeetingLink",
                          display: "Interview Meeting Link",
                        },
                        {
                          id: "calendly_cancel_url",
                          display: "Calendly Cancel URL",
                        },
                        {
                          id: "calendly_reschedule_url",
                          display: "Calendly Reschedule URL",
                        },
                        { id: "companyName", display: "Company Name" },
                        { id: "companyWebsite", display: "Company Website" },
                        { id: "companyAddress", display: "Company Address" },
                        {
                          id: "applicationStatus",
                          display: "Application Status",
                        },
                        { id: "rejectionReason", display: "Rejection Reason" },
                        { id: "calendarLink", display: "Calendar Link" },
                        {
                          id: "userCalendarLink",
                          display: "User Calendar Link",
                        },
                        { id: "currentDate", display: "Current Date" },
                        { id: "currentTime", display: "Current Time" },
                        { id: "userFirstname", display: "User Firstname" },
                        { id: "userLastname", display: "User Lastname" },
                        { id: "userEmail", display: "User Email" },
                        { id: "userPhone", display: "User Phone" },
                        { id: "cvLink", display: "CV Submission Link" },
                        { id: "surveyLink", display: "Survey Link" },
                        {
                          id: "interviewTimeRemaining",
                          display: "Interview Remaining Time",
                        },
                      ]}
                    />
                  </MentionsInput>
                

                <Space>
                  <label className="custom-label">Delay</label>
                  <Tooltip
                    title={`This message will be sent ${
                      messageTemplate?.hours ?? 0
                    } hour${
                      messageTemplate?.hours > 1 ? "s" : ""
                    } after candidate stays idle in this stage.`}
                  >
                    <GrInfo />
                  </Tooltip>
                </Space>
                
                <div>
                  <InputNumber
                    value={messageTemplate.hours}
                    onChange={(value) => {
                      setSoftValue((v) => ({
                        ...v,
                        messagingAutomation: replaceAtIndex(
                          v.messagingAutomation,
                          index,
                          {
                            subject: v.messagingAutomation[index].subject,
                            hours: value,
                            body: v.messagingAutomation[index].body,
                          }
                        ),
                      }));
                    }}
                  />
                </div>
                </div>

                <Divider />
              </div>
            </div>
          ))}
        </div>

        <button
          className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
          onClick={(e) => {
            setSoftValue((v) => ({
              ...v,
              messagingAutomation: [
                ...v.messagingAutomation,
                { subject: "", body: "", hours: 0 },
              ],
            }));
          }}
        >
          + Add Message
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2">
      <Button onClick={()=>setDelayedAutomationModal(false)} >Cancel</Button>
        <Button
        type="primary"
          onClick={handleUpdate}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default DelayedAutomations;
