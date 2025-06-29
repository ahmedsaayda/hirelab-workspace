import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Button,
  Card,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import Alert from "antd/es/alert/Alert";
import moment from "moment";
import { FaRedo, FaUndo } from "react-icons/fa";
import { TbRobotFace } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
import { useSelector } from "react-redux";
import { MINIMUM_AI_CHARS } from "../../../data/constants";
import { getPartner } from "../../../redux/auth/selectors";
import AuthService from "../../../service/AuthService";
import CrudService from "../../../service/CrudService";
import MessagingService from "../../../service/MessagingService";
import classNamesBody from "./body.module.css";
import classNames from "./example.module.css";
import useHistory from "./useHistory";

const correctText = (text) =>
  text
    .replace(
      /\[Candidate's Firstname\]/g,
      "@[Candidate's Firstname](candidateFirstname)"
    )
    .replace(
      /\[Candidate's Lastname\]/g,
      "@[Candidate's Lastname](candidateLastname)"
    )
    .replace(/\[Candidate's Email\]/g, "@[Candidate's Email](candidateEmail)")
    .replace(/\[Candidate's Phone\]/g, "@[Candidate's Phone](candidatePhone)")
    .replace(/\[Job Title\]/g, "@[Job Title](jobTitle)")
    .replace(/\[Job Location\]/g, "@[Job Location](jobLocation)")
    .replace(
      /\[Job Application Link\]/g,
      "@[Job Application Link](jobApplicationLink)"
    )
    .replace(/\[Interview Date\]/g, "@[Interview Date](interviewDate)")
    .replace(/\[Interview Time\]/g, "@[Interview Time](interviewTime)")
    .replace(
      /\[Interview Ending Date\]/g,
      "@[Interview Ending Date](interviewDateEnd)"
    )
    .replace(
      /\[Interview Ending Time\]/g,
      "@[Interview Ending Time](interviewTimeEnd)"
    )
    .replace(
      /\[Interview Meeting Link\]/g,
      "@[Interview Meeting Link](interviewMeetingLink)"
    )
    .replace(
      /\[Calendly Cancel URL\]/g,
      "@[Calendly Cancel URL](calendly_cancel_url)"
    )
    .replace(
      /\[Calendly Reschedule URL\]/g,
      "@[Calendly Reschedule URL](calendly_reschedule_url)"
    )
    .replace(/\[Company Name\]/g, "@[Company Name](companyName)")
    .replace(/\[Company Website\]/g, "@[Company Website](companyWebsite)")
    .replace(/\[Company Address\]/g, "@[Company Address](companyAddress)")
    .replace(
      /\[Application Status\]/g,
      "@[Application Status](applicationStatus)"
    )
    .replace(/\[Rejection Reason\]/g, "@[Rejection Reason](rejectionReason)")
    .replace(/\[Calendar Link\]/g, "@[Calendar Link](calendarLink)")
    .replace(/\[Current Date\]/g, "@[Current Date](currentDate)")
    .replace(/\[Current Time\]/g, "@[Current Time](currentTime)")
    .replace(/\[User Firstname\]/g, "@[User Firstname](userFirstname)")
    .replace(/\[User Lastname\]/g, "@[User Lastname](userLastname)")
    .replace(/\[User Email\]/g, "@[User Email](userEmail)")
    .replace(/\[User Phone\]/g, "@[User Phone](userPhone)")
    .replace(/\[CV Submission Link\]/g, "@[CV Submission Link](cvLink)")
    .replace(/\[Survey Link\]/g, "@[Survey Link](surveyLink)")
    .replace(
      /\[Interview Remaining Time\]/g,
      "@[Interview Remaining Time](interviewTimeRemaining)"
    );

const MeetingConfirmationBox = ({ onSend, VacancyId }) => {
  const [subject, setSubject] = useState("");
  const {
    state: body,
    setState: setBody,
    undo: undoBody,
    redo: redoBody,
  } = useHistory("");
  const [includeBCC, setIncludeBcc] = useState(false);
  const [scheduleConfirmationEnabled, setScheduleConfirmationEnabled] =
    useState(true);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [AILoading, setAILoading] = useState(false);
  const [loadedVacancy, setLoadedVacancy] = useState(false);
  const socket = useRef(null);
  const socketPing = useRef(null);
  const partner = useSelector(getPartner);

  const handleReset = () => {
    onSend(subject, body);
    setSubject("");
    setBody("");
    setIncludeBcc(false);
    setScheduleConfirmationEnabled(false);
  };

  const reloadTemplates = useCallback(async () => {
    await CrudService.search("MessageTemplate", 10000000, 1, {
      sort: { createdAt: 1 },
    }).then(({ data }) => {
      setTemplates(data.items);
    });
  }, []);

  useEffect(() => {
    reloadTemplates();
  }, [reloadTemplates]);

  useEffect(() => {
    const selected = templates.find((t) => t._id === selectedTemplate);
    if (selected) {
      setSubject(selected.subject);
      setBody(selected.message);
      setIncludeBcc(selected.includeBCC);
    }
  }, [selectedTemplate, templates]);

  useEffect(() => {
    AuthService.me().then(({ data }) => {
      if (data) {
        setMe(data.me);
      }
    });

    CrudService.getSingle("Vacancy", VacancyId).then(({ data }) => {
      setLoadedVacancy(true);
      setSubject(data.scheduleConfirmationSubject);
      setBody(data.scheduleConfirmationBody);
      setIncludeBcc(data.scheduleConfirmationIncludeBCC);
      setScheduleConfirmationEnabled(data.scheduleConfirmationEnabled);
    });
  }, []);

  if (!me) return <Skeleton active />;
  if (!loadedVacancy) return <Skeleton active />;
  return (
    <>
      {!localStorage?.["info-box-AFDSFWE"] && (
        <Alert
          className="my-5"
          type="info"
          message="Customize your interview confirmation message here. Include essential details like the interview link, date, and time. Save your template to ensure candidates receive immediate confirmation upon booking."
          closable
          onClose={() => (localStorage["info-box-AFDSFWE"] = true)}
        />
      )}

      <div className="mb-5">
        <Space size={20}>
          <label className="font-bold">Enable Interview Confirmations</label>
          <Switch
            checked={scheduleConfirmationEnabled}
            onChange={(e) => setScheduleConfirmationEnabled(e)}
          />
        </Space>
      </div>

      {scheduleConfirmationEnabled && (
        <>
          <label className="font-bold">Template</label>
          <div className="w-full flex items-center">
            <Select
              className="grow"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e)}
              showSearch
              filterOption={(input, option) => {
                // Filter based on the label (template.subject)
                const label = option.label
                  .replace(/\@\[/g, "")
                  .replace(/\]\((.)*\)/g, "")
                  .toLowerCase();
                return label.includes(input.toLowerCase());
              }}
            >
              {templates.map((t) => (
                <Select.Option
                  value={t._id}
                  label={
                    t.subject
                      .replace(/\@\[/g, "")
                      .replace(/\]\((.)*\)/g, "")
                      .slice(0, 40) || "-"
                  }
                >
                  <Space className="flex justify-between">
                    <div>
                      {t.subject
                        .replace(/\@\[/g, "")
                        .replace(/\]\((.)*\)/g, "")
                        .slice(0, 40) || "-"}
                    </div>
                    <div>
                      <Popconfirm
                        title="Sure to delete?"
                        onConfirm={async () => {
                          setLoading(true);
                          try {
                            await CrudService.delete("MessageTemplate", t._id);
                            await reloadTemplates();
                            setSelectedTemplate(null);
                          } catch (e) {
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          size="small"
                          danger
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  </Space>
                </Select.Option>
              ))}
            </Select>
            <button
              onClick={async () => {
                if (!subject)
                  return message.error("Please enter a subject line");
                if (!body) return message.error("Message cannot be empty");

                setLoading(true);
                try {
                  const current = await CrudService.create("MessageTemplate", {
                    subject: subject,
                    message: body,
                    includeBCC,
                  });
                  await reloadTemplates();
                  if (current?.data?.result?._id)
                    setSelectedTemplate(current?.data?.result?._id);
                } catch (e) {
                } finally {
                  setLoading(false);
                }
              }}
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
              disabled={loading}
            >
              {!loading ? "Save Current" : <Spin>Save Current</Spin>}
            </button>
          </div>

          <br />

          <div>
            <Space size={20}>
              <label className="font-bold">Include me in BCC</label>
              <Switch checked={includeBCC} onChange={(e) => setIncludeBcc(e)} />
            </Space>
          </div>

          <br />

          <label className="font-bold">Subject</label>
          <MentionsInput
            placeholder="Type # to browse variables"
            value={subject}
            onChange={(_, value) => setSubject(value)}
            // onKeyDown={(e) => console.log("keydown", e.key)}
            classNames={classNames}
            a11ySuggestionsListLabel={"Possible variables"}
          >
            <Mention
              trigger="#"
              className={"bg-indigo-100"}
              data={[
                { id: "candidateFirstname", display: "Candidate's Firstname" },
                { id: "candidateLastname", display: "Candidate's Lastname" },
                { id: "candidateEmail", display: "Candidate's Email" },
                { id: "candidatePhone", display: "Candidate's Phone" },
                { id: "jobTitle", display: "Job Title" },
                { id: "jobLocation", display: "Job Location" },
                { id: "jobApplicationLink", display: "Job Application Link" },
                { id: "interviewDate", display: "Interview Date" },
                { id: "interviewTime", display: "Interview Time" },
                { id: "interviewDateEnd", display: "Interview Ending Date" },
                { id: "interviewTimeEnd", display: "Interview Ending Time" },
                {
                  id: "interviewMeetingLink",
                  display: "Interview Meeting Link",
                },
                { id: "calendly_cancel_url", display: "Calendly Cancel URL" },
                {
                  id: "calendly_reschedule_url",
                  display: "Calendly Reschedule URL",
                },
                { id: "companyName", display: "Company Name" },
                { id: "companyWebsite", display: "Company Website" },
                { id: "companyAddress", display: "Company Address" },
                { id: "applicationStatus", display: "Application Status" },
                { id: "rejectionReason", display: "Rejection Reason" },
                { id: "calendarLink", display: "Calendar Link" },
                { id: "userCalendarLink", display: "User Calendar Link" },
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

          <br />

          <div className="flex justify-between">
            <label className="font-bold">Message</label>
            <Space>
              <button
                className="px-2 py-1 text-sm bg-white-500 text-indigo-500 border border-indigo-500 rounded"
                onClick={undoBody}
                type="secondary"
              >
                <FaUndo />
              </button>
              <button
                className="px-2 py-1 text-sm bg-white-500 text-indigo-500 border border-indigo-500 rounded"
                onClick={redoBody}
                type="secondary"
              >
                <FaRedo />
              </button>
              {AILoading && <Spin />}

              <TbRobotFace
                loading={AILoading}
                size={18}
                className="cursor-pointer"
                onClick={() => {
                  if (AILoading) return;
                  if (!body)
                    return message.info("Please write some text first");
                  if (body?.length < MINIMUM_AI_CHARS)
                    return message.info(
                      `AI needs a little more context. Please write at least ${MINIMUM_AI_CHARS} characters.`
                    );

                  socket.current = new WebSocket(
                    `wss://booklified-chat-socket.herokuapp.com`
                  );

                  socket.current.addEventListener("open", async () => {
                    socketPing.current = setInterval(
                      () => socket.current.send(JSON.stringify({ id: "PING" })),
                      30000
                    );
                    const content = `Hello, I need your expertise in transforming the following email text into a highly professional version. Please apply your literary skills to rewrite this text. Elevate its language, make it more engaging to read. Here's the text:
                
                ${body}
                
                ________
                You need to use the following structure for variables: [Candidate's Firstname]
                
                Here is a list of specified variables:
                [
                  { id: "candidateFirstname", display: "Candidate's Firstname" },
                  { id: "candidateLastname", display: "Candidate's Lastname" },
                  { id: "candidateEmail", display: "Candidate's Email" },
                  { id: "candidatePhone", display: "Candidate's Phone" },
                  { id: "jobTitle", display: "Job Title" },
                  { id: "jobLocation", display: "Job Location" },
                  { id: "jobApplicationLink", display: "Job Application Link" },
                  { id: "interviewDate", display: "Interview Date" },
                  { id: "interviewTime", display: "Interview Time" },
                  { id: "interviewDateEnd", display: "Interview Ending Date" },
                  { id: "interviewTimeEnd", display: "Interview Ending Time" },
                  { id: "interviewMeetingLink", display: "Interview Meeting Link" },
                  { id: "calendly_cancel_url", display: "Calendly Cancel URL" },
                  { id: "calendly_reschedule_url", display: "Calendly Reschedule URL" },
                  { id: "companyName", display: "Company Name" },
                  { id: "companyWebsite", display: "Company Website" },
                  { id: "companyAddress", display: "Company Address" },
                  { id: "applicationStatus", display: "Application Status" },
                  { id: "rejectionReason", display: "Rejection Reason" },
                  { id: "calendarLink", display: "Calendar Link" },
                  { id: "userCalendarLink", display: "User Calendar Link" },
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
                        ]
                        
                        It is imperative that you DO NOT use any variables other than the ones specified.
                        
                        It is imperative to use the exact format as it is written here. Here are some possible examples of how a variable can look like inside your text:
                        [Current Time]
                        [Company Name]
                        [Job Location]
                        [Candidate's Phone]
                        [Candidate's Email]
                        
                        It is imperative that your reply contains nothing beyond the upgraded text. Please only answer with the enhanced version of the text. Do not add anything else into your answer.
                        `;

                    setAILoading(true);
                    socket.current.send(
                      JSON.stringify({
                        id: "OPEN_AI_PROMPT",
                        payload: {
                          content,
                          model: "gpt-4o",
                          app_id: "hirelab",
                          partner: partner._id,
                        },
                      })
                    );
                  });

                  socket.current.addEventListener("message", async (event) => {
                    const message = JSON.parse(event.data);
                    const response = message.payload?.response;

                    setBody(correctText(response));
                    setAILoading(false);
                    if (socketPing.current) clearInterval(socketPing.current);
                  });
                }}
              />
            </Space>
          </div>
          <MentionsInput
            placeholder="Type # to browse variables"
            value={body}
            onChange={(_, value) => setBody(value)}
            // onKeyDown={(e) => console.log("keydown", e.key)}
            classNames={classNamesBody}
            a11ySuggestionsListLabel={"Possible variables"}
          >
            <Mention
              trigger="#"
              className={"bg-indigo-100"}
              data={[
                { id: "candidateFirstname", display: "Candidate's Firstname" },
                { id: "candidateLastname", display: "Candidate's Lastname" },
                { id: "candidateEmail", display: "Candidate's Email" },
                { id: "candidatePhone", display: "Candidate's Phone" },
                { id: "jobTitle", display: "Job Title" },
                { id: "jobLocation", display: "Job Location" },
                { id: "jobApplicationLink", display: "Job Application Link" },
                { id: "interviewDate", display: "Interview Date" },
                { id: "interviewTime", display: "Interview Time" },
                { id: "interviewDateEnd", display: "Interview Ending Date" },
                { id: "interviewTimeEnd", display: "Interview Ending Time" },
                {
                  id: "interviewMeetingLink",
                  display: "Interview Meeting Link",
                },
                { id: "calendly_cancel_url", display: "Calendly Cancel URL" },
                {
                  id: "calendly_reschedule_url",
                  display: "Calendly Reschedule URL",
                },
                { id: "companyName", display: "Company Name" },
                { id: "companyWebsite", display: "Company Website" },
                { id: "companyAddress", display: "Company Address" },
                { id: "applicationStatus", display: "Application Status" },
                { id: "rejectionReason", display: "Rejection Reason" },
                { id: "calendarLink", display: "Calendar Link" },
                { id: "userCalendarLink", display: "User Calendar Link" },
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
        </>
      )}

      {!localStorage?.informationMessageVariables001 && (
        <Alert
          type="info"
          message="To explore available messaging variables, simply type '#' followed by your keyword, and a list of suggestions will appear for your convenience."
          closable
          onClose={() => (localStorage.informationMessageVariables001 = "true")}
        />
      )}
      <br />

      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={async () => {
            if (!subject) return message.error("Please enter a subject line");
            if (!body) return message.error("Message cannot be empty");

            if (
              !body.includes("@[Interview Meeting Link](interviewMeetingLink)")
            )
              return message.error(
                "Message must include the variable Interview Meeting Link"
              );

            setLoading(true);
            try {
              await CrudService.update("Vacancy", VacancyId, {
                scheduleConfirmationSubject: subject,
                scheduleConfirmationBody: body,
                scheduleConfirmationIncludeBCC: includeBCC,
                scheduleConfirmationEnabled,
              });

              handleReset();
            } catch (e) {
            } finally {
              setLoading(false);
            }
          }}
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded mt-5"
          disabled={loading}
        >
          {!loading ? "Save" : <Spin>Save</Spin>}
        </button>
      </div>
    </>
  );
};

export default MeetingConfirmationBox;
