// hirelab-frontend\src\components\mediaLibrary\components\modals\SelectTemplateModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Tooltip } from "antd";
import { QuestionCircleOutlined, CloseOutlined, BulbOutlined } from "@ant-design/icons";
import TestimonialsForm from "./sectionTemplateForms/testimonials-form.jsx";
import HeroForm from "./sectionTemplateForms/hero-form.jsx";
import leaderIntroductionForm from "./sectionTemplateForms/leader-introduction-form.jsx";
import JobDescriptionForm from "./sectionTemplateForms/job-description.jsx";
import CompanyFactsForm from "./sectionTemplateForms/company-facts.jsx";
import RecruiterContactForm from "./sectionTemplateForms/recruiter-contact-form.jsx";
import CandidateProcessForm from "./sectionTemplateForms/candidate-process-form.jsx";
import VideoSectionForm from "./sectionTemplateForms/video-form.jsx";
import PhotoCarouselForm from "./sectionTemplateForms/photo-carousel-form.jsx";
import AboutCompanyForm from "./sectionTemplateForms/about-the-company-form.jsx";
import JobSpecificationsForm from "./sectionTemplateForms/job-specifications-form.jsx";
import AgendaForm from "./sectionTemplateForms/agenda-form.jsx";
import EVPMissionForm from "./sectionTemplateForms/evp-mission-form.jsx";
import GrowthPathForm from "./sectionTemplateForms/growth-path-form.jsx";
import TextBoxForm from "./sectionTemplateForms/text-box-form.jsx";

const departmentOptions = [
  {
    label: "Asset Management",
    value: "Asset Management",
  },
  {
    label: "Board of Directors",
    value: "Board of Directors",
  },
  {
    label: "Business Development",
    value: "Business Development",
  },
  {
    label: "Corporate Communications",
    value: "Corporate Communications",
  },
  {
    label: "Creative Services",
    value: "Creative Services",
  },
  {
    label: "Customer Service / Customer Experience",
    value: "Customer Service / Customer Experience",
  },
  {
    label: "Engineering",
    value: "Engineering",
  },
  {
    label: "Finance / Accounting",
    value: "Finance / Accounting",
  },
  {
    label: "General Management",
    value: "General Management",
  },
  {
    label: "Human Resources",
    value: "Human Resources",
  },
  {
    label: "Information Technology / Technology",
    value: "Information Technology / Technology",
  },
  {
    label: "Investor Relations",
    value: "Investor Relations",
  },
  {
    label: "Legal",
    value: "Legal",
  },
  {
    label: "Marketing",
    value: "Marketing",
  },
  {
    label: "Operations",
    value: "Operations",
  },
  {
    label: "Product Management",
    value: "Product Management",
  },
  {
    label: "Production",
    value: "Production",
  },
  {
    label: "Project Management Office",
    value: "Project Management Office",
  },
  {
    label: "Purchasing / Sourcing",
    value: "Purchasing / Sourcing",
  },
  {
    label: "Quality Assurance",
    value: "Quality Assurance",
  },
  {
    label: "Risk Management",
    value: "Risk Management",
  },
  {
    label: "Sales",
    value: "Sales",
  },
  {
    label: "Strategic Initiatives & Programs",
    value: "Strategic Initiatives & Programs",
  },
  {
    label: "Research & Development",
    value: "Research & Development",
  },
  {
    label: "Public Relations",
    value: "Public Relations",
  },
  {
    label: "Executive Office",
    value: "Executive Office",
  },
  {
    label: "Design",
    value: "Design",
  },
];

export function SelectTemplateModal({
  open,
  onCancel,
  onSave,
}) {
  const [step, setStep] = useState("selectType");
  const [selectedType, setSelectedType] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep("form");
  };

  const handleSave = (formData) => {
    const templateData = {
      type: selectedType,
      sectionName,
      tags: [{ text: selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1), type: "department" },],
      ...formData,
    };
    onSave(templateData); // Notify parent with final data
  };

  console.log("selectedDepartment", selectedDepartment)
  return (
    <Modal
      title={`Create Section Template`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="p-0"
    >
      {step === "selectType" ? (
        <SelectTypeStep
          onSelectType={setSelectedType}
          selectedType={selectedType}
          onNext={() => setStep("nameAndDept")}
          onCancel={onCancel}
        />
      ) : step === "nameAndDept" ? (
        <NameAndDeptStep
          sectionName={sectionName}
          onSectionNameChange={setSectionName}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          onNext={() => setStep("form")}
          onBack={() => setStep("selectType")}
        />
      ) : (
        <FormStep
          type={selectedType}
          sectionName={sectionName}
          onBack={() => setStep("nameAndDept")}
          onSave={handleSave}
        />
      )}
    </Modal>
  );
}


const NameAndDeptStep = ({
  sectionName,
  onSectionNameChange,
  selectedDepartment,
  onDepartmentChange,
  onNext,
  onBack,
}) => {
  const isNextDisabled = !sectionName.trim() || !selectedDepartment;

  return (
    <div className="px-6 pb-6 space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Section Details</h3>
        <Button onClick={onBack}>Back</Button>
      </div>

      {/* Section Name Input */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <label className="text-sm text-gray-600">Section Name</label>
          <Tooltip title="Enter the name for this section. This helps to identify the section in your template.">
            <QuestionCircleOutlined className="text-xs text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
        <Input
          placeholder="Write section name here"
          maxLength={200}
          value={sectionName}
          onChange={(e) => onSectionNameChange(e.target.value)}
          className="w-full rounded-lg"
          required
        />
      </div>

      {/* Department Selection */}
      <div>
        <div className="flex items-center gap-1 mb-2">
          <label className="text-sm text-gray-600">Department</label>
          <Tooltip title="Select the department this section is related to. This helps in organizing and searching sections.">
            <QuestionCircleOutlined className="text-xs text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>
        <Select
          placeholder="Select department"
          className="w-full rounded-lg"
          value={selectedDepartment}
          onChange={onDepartmentChange}
          options={departmentOptions}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onBack}>Back</Button>
        <Button
          className="custom-button"
          type="primary"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};


const SelectTypeStep = ({
  onSelectType,
  selectedType,
  onNext,
  onCancel,
}) => {
  const isNextDisabled = !selectedType;

  return (
    <div className="px-6 pb-6 space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Choose Section Type</h3>
        <p className="text-sm text-gray-500">
          Select the type of section you want to create
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SectionTypeCard
          icon={<img src="/images/img_flex_align_top.svg" alt="Hero Icon" className="w-5 h-6" />}
          title="Hero Section"
          description="Main page header with image and CTAs"
          isSelected={selectedType === "hero"}
          onClick={() => onSelectType("hero")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/users-01.svg" alt="Icon" className="w-6 h-6" />}

          title="Testimonial"
          description="Customer or employee testimonials"
          isSelected={selectedType === "testimonial"}
          onClick={() => onSelectType("testimonial")}
        />
        {/* Commented out but maintained for reference
        <SectionTypeCard
          title="Feature"
          description="Product or service features"
          isSelected={selectedType === "feature"}
          onClick={() => onSelectType("feature")}
        /> */}
        <SectionTypeCard
          icon={<img src="/icons2/list.svg" alt="List Icon" className="w-6 h-6" />}
          title="Candidate Process"
          description="Step-by-step application process"
          isSelected={selectedType === "candidateProcess"}
          onClick={() => onSelectType("candidateProcess")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/user-01.svg" alt="calender Icon" className="w-6 h-6" />}
          title="Leader Introduction"
          description="Leadership team member introduction"
          isSelected={selectedType === "leaderIntro"}
          onClick={() => onSelectType("leaderIntro")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/edit-04.svg" alt="Briefcase Icon" className="w-6 h-6" />}
          title="Job Description"
          description="Detailed job requirements and responsibilities"
          isSelected={selectedType === "jobDescription"}
          onClick={() => onSelectType("jobDescription")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/zap.svg" alt="Zap Icon" className="w-6 h-6" />}
          title="Company Facts"
          description="Key statistics and information about your company"
          isSelected={selectedType === "companyFacts"}
          onClick={() => onSelectType("companyFacts")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/message-chat-circle.svg" alt="Icon" className="w-6 h-6" />}
          title="Recruiter Contact"
          description="Contact information for recruitment team"
          isSelected={selectedType === "recruiterContact"}
          onClick={() => onSelectType("recruiterContact")}
        />
        <SectionTypeCard
          icon={<img src="/images/video-recorder.svg" alt="Icon" className="w-6 h-6" />}
          title="Video Section"
          description="Embed a video with player controls"
          isSelected={selectedType === "videoSection"}
          onClick={() => onSelectType("videoSection")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/image-01.svg" alt="Icon" className="w-6 h-6" />}
          title="Photo Carousel"
          description="Image gallery with reordering"
          isSelected={selectedType === "photoCarousel"}
          onClick={() => onSelectType("photoCarousel")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/intersect-circle.svg" alt="Icon" className="w-6 h-6" />}
          title="About The Company"
          description="Company introduction with images"
          isSelected={selectedType === "aboutCompany"}
          onClick={() => onSelectType("aboutCompany")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/briefcase-01.svg" alt=" Icon" className="w-6 h-6" />}
          title="Job Specifications"
          description="Detailed job requirements and benefits"
          isSelected={selectedType === "jobSpecification"}
          onClick={() => onSelectType("jobSpecification")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/calendar.svg" alt="Icon" className="w-6 h-6" />}
          title="Daily Agenda"
          description="Timeline of daily activities"
          isSelected={selectedType === "agenda"}
          onClick={() => onSelectType("agenda")}
        />
        <SectionTypeCard
          icon={<svg
            width="20"
            height="20"
            viewBox="0 0 10 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.833 6.125C10.833 7.55737 10.1461 8.82875 9.07951 9.62762L10.1295 11.0276C10.8917 10.4576 11.5103 9.71765 11.9362 8.86656C12.3622 8.01546 12.5836 7.07672 12.583 6.125H10.833ZM6.45801 1.75C7.61833 1.75 8.73113 2.21094 9.5516 3.03141C10.3721 3.85188 10.833 4.96468 10.833 6.125H12.583C12.583 4.50055 11.9377 2.94263 10.789 1.79397C9.64038 0.64531 8.08246 0 6.45801 0V1.75ZM2.08301 6.125C2.08301 4.96468 2.54394 3.85188 3.36442 3.03141C4.18489 2.21094 5.29769 1.75 6.45801 1.75V0C4.83356 0 3.27564 0.64531 2.12698 1.79397C0.97832 2.94263 0.333009 4.50055 0.333009 6.125H2.08301ZM3.83651 9.62762C3.2917 9.22063 2.84946 8.69203 2.54503 8.08393C2.2406 7.47583 2.08239 6.80504 2.08301 6.125H0.333009C0.332396 7.07672 0.553859 8.01546 0.979787 8.86656C1.40571 9.71765 2.02435 10.4576 2.78651 11.0276L3.83651 9.62762ZM5.58038 14.6501C5.55271 13.3159 5.27706 11.9985 4.76751 10.7651L3.15051 11.4345C3.57576 12.4644 3.80763 13.5669 3.83126 14.6869L5.58038 14.6501ZM7.63226 14.1846C7.26768 14.367 6.86564 14.4619 6.45801 14.4619C6.05037 14.4619 5.64834 14.367 5.28376 14.1846L4.50151 15.75C5.10898 16.0537 5.77883 16.2118 6.45801 16.2118C7.13718 16.2118 7.80703 16.0537 8.41451 15.75L7.63226 14.1846ZM8.14851 10.766C7.63876 11.999 7.36282 13.3162 7.33476 14.6501L9.08476 14.6869C9.10838 13.5669 9.34026 12.4644 9.76551 11.4345L8.14851 10.766ZM8.41451 15.75C8.61244 15.6506 8.77947 15.4991 8.89759 15.3117C9.01571 15.1244 9.08042 14.9083 9.08476 14.6869L7.33476 14.6501C7.33717 14.5528 7.36616 14.4579 7.4186 14.3759C7.47104 14.2938 7.54492 14.2277 7.63226 14.1846L8.41451 15.75ZM3.83126 14.6869C3.84001 15.1279 4.08851 15.5435 4.50151 15.75L5.28376 14.1846C5.37109 14.2277 5.44498 14.2938 5.49742 14.3759C5.54986 14.4579 5.57885 14.5528 5.58126 14.6501L3.83126 14.6869ZM2.78651 11.0276C2.91776 11.1274 2.99563 11.1851 3.04988 11.2289C3.10501 11.2744 3.09451 11.2726 3.07001 11.2411L4.45251 10.1684C4.28888 9.95662 4.03513 9.77637 3.83651 9.62762L2.78651 11.0276ZM4.76751 10.7651C4.69926 10.5997 4.61263 10.374 4.45251 10.1684L3.07001 11.2411C3.05863 11.2254 3.05601 11.2175 3.06738 11.2411C3.09531 11.3051 3.12273 11.3692 3.14963 11.4336L4.76751 10.7651ZM9.07951 9.62762C8.88088 9.77637 8.62626 9.9575 8.46263 10.1684L9.84601 11.2411C9.82238 11.2717 9.81101 11.2744 9.86613 11.2297C9.92038 11.1851 9.99738 11.1274 10.1295 11.0285L9.07951 9.62762ZM9.76551 11.4345L9.81801 11.3094L9.84863 11.2411C9.86001 11.2175 9.85738 11.2254 9.84601 11.2411L8.46263 10.1684C8.30251 10.3749 8.21676 10.5997 8.14851 10.766L9.76551 11.4345Z"
              fill="#667085"
            />
            <path
              d="M9.07584 11.375C8.30097 11.893 7.38988 12.1694 6.45784 12.1694C5.5258 12.1694 4.61471 11.893 3.83984 11.375"
              stroke="#667085"
            />
          </svg>}
          title="EVP / Mission"
          description="Executive profile and company mission"
          isSelected={selectedType === "evpMission"}
          onClick={() => onSelectType("evpMission")}
        />
        <SectionTypeCard
          icon={<img src="/images/trend-up-01.svg" alt="Icon" className="w-6 h-6" />}
          title="Growth Path"
          description="Career progression timeline"
          isSelected={selectedType === "growthPath"}
          onClick={() => onSelectType("growthPath")}
        />
        <SectionTypeCard
          icon={<img src="/icons2/type-square.svg" alt="Icon" className="w-6 h-6" />}
          title="Text Box"
          description="Add a title, brief text, and an optional image to display important information."
          isSelected={selectedType === "textBox"}
          onClick={() => onSelectType("textBox")}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          className="custom-button"
          type="primary"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};


const FormStep = ({ type, sectionName, onBack, onSave }) => {
  let FormComponent;
  switch (type) {
    case "hero":
      FormComponent = HeroForm;
      break;
    case "testimonial":
      FormComponent = TestimonialsForm;
      break;
    case "leaderIntro":
      FormComponent = leaderIntroductionForm;
      break;
    case "jobDescription":
      FormComponent = JobDescriptionForm;
      break;
    case "companyFacts":
      FormComponent = CompanyFactsForm;
      break;
    case "recruiterContact":
      FormComponent = RecruiterContactForm;
      break;
    case "candidateProcess":
      FormComponent = CandidateProcessForm;
      break;
    case "videoSection":
      FormComponent = VideoSectionForm;
      break;
    case "photoCarousel":
      FormComponent = PhotoCarouselForm;
      break;
    case "aboutCompany":
      FormComponent = AboutCompanyForm;
      break;
    case "jobSpecification":
      FormComponent = JobSpecificationsForm;
      break;

    case "agenda":
      FormComponent = AgendaForm;
      break;

    case "evpMission":
      FormComponent = EVPMissionForm;
      break;

    case "growthPath":
      FormComponent = GrowthPathForm;
      break;
    case "textBox":
      FormComponent = TextBoxForm
      break;
    default:
      return <div>
        Unsupported section type
        <Button onClick={onBack} className="mb-4">
          Back
        </Button>
      </div>;
  }

  return (
    <div className="px-6 pb-6">
      <div className="mb-6 flex justify-between">
        <h3 className="text-lg font-semibold">
          Configure {sectionName} ({type})
        </h3>
        <Button onClick={onBack} className="mb-4">
          Back
        </Button>
      </div>

      {/* section name I want section name here  */}
      <FormComponent onSave={onSave} />
    </div>
  );
};
// disabled
// ? "opacity-50 cursor-not-allowed"
// :
// const SectionTypeCard = ({ title, description, onClick,  }) => (
//   <div
//     onClick={onClick}
//     className={`${
//        "cursor-pointer hover:border-blue-500"
//     } p-4 border rounded-lg  transition-colors`}
//   >
//     <h4 className="font-medium">{title}</h4>
//     <p className="text-sm text-gray-500">{description}</p>
//   </div>
// );


const SectionTypeCard = ({
  icon,
  title,
  description,
  isSelected,
  onClick
}) => (
  <div
    onClick={onClick}
    className={`${isSelected
      ? "border-blue-500 bg-blue-50"
      : "hover:border-blue-200 cursor-pointer"
      } p-4 border rounded-lg transition-colors`}
  > <div className="flex items-center gap-2 ">
      {icon && <div className="w-5 h-5 mb-2 ">{icon}</div>}
      <h4 className="font-medium mb-1 ">{title}</h4>
    </div>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

