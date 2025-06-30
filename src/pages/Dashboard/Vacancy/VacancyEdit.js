import { HomeOutlined } from "@ant-design/icons";
import {
  AdjustmentsHorizontalIcon,
  BoltIcon,
  CloudArrowUpIcon,
  GlobeEuropeAfricaIcon,
  LinkIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { Breadcrumb, Modal, Skeleton, Switch, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { handleXLSXTOJSON } from "../Vacancies/components/Board/services/utils";
import MultiStepComponent from "../Vacancies/components/MultiStepComponent";
import { currencies } from "../../../data/currencies";
import { selectLoading, selectUser } from "../../../redux/auth/selectors";
import CrudService from "../../../services/CrudService";
import LinkService from "../../../services/LinkService";
import UserService from "../../../services/UserService";
import ApplicationLink from "./DetailsModal/ApplicactionLink";
import ConfigurePayment from "./DetailsModal/ConfigurePayment";
import FormMultiStep from "./FormMultiStep";
import ImportModule from "./ImportModule";

const VacancyEdit = () => {
  let [searchParams] = useSearchParams();
  const user = useSelector(selectUser);
  const router = useRouter();;
  const [vacancyData, setVacancyData] = useState(null);
  const [heroes, setHeroes] = useState([]);
  const fileInputRef = useRef(null);
  const [bulkUploadProcess, setBulkUploadProcess] = useState({});
  const [shortLink, setShortLink] = useState("");
  const [linkModal, setlinkModal] = useState(false);
  const loading = useSelector(selectLoading);

  const copyLink = async () => {
    const link = await getShortLink(`apply/${vacancyData?._id}`);
    setlinkModal(true);
  };

  const getShortLink = async (link) => {
    const res = await LinkService.shortLink(link);
    setShortLink(res.data.shortLink);
  };

  const uploadCSV = () => {
    const stageId =
      vacancyData?.onApplyAssignStage ?? vacancyData?.vacancyStages?.[0];
    if (!stageId) return message.error("No stage found");

    setBulkUploadProcess({
      stageId,
    });
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleXLSXTOJSON({ sheet: file }, async (json) => {
        json.shift();

        let mappings = {};
        try {
          mappings = JSON.parse(
            localStorage[
              `importfile_mapping_${Object.keys(json?.[0]).join("_")}`
            ]
          );
        } catch (e) {}

        setBulkUploadProcess((current) => ({ ...current, json, mappings }));
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    CrudService.search("Hero", 1000, 1, {
      filters: { user_id: user._id },
    }).then((res) => {
      console.log(res);
      const heroesToAdd = res.data.items.map((hero) => ({
        label: hero.name,
        value: hero._id,
      }));
      setHeroes(heroesToAdd);
      console.log(heroes);
    });
  }, [user]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    setVacancyData(null);

    CrudService.getSingle("Vacancy", id).then((res) => {
      if (!res.data) return;
      setVacancyData(res.data);
    });
  }, [searchParams]);

  //   useEffect(() => {
  //   if (!partner?.calendlyclientId) return;
  //   CalendlyService.getEventTypes().then(({ data }) => {
  //     setEventTypes(data.eventTypes);
  //   });
  // }, [partner]);

  const settings = [
    {
      title: "Application Link",
      icon: <LinkIcon className="h-6 w-6" />,
      text: "Create a URL through which applicants can apply and get interviewed instantly or plan an interview",
      action: copyLink,
    },
    {
      title: "Upload Applicants",
      icon: <CloudArrowUpIcon className="h-6 w-6" />,
      text: "Upload a CSV list of applicants and let the system do the rest",
      action: uploadCSV,
    },
    {
      title: "Integrate ATS",
      icon: <SquaresPlusIcon className="h-6 w-6" />,
      text: "Coming soon.",
      action: "",
    },
  ];

  const steps = [
    {
      id: "step1",
      name: "General Information",
      form: [
        // {
        //   fieldName: "training",
        //   label: "Training",
        //   type: "switch",
        // },
        {
          fieldName: "name",
          label: "Job Title",
          type: "input",
          required: true,
          placeholder: "Enter job title for this campaign",
        },
        {
          //Add "No description?" option
          fieldName: "description",
          label: "Job Description",
          type: "textarea",
          placeholder:
            "Copy/paste the job description. Add as much relevant information as possible and let the HireHero learn about the job. Got no job description? Type in some keywords in relation too the job and click our AI job description generator and we got you covered.",
          rows: 6,
        },
        {
          fieldName: "hero", //OBJref
          label: "Select Hero",
          type: "select",
          required: true,
          placeholder: "",
          options: heroes,
          //add a list of heroes as options
        },
        //add the posibility of creating a new hero
        // {
        //   fieldName: "create ney hero",
        //   label: "+ Or create new HireHero",
        //   type: "link",
        //   link: ""
        // },
      ],
    },
    {
      id: "step2",
      name: "Job Specifics",
      form: [
        {
          fieldName: "requiredSkills",
          label: "Required Skills (Optional)",
          type: "textarea",
          placeholder: "List all important skills and traits here",
          rows: 6,
        },
        // {
        //   fieldName: "mustHaves", //
        //   label: "Must-Haves (Optional)",
        //   type: "textarea",
        //   placeholder:
        //   "List must-haves.For example: Accountant having experience with Aetsuite. For example: Must live no further than 30 miles away from ManHattan - New York",
        //   rows: 6,
        // },
        {
          fieldName: "keyBenefits",
          label: "Key Benefits (Optional)",
          type: "textarea",
          placeholder:
            "List company benefits.For example: Competitive salary, flexible work hours, opportunity for career growth",
          rows: 6,
        },
        {
          fieldName: "dealBreakers",
          label: "Deal Breakers (Optional)",
          type: "textarea",
          placeholder:
            "List deal breakers. These are specifics that will cause the HireHero to professionally end the call. These are discovered early on in the process. For example: Truck Drivers License. Applicant can't confirm possession of driver's license for a CE Truck Driver position ",
          rows: 6,
        },
      ],
    },
    {
      id: "step3",
      name: "Settings",
      form: [
        {
          fieldName: "conversationLength",
          label: "Max length of conversation (minutes)",
          type: "select-cost",
          options: [
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
            { value: 25, label: "25" },
            { value: 30, label: "30" },
            { value: 35, label: "35" },
            { value: 40, label: "40" },
            { value: 45, label: "45" },
            { value: 50, label: "50" },
            { value: 55, label: "55" },
            { value: 60, label: "60" },
          ],
        },
        // {
        //   fieldName: "costLimit",
        //   label: "Campaign Cost Limit",
        //   type: "select",
        //   options: [
        //     { value: "limit", label: "limit" },
        //   ],
        // },
        {
          fieldName: "introductionLine",
          label: "Introduction Line",
          type: "textarea",
          placeholder:
            "Example: Hi my name is [Name Al] from SDL, thanks for taking this call. This call is about your application for the position of [Job Title]. Can you confirm you're application for this role?",
          rows: 5,
        },
      ],
    },
    {
      id: "step4",
      name: "Launch",
      form: [
        {
          fieldName: "settings",
          options: settings,
          type: "cards",
        },
      ],
    },
  ];

  if (!vacancyData) return <Skeleton active />;
  return (
    <div className="container mx-auto p-2 flex-column">
      <div className="relative flex items-center">
        <div className="flex flex-col w-full  items-start mb-3">
          <Breadcrumb
            separator=">"
            className="text-sm font-medium mb-5"
            items={[
              {
                title: <HomeOutlined />,
                href: "/dashboard/home",
              },
              {
                title: <a href="/dashboard/vacancy">My Campaigns</a>,
              },
              {
                title: "Edit Campaign",
              },
            ]}
          />
          <h1 className="text-3xl font-semibold mb-1">Edit Campaign</h1>
          <p className="font-normal text-base text-[#475467]">
            Create and manage your AI Recruitment Interview Campaigns.
          </p>
        </div>
      </div>
      <FormMultiStep
        displaySteps={true}
        displayUndoRedo
        AIEnhancements={true}
        steps={steps}
        defaultFormData={{
          ...vacancyData,
        }}
        onFinish={async (formData) => {
          const id = searchParams.get("id");
          if (!id) return;
          console.log(formData);
          await CrudService.update("Vacancy", id, {
            ...formData,
          });

          router.push(`/dashboard/vacancydetails?id=${id}`);
        }}
        onNext={async (formData) => {
          const id = searchParams.get("id");
          if (!id) return;

          await CrudService.update("Vacancy", id, {
            ...formData,
          });
        }}
      />
      <Modal
        open={!!bulkUploadProcess?.json?.[0]}
        onCancel={() => setBulkUploadProcess({})}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <ImportModule
          bulkUploadProcess={bulkUploadProcess}
          setBulkUploadProcess={setBulkUploadProcess}
          VacancyId={vacancyData._id}
        />
      </Modal>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.csv"
      />
      <Modal
        open={linkModal}
        onCancel={() => setlinkModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        loading={loading}
      >
        <ApplicationLink
          shortLink={shortLink}
          setShortLink={setShortLink}
          setlinkModal={setlinkModal}
        />
      </Modal>
    </div>
  );
};

export default VacancyEdit;
