import { HomeOutlined } from "@ant-design/icons";
import HomeIcon, {
  AdjustmentsHorizontalIcon,
  BoltIcon,
  GlobeEuropeAfricaIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Breadcrumb, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MultiStepComponent from "../../../../src/components/MultiStepComponent";
import { getPartner } from "../../../../src/redux/auth/selectors";
import CalendlyService from "../../../../src/services/CalendlyService";
import CrudService from "../../../../src/services/CrudService";
// import { voices } from "../../InterviewBookCall";
// Placeholder voices object
const voices = {
  en: { label: "English" },
  es: { label: "Spanish" },
  fr: { label: "French" },
  de: { label: "German" },
};
import FormMultiStep from "./FormMultiStep";
import { partner } from "../../../../src/constants";
// import getFormPrompt from "./getFormPrompt";
// import getFunnelPrompt from "./getFunnelPrompt";

const steps = (eventTypes) => [
  {
    id: "step1",
    name: "General Information",
    form: [
      {
        fieldName: "name",
        label: "Name",
        type: "input",
        placeholder: "Name your HireHero",
        required: true,
      },
      {
        fieldName: "aiImage",
        label: "Choose AI Avatar",
        type: "checkbox",
        options: avatars,
      },
    ],
  },

  {
    id: "step4",
    name: "AI Call Configuration",
    form: [
      // {
      //   fieldName: "aiSpeed",
      //   label: "Speed",
      //   type: "select",
      //   options: [
      //     { value: 0.85, label: "Slow" },
      //     { value: 1, label: "Normal" },
      //     { value: 1.35, label: "Fast" },
      //     { value: 1.6, label: "Ultra Fast" },
      //   ],
      //   placeholder: "Select the speed of speech",
      // },
      // {
      //   fieldName: "aiGender",
      //   label: "Gender",
      //   type: "select",
      //   options: [
      //     { value: "female", label: "Female" },
      //     { value: "male", label: "Male" },
      //   ],
      //   placeholder: "Select the gender of hero",
      // },
      {
        fieldName: "aiLanguage",
        label: "Language",
        type: "select",
        options: Object.keys(voices).map((key) => ({
          value: key,
          label: voices[key].label,
        })),
        placeholder: "Select the speed of speech",
      },
      {
        fieldName: "aiStyle",
        label: "Interview Style",
        options: interviewTypes,
        type: "customCheckbox",
      },
      // {
      //   fieldName: "aiMaxDuration",
      //   label: "Maximum Call Duration",
      //   type: "inputNumber",
      //   placeholder: "Specify the maximum duration of an interview in minutes",
      // },
      // {
      //   fieldName: "aiRecord",
      //   label: "Record Call",
      //   type: "switch",
      //   placeholder:
      //     "Specify whether you would like to create a voice recording of your call",
      // },
    ],
  },
];

const avatars = [
  {
    id: 1,
    fieldName: "aiImage",
    value: "/images/avatars/Avatar1.png",
  },
  {
    id: 2,
    fieldName: "aiImage",
    value: "/images/avatars/Avatar2.png",
  },
  {
    id: 3,
    fieldName: "aiImage",
    value: "/images/avatars/Avatar3.png",
  },
  {
    id: 4,
    fieldName: "aiImage",
    value: "/images/avatars/Avatar4.png",
  },
];

const interviewTypes = [
  {
    icon: <BoltIcon className="w-6 h-6" />,
    title: "General",
    description: "HireHero focuses on high-level skills & traits",
    fieldName: "aiStyle",
    value: "general",
  },
  {
    icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />,
    title: "Technical",
    description: "HireHero focuses on technical aspects of the job",
    fieldName: "aiStyle",
    value: "technical",
  },
  {
    icon: <GlobeEuropeAfricaIcon className="w-6 h-6" />,
    title: "Culture",
    description: "HireHero focuses on cultural aspects of the job",
    fieldName: "aiStyle",
    value: "culture",
  },
  {
    icon: <LinkIcon className="w-6 h-6" />,
    title: "Mix",
    description: "The choice for deeper and longer conversations",
    fieldName: "aiStyle",
    value: "mix",
  },
];

const HeroEdit = () => {
  const router = useRouter();
  const { query } = router;
  const [vacancyData, setVacancyData] = useState(null);
  const vidRef = useRef();
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    if (!partner?.calendlyclientId) return;
    CalendlyService.getEventTypes().then(({ data }) => {
      setEventTypes(data.eventTypes);
    });
  }, [partner]);

  useEffect(() => {
    if (vidRef.current) vidRef.current.play();
  }, [vidRef]);

  useEffect(() => {
    const id = query.id;
    if (!id) return;

    CrudService.getSingle("Hero", id).then((res) => {
      if (!res.data) return;
      setVacancyData(res.data);
      console.log(res.data);
    });
  }, [query]);

  if (!vacancyData) return <Skeleton active />;

  return (
    <>
      <div className="container p-2 mx-auto flex-column ">
        <div className="relative flex items-center ">
          <div className="flex flex-col items-start w-full">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: <HomeOutlined />,
                  href: "/dashboard/home",
                },
                {
                  title: <a href="/dashboard/heroes">My Heroes</a>,
                },
                {
                  title: "Create New HireHero",
                },
              ]}
            />
            <h1 className="text-2xl font-bold">Create New HireHero</h1>
            <p className="text-md font-inter text-[#475467]">
              Create and manage your autonomous AI Recruitment Assistant.
            </p>
          </div>
        </div>
        <div>
          {/* - */}
          <FormMultiStep
            AIEnhancements={true}
            displayUndoRedo
            steps={steps(eventTypes)}
            defaultFormData={{
              ...vacancyData,
            }}
            onFinish={async (formData) => {
              const id = query.id;
              if (!id) return;

              if (
                formData.aiImage === "/images/avatars/Avatar3.png" ||
                formData.aiImage === "/images/avatars/Avatar4.png"
              ) {
                formData.aiGender = "male";
              }
              await CrudService.update("Hero", id, {
                ...formData,
              });

              router.push(`/dashboard/heroes`);
            }}
            onNext={async (formData) => {
              const id = query.id;
              if (!id) return;

              await CrudService.update("Hero", id, {
                ...formData,
              });
            }}
            buttomLineWrapperClass="fixed bottom-0 w-full bg-white dark:bg-gray-900 rounded-t-sm pl-[20px] pt-[20px] pb-[20px] pr-[80px] right-0	bottom-0"
            buttomLineInnerClass="items-end flex flex-col"
          />
        </div>
      </div>
    </>
  );
};

export default HeroEdit;
