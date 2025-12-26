import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Alert,
  Button,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import { FaRedo, FaUndo } from "react-icons/fa";
import { IoLibrarySharp } from "react-icons/io5";
import { TbRobotFace } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
import { useSelector } from "react-redux";
import { MINIMUM_AI_CHARS } from "../../../data/constants";
import { getPartner, selectDarkMode, selectUser } from "../../../redux/auth/selectors";
import CrudService from "../../../services/CrudService";
import MessagingService from "../../../services/MessagingService";
import classNamesBody from "./body.module.css";
import classNames from "./example.module.css";
import useHistory from "./useHistory";
import { partner } from "../../../constants";

export const correctText = (text) =>
  text
    .replace(/\[Candidate's Firstname\]/g, "{{first_name}}")
    .replace(/\[Candidate's Lastname\]/g, "{{last_name}}")
    .replace(/\[Job Title\]/g, "{{job_title}}")
    .replace(/\[Company Name\]/g, "{{company_name}}")
    .replace(/\[User Firstname\]\s*\[User Lastname\]/g, "{{recruiter_name}}")
    .replace(/\[User Firstname\]/g, "{{recruiter_name}}")
    .replace(/\[User Lastname\]/g, "{{recruiter_name}}");

const VariableMessageBox = ({
  candidateId,
  onSend,
  workflowData,
  defaultSubject,
  defaultBody,
}) => {
  const [subject, setSubject] = useState(
    defaultSubject ?? localStorage["lastStdMessage_subject"] ?? ""
  );
  const {
    state: body,
    setState: setBody,
    undo: undoBody,
    redo: redoBody,
  } = useHistory(defaultBody ?? localStorage["lastStdMessage_message"] ?? "");
  const [includeBCC, setIncludeBcc] = useState(
    localStorage["lastStdMessage_includeBCC"] === "true"
  );
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [AILoading, setAILoading] = useState(false);
  const socket = useRef(null);
  const socketPing = useRef(null);
  const [candidateData, setCandidateData] = useState(null);
  console.log("123,candidateData", candidateData)
  const [templateLibrary, setTemplateLibrary] = useState(null);
  const darkMode = useSelector(selectDarkMode);
  const user = useSelector(selectUser);

  const recipientEmail = useMemo(() => {
    const formData = candidateData?.formData || {};
    if (!formData || typeof formData !== "object") return undefined;
    if (formData.email) return formData.email;
    const entries = Object.entries(formData);
    const suffixMatch = entries.find(([key, value]) => /(?:^|_)email$/i.test(key) && value);
    if (suffixMatch) return suffixMatch[1];
    const includesMatch = entries.find(([key, value]) => key.toLowerCase().includes("email") && value);
    return includesMatch ? includesMatch[1] : undefined;
  }, [candidateData]);

  const handleReset = () => {
    onSend(subject, body);
    setSubject("");
    setBody("");
    setIncludeBcc(false);
  };

  const reloadTemplates = useCallback(async () => {
    if (!user?._id) return;
    await CrudService.search("MessageTemplate", 100, 1, {
      filters: { user_id: user._id },
      sort: { createdAt: 1 },
    }).then(({ data }) => {
      setTemplates(data.items);
    });
  }, [user?._id]);

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
    if (!candidateId) return;
    CrudService.getSingle("VacancySubmission", candidateId).then(({ data }) => {
      if (data) setCandidateData(data);
    });
  }, [candidateId]);

  if (candidateId && !candidateData) return <Skeleton active />;
  return (
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
            if (!subject) return message.error("Please enter a subject line");
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

      {!workflowData && (
        <div>
          <Space size={20}>
            <label className="font-bold">Include me in BCC</label>
            <Switch checked={includeBCC} onChange={(e) => setIncludeBcc(e)} />
          </Space>
        </div>
      )}

      {candidateId && (
        <>
          <br />
          <label className="font-bold">Recipient</label>
          {candidateData?.formData && (
            <div>
              {candidateData?.formData?.firstname}{" "}
              {candidateData?.formData?.lastname}{" "}
              {recipientEmail ? (
                <a href={`mailto:${recipientEmail}`}>{`<${recipientEmail}>`}</a>
              ) : (
                <span className="text-gray-400">(no email)</span>
              )}
            </div>
          )}
        </>
      )}

      <br />

      <label className="font-bold">Subject</label>
      <MentionsInput
        placeholder="Type # to browse variables"
        value={subject}
        onChange={(_, value) => setSubject(value)}
        markup="{{__id__}}"
        // onKeyDown={(e) => console.log("keydown", e.key)}
        classNames={classNames}
        a11ySuggestionsListLabel={"Possible variables"}
      >
        <Mention
          trigger="#"
          className={"bg-indigo-100"}
          data={[
            { id: "first_name", display: "Candidate First name" },
            { id: "last_name", display: "Candidate Last name" },
            { id: "job_title", display: "Job title" },
            { id: "company_name", display: "Company name" },
            { id: "recruiter_name", display: "Recruiter name" },
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
              if (!body) return message.info("Please write some text first");
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

          <IoLibrarySharp
            size={18}
            className="cursor-pointer"
            title="Template Library"
            onClick={async () => {
              setTemplateLibrary(true);
            }}
          />
        </Space>
      </div>
      <MentionsInput
        placeholder="Type # to browse variables"
        value={body}
        onChange={(_, value) => setBody(value)}
        markup="{{__id__}}"
        // onKeyDown={(e) => console.log("keydown", e.key)}
        classNames={classNamesBody}
        a11ySuggestionsListLabel={"Possible variables"}
      >
        <Mention
          trigger="#"
          className={"bg-indigo-100"}
          data={[
            { id: "first_name", display: "Candidate First name" },
            { id: "last_name", display: "Candidate Last name" },
            { id: "job_title", display: "Job title" },
            { id: "company_name", display: "Company name" },
            { id: "recruiter_name", display: "Recruiter name" },
          ]}
        />
      </MentionsInput>

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

            setLoading(true);
            try {
              if (!workflowData && candidateId)
                await MessagingService.messageCandidate({
                  candidateId,
                  subject: subject,
                  message: body,
                  includeBCC,
                });
              handleReset();

              localStorage["lastStdMessage_subject"] = subject;
              localStorage["lastStdMessage_message"] = body;
              localStorage["lastStdMessage_includeBCC"] = includeBCC;
            } catch (e) {
            } finally {
              setLoading(false);
            }
          }}
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded mt-5"
          disabled={loading}
        >
          {!loading ? (
            `${workflowData ? "Save" : "Send"}`
          ) : (
            <Spin>{`${workflowData ? "Save" : "Send"}`}</Spin>
          )}
        </button>
      </div>
    </>
  );
};

export default VariableMessageBox;
