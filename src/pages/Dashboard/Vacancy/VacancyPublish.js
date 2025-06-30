import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MultiStepComponent from "../Vacancies/components/MultiStepComponent";
import { getPartner } from "../../../../src/redux/auth/selectors";
import CalendlyService from "../../../../src/services/CalendlyService";
import CrudService from "../../../../src/services/CrudService";
import { partner } from "../../../../src/constants";

const VacancyPublish = () => {
  const router = useRouter();
  const { query } = router;
  const [vacancyData, setVacancyData] = useState(null);

  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    if (!partner?.calendlyclientId) return;
    CalendlyService.getEventTypes().then(({ data }) => {
      setEventTypes(data.eventTypes);
    });
  }, [partner]);

  useEffect(() => {
    const id = query.id;
    if (!id) return;
    setVacancyData(null);

    CrudService.getSingle("Vacancy", id).then((res) => {
      if (!res.data) return;
      setVacancyData(res.data);
    });
  }, [query.id]);

  const steps = [
    {
      id: "step1",
      name: "General Information",
      form: [
        {
          fieldName: "name",
          label: "Job name",
          type: "input",
          placeholder: "Dentist",
        },
        {
          fieldName: "valueProposition",
          label: "Scroll stopper",
          type: "input",
          placeholder: "Enter the scroll stopper text",
        },
        {
          fieldName: "heroTitle",
          label: "Campaign title",
          type: "textarea",
          placeholder: "Enter title on top of your funnel",
        },
        {
          fieldName: "requiredSkills",
          label: "Requirements",
          type: "textarea",
          placeholder: "Enter the required skills",
        },
      ],
    },
    {
      id: "step10",
      name: "Details",
      form: [
        {
          fieldName: "location",
          label: "Preferred Work Location",
          type: "input",
          placeholder: "Enter your preferred work location",
        },
        {
          fieldName: "engagementType",
          label: "Engagement Type",
          type: "select",
          options: [
            { value: "Permanent", label: "Permanent" },
            { value: "Temporary", label: "Temporary" },
            { value: "Fixed-Term", label: "Fixed-Term" },
            { value: "Freelance", label: "Freelance" },
            { value: "Project-based", label: "Project-based" },
            { value: "Retainer", label: "Retainer" },
            { value: "Seasonal", label: "Seasonal" },
            { value: "Internship", label: "Internship" },
            { value: "Apprenticeship", label: "Apprenticeship" },
            { value: "Commission-Based", label: "Commission-Based" },
            { value: "Contract-to-Hire", label: "Contract-to-Hire" },
            { value: "Partnership", label: "Partnership" },
          ],
        },
        {
          fieldName: "contractType",
          label: "Contract Type",
          type: "select",
          options: [
            { value: "Full-time", label: "Full-time" },
            { value: "Part-time", label: "Part-time" },
            { value: "Casual", label: "Casual" },
            { value: "Zero-Hours", label: "Zero-Hours" },
            { value: "Profit-share", label: "Profit-share" },
          ],
        },
        {
          fieldName: "preferredCalendlyEvent",
          label: "Calendly Event Type",
          type: "select",
          tooltip:
            "Specify a unique Calendly event type for each funnel, or leave blank to use the default account setting for interviews.",
          options: eventTypes.map((eventType) => ({
            value: eventType.uri,
            label: eventType.name,
          })),
        },
      ],
    },
    {
      id: "step3",
      name: "Benefits & Culture",
      form: [
        {
          fieldName: "benefitsTitle",
          label: "Benefits Title",
          type: "input",
          placeholder: "Title for Benefits Section",
        },
        {
          fieldName: "benefitsText",
          label: "Benefits Description",
          type: "textarea",
          rows: 10,
          placeholder: "Describe the benefits of working with us",
        },
        {
          fieldName: "benefits",
          label: "Benefits",
          type: "list",
          defaultForm: [
            {
              fieldName: "title",
              label: "Title",
              type: "input",
              placeholder: "Title of this benefit",
            },
            {
              fieldName: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Description of this benefit",
            },
            {
              fieldName: "icon",
              label: "Icon",
              type: "input",
              placeholder: "Emoji",
            },
          ],
          defaultObject: {
            title: "",
            description: "",
            icon: "",
          },
        },
      ],
    },
    {
      id: "step4",
      name: "Testimonials",
      form: [
        {
          fieldName: "testimonialTitle",
          label: "Testimonial Section Title",
          type: "input",
          placeholder: "Enter the title for the testimonial section",
        },
        {
          fieldName: "testimonialSubheader",
          label: "Testimonial Section Subheader",
          type: "input",
          placeholder: "Enter the Subheader for the testimonial section",
        },
        {
          fieldName: "teamTestimonials",
          label: "Testimonials",
          type: "list",
          defaultForm: [
            {
              fieldName: "author",
              label: "Fullname",
              type: "input",
              placeholder: "Fullname of the team member",
            },
            {
              fieldName: "authorPosition",
              label: "Role",
              type: "input",
              placeholder: "The position of the team member",
            },
            {
              fieldName: "testimonial",
              label: "Testimonial",
              type: "textarea",
              rows: 5,
              placeholder: "What does the team member think about the company?",
            },
          ],
          defaultObject: {
            author: "",
            authorPosition: "",
            testimonial: "",
          },
        },
      ],
    },
    {
      id: "step5",
      name: "Application Submission",
      form: [
        {
          fieldName: "CTA",
          label: "Call to Action",
          type: "input",
          placeholder: "Call to action for application submission",
        },
      ],
    },
    {
      id: "step6",
      name: "Post-Application",
      form: [
        {
          fieldName: "thankYouHero",
          label: "Thank You Message",
          type: "input",
          placeholder: "Enter the thank you message post-application",
        },
        {
          fieldName: "underReviewInfo",
          label: "Application Under Review Information",
          type: "textarea",
          rows: 3,
          placeholder: "Information about the application review process",
        },
        {
          fieldName: "nextSteps",
          label: "Next Steps After Application",
          type: "textarea",
          rows: 3,
          placeholder:
            "Describe the next steps after the application is submitted",
        },

        // {
        //   fieldName: "eeodc",
        //   label: "Include EEO Data Collection Form",
        //   type: "switch",
        // },
      ],
    },
  ];

  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      {vacancyData && (
        <>
          <div
            className="flex items-center justify-start gap-2 mb-2 text-sm cursor-pointer"
            onClick={() => router.push("/dashboard/vacancy")}
          >
            <MdArrowBackIos size={13} /> <div>Back to Funnels</div>
          </div>
          <h1 className="mb-4 text-lg font-bold">
            Edit: {vacancyData?.alternativeName || vacancyData?.name}
          </h1>
        </>
      )}

      <div>
        <MultiStepComponent
          AIEnhancements={true}
          displayUndoRedo
          steps={steps}
          defaultFormData={{
            ...vacancyData,
          }}
          onFinish={async (formData) => {
            const id = query.id;
            if (!id) return;

            await CrudService.update("Vacancy", id, {
              ...formData,
              published: true,
            });

            router.push(`/dashboard/vacancy?id=${id}`);
          }}
          onNext={async (formData) => {
            const id = query.id;
            if (!id) return;

            await CrudService.update("Vacancy", id, {
              ...formData,
            });
          }}
        />
      </div>
    </>
  );
};

export default VacancyPublish;
