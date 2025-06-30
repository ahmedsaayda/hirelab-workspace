import { HomeOutlined } from "@ant-design/icons";
import { Allotment } from "allotment";
import {
  Alert,
  Breadcrumb,
  Button,
  Divider,
  Modal,
  Skeleton,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { GrInfo } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { handleXLSXTOJSON } from "../../../../src/components/Board/services/utils";
import CloudinaryUpload from "../../../../src/components/CloudinaryUpload";
import Select from "../../../../src/components/Select";
import {
  selectDarkMode,
  selectLoading,
  selectUser,
} from "../../../../src/redux/auth/selectors";
import ATSService from "../../../../src/services/ATSService";
import CrudService from "../../../../src/services/CrudService";
import LinkService from "../../../../src/services/LinkService";
// import OnboardUser from "../OnboardUser";
const OnboardUser = () => <div>Onboard User Component</div>;
import ATS from "./ATS";
import ApplicationLink from "./DetailsModal/ApplicactionLink";
import ImportModule from "./ImportModule";

const VacancyDetails = () => {
  const router = useRouter();
  const { query } = router;
  const [vacancyData, setVacancyData] = useState(null);
  const [bulkUploadProcess, setBulkUploadProcess] = useState({});
  const darkMode = useSelector(selectDarkMode);
  const fileInputRef = useRef(null);
  const [heroes, setHeroes] = useState([]);
  const user = useSelector(selectUser);
  const [linkModal, setlinkModal] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const loading = useSelector(selectLoading);
  const [selectHero, setSelectHero] = useState("");
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    setOnboarding(!user.onboarded);
  }, [user]);

  const copyLink = async () => {
    await getShortLink(`apply/${vacancyData?._id}`);
    setlinkModal(true);
  };

  const getShortLink = async (link) => {
    const res = await LinkService.shortLink(link);
    console.log(res);
    setShortLink(res.data.shortLink);
    console.log(shortLink);
  };

  useEffect(() => {
    if (!user) return;

    CrudService.search("Hero", 1000, 1, {
      filters: { user_id: user._id },
    }).then((res) => {
      setHeroes(res.data.items);
    });
  }, [user]);

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
    const id = query.id;
    if (!id) return;
    setVacancyData(null);

    CrudService.getSingle("Vacancy", id, "hero").then((res) => {
      if (!res.data) return;
      setVacancyData(res.data);
    });
  }, [query]);

  const handleClick = async (e) => {
    e.preventDefault();

    let formData = {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    try {
      const submission = await CrudService.create("VacancySubmission", {
        VacancyId: vacancyData._id,
        stageId:
          vacancyData?.onApplyAssignStage ?? vacancyData?.vacancyStages?.[0],
        formData,
        searchIndex: JSON.stringify(formData),
      });

      const result = await ATSService.getApplyToken(submission.data.result._id);

      window.open(
        `/interview-call?token=${result.data.token}&training=true`,
        "_blank"
      );
    } catch (error) {
      message.error("Error al procesar la solicitud:", error);
    }
  };

  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      <div className="w-full z-10">
        {vacancyData && (
          <>
            <Breadcrumb
              separator=">"
              items={[
                {
                  title: <HomeOutlined />,
                  href: "/dashboard/home",
                },
                {
                  title: <a href="/dashboard/vacancy">My Campaigns</a>,
                },
                {
                  title: "Campaign Details",
                },
              ]}
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col w-full  items-start">
                <div className="flex items-center">
                  <h1 className="text-3xl font-semibold my-1">
                    {vacancyData?.alternativeName || vacancyData?.name}
                  </h1>
                  {vacancyData.training && (
                    <h5 className="border border-solid border-[#FFC300] text-sm bg-[#f7dc6f] text-center font-medium rounded-xl mx-5 px-2">
                      TRAINING
                    </h5>
                  )}
                  {!vacancyData.enabled && (
                    <h5 className="border border-solid border-gray-600 text-sm bg-gray-300 text-center font-medium rounded-xl mx-5 px-2">
                      DISABLED
                    </h5>
                  )}
                </div>
                <p className="font-normal text-base text-[#475467]">
                  Overview of the campaign
                </p>
              </div>
              <div className="flex gap-2">
                {vacancyData.training ? (
                  // <Button
                  //           onClick={async()=>{
                  //             let formData= {
                  //               firstname: user.firstName,
                  //               lastname: user.lastName,
                  //               email: user.email,
                  //               phone: user.phone,
                  //             }
                  //             const submission = await CrudService.create("VacancySubmission", {
                  //               VacancyId: vacancyData._id,
                  //               stageId: vacancyData?.onApplyAssignStage ??
                  //               vacancyData?.vacancyStages?.[0],
                  //               formData,
                  //               searchIndex: JSON.stringify(formData),
                  //             })
                  //             const result = await ATSService.getApplyToken(submission.data.result._id)
                  //              router.push(`/interview-call?token=${result.data.token}&training=true`)

                  //           }}
                  //           type="secondary"
                  //           style={{ textTransform: "capitalize" }}
                  //           className="bg-white"
                  //         >
                  //           Try demo interview
                  //         </Button>
                  <Button
                    type="secondary"
                    style={{ textTransform: "capitalize" }}
                    className="bg-white"
                    loading={loading}
                  >
                    <Link
                      href="#"
                      onClick={handleClick}
                      style={{ textDecoration: "none" }}
                    >
                      Try demo interview
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      copyLink();
                    }}
                    style={{ textTransform: "capitalize" }}
                    className="bg-white"
                    disabled={!vacancyData.enabled}
                  >
                    Copy invitation link
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const stageId =
                      vacancyData?.onApplyAssignStage ??
                      vacancyData?.vacancyStages?.[0];
                    if (!stageId) return message.error("No stage found");

                    setBulkUploadProcess({
                      stageId,
                    });
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                  }}
                  type="primary"
                  className="bg-gradient "
                >
                  + Insert Candidates
                </Button>
              </div>
            </div>
          </>
        )}

        <ATS
          VacancyId={vacancyData._id}
          vacancyInfo={{ name: vacancyData.name }}
        />

        <Modal
          wrapClassName={`${darkMode ? "dark" : ""}`}
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

        {/* For bulk upload */}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.csv"
        />
      </div>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!vacancyData?.hero?._id}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title="Please select a hero for this campaign"
      >
        <Select
          options={[
            { value: "", label: "" },
            ...heroes.map((hero) => ({
              value: hero._id,
              label: hero.name,
            })),
          ]}
          onChange={(e) => {
            setSelectHero(e);
          }}
          value={selectHero}
        />
        <div className="mt-2 flex flex-col w-full">
          <Button
            type="primary"
            className="w-full"
            onClick={(e) => {
              if (!selectHero) return;
              CrudService.update("Vacancy", vacancyData._id, {
                hero: selectHero,
              }).then((res) => {
                CrudService.getSingle("Vacancy", vacancyData._id, "hero").then(
                  (res) => {
                    if (!res.data) return;
                    setVacancyData(res.data);
                  }
                );
              });
            }}
          >
            Save
          </Button>
          <Divider>or</Divider>
          <Button
            type="primary"
            className="w-full"
            onClick={async () => {
              const hero = await CrudService.create("Hero", {
                user_id: user._id,
              });
              if (hero?.data?.result?._id)
                router.push(`/dashboard/heroedit?id=${hero?.data?.result?._id}`);
            }}
          >
            Create New Hero
          </Button>
        </div>
      </Modal>
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

      <Modal
        open={onboarding}
        wrapClassName={`${darkMode ? "dark" : ""}`}
        onCancel={() => setOnboarding(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <OnboardUser />
      </Modal>
    </>
  );
};

export default VacancyDetails;
