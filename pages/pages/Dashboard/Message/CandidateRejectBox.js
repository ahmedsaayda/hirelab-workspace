import React, { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Button,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Tooltip,
  message,
} from "antd";
import { GrInfo } from "react-icons/gr";
import { Mention, MentionsInput } from "react-mentions";
import CrudService from "../../../service/CrudService";
import classNamesBody from "./body.module.css";

const CandidateRejectBox = ({ candidateId, onSend }) => {
  const [body, setBody] = useState(
    localStorage["lastRejectMessage_message"] ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    if (!candidateId) return;
    CrudService.getSingle("VacancySubmission", candidateId).then(({ data }) => {
      if (data) setCandidateData(data);
    });
  }, [candidateId]);

  const handleReset = () => {
    setBody("");
    onSend();
  };

  const reloadTemplates = useCallback(async () => {
    await CrudService.search("RejectReasonTemplate", 10000000, 1, {
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
                        await CrudService.delete("RejectReasonTemplate", t._id);
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
            if (!body)
              return message.error(
                "Empty rejection reason cannot need to be stored as a template"
              );

            setLoading(true);
            try {
              const current = await CrudService.create("RejectReasonTemplate", {
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
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          disabled={loading}
        >
          {!loading ? "Save Current" : <Spin>Save Current</Spin>}
        </button>
      </div>

      <br />
      <label className="font-bold">Candidate</label>
      {candidateData?.formData && (
        <div>
          {candidateData?.formData?.firstname}{" "}
          {candidateData?.formData?.lastname}{" "}
          <a
            href={`mailto:${candidateData?.formData?.email}`}
          >{`<${candidateData?.formData?.email}>`}</a>
        </div>
      )}

      <br />

      <div className="flex items-center justify-between w-full">
        <label className="font-bold">Rejection Reason</label>
        <Tooltip title="Provide a reason on why the candidate was not a great fit for this position. This text can be used in your email automations as a variable.">
          <GrInfo />
        </Tooltip>
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
            { id: "interviewDateEnd", display: "Interview Ending Date" },
            { id: "interviewTime", display: "Interview Time" },
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

      {!localStorage?.informationCandidateRejection001 && (
        <Alert
          type="info"
          message="The rejection reason entered will be saved as a candidate variable. No automated communication will occur without a custom workflow setup by you. For instance, a workflow could move candidates to a 'rejected' stage and trigger an email with the stored rejection reason. This process is entirely optional and customizable."
          closable
          onClose={() =>
            (localStorage.informationCandidateRejection001 = "true")
          }
        />
      )}
    </>
  );
};

export default CandidateRejectBox;
