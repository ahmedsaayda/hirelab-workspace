import { UserAddOutlined, WechatWorkOutlined } from "@ant-design/icons";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ChevronDoubleRightIcon,
  EnvelopeIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Alert,
  Button,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Timeline,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFall, AiOutlineMail, AiOutlineSend } from "react-icons/ai";
import { BiCalendarAlt, BiMapPin, BiTimeFive } from "react-icons/bi";
import { BsStars, BsTelephone } from "react-icons/bs";
import { FaAngleDown, FaExternalLinkAlt } from "react-icons/fa";
import { MdAttachFile, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Link from "next/link";
import MultiStepComponent from "../../../../../src/components/MultiStepComponent";
import {
  STANDARD_MOMENT_FORMAT,
  eeoForm,
  personalDataCollection,
} from "../../../../../src/data/constants";
import { getPartner, selectLoading } from "../../../../../src/redux/auth/selectors";
import ATSService from "../../../../../src/services/ATSService";
import CrudService from "../../../../../src/services/CrudService";
import PublicService from "../../../../../src/services/PublicService";
import UploadService from "../../../../../src/services/UploadService";
import CVTemplate from "../../../CandidateCV/CVTemplate";
import CandidateRejectBox from "../../Message/CandidateRejectBox";
import CandidateNote from "../CandidateNote";
import CallStatsComponent from "./CallStatsComponent";
import CandidateAvatarInfo from "./components/CandidateAvatarInfo";
import DetailHeader from "./components/DetailHeader";
import MoveCandidate from "./components/MoveCandidate";
import Overview from "./components/Overview";
import OverviewTabs from "./components/OverviewTabs";
import ScoreCard from "./components/ScoreCard";
import StageTabs from "./components/StageTabs";

const { TabPane } = Tabs;

function convertLinksToHTML(text) {
  var urlWithTitleRegex = /\{([^}]+)\}\[([^\]]+)\]/g;

  var replacedText = text.replace(
    urlWithTitleRegex,
    function (match, url, title) {
      // Use the title as the link text
      return '<a href="' + url + '" target="_blank">' + title + "</a>";
    }
  );

  var urlRegex =
    /(?<!href="|href='|">)(https?:\/\/[^\s\n<]+)(?=[,.!?;]*($|\s|<))/g;

  replacedText = replacedText.replace(urlRegex, function (url) {
    return '<a href="' + url + '" target="_blank">' + url + "</a>";
  });

  return replacedText;
}

const getDocumentStatus = (document) => {
  if (!document?.candidateSignature) return "Pending";
  if (
    !document?.body?.includes?.(
      "@[Hiring Authority Signature](hiringAuthoritySignature)"
    )
  )
    return "Completed";
  if (document?.hiringManagerSignature) return "Completed";
  return "Candidate Signed";
};
const getDocumentColor = (document) => {
  if (!document?.candidateSignature) return "orange";
  if (
    !document?.body?.includes?.(
      "@[Hiring Authority Signature](hiringAuthoritySignature)"
    )
  )
    return "green";
  if (document?.hiringManagerSignature) return "green";
  return "blue";
};

function downloadAndShowPDF(pdfUrl, setLocalPdfUrl) {
  fetch(pdfUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const localUrl = URL.createObjectURL(blob);
      setLocalPdfUrl(localUrl); // Assuming you have a state setter for the local PDF URL
    })
    .catch((error) => console.error("Error downloading the PDF:", error));
}

const LOG_LOAD_PAGINATION = 25;

const DetailsModal = ({
  candidateId,
  vacancyInfo,
  onEmail,
  reloadStages,
  setDetailsModal,
}) => {
  console.log("vacancyInfo", vacancyInfo);

  const [AILoading, setAILoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [vacancyData, setVacancyData] = useState(null);
  const [candidateTimeline, setCandidateTimeline] = useState([]);
  const [candidateTimelineTotal, setCandidateTimelineTotal] = useState(0);
  const [currentLogsPage, setCurrentLogsPage] = useState(1);
  const [CV, setCV] = useState(null);
  const [interviewScripts, setInterviewScripts] = useState([]);
  const [candidateDocuments, setCandidateDocuments] = useState([]);
  const [surveySubmission, setSurveySubmission] = useState(null);
  const [alternativePDFLocalURL, setAlternativePDFLocalURL] = useState(null);
  const [AIInstructions, setAIInstructions] = useState("");
  // const [activeTab, setActiveTab] = useState("phoneCalls");
  const [activeTab, setActiveTab] = useState("overview");
  const [callDetailModal, setCallDetailModal] = useState(null);
  const [averageSkills, setAverageSkills] = useState(null);
  const [averageCultural, setAverageCultural] = useState(null);
  const [averageEmotional, setAverageEmotional] = useState(null);
  const socket = useRef(null);
  const socketPing = useRef(null);
  const loading = useSelector(selectLoading);
  const [stages, setStages] = useState([]);
  const fileInput = useRef(null);
  const [lastCall, setLastCall] = useState({});
  const [rejectCandidate, setRejectCandidate] = useState(null);
  const [moveCandidate, setMoveCandidate] = useState(null);

  function getNextObject(array, id) {
    console.log(array);
    console.log(id);
    const index = array.findIndex((obj) => obj.id === id);
    if (index === -1 || array.length === 0) {
      return null;
    }

    if (index === array.length - 1) {
      return array[0].id;
    }

    return array[index + 1].id;
  }
  function getPrevObject(array, id) {
    const index = array.findIndex((obj) => obj.id === id);
    if (index === -1 || array.length === 0) {
      return null;
    }

    if (index === 0) {
      return array[array.length - 1].id;
    }

    return array[index - 1].id;
  }

  useEffect(() => {
    if (!candidateId) return;

    fileInput.current = document.getElementById("fileInput34");
    if (fileInput.current)
      fileInput.current.addEventListener("change", async () => {
        const selectedFile = fileInput.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 5);

          await ATSService.submitCV(candidateId, result.data.secure_url);

          CrudService.search("CV", 1, 1, {
            filters: { candidate: candidateId, submitted: true },
          })
            .then(({ data }) => {
              if (data.items?.[0]) setCV(data.items?.[0]);
              else setCV(false);
            })
            .catch((err) => console.log(err));
          fileInput.current.files[0] = "";
        } else {
          console.log("No file selected.");
        }
      });
  }, [candidateId]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (CV?.alternativeUrl)
      downloadAndShowPDF(alternativePDFLocalURL, setAlternativePDFLocalURL);
  }, [CV]);

  useEffect(() => {
    if (!candidateId) return;

    CrudService.search("VacancySubmission", 1, 1, {
      filters: { _id: candidateId },
      populate: {
        path: "emailSent.user_id",
        select: "firstName lastName email",
      },
      populate2: {
        path: "smsSent.user_id",
        select: "firstName lastName email",
      },
    })
      .then(({ data }) => {
        if (data.items?.[0]) {
          console.log(data.items?.[0]);
          console.log(data.items?.[0].VacancyId);
          setCandidate(data.items[0]);

          CrudService.search("LandingPageData", 1, 1, {
            filters: { _id: data.items?.[0].LandingPageDataId },
          })
            .then(({ data }) => {
              console.log(data.items?.[0]);
              if (data.items?.[0]) setVacancyData(data.items?.[0]);
            })
            .catch((err) => console.log(err));
        } else setCandidate(false);
      })
      .catch((err) => {
        console.log(err);
      });

    CrudService.search("CV", 1, 1, {
      filters: { candidate: candidateId, submitted: true },
    })
      .then(({ data }) => {
        if (data.items?.[0]) setCV(data.items?.[0]);
        else setCV(false);
      })
      .catch((err) => console.log(err));

    CrudService.search("SurveySubmission", 1, 1, {
      filters: { VacancySubmissionId: candidateId },
    })
      .then(({ data }) => {
        if (data.items?.[0]) setSurveySubmission(data.items?.[0]);
        else setSurveySubmission(false);
      })
      .catch((err) => console.log(err));

    CrudService.search("CandidateLogs", LOG_LOAD_PAGINATION, 1, {
      filters: { candidate: candidateId },
      sort: { createdAt: -1 },
      populate: "user_id",
    })
      .then(({ data }) => {
        setCandidateTimeline(data.items);
        setCandidateTimelineTotal(data.total);
      })
      .catch((err) => console.log(err));

    // ATSService.getCandidateDocuments(candidateId)
    //   .then(({ data }) => setCandidateDocuments(data))
    //   .catch((err) => console.log(err));
  }, [candidateId]);

  console.log(candidateId);

  if (!candidate) return <Skeleton active />;
  // if (CV === null) return <Skeleton active />;
  // if (surveySubmission === null) return <Skeleton active />;

  const dateConversion = (_date) => {
    if (_date == undefined || _date == null) return;
    let date = new Date(_date); // Note: JavaScript months are zero-based, so February is represented by 1
    let formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
    return formattedDate;
  };

  const sortingStages = (emailToFind) => {
    let updatedStages = vacancyInfo.stages.map((stage) => ({
      ...stage,
      color: "",
      atStage: "",
    }));
    let foundIndex = -1;

    vacancyInfo.stages.forEach((stage, index) => {
      let stageColor = stage.color;

      // Check if the candidate exists in this stage
      const candidate = stage.cards.find((card) => card.email === emailToFind);
      if (candidate) {
        foundIndex = index; // Update the index where the candidate is found
        // Set the color for the current stage and previous stages where the candidate is found to purple
        for (let i = foundIndex; i >= 0; i--) {
          if (updatedStages[i]) {
            updatedStages[i].color = updatedStages[i]?.title;
          }
        }

        // Set the color for the next stages to black
        for (let i = foundIndex + 1; i < updatedStages.length; i++) {
          updatedStages[i].color = "#eeeeee";
        }

        // Set atStage property for the current stage
        updatedStages[index].atStage = stage.title;
      }
    });
    return updatedStages;
  };
  let _stages = sortingStages(candidate?.formData?.email);
  console.log("_stages", _stages);

  const getLastStage = () => {
    let __stages = [];
    _stages.forEach((ele) => {
      if (ele.atStage !== "") __stages.push(ele);
    });
    return __stages[__stages.length - 1]?.atStage;
  };

  console.log("candidate", candidate);
  return (
    <div className="flex flex-col min-h-full ">
      {/* <div className="dark:bg-gray-400"> */}

      {/* <h2 className="mb-1 text-lg font-bold">Candidate Profile View</h2>
      <Divider /> */}
      <DetailHeader
        candidateInfo={candidate}
        _stages={_stages}
        onEmail={onEmail}
        reloadStages={reloadStages}
      />
      <div className="flex items-center gap-2 mt-2 mb-5">
        <EnvelopeIcon width={20} />
        <h3 className="font-semibold text-md whitespace-nowrap">
          {candidate?.formData?.email}
        </h3>
      </div>
      {/* </div> */}

      {candidate?.rejected && (
        <Alert
          type="error"
          message={`This candidate has been marked for rejection. Provided reason: ${
            candidate?.rejectionReason ?? ""
          }`}
        />
      )}

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane key="overview" tab={"Overview"}>
          <div className="flex flex-col gap-5 ">
            {/* <Overview lastCall={lastCall} currentStage={getLastStage()} /> */}

            <OverviewTabs classObj={"gap-5"}>
              <h4 style={{ fontSize: "15px", fontWeight: "400" }}>
                Applied for:
              </h4>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                {vacancyInfo?.name}
              </h2>
              <h4 style={{ fontSize: "15px", fontWeight: "400" }}>Test:</h4>
              <div className="h-[5vh] w-[100%] flex gap-2">
                {_stages.map((_stageData, index) => {
                  console.log(_stageData);
                  return (
                    <StageTabs
                      candidate={candidate}
                      index={index}
                      stageData={_stageData}
                      classObj={{
                        height: "h-[3vh]",
                        width: "w-[120px]",
                        rounded: "rounded-[5px]",
                      }}
                    />
                  );
                })}
              </div>
            </OverviewTabs>
            {/* <div className="h-[20vh] w-[100%] border border-black rounded-lg flex flex-col gap-5 items-start p-2"></div> */}
            <OverviewTabs classObj={"gap-5 justify-center"}>
              <div
                style={{ fontSize: "16px" }}
                className="flex items-center justify-start gap-2"
              >
                <AiOutlineMail /> <span>{candidate?.formData?.email}</span>
              </div>
              <div
                style={{ fontSize: "16px" }}
                className="flex items-center justify-start gap-2"
              >
                <BsTelephone /> <span>{candidate?.formData?.phone}</span>
              </div>
              <div
                style={{ fontSize: "16px" }}
                className="flex items-center justify-start gap-2"
              >
                <BiMapPin /> <span>London,Uk</span>
              </div>
            </OverviewTabs>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Resume" key={"cv"}>
          {CV?.alternativeUrl ? (
            <div>
              <div className="flex justify-end mb-2">
                <FaExternalLinkAlt
                  onClick={() => {
                    window.open(CV?.alternativeUrl);
                  }}
                  size={20}
                  className="cursor-pointer"
                />
              </div>
              {CV?.alternativeUrl && (
                <iframe src={CV?.alternativeUrl} width="100%" height="600px" />
              )}
            </div>
          ) : CV ? (
            <CVTemplate CVData={{ cv: CV, candidate }} />
          ) : (
            <>
              <Alert
                type="info"
                message="Candidate has not submitted the CV"
                className="mb-3"
              />

              <Button
                type="primary"
                className="flex justify-center w-full"
                onClick={() => {
                  if (loading) return;
                  fileInput?.current?.click?.();
                }}
              >
                <div className="p-4 font-bold text-center text-white break-words rounded wrapper">
                  {loading ? (
                    <Spin>
                      <h3>Upload manually</h3>
                    </Spin>
                  ) : (
                    <h3>Upload manually</h3>
                  )}
                </div>
              </Button>
            </>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Notes" key={"notes"}>
          <CandidateNote
            candidateId={candidateId}
            showHeadings={false}
            handleNext={() => {
              // handle move to next candidate
            }}
            handlePrev={() => {
              //  handle move to prev candidate
            }}
          />
        </Tabs.TabPane>
      </Tabs>
      <div className="sticky bottom-0 py-3 mt-auto bg-white ">
        <div className="flex flex-col gap-5">
          <div className="mt-auto bg-hireheroes-gray-200" />
          <div className="flex gap-5">
            <button
              className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300 bg-hireheroes-white px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5"
              onClick={() => {
                console.log("move to prev candidate");
                const prev = getPrevObject(
                  vacancyInfo.stages.filter(
                    (stage) => stage.id === candidate.stageId
                  )[0].cards,
                  candidateId
                );
                console.log(prev);
                setDetailsModal(prev);
              }}
            >
              <ArrowLeftIcon width={20} />
              Previous candidate
            </button>
            <button
              className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300 bg-hireheroes-white px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5"
              onClick={() => {
                setDetailsModal(
                  getNextObject(
                    vacancyInfo.stages.filter(
                      (stage) => stage.id === candidate.stageId
                    )[0].cards,
                    candidateId
                  )
                );
              }}
            >
              Next candidate
              <ArrowRightIcon width={20} />
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={!!rejectCandidate}
        onCancel={() => setRejectCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        // afterOpenChange={(e) => {
        //   if (!e) window.scrollTo(0, lastScroll);
        // }}
      >
        <CandidateRejectBox
          candidateId={candidateId}
          setRejectCandidate={setRejectCandidate}
          onSend={() => {
            setRejectCandidate(null);
            reloadStages({ noLoadingDisplay: true });
          }}
        />
      </Modal>

      <Modal
        open={!!moveCandidate}
        onCancel={() => setMoveCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        // afterOpenChange={(e) => {
        //   if (!e) window.scrollTo(0, lastScroll);
        // }}
      >
        <MoveCandidate
          candidateId={candidateId}
          stages={vacancyInfo.stages}
          currentStage={getLastStage()}
          setMoveCandidate={setMoveCandidate}
          reloadStages={reloadStages}
        />
      </Modal>
      {/* </div> */}
    </div>
  );
};

// const DetailHeader = ({ candidateInfo, _stages }) => {

// };

export default DetailsModal;
