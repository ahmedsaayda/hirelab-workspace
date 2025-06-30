import { Menu, Transition } from "@headlessui/react";
import { Modal, Skeleton } from "antd";
import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Mention, MentionsInput } from "react-mentions";
import CrudService from "../../../../src/services/CrudService";
import classNamesSubject from "../Message/example.module.css";

const GeneralEmailLibrary = ({ callback }) => {
  const [templates, setTemplates] = useState(null);
  const [queryFilter, setQueryFilter] = useState("ALL");

  useEffect(() => {
    CrudService.search("GeneralEmailTemplates", 1000, 1, {}).then(({ data }) =>
      setTemplates(
        data.items.map((item) => ({
          _id: item._id,
          subject: item.subject,
          message: item.message,
          category: item.category,
        }))
      )
    );
  }, []);

  if (!templates) return <Skeleton active />;
  return (
    <>
      <div className="flex items-center justify-between mt-5">
        <h1 className="text-lg font-bold mb-2">Email Library</h1>
        <div>
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button
                type="button"
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <FaFilter />
                Filter
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-black ring-opacity-5 focus:outline-none">
                {[
                  { _id: "ALL", name: "All copies" },
                  { _id: "membership", name: "Membership" },
                  { _id: "event", name: "Event" },
                  { _id: "feedback", name: "Feedback" },
                  { _id: "freebie", name: "Freebie" },
                  { _id: "meeting", name: "Meeting" },
                  { _id: "recruiter", name: "Recruiter Prospecting" },
                ].map((item) => (
                  <Menu.Item key={item._id}>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active || queryFilter === item._id
                            ? "bg-gray-100 dark:bg-gray-400 dark:bg-gray-600"
                            : "",
                          "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300  cursor-pointer"
                        )}
                        onClick={() => {
                          setQueryFilter(item._id);
                        }}
                      >
                        {item.name}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-2">
        {templates
          .filter((e) => {
            if (queryFilter === "ALL") return true;

            return e?.category?.includes?.(queryFilter);
          })
          .map((template) => (
            <div
              key={template._id}
              className="p-4 border rounded-lg hover:shadow-md dark:shadow-gray-400/50 hover:shadow-gray-600/50  cursor-pointer transition duration-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                callback(template);
              }}
            >
              <MentionsInput
                value={template.subject}
                classNames={classNamesSubject}
                style={{ pointerEvents: "none" }}
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
            </div>
          ))}
      </div>
    </>
  );
};

export default GeneralEmailLibrary;
