import React, { useState } from "react";
import { Modal, Select, Input, Button, Spin, Alert, message } from "antd";
import CrudService from "../../../services/CrudService";
import { Heading } from "./components/components";
import vacacnyExempleForAiEditModal from "./vacacnyExempleForAiEditModal.json";
import aiRulesForAiEditModal from "./aiRulesForAiEditModal.json";



const SECTION_CONFIGS = {
  Hero: {
    name: "Hero",
    fields: [
      {
        key: "heroDescription",
        label: "Headline",
        type: "headline",
        maxLength: 120,
      },
    ],
  },
  "Employee Testimonials": {
    name: "Employer Testimonial",
    fields: [
      {
        key: "testimonialTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "testimonialSubheader",
        label: "Subheader",
        type: "subheader",
        maxLength: 300,
      },
    ],
  },
  "Leader Introduction": {
    name: "Leader Introduction",
    fields: [
      {
        key: "leaderIntroductionTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "leaderIntroductionDescription",
        label: "Body text",
        type: "body",
        maxLength: 400,
      },
    ],
  },
  "Company Facts": {
    name: "Company Facts",
    fields: [
      {
        key: "companyFactsTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "companyFactsDescription",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
      {
        key: "companyFacts",
        label: "Company Facts",
        type: "object",
        objectShape: "array",
        objectExemple: [
          {
            headingText: "Industry Leader",
            descriptionText: "Leading provider of innovative tech solutions",
          },
          {
            headingText: "Global Team",
            descriptionText: "Over 500 employees across 10 countries",
          },
        ],
      },
    ],
  },
  "Recruiter Contact": {
    name: "Recruiter Contact",
    fields: [
      {
        key: "recruiterContactTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "recruiterContactText",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
    ],
  },
  Agenda: {
    name: "Agenda",
    fields: [
      {
        key: "agendaTitle",
        label: "Title",
        type: "title",
        maxLength: 40,
      },
      {
        key: "agendaDescription",
        label: "Description",
        type: "description",
        maxLength: 120,
      },
      //dailyScheduleList
      {
        key: "dailyScheduleList",
        label: "Schedule",
        type: "object",
        objectShape: "array",
        objectExemple: [
          {
            dateTimeSlot: {
              startTime: "02:00",
              endTime: "04:00",
            },
            eventTitle: "Morning Check-In & Team Sync",
            description: "Morning Check-In & Team Sync",
          },
          {
            dateTimeSlot: {
              startTime: "05:00",
              endTime: "07:00",
            },
            eventTitle: "Review Project Timelines & Milestones",
            description: "Review Project Timelines & Milestones",
          },
        ],
      },
    ],
  },
  "Job Specifications": {
    name: "Job Specifications",
    fields: [
      {
        key: "jobSpecificationTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "jobSpecificationDescription",
        label: "Subheader",
        type: "subheader",
        maxLength: 80,
      },
      {
        key: "specifications",
        label: "Specifications",
        type: "object",
        objectShape: "array",
        objectExemple: [
          {
            title: "Benefits",
            description: "What we offer",
            bulletPoints: [
              { bullet: "Comprehensive health insurance" },
              { bullet: "Remote work options" },
              { bullet: "Competitive salary" },
              { bullet: "Professional development opportunities" },
            ],
          },
          {
            title: "Tasks",
            description: "Your responsibilities",
            bulletPoints: [
              { bullet: "Develop high-quality web applications" },
              { bullet: "Collaborate with cross-functional teams" },
              { bullet: "Debug and fix issues" },
              { bullet: "Participate in code reviews" },
            ],
          },
          {
            title: "Requirements",
            description: "What you need",
            bulletPoints: [
              { bullet: "Proficiency in JavaScript" },
              { bullet: "Experience with React" },
              { bullet: "Knowledge of Node.js" },
              { bullet: "2+ years of development experience" },
            ],
          },
        ],
      },
    ],
  },
  "Job Description": {
    name: "Job Description",
    fields: [
      {
        key: "jobDescriptionTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "jobDescriptionSubheader",
        label: "Subheader",
        type: "subheader",
        maxLength: 40,
      },
      {
        key: "jobDescription",
        label: "Body Text",
        type: "body",
        maxLength: 2000,
      },
    ],
  },
  "About The Company": {
    name: "About The Company",
    fields: [
      {
        key: "aboutTheCompanyTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "aboutTheCompanyText",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
      {
        key: "aboutTheCompanyDescription",
        label: "Body Text",
        type: "body",
        maxLength: 500,
      },
    ],
  },
  "Image Carousel": {
    name: "Image Carousel",
    fields: [
      {
        key: "photoTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "photoText",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
    ],
  },
  "EVP / Mission": {
    name: "EVP Mission",
    fields: [
      {
        key: "evpMissionTitle",
        label: "Header",
        type: "header",
        maxLength: 40,
      },
      {
        key: "evpMissionDescription",
        label: "Body text",
        type: "body",
        maxLength: 300,
      },
    ],
  },
  "Candidate Process": {
    name: "Candidate Process",
    fields: [
      {
        key: "candidateProcessTitle",
        label: "Title",
        type: "title",
        maxLength: 40,
      },
      {
        key: "candidateProcessDescription",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
      {
        key: "candidateProcess",
        label: "Process Steps",
        type: "object",
        objectShape: "array",
        objectExemple: [
          {
            candidateProcessText: "Application Review",
          },
          {
            candidateProcessText: "Technical Interview",
          },
        ],
      },
    ],
  },
  "Growth Path": {
    name: "Growth Path",
    fields: [
      {
        key: "growthPathTitle",
        label: "Title",
        type: "title",
        maxLength: 40,
      },
      {
        key: "growthPathDescription",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
      {
        key: "growthPath",
        label: "Growth Path",
        type: "object",
        objectShape: "array",
        objectExemple: [
          {
            title: "Entry-Level",
            description:
              "Start your journey with foundational responsibilities",
          },
          {
            title: "Mid-Level",
            description: "Take on more complex projects and mentoring",
          },
          {
            title: "Senior",
            description: "Lead teams and strategic initiatives",
          },
        ],
      },
    ],
  },
  Video: {
    name: "Video",
    fields: [
      { key: "videoTitle", label: "Title", type: "title", maxLength: 40 },
      {
        key: "videoDescription",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
    ],
  },
  "Text Box": {
    name: "Text Box",
    fields: [
      { key: "textBoxTitle", label: "Header", type: "header", maxLength: 40 },
      {
        key: "textBoxText",
        label: "Subheader",
        type: "subheader",
        maxLength: 120,
      },
      {
        key: "textBoxDescription",
        label: "Body text",
        type: "body",
        maxLength: 400,
      },
    ],
  },
  Footer: {
    name: "Footer",
    fields: [
      { key: "footerTitle", label: "Title", type: "title", maxLength: 80 },
      {
        key: "footerDescription",
        label: "Description",
        type: "description",
        maxLength: 120,
      },
    ],
  },
};



const AIEditModal = ({
  visible,
  onClose,
  sectionName,
  vacancyId,
  onSuccess,
  vacancyData,
}) => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  console.log("generating", generating);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [step, setStep] = useState("input");
  const [socketError, setSocketError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [saving, setSaving] = useState(false);

  console.log("Section Name:", sectionName);
  console.log("Vacancy Data:", vacancyData);
  const sectionConfig = SECTION_CONFIGS[sectionName];
  console.log("Section Config:", sectionConfig);

  // Function to get current field value from vacancyData
  const getCurrentFieldValue = (fieldKey) => {
    if (!vacancyData || !fieldKey) return "";
    return vacancyData[fieldKey] || "";
  };

  // Function to render field value based on type
  const renderFieldValue = (field) => {
    const value = getCurrentFieldValue(field.key);
    console.log("Value:", value);
    console.log("Field:", field);
    // Handle object type fields differently
    if (field.type === "object") {
      try {
        // Format object data for display
        if (Array.isArray(value)) {
          return (
            <div className="overflow-y-auto max-h-60">
              {field.key === "specifications"
                ? // Special handling for specifications
                  value.map((spec, index) => (
                    <div
                      key={index}
                      className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {spec.title}
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        {spec.description}
                      </div>
                      {spec.bulletPoints && spec.bulletPoints.length > 0 && (
                        <ul className="pl-5 list-disc">
                          {spec.bulletPoints.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="text-sm text-gray-700"
                            >
                              {point.bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                : field.key === "companyFacts"
                ? // Special handling for companyFacts
                  value.map((fact, index) => (
                    <div
                      key={index}
                      className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {fact.headingText}
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        {fact.descriptionText}
                      </div>
                    </div>
                  ))
                : field.key === "candidateProcess"
                ? // Special handling for candidateProcess
                  value.map((process, index) => (
                    <div
                      key={index}
                      className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {process.candidateProcessText}
                      </div>
                    </div>
                  ))
                : field.key === "growthPath"
                ? // Special handling for growthPath
                  value.map((path, index) => (
                    <div
                      key={index}
                      className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                    >
                      <div className="text-base font-semibold text-gray-800">
                        {path.title}
                      </div>
                      <div className="mb-2 text-sm text-gray-600">
                        {path.description}
                      </div>
                    </div>
                  ))
                : // Default array rendering for other object types
                  value.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 mb-2 rounded border border-gray-200"
                    >
                      <div className="text-xs font-semibold">
                        Item {index + 1}
                      </div>
                      <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  ))}
            </div>
          );
        } else if (typeof value === "object" && value !== null) {
          return (
            <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
              {JSON.stringify(value, null, 2)}
            </pre>
          );
        }
      } catch (error) {
        return (
          <span className="text-red-500">Error displaying object data</span>
        );
      }
    }

    // For simple string fields
    return typeof value === "string" ? value : "No content yet";
  };

  const getFieldPromptPlaceholder = () => {
    return `Describe what you want for the ${sectionName} section...`;
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      if (!sectionConfig) {
        console.error(`No configuration found for section: ${sectionName}`);
        setSocketError(`No configuration found for section: ${sectionName}`);
        setConnectionStatus("error");
        return;
      }

      if (!vacancyData) {
        setSocketError("Vacancy data is not available. Please try again.");
        setConnectionStatus("error");
        return;
      }

      setSocketError(null);
      setConnectionStatus("connecting");

      const socket = new WebSocket(
        "wss://booklified-chat-socket.herokuapp.com"
      );

      let timeoutId = setTimeout(() => {
        setSocketError("Connection timeout. Please try again.");
        setGenerating(false);
        setConnectionStatus("error");
        socket.close();
      }, 30000); // 30 second timeout

      socket.addEventListener("open", () => {
        clearTimeout(timeoutId);
        setConnectionStatus("generating");

        const socketPing = setInterval(
          () => socket.send(JSON.stringify({ id: "PING" })),
          30000
        );

        // Extract relevant vacancy context
        const vacancyContext = {
          title: vacancyData.vacancyTitle || "",
          description: vacancyData.heroDescription || "",
          jobDescription: vacancyData.jobDescription || "",
          companyInfo: vacancyData.aboutTheCompanyDescription || "",
          department: vacancyData.department || "",
        };

        // When formatting the content for the AI, handle object types correctly
        const content = `
          -You are a professional content writer for job vacancy landing pages.
          -User request:${prompt}
          -CURRENT VACANCY CONTEXT:
           *Title: ${vacancyContext.title}
           *Department: ${vacancyContext.department}
           *Description: ${vacancyContext.description}
           *Job Description: ${vacancyContext.jobDescription}
           *Company Info: ${vacancyContext.companyInfo}
          
          -TASK:
          Generate content for the "${sectionName}" section of this vacancy landing page.
          
          -Fields to generate:
          ${sectionConfig.fields
            .map((field) => {
              let fieldInfo = `- ${field.label} (${field.type}${
                field.maxLength ? `, max ${field.maxLength} characters` : ""
              })`;

              // For object types, provide more information
              if (field.type === "object") {
                fieldInfo += `\n  Current value: ${
                  typeof vacancyData[field.key] === "object"
                    ? JSON.stringify(vacancyData[field.key])
                    : "none"
                }`;

                // Add example if available
                if (field.objectExemple) {
                  fieldInfo += `\n  Example structure: ${JSON.stringify(
                    field.objectExemple
                  )}`;
                }
              }

              return fieldInfo;
            })
            .join("\n")}

          -Important instructions:
           *!!!generated content must never exceed the max length of the field
           *Tone: ${tone}
           *Maintain professional terminology where applicable
           *Respect character limits strictly
           *Ensure content is consistent with the rest of the vacancy information
           *For object type fields, respond with a valid JSON string representation of the object
           *Format response as valid JSON

          Respond with a JSON object containing the following fields:
          {
            ${sectionConfig.fields
              .map(
                (field) =>
                  `"${field.key}": ${
                    field.type === "object"
                      ? `"[valid JSON string for ${field.label}]"`
                      : `"content for ${field.label}"`
                  }`
              )
              .join(",\n")}
          }
          -Ensure each field's content matches its type and respects any maximum length constraints.
          -For the best result i am providing you with a vacancy exemple,our backend schema and a list of rules that must be respected.
          ${JSON.stringify(vacacnyExempleForAiEditModal)}
          Rules:
          ${JSON.stringify(aiRulesForAiEditModal)}
        `;

        console.log("Content:", content);

        socket.send(
          JSON.stringify({
            id: "OPEN_AI_PROMPT",
            payload: {
              content,
              // model: "gpt-4o-mini-2024-07-18",
              model: "gpt-4.1-mini-2025-04-14",
              app_id: "hirelab",
              max_tokens: 10000,
            },
          })
        );

        // Clear ping interval when socket closes
        socket.addEventListener("close", () => {
          if (socketPing) {
            clearInterval(socketPing);
          }
        });
        setGenerating(false);
      });

      socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        const response = message.payload?.response;
        console.log("Response:", response);

        if (response) {
          try {
            const result = JSON.parse(response);
            console.log("Result:", result);
            setGeneratedContent(result);
            setStep("review");
            setConnectionStatus("completed");
          } catch (error) {
            console.error("Failed to parse AI response:", error);
            setSocketError("Failed to parse AI response. Please try again.");
            setConnectionStatus("error");
          }
        }
        setGenerating(false);
        socket.close();
      });

      socket.addEventListener("error", (error) => {
        console.error("WebSocket connection failed", error);
        setSocketError("Connection failed. Please try again.");
        setGenerating(false);
        setConnectionStatus("error");
      });
    } catch (error) {
      console.error("Error generating content:", error);
      setSocketError("An error occurred. Please try again.");
      setGenerating(false);
      setConnectionStatus("error");
    } finally {
    }
  };

  const handleSaveContent = async () => {
    console.log("Generated Content:", generatedContent);
    console.log("Vacancy ID:", vacancyId);

    if (!generatedContent) {
      message.error("No content was generated. Please try again.");
      return;
    }

    if (!vacancyId) {
      message.error(
        "Vacancy ID is missing. Please try again or refresh the page."
      );
      console.error("Missing vacancy ID when trying to save content");
      return;
    }

    try {
      setSaving(true);

      // Get the current vacancy data first
      const response = await CrudService.getSingle(
        "LandingPageData",
        vacancyId
      );
      const currentVacancy = response.data.result;

      // Process the generated content - parse JSON strings for object fields
      const processedContent = { ...generatedContent };

      // Find object type fields
      if (sectionConfig) {
        sectionConfig.fields.forEach((field) => {
          if (field.type === "object" && processedContent[field.key]) {
            try {
              // Parse the JSON string and convert back to a string for saving
              // This ensures the JSON is valid
              const parsedValue = JSON.parse(processedContent[field.key]);
              processedContent[field.key] = parsedValue;
            } catch (error) {
              console.error(
                `Error parsing JSON for field ${field.key}:`,
                error
              );
              message.error(
                `Invalid data format for ${field.label}. Please try again.`
              );
              setSaving(false);
              return;
            }
          }
        });
      }

      // Update only the fields that were generated by AI
      const updatedData = {
        ...currentVacancy,
        ...processedContent,
      };

      // Send the update to the backend
      await CrudService.update("LandingPageData", vacancyId, updatedData);

      message.success(`${sectionName} content updated successfully`);

      // Reset the state
      setPrompt("");
      setTone("Professional");
      setGeneratedContent(null);
      setStep("input");
      setSocketError(null);
      setConnectionStatus("idle");

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // If no callback provided, just close the modal
        onClose();
      }
    } catch (error) {
      console.error("Error updating vacancy:", error);
      message.error("Failed to update vacancy content. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    // Reset state when modal closes
    if (!generating && !saving) {
      setPrompt("");
      setTone("Professional");
      setGeneratedContent(null);
      setStep("input");
      setSocketError(null);
      setConnectionStatus("idle");
      onClose();
    }
  };

  const getButtonText = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting...";
      case "generating":
        return "Generating...";
      default:
        return "Generate";
    }
  };

  const renderInputStep = () => (
    <div className="flex flex-col gap-4">
      {!vacancyData && (
        <Alert
          message="Missing vacancy data"
          description="Vacancy data is not available. Please try refreshing the page."
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <div>
        <div className="mb-2 font-medium">
          Describe what you want for this section
        </div>
        <Input.TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getFieldPromptPlaceholder()}
          rows={4}
          disabled={generating || !vacancyData}
        />
      </div>

      {/* Display current field values */}
      {sectionConfig?.fields && (
        <div className="pt-4 mt-4 border-t">
          <div className="mb-2 font-medium text-gray-700">Current Content:</div>
          {sectionConfig.fields.map((field) => (
            <div key={field.key} className="mb-3">
              <div className="text-sm font-medium text-gray-600">
                {field.label}
              </div>
              <div className="p-2 mt-1 text-sm bg-gray-50 rounded-md">
                {renderFieldValue(field)}
              </div>
              {field.maxLength &&
                typeof getCurrentFieldValue(field.key) === "string" && (
                  <div className="mt-1 text-xs text-gray-500">
                    {getCurrentFieldValue(field.key)?.length || 0}/
                    {field.maxLength} characters
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2 items-center">
          <span>Tone:</span>
          <Select
            value={tone}
            onChange={setTone}
            style={{ width: 120 }}
            options={[
              { value: "Professional", label: "Professional" },
              { value: "Casual", label: "Casual" },
              { value: "Friendly", label: "Friendly" },
            ]}
            disabled={generating || !vacancyData}
          />
        </div>
        <button
          onClick={handleGenerate}
          className="py-2 text-white bg-[#5207CD] rounded-md hover:bg-blue-600 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={generating || prompt.trim() === "" || !vacancyData}
        >
          {getButtonText()}
        </button>
      </div>

      {socketError && (
        <Alert
          message="Error"
          description={socketError}
          type="error"
          showIcon
          className="mt-4"
        />
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="flex flex-col gap-4">
      <div className="mb-2">
        {sectionConfig?.fields.map((field) => {
          const isObjectType = field.type === "object";

          return (
            <div key={field.key} className="mt-4">
              <div className="font-medium text-gray-700">{field.label}</div>
              <div className="p-3 mt-1 bg-gray-50 rounded-md">
                {isObjectType
                  ? (() => {
                      try {
                        // Only try to parse if there's content
                        if (!generatedContent?.[field.key]) {
                          return (
                            <div className="text-gray-500">
                              No content generated
                            </div>
                          );
                        }

                        // Try to parse the JSON string safely
                        const parsedData = JSON.parse(
                          generatedContent[field.key]
                        );

                        // Handle different object types
                        if (
                          field.key === "specifications" &&
                          Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="overflow-y-auto max-h-60">
                              {parsedData.map((spec, index) => (
                                <div
                                  key={index}
                                  className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                                >
                                  <div className="text-base font-semibold text-gray-800">
                                    {spec.title}
                                  </div>
                                  <div className="mb-2 text-sm text-gray-600">
                                    {spec.description}
                                  </div>
                                  {spec.bulletPoints &&
                                    spec.bulletPoints.length > 0 && (
                                      <ul className="pl-5 list-disc">
                                        {spec.bulletPoints.map(
                                          (point, pointIndex) => (
                                            <li
                                              key={pointIndex}
                                              className="text-sm text-gray-700"
                                            >
                                              {point.bullet}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                </div>
                              ))}
                            </div>
                          );
                        } else if (
                          field.key === "companyFacts" &&
                          Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="overflow-y-auto max-h-60">
                              {parsedData.map((fact, index) => (
                                <div
                                  key={index}
                                  className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                                >
                                  <div className="text-base font-semibold text-gray-800">
                                    {fact.headingText}
                                  </div>
                                  <div className="mb-2 text-sm text-gray-600">
                                    {fact.descriptionText}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else if (
                          field.key === "candidateProcess" &&
                          Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="overflow-y-auto max-h-60">
                              {parsedData.map((process, index) => (
                                <div
                                  key={index}
                                  className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                                >
                                  <div className="text-base font-semibold text-gray-800">
                                    {process.candidateProcessText}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else if (
                          field.key === "growthPath" &&
                          Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="overflow-y-auto max-h-60">
                              {parsedData.map((path, index) => (
                                <div
                                  key={index}
                                  className="p-3 mb-3 bg-white rounded-md border border-gray-200"
                                >
                                  <div className="text-base font-semibold text-gray-800">
                                    {path.title}
                                  </div>
                                  <div className="mb-2 text-sm text-gray-600">
                                    {path.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          // Generic array or object rendering
                          return (
                            <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
                              {JSON.stringify(parsedData, null, 2)}
                            </pre>
                          );
                        }
                      } catch (error) {
                        console.error("Error parsing JSON:", error);
                        return (
                          <div>
                            <div className="mb-2 text-red-500">
                              Error parsing JSON data
                            </div>
                            <details>
                              <summary className="text-sm text-gray-600 cursor-pointer">
                                View raw data
                              </summary>
                              <pre className="overflow-x-auto p-2 mt-2 text-xs whitespace-pre-wrap bg-gray-100 rounded border border-gray-200">
                                {generatedContent?.[field.key]}
                              </pre>
                            </details>
                          </div>
                        );
                      }
                    })()
                  : generatedContent?.[field.key]}
              </div>
              {field.maxLength && !isObjectType && (
                <div className="mt-1 text-xs text-gray-500">
                  {field.maxLength
                    ? `${generatedContent?.[field.key]?.length || 0}/${
                        field.maxLength
                      } characters`
                    : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button
          onClick={() => setStep("input")}
          disabled={saving}
          className="px-4 py-2 rounded-md border border-gray-300 hover:border-gray-400"
        >
          Generate Again
        </button>
        <button
          className="py-2 text-white bg-[#5207CD] rounded-md hover:bg-blue-600 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveContent}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      title=""
      open={visible}
      onCancel={generating || saving ? undefined : handleModalClose}
      footer={null}
      destroyOnClose
      maskClosable={!(generating || saving)}
      closable={!(generating || saving)}
      width={600}
    >
      {" "}
      <Heading size="7xl" as="h1" className="!text-black-900_01 text-center">
        {sectionName}
      </Heading>
      {step === "input" ? renderInputStep() : renderReviewStep()}
    </Modal>
  );
};

export default AIEditModal;

//todo: provide the max of each field to Ai
/* 

fields to be edited by Ai Base on section
##Hero :heroDescription
##Employer Testimonial : testimonialTitle, testimonialSubheader
##Leader Introduction : leaderIntroductionTitle, leaderIntroductionDescription
##Recruiter Contact : recruiterContactTitle, recruiterContactText
##Agenda : agendaTitle, agendaDescription
##Job Specification : jobSpecificationTitle, jobSpecificationDescription,
##Job Description : jobDescriptionTitle, jobDescriptionSubheader, jobDescription
##About Company : aboutTheCompanyTitle, aboutTheCompanyText ,aboutTheCompanyDescription
##Evp Mission : evpMissionTitle, evpMissionDescription
##Company Facts : companyFactsTitle, companyFactsDescription
##Candidate Process : candidateProcessTitle, candidateProcessDescription
##Growt Path:growthPathTitle , growthPathDescription
##Photos : photoTitle, photoText
##Video : videoTitle, videoDescription
##text Box : textBoxTitle, textBoxText, textBoxDescription
##Footer :footerTitle,footerDescription


*/

/* 
Another version of the mapping but each item has a key and a label for the customer to understand what they are editing

##Hero :
    - heroDescription (Headline)
    
##Employer Testimonial : 
        - testimonialTitle (Header)
        - testimonialSubheader (Subheader)

##Leader Introduction :
    - leaderIntroductionTitle (Header)
    - leaderIntroductionDescription (Body text)

##Recruiter Contact :
    - recruiterContactTitle (Title)
    - recruiterContactText (Description)

##Agenda :
    - agendaTitle (Header)
    - agendaDescription (Description)

##Job Specification :
    - jobSpecificationTitle (Header)
    - jobSpecificationDescription (Subheader)

##Job Description :
    - jobDescriptionTitle (Header)
    - jobDescriptionSubheader (Subheader)
    - jobDescription (Body text)

##About Company :
    - aboutTheCompanyTitle (Header)
    - aboutTheCompanyText (Subheader)
    - aboutTheCompanyDescription (Body text)

##EVP Mission : 
    - evpMissionTitle (Header)
    - evpMissionDescription (Body text)

##Company Facts :
    - companyFactsTitle (Header)
    - companyFactsDescription (Subheader)

##Candidate Process :
    - candidateProcessTitle (Title)
    - candidateProcessDescription (Subheader)

##Growt Path:
    - growthPathTitle (Title)
    - growthPathDescription (Subheader)

##Photos :
    - photoTitle (Header)
    - photoText (Subheader)

##Video :
    - videoTitle (Title)
    - videoDescription (Subheader)

##text Box :
    - textBoxTitle (Header)
    - textBoxText (Subheader)
    - textBoxDescription (Body text)

##Footer :
    - footerTitle (Title)
    - footerDescription (Description)


*/

/* 
Fields to be edited by Ai  (From editor page)based on section

##Hero :
    - heroDescription (Headline)
    
##Employer Testimonial : 
        -  (Header)
        -  (Subheader)

##Leader Introduction :
    -  (Header)
    -  (Body text)

##Recruiter Contact :
    -  (Title)
    -  (Description)

##Agenda :
    -  (Header)
    -  (Description)

##Job Specification :
    -  (Header)
    -  (Subheader)

##Job Description :
    -  (Header)
    -  (Subheader)
    -  (Body text)

##About Company :
    -  (Header)
    -  (Subheader)
    -  (Body text)

##EVP Mission : 
    -  (Header)
    -  (Body text)

##Company Facts :
    -  (Header)
    -  (Subheader)

##Candidate Process :
    -  (Title)
    -  (Subheader)

##Growt Path:
    -  (Title)
    -  (Subheader)

##Photos :
    -  (Header)
    -  (Subheader)

##Video :
    -  (Title)
    -  (Subheader)

##text Box :
    -  (Header)
    -  (Subheader)
    -  (Body text)

##Footer :
    -  (Title)
    -  (Description)

*/
