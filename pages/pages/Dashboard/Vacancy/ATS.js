import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "../../../../src/components/Board";

import { UserAddOutlined, WechatWorkOutlined } from "@ant-design/icons";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import {
  Alert,
  Button,
  Drawer,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tabs,
  Typography,
  message,
} from "antd";
import moment from "moment";
import { AiOutlineMail } from "react-icons/ai";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { BsChat } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { ImStatsDots } from "react-icons/im";
import { IoMdRefresh } from "react-icons/io";
import { IoLibrarySharp } from "react-icons/io5";
import { LuWorkflow } from "react-icons/lu";
import {
  MdCleaningServices,
  MdDelete,
  MdEdit,
  MdEmail,
  MdPreview,
} from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";
import {
  handleXLSXTOJSON,
  when,
} from "../../../../src/components/Board/services/utils";
import { setPhoneCandidate } from "../../../../src/redux/auth/actions";
import {
  getPhoneCandidate,
  selectDarkMode,
  selectLoading,
  selectUser,
} from "../../../../src/redux/auth/selectors";
import { store } from "../../../../src/redux/store";
import ATSService from "../../../../src/services/ATSService";
import CrudService from "../../../../src/services/CrudService";
import ForwardResume from "../ForwardResume";
import CandidateMeetingBox from "../Message/CandidateMeetingBox";
import CandidateRejectBox from "../Message/CandidateRejectBox";
import MeetingConfirmationBox from "../Message/MeetingConfirmationBox";
import VariableMessageBox from "../Message/VariableMessageBox";
import VariableSMSBox from "../Message/VariableSMSBox";
import CandidateNote from "./CandidateNote";
import DelayedAutomations from "./DelayedAutomations";
import DetailsModal from "./DetailsModal";
import FunnelTemplateLibrary from "./FunnelTemplateLibrary";
import ImportModule from "./ImportModule";
import WorkflowConfigurator from "./WorkflowConfigurator";
import ATSTable from "./ATSTable/index.jsx";

export const mappedVacancySubmission = [
  { value: "fullname", label: "Fullname" },
  { value: "firstname", label: "Firstname" },
  { value: "lastname", label: "Lastname" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "linkedInUrl", label: "LinkedIn URL" },
  { value: "cvUrl", label: "CV URL" },
];
function isBoolean(value) {
  return value === "true" || value === "false";
}

function not(fn) {
  return function (value) {
    return !fn(value);
  };
}

function getUrlParams() {
  const url = new URL(window.location.href);
  var params = {};

  for (const p of url.searchParams.entries()) {
    const value = p[1];

    when(
      value,
      isBoolean
    )((value) => {
      params[p[0]] = Boolean(value);
    });
    when(
      value,
      not(isBoolean)
    )((value) => {
      params[p[0]] = value;
    });
  }

  return params;
}

const LOAD_PER_PAGE = 25;

const ATS = ({ VacancyId, vacancyInfo }) => {
  const [boardColumns, setBoardColumns] = useState([]);
  console.log("boardColumns", boardColumns);
  const [messageCandidate, setMessageCandidate] = useState(null);
  const [smsCandidate, setSMSCandidate] = useState(null);
  const [rejectCandidate, setRejectCandidate] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  console.log("detailsModal", detailsModal);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [meetingConfirmBox, setMeetingConfirmBox] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [accountConfig, setAccountConfig] = useState(null);
  const [bulkUploadProcess, setBulkUploadProcess] = useState({});
  const [reloadingStages, setReloadingStages] = useState(true);
  const [templateLibrary, setTemplateLibrary] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [noteModal, setNoteModal] = useState(null);
  const [forwardResume, setForwardResume] = useState(null);
  const [delayedAutomationModal, setDelayedAutomationModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const [modal, contextHolder] = Modal.useModal();
  const router = useRouter();;
  const phoneCandidate = useSelector(getPhoneCandidate);
  const darkMode = useSelector(selectDarkMode);
  const backendLoading = useSelector(selectLoading);
  const [pages, setPages] = useState({});
  const [viewMode, setViewMode] = useState("table"); //kanban , // New state for view mode
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  console.log(pages);

  const fetchCandidates = useCallback(async () => {
    const mainFilter = {};
    console.log("mainFilter", mainFilter);
    if (VacancyId) mainFilter.LandingPageDataId = VacancyId;
    const filters = { ...mainFilter };
    if (accountConfig?.hideRejected)
      filters.$and = [
        { ...mainFilter },
        { $or: [{ rejected: false }, { rejected: { $exists: false } }] },
      ];

    CrudService.search("VacancySubmission", 10000, page, {
      filters,
      sort: { sort: 1, createdAt: -1 },
      populate: "stageId LandingPageDataId",
    }).then(({ data }) => {
      console.log("data", data);
      if (data.items.length > 0) {
        setCandidates(data.items);
      }
    });
  }, [pages, accountConfig, VacancyId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const loadMore = useCallback(
    async (id) => {
      if (!pages?.[id]) return;

      const mainFilter = {
        stageId: id === "UNCATEGORIZED" ? { $exists: false } : id,
      };
      console.log("mainFilter", mainFilter);
      if (VacancyId) mainFilter.LandingPageDataId = VacancyId;
      const filters = { ...mainFilter };
      if (accountConfig?.hideRejected)
        filters.$and = [
          { ...mainFilter },
          { $or: [{ rejected: false }, { rejected: { $exists: false } }] },
        ];

      CrudService.search("VacancySubmission", LOAD_PER_PAGE, pages[id] + 1, {
        filters,
        sort: { sort: 1, createdAt: -1 },
      }).then(({ data }) => {
        console.log("data", data);
        if (data.items.length > 0) {
          setBoardColumns((c) => {
            const current = [...c];
            const idx = current.findIndex((e) => e.id === id);

            if (idx === -1) return current;

            return [
              ...current.slice(0, idx),
              {
                id: id,
                title: current[idx].title,
                candidateCount: data.total,
                cards: [
                  ...current[idx].cards,
                  ...data.items.map((d) => ({
                    id: d._id,
                    fullname: `${d.formData?.firstname ?? ""} ${
                      d.formData?.lastname ?? ""
                    }`,
                    linkedInUrl: d.formData?.linkedInUrl,
                    email: d.formData?.email ?? "",
                    phone: d.formData?.phone ?? "",
                    rejected: d.rejected,
                    stars: d.stars,
                    createdAt: d.createdAt,
                    scheduledAt: d?.interviewMeetingTimestamp,
                  })),
                ],
                canLoadMore: data.total > data.page * data.limit,
              },
              ...current.slice(idx + 1),
            ];
          });

          setCandidates(data.items);
        }
      });

      setPages((pages) => {
        const current = { ...pages };
        current[id] = pages[id] + 1;

        return current;
      });
    },
    [pages, accountConfig, VacancyId]
  );

  const user = useSelector(selectUser);
  useEffect(() => {
    if (!accountConfig?._id) return;
    if (!user) return;
    if (user?.accessLevel === "read") return;

    CrudService.update("AccountConfiguration", accountConfig._id, {
      hideRejected: accountConfig.hideRejected,
    }).then(() => {
      reloadStages({ noLoadingDisplay: true });
    });
  }, [accountConfig, user]);

  useEffect(() => {
    CrudService.search("AccountConfiguration", 1, 1, {}).then(({ data }) => {
      const config = data.items?.[0];
      if (!config) return;

      setAccountConfig({ ...config });
    });
  }, []);

  const reloadStages = useCallback(
    async ({ noLoadingDisplay, text = "" } = { noLoadingDisplay: false }) => {
      if (!noLoadingDisplay) setReloadingStages(true);

      await ATSService.reloadStages({
        limit: LOAD_PER_PAGE,
        page: 1,
        sort: { sort: 1, createdAt: -1 },
        VacancyId,
        text,
      })
        .then(({ data }) => {
          console.log("data", data);
          setBoardColumns(data.boardColumns.filter((a) => !!a));
          setPages((pages) => {
            const current = { ...pages };
            current["UNCATEGORIZED"] = 1;
            for (const column of data.boardColumns.filter((a) => !!a)) {
              current[column.id] = 1;
            }

            return current;
          });
        })
        .finally(() => {
          if (!noLoadingDisplay) setReloadingStages(false);
        });
    },
    [VacancyId]
  );
  useEffect(() => {
    reloadStages();
  }, [reloadStages]);

  const reloadStagesNoLoading = useCallback(() => {
    reloadStages({ noLoadingDisplay: true });
  }, [reloadStages]);

  useEffect(() => {
    document.addEventListener("REFRESH.ATS", reloadStagesNoLoading);
    return () =>
      document.removeEventListener("REFRESH.ATS", reloadStagesNoLoading);
  }, [reloadStagesNoLoading]);

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

  const performSearch = useCallback((text) => {
    reloadStages({
      text: text ? text : undefined,
      noLoadingDisplay: true,
    });
  }, []);

  // Function to handle the input change with debounce
  const searchTimer = useRef();
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);

    // Delay the execution of the search function by 300 milliseconds (adjust as needed)
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 1000);
  };
  const searchingOne = (email, _stages) => {
    let cardObj = [];
    _stages?.forEach((ele) => {
      cardObj.push(...ele.cards);
    });
    const _found = cardObj.find((e) => e.email == email);
    if (_found) {
      return true;
    } else {
      return false;
    }
  };
  const HideIcon = accountConfig?.hideRejected ? BiSolidHide : BiSolidShow;

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "LinkedIn URL",
      dataIndex: "linkedInUrl",
      key: "linkedInUrl",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
  ];

  const dataSource = boardColumns.flatMap((column) =>
    column.cards.map((card) => ({
      key: card.id,
      fullname: card.fullname,
      email: card.email,
      phone: card.phone,
      linkedInUrl: card.linkedInUrl,
      createdAt: card.createdAt,
    }))
  );

  if (reloadingStages) return <Skeleton active />;
  console.log("boardColumns", boardColumns);
  return (
    <div className="w-full ">
      <div className="flex flex-col justify-start gap-3   h-5/6 min-h-[90vh] w-full">
        <div className="flex justify-between gap-4 my-2 w-[100%]">
          <input
            type="text"
            placeholder="Search Candidates"
            className="w-full mr-4 rounded-md border-0 py-1.5 pr-14 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
            value={searchTerm}
            onChange={handleInputChange}
          />

          <Space className="">
            {/* <IoLibrarySharp
            size={22}
            className="cursor-pointer"
            title="Template Library"
            onClick={async () => {
              setLastScroll(window.scrollY);
              setTemplateLibrary(true);
            }}
          /> */}
            {/* <MdPreview
            size={22}
            className="cursor-pointer"
            title="Preview Landing Page"
            onClick={async () => {
              window.open(`/funnel?id=${VacancyId}`);
            }}
          /> */}
            <MdEdit
              size={22}
              className="cursor-pointer"
              title="Edit Campaign"
              onClick={async () => {
                router.push(`/dashboard/vacancyedit?id=${VacancyId}`);
              }}
            />
            {/* <ImStatsDots
            size={22}
            className="cursor-pointer"
            title="Statistics"
            onClick={async () => {
              router.push(
                `/dashboard/vacancystats?id=${VacancyId}&back=${
                  window.location.pathname + window.location.search
                }`
              );
            }}
          /> */}

            <LuWorkflow
              size={25}
              title="ATS Workflows"
              className="cursor-pointer"
              onClick={() => {
                setLastScroll(window.scrollY);
                setWorkflow("general");
              }}
            />

            {/* <HideIcon
                size={25}
                title="Hide Rejected"
                className="cursor-pointer"
                onClick={() => {
                  setAccountConfig((c) => ({
                    ...c,
                    hideRejected: !c.hideRejected,
                  }));
                }}
              /> */}

            <Popconfirm
              title="This will unrecoverably delete all candidates that are marked as rejected in this funnel"
              onConfirm={async () => {
                await ATSService.cleanupRejected(VacancyId);
                await reloadStages({ noLoadingDisplay: true });
              }}
            >
              <MdCleaningServices
                size={25}
                title="Cleanup Rejected"
                className="cursor-pointer"
              />
            </Popconfirm>

            <IoMdRefresh
              size={25}
              title="Refresh"
              className="cursor-pointer"
              onClick={() => reloadStages()}
            />
            <Button
              onClick={() =>
                setViewMode(viewMode === "kanban" ? "table" : "kanban")
              }
            >
              Toggle View
            </Button>
          </Space>
        </div>
        {contextHolder}
        {viewMode === "kanban" ? (
          <div className="relative flex flex-grow w-full h-full z-60">
            <div className=" bottom-0 overflow-x-auto w-[100%]  flex-grow ">
              <Board
                onCardOptionClick={(id, option, data) => {
                  if (option === "email") {
                    setLastScroll(window.scrollY);
                    setMessageCandidate(id);
                  }
                  if (option === "sms") {
                    setLastScroll(window.scrollY);
                    setSMSCandidate(id);
                  }
                  if (option === "phone") {
                    if (phoneCandidate)
                      return message.info("Please close the active tab");
                    setLastScroll(window.scrollY);
                    store.dispatch(setPhoneCandidate(id));
                  }
                  if (option === "reject") {
                    setLastScroll(window.scrollY);
                    setRejectCandidate(id);
                  }
                  if (option === "schedule") {
                    setLastScroll(window.scrollY);
                    setScheduleCandidate(id);
                  }
                  if (option === "delete-column") {
                    if (user?.accessLevel === "read")
                      return message.error("Your access is read-only");

                    if (id === "UNCATEGORIZED")
                      return message.info(
                        "This column cannot be removed. You need to categorize or delete all of the candidates."
                      );
                    modal.confirm({
                      title: "Confirm Deletion",
                      content:
                        "You are about to delete a stage (column). All of the corresponding applicants will be safely moved to the uncategorized column.",
                      okText: "DELETE",
                      cancelButtonProps: { style: { display: "none" } },
                      closable: true,
                      onOk: async () => {
                        await ATSService.deleteStage(id);
                        setBoardColumns((cur) => {
                          const current = [...cur].filter((a) => a.id !== id);
                          return current;
                        });
                        await reloadStages({ noLoadingDisplay: true });
                      },
                    });
                  }
                  if (option === "undo-reject") {
                    ATSService.undoRejectCandidate({ candidateId: id });
                    setBoardColumns((c) => {
                      const current = [...c];

                      const column = current.find((c) =>
                        c.cards.some((card) => card.id === id)
                      );
                      const card = column.cards.find((card) => card.id === id);
                      card.rejected = false;

                      return current;
                    });
                  }
                  if (option === "stars-pick") {
                    if (user?.accessLevel === "read")
                      return message.error("Your access is read-only");

                    setBoardColumns((c) => {
                      const current = [...c];

                      const column = current.find((c) =>
                        c.cards.some((card) => card.id === id)
                      );
                      const card = column.cards.find((card) => card.id === id);
                      card.stars = data.e;

                      return current;
                    });
                    CrudService.update("VacancySubmission", id, {
                      stars: data.e,
                    });
                  }
                  if (option === "open-note") {
                    setLastScroll(window.scrollY);
                    setNoteModal(id);
                  }
                  if (option === "forward-resume") {
                    setLastScroll(window.scrollY);
                    setForwardResume(id);
                  }
                  if (option === "details-modal") {
                    setLastScroll(window.scrollY);
                    setDetailsModal(id);
                  }

                  if (option === "import") {
                    if (user?.accessLevel === "read")
                      return message.error("Your access is read-only");

                    console.log(VacancyId, id);
                    setLastScroll(window.scrollY);

                    fileInputRef.current.value = "";
                    setBulkUploadProcess({
                      stageId: id,
                    });
                    fileInputRef.current.click();
                  }

                  if (option === "export") {
                    const card = boardColumns.find((e) => e.id === id);
                    const candidates = boardColumns.find(
                      (e) => e.id === id
                    )?.cards;
                    if (!candidates) return;

                    const workbook = XLSX.utils.book_new();
                    const worksheet = XLSX.utils.json_to_sheet(
                      candidates.map((e) => {
                        delete e?.id;
                        delete e?.rejected;

                        return e;
                      })
                    );

                    XLSX.utils.book_append_sheet(
                      workbook,
                      worksheet,
                      "Sheet 1"
                    );
                    XLSX.writeFile(
                      workbook,
                      `Candidates ${card.title} ${moment().format(
                        "DD-MM-YYYY HH:mm"
                      )}.xlsx`
                    );
                  }

                  if (option === "delayed-automation") {
                    setDelayedAutomationModal(id);
                  }

                  if (option === "workflow") {
                    setLastScroll(window.scrollY);
                    setWorkflow({
                      stageId: id,
                    });
                  }
                  if (option === "add-candidate") {
                    setLastScroll(window.scrollY);
                    setAddModal({
                      stageId: id,
                    });
                  }
                }}
                {...getUrlParams()}
                handleCardMove={async (source, destination, subject) => {
                  if (user?.accessLevel === "read")
                    return message.error("Your access is read-only");

                  if (!!subject?.cards) {
                    if (subject.id === "UNCATEGORIZED")
                      return message.info("This column cannot be moved");
                    const currentColumns = [...boardColumns];

                    const sortedColumns = [
                      ...currentColumns
                        .filter((c) => c.id !== subject.id)
                        .map((c, i) => ({ ...c, sort: i + 1 })),
                      { ...subject, sort: destination.toPosition },
                    ].sort((a, b) => a.sort - b.sort);

                    setBoardColumns(sortedColumns);
                    await CrudService.update("VacancyStage", null, {
                      bulkItems: sortedColumns
                        .filter((c) => c.id !== "UNCATEGORIZED")
                        .map((col, i) => ({
                          _id: col.id,
                          sort: i,
                        })),
                    });
                    await reloadStages({ noLoadingDisplay: true });
                  } else {
                    console.log(source, destination, subject);
                    if (!subject) return;
                    if (destination.toColumnId === "UNCATEGORIZED")
                      return message.info(
                        "Cannot move candidate into uncategorized"
                      );
                    if (destination.toColumnId === "new")
                      return message.error(
                        "Not so quick! Try again in a few seconds."
                      );

                    setBoardColumns((c) => {
                      const current = [...c];

                      const sourceCol = current.find(
                        (c) => c.id === source.fromColumnId
                      );
                      if (sourceCol?.cards)
                        sourceCol.cards = sourceCol.cards.filter(
                          (c) => c.id !== subject.id
                        );

                      const destinationCol = current.find(
                        (c) => c.id === destination.toColumnId
                      );
                      destinationCol.cards = [
                        ...destinationCol.cards.map((c, i) => ({
                          ...c,
                          sort: i + 1,
                        })),
                        { ...subject, sort: destination.toPosition },
                      ].sort((a, b) => a.sort - b.sort);

                      ATSService.moveCandidate({
                        targetStage: destination.toColumnId,
                        candidateId: subject.id,
                        destinationCol: destinationCol.cards.map((c) => c.id),
                      }).then(() => {
                        reloadStages({ noLoadingDisplay: true });
                      });

                      return current;
                    });
                  }
                }}
                loadMore={loadMore}
                VacancyId={VacancyId}
                allowAddColumn
                onNewColumnConfirm={async (e) => {
                  if (user?.accessLevel === "read")
                    return message.error("Your access is read-only");

                  setBoardColumns((cur) => {
                    const current = [...cur];
                    current.push({
                      id: "new",
                      title: e.title,
                      cards: [],
                      canLoadMore: false,
                      sort: 100,
                    });
                    return current;
                  });

                  await CrudService.create("VacancyStage", {
                    name: e.title,
                    sort: 100,
                    vacancyId: VacancyId,
                  });
                  await reloadStages({ noLoadingDisplay: true });
                }}
                onColumnRename={async (id, e) => {
                  if (user?.accessLevel === "read")
                    return message.error("Your access is read-only");

                  setBoardColumns((cur) => {
                    const current = [...cur];
                    const changed = current.find((c) => c.id === id);
                    if (changed) changed.title = e;
                    return current;
                  });
                  await CrudService.update("VacancyStage", id, { name: e });
                  await reloadStages({ noLoadingDisplay: true });
                }}
              >
                {{
                  columns: boardColumns,
                }}
              </Board>
            </div>
          </div>
        ) : (
          <ATSTable
            stages={boardColumns.map((stage) => stage.title)}
            vacancyInfo={{ ...vacancyInfo, stages: boardColumns }}
            candidates={candidates}
            reloadStages={fetchCandidates}
            boardColumns={boardColumns}
            onCardOptionClick={async (id, type) => {
              if (type === "details-modal") {
                setLastScroll(window.scrollY);
                setDetailsModal(id);
              }
              if (type === "email") {
                setLastScroll(window.scrollY);
                setMessageCandidate(id);
              }

              if (type === "sms") {
                setLastScroll(window.scrollY);
                setSMSCandidate(id);
              }

              if (type === "phone") {
                setLastScroll(window.scrollY);
                setPhoneCandidate(id);
              }
              //delete-modal
              if (type === "delete-modal") {
              }

              //schedule

              if (type === "schedule") {
                setLastScroll(window.scrollY);
                setScheduleCandidate(id);
              }
            }}
          />
        )}
      </div>
      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!messageCandidate}
        onCancel={() => setMessageCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <VariableMessageBox
          candidateId={messageCandidate}
          setMessageCandidate={setMessageCandidate}
          onSend={() => {
            setMessageCandidate(null);
            reloadStages({ noLoadingDisplay: true });
          }}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!smsCandidate}
        onCancel={() => setSMSCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <VariableSMSBox
          candidateId={smsCandidate}
          onSend={() => {
            setSMSCandidate(null);
            reloadStages({ noLoadingDisplay: true });
          }}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!rejectCandidate}
        onCancel={() => setRejectCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <CandidateRejectBox
          candidateId={rejectCandidate}
          setRejectCandidate={setRejectCandidate}
          onSend={() => {
            setRejectCandidate(null);
            reloadStages({ noLoadingDisplay: true });
            setBoardColumns((c) => {
              const current = [...c];

              const column = current.find((c) =>
                c.cards.some((card) => card.id === rejectCandidate)
              );
              const card = column.cards.find(
                (card) => card.id === rejectCandidate
              );
              card.rejected = true;

              if (accountConfig?.hideRejected)
                column.cards = column.cards.filter((c) => c.rejected === false);

              return current;
            });
          }}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!scheduleCandidate}
        onCancel={() => setScheduleCandidate(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <CandidateMeetingBox
          candidateId={scheduleCandidate}
          onSend={() => {
            setScheduleCandidate(null);
            reloadStages({ noLoadingDisplay: true });
          }}
          close={() => setScheduleCandidate(null)}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!meetingConfirmBox}
        onCancel={() => setMeetingConfirmBox(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <MeetingConfirmationBox
          VacancyId={VacancyId}
          onSend={() => {
            setMeetingConfirmBox(null);
          }}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!bulkUploadProcess?.json?.[0]}
        onCancel={() => setBulkUploadProcess({})}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <ImportModule
          bulkUploadProcess={bulkUploadProcess}
          setBulkUploadProcess={setBulkUploadProcess}
          VacancyId={VacancyId}
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

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!workflow}
        onCancel={() => setWorkflow(null)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <WorkflowConfigurator workflow={workflow} VacancyId={VacancyId} />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!addModal}
        onCancel={() => setAddModal(null)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!addModal?.stageId) return setAddModal(null);
            const firstname = e.target[0].value;
            const lastname = e.target[1].value;
            const email = e.target[2].value;
            const phone = e.target[3].value;
            const linkedInUrl = e.target[4].value;
            const cvUrl = e.target[5].value;
            if (searchingOne(email, boardColumns)) {
              message.info("This candidate already available");
              setAddModal(null);
              return;
            }
            const formData = {
              firstname,
              lastname,
              email,
              phone,
              linkedInUrl,
            };
            const result = await CrudService.create("VacancySubmission", {
              bulkItems: [
                {
                  VacancyId,
                  stageId: addModal?.stageId,
                  searchIndex: JSON.stringify(formData),
                  formData,
                },
              ],
            });

            if (result.data?.result) {
              await ATSService.importCandidates({
                candidateIds: result.data.result.map((a) => a._id),
              });

              if (cvUrl)
                await Promise.all(
                  result.data.result.map(async (a) => {
                    await ATSService.submitCV(a._id, cvUrl);
                  })
                );
            }

            await reloadStages({ noLoadingDisplay: true });
            setAddModal(null);
          }}
        >
          <div className="mt-5 mb-2">
            <label className="custom-label-title">Add Candidate</label>
            <Input
              type="text"
              className="w-full mt-2 dark:bg-gray-900"
              placeholder="Firstname"
            />
            <Input
              type="text"
              className="w-full mt-2 dark:bg-gray-900"
              placeholder="Lastname"
            />
            <Input
              type="email"
              className="w-full mt-2 dark:bg-gray-900"
              placeholder="Email"
            />
            <PhoneInput
              inputStyle={{ width: "100%", height: "40px" }}
              placeholder={"Phone"}
              defaultCountry="US"
              className="w-full mt-2 hover:border-red"
              inputClass="dark:!bg-gray-900"
              dropdownClass="dark:!text-black"
              buttonClass="dark:!bg-gray-900"
            />
            <Input
              type="linkedInUrl"
              className="w-full mt-2 dark:bg-gray-900"
              placeholder="LinkedIn URL (optional)"
            />
            <Input
              type="linkedInUrl"
              className="w-full mt-2 dark:bg-gray-900"
              placeholder="CV URL (optional)"
            />
          </div>
          <div className="grid grid-cols-2 mt-4 gap-x-2">
            <Button onClick={() => setAddModal(null)}>Cancel</Button>
            <Button type="primary" loading={backendLoading} htmlType="submit">
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!noteModal}
        onCancel={() => setTimeout(() => setNoteModal(null), 750)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <CandidateNote candidateId={noteModal} showHeadings={true} />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!forwardResume}
        onCancel={() => setTimeout(() => setForwardResume(null), 750)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <ForwardResume
          candidateId={forwardResume}
          onSend={() => setForwardResume(null)}
        />
      </Modal>

      {/* <Modal
        wrapClassName={darkMode ? "dark" : ""}
        width={"90vh"}
        onCancel={() => {
          window.scrollTo(0, lastScroll);
          setTimeout(() => setDetailsModal(null), 750);
        }}
        open={!!detailsModal}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <DetailsModal candidateId={detailsModal} />
      </Modal> */}

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!templateLibrary}
        onCancel={() => setTemplateLibrary(false)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <FunnelTemplateLibrary
          candidateId={noteModal}
          vacancyId={VacancyId}
          onFinish={async () => {
            await reloadStages({ noLoadingDisplay: true });
            setTemplateLibrary(false);
          }}
        />
      </Modal>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!delayedAutomationModal}
        onCancel={() => setDelayedAutomationModal(false)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
        <DelayedAutomations
          stageId={delayedAutomationModal}
          setDelayedAutomationModal={setDelayedAutomationModal}
        />
      </Modal>

      {/* Drawer sections start*/}
      <Drawer
        open={!!detailsModal}
        onClose={() => setDetailsModal(false)}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
        width={800}
        title="Candidate Profile View"
        style={{ paddingBottom: 0, height: "full" }}
      >
        <DetailsModal
          onEmail={(id) => setMessageCandidate(id)}
          candidateId={detailsModal}
          setDetailsModal={setDetailsModal}
          vacancyInfo={{ ...vacancyInfo, stages: boardColumns }}
          reloadStages={reloadStages}
        />
      </Drawer>

      {/* drawer sections end */}
    </div>
  );
};

export default ATS;
