import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  Button,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  message,
} from "antd";
import { FaRedo, FaUndo, FaWhatsapp } from "react-icons/fa";
import { TbRobotFace } from "react-icons/tb";
import { Mention, MentionsInput } from "react-mentions";
import { useSelector } from "react-redux";
import { MINIMUM_AI_CHARS } from "../../../data/constants";
import CrudService from "../../../services/CrudService";
import MessagingService from "../../../services/MessagingService";
import classNamesBody from "./body.module.css";
import useHistory from "./useHistory";
import { partner } from "../../../constants";

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

const VariableWhatsAppBox = ({ candidateId, onSend, defaultBody, workspaceId }) => {
  const {
    state: body,
    setState: setBody,
    undo: undoBody,
    redo: redoBody,
  } = useHistory(defaultBody ?? localStorage["lastWhatsAppMessage_message"] ?? "");

  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [AILoading, setAILoading] = useState(false);
  const socket = useRef(null);
  const socketPing = useRef(null);
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    if (!candidateId) return;
    CrudService.getSingle("VacancySubmission", candidateId).then(({ data }) => {
      if (data) setCandidateData(data);
    });
  }, [candidateId]);

  const handleReset = () => {
    onSend && onSend(body);
    setBody("");
  };

  const reloadTemplates = useCallback(async () => {
    // Reuse SMS templates for WhatsApp (they're similar short-form messages)
    await CrudService.search("SMSTemplate", 10000000, 1, {
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
      setBody(selected.message);
    }
  }, [selectedTemplate, templates]);

  if (!candidateData) return <Skeleton active />;
  
  const hasPhone = candidateData?.formData?.phone;
  
  return (
    <>
      {/* WhatsApp Header */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <FaWhatsapp className="text-green-600 text-xl" />
        <div>
          <div className="font-semibold text-green-800">Send WhatsApp Message</div>
          <div className="text-xs text-green-600">Message will be sent via WhatsApp Business API</div>
        </div>
      </div>

      {!hasPhone && (
        <Alert
          type="warning"
          message="This candidate does not have a phone number. Please add a phone number to send WhatsApp messages."
          className="mb-4"
        />
      )}

      <label className="font-bold">Template</label>
      <div className="w-full flex items-center">
        <Select
          className="grow"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e)}
          showSearch
          placeholder="Select a template..."
          filterOption={(input, option) => {
            const label = option.label
              .replace(/\@\[/g, "")
              .replace(/\]\((.)*\)/g, "")
              .toLowerCase();
            return label.includes(input.toLowerCase());
          }}
        >
          {templates.map((t) => (
            <Select.Option
              key={t._id}
              value={t._id}
              label={
                t.message
                  .replace(/\@\[/g, "")
                  .replace(/\]\((.)*\)/g, "")
                  .slice(0, 40) || "-"
              }
            >
              <Space className="flex justify-between">
                <div>
                  {t.message
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
                        await CrudService.delete("SMSTemplate", t._id);
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
            if (!body) return message.error("Message cannot be empty");

            setLoading(true);
            try {
              const current = await CrudService.create("SMSTemplate", {
                message: body,
              });
              await reloadTemplates();
              if (current?.data?.result?._id)
                setSelectedTemplate(current?.data?.result?._id);
            } catch (e) {
            } finally {
              setLoading(false);
            }
          }}
          className="px-2 py-1 text-sm bg-green-600 text-white rounded ml-2"
          disabled={loading}
        >
          Save Current
        </button>
      </div>

      <br />
      <label className="font-bold">Recipient</label>
      {candidateData?.formData && (
        <div className="p-2 bg-gray-50 rounded border">
          <div className="font-medium">
            {candidateData?.formData?.firstname}{" "}
            {candidateData?.formData?.lastname}
          </div>
          {hasPhone ? (
            <div className="flex items-center gap-2 text-green-600">
              <FaWhatsapp />
              <span>{candidateData?.formData?.phone}</span>
            </div>
          ) : (
            <div className="text-red-500 text-sm">No phone number available</div>
          )}
        </div>
      )}

      <br />

      <div className="flex justify-between">
        <label className="font-bold">Message</label>

        <Space>
          <button
            className="px-2 py-1 text-sm bg-white-500 text-green-600 border border-green-600 rounded"
            onClick={undoBody}
            type="secondary"
          >
            <FaUndo />
          </button>
          <button
            className="px-2 py-1 text-sm bg-white-500 text-green-600 border border-green-600 rounded"
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
                const content = `Hello, I need your expertise in transforming the following WhatsApp message text into a highly professional yet friendly version suitable for WhatsApp. Please apply your writing skills to rewrite this text. Make it conversational, engaging, and appropriate for WhatsApp communication while maintaining professionalism. Here's the text:

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
                const msg = JSON.parse(event.data);
                const response = msg.payload?.response;

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
        classNames={classNamesBody}
        a11ySuggestionsListLabel={"Possible variables"}
      >
        <Mention
          trigger="#"
          className={"bg-green-100"}
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
            { id: "interviewMeetingLink", display: "Interview Meeting Link" },
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
        <div className="text-xs text-gray-500">
          Message will be sent via WhatsApp Business API
        </div>
        <button
          onClick={async () => {
            if (!body) return message.error("Message cannot be empty");
            if (!hasPhone) return message.error("Candidate does not have a phone number");

            setLoading(true);
            try {
              await MessagingService.whatsappCandidate({
                candidateId,
                message: body,
                workspaceId,
              });
              message.success("WhatsApp message sent successfully!");
              handleReset();

              localStorage["lastWhatsAppMessage_message"] = body;
            } catch (e) {
              message.error(e?.response?.data?.message || "Failed to send WhatsApp message");
            } finally {
              setLoading(false);
            }
          }}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
          disabled={loading || !hasPhone}
        >
          {loading ? (
            <Spin size="small" />
          ) : (
            <FaWhatsapp />
          )}
          Send WhatsApp
        </button>
      </div>
    </>
  );
};

export default VariableWhatsAppBox;
