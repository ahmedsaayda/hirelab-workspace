import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ChatBubbleOvalLeftIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Modal,
  Popconfirm,
  Skeleton,
  Switch,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronCircleRight } from "react-icons/fa";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { ImStatsDots } from "react-icons/im";
import { IoMegaphone } from "react-icons/io5";
import { MdDelete, MdEdit, MdFileCopy, MdPreview } from "react-icons/md";
import { PiKanbanFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { brandColor } from "../../../data/constants";
import * as actions from "../../../redux/auth/actions";
import {
  getPartner,
  selectDarkMode,
  selectUser,
} from "../../../redux/auth/selectors";
import ATSService from "../../../services/ATSService";
import CrudService from "../../../services/CrudService";
// import OnboardUser from "../OnboardUser";
const OnboardUser = () => <div>Onboard User Component</div>;
import NoObjects from "./NoObjects";
import { partner } from "../../../constants";

const tiers = [
  {
    name: "Hire Fast",
    id: "fast",
    price: 45,
    description: "Promote for a day",
    days: 1,
    features: ["10-100 candidates", "Live for 1 days", "Fill the vacancy fast"],
  },
  {
    name: "Hire Better",
    id: "better",
    price: 295,
    description: "Promote for a week",
    days: 7,
    features: [
      "100-1000 candidates",
      "Live for 7 days",
      "Find a great fit for the position",
    ],
  },
  {
    name: "Hire Best",
    id: "best",
    price: 595,
    description: "Promote for 2 weeks",
    days: 14,
    features: [
      "600-2000 candidates",
      "Live for 14 days",
      "Find the best fit for the position",
    ],
  },
];

function truncateString(str, num) {
  if (!str) return "";
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

function removeDuplicateObjects(arr) {
  const uniqueObjects = {};
  const result = [];

  for (const obj of arr) {
    const id = obj._id;

    // Check if the _id is not already in the uniqueObjects dictionary
    if (!uniqueObjects[id]) {
      uniqueObjects[id] = true;
      result.push(obj);
    }
  }

  return result;
}

const PAGE_LIMIT = 8;

const MyVacancies = () => {
  let dispatch = useDispatch();
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const heroesss = useSelector((state) => state.heroes);
  const router = useRouter();
  const { query } = router;
  const [vacancies, setVacancies] = useState([]);
  const [singleVacancy, setSingleVacancy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, contextHolder] = Modal.useModal();
  const [promoteFunnel, setPromoteFunnel] = useState(null);
  const [total, setTotal] = useState(0);
  const [activePromotions, setActivePromotions] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    setOnboarding(!user.onboarded);
  }, [user]);

  const loadMoreVacancies = useCallback(
    async (filters = {}, text = "", alternativePage) => {
      if (!user) return;

      setLoading(true);

      try {
        const data = {
          filters: { ...filters, user_id: user._id },
          sort: { createdAt: -1 },
          populate: "hero",
        };
        if (text) data.text = text;
        const response = await CrudService.search(
          "Vacancy",
          PAGE_LIMIT,
          alternativePage ?? page,
          data
        );

        const newVacancies = (
          await ATSService.countApplicants(response.data.items)
        ).data;
        setVacancies((prevVacancies) => [...prevVacancies, ...newVacancies]);

        setPage((prevPage) => prevPage + 1);
        setTotal(response.data.total);
      } catch (e) {
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    },
    [page, user]
  );
  const loadLessVacancies = useCallback(
    async (filters = {}, text = "", alternativePage) => {
      if (!user) return;

      setLoading(true);

      try {
        const data = {
          filters: { ...filters, user_id: user._id },
          sort: { createdAt: -1 },
          populate: "hero",
        };
        if (text) data.text = text;
        const response = await CrudService.search(
          "Vacancy",
          PAGE_LIMIT,
          alternativePage ?? page,
          data
        );

        const newVacancies = (
          await ATSService.countApplicants(response.data.items)
        ).data;
        setVacancies((prevVacancies) => [...prevVacancies, ...newVacancies]);

        setPage((prevPage) => prevPage - 1);
        setTotal(response.data.total);
      } catch (e) {
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    },
    [page, user]
  );

  // useEffect(() => {
  //   ATSService.getActivePromotions().then(({ data }) => {
  //     setActivePromotions(data.activePromotions);
  //   });
  // }, []);

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      const container = document.getElementById("vacancyContainer");

      if (
        container &&
        window.innerHeight + window.scrollY >= container.scrollHeight - 100
      ) {
        loadMoreVacancies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  useEffect(() => {
    const getSingle = async () => {
      const id = query.id;
      const isNew = query.new;
      if (!id) return;

      const searchedVacancy = await CrudService.getSingle("Vacancy", id);
      setSingleVacancy({ ...searchedVacancy.data, isNew: isNew === "true" });
    };
    getSingle();
  }, [query]);

  // Function to handle the input change with debounce
  const searchTimer = useRef();
  const handleInputChange = (event) => {
    event.preventDefault();
    const newValue = event.target.value;
    setSearchTerm(newValue);

    // Delay the execution of the search function by 300 milliseconds (adjust as needed)
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setVacancies([]);

      const query = {};

      loadMoreVacancies(query, newValue, 1);
      setSingleVacancy(null);
    }, 1000);
  };

  useEffect(() => {
    loadMoreVacancies();
  }, [searchTerm]);

  const handleSecondConfirm = async (vacancyId, deleteCandidates) => {
    await ATSService.deleteFunnel(vacancyId, deleteCandidates);
    setSingleVacancy(null);
    setVacancies((c) => c.filter((e) => e._id !== vacancyId));
  };

  const handleFirstConfirm = (vacancyId) => {
    handleSecondConfirm(vacancyId, true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    const formattedDateWithComma =
      formattedDate.slice(0, 6) + ", " + formattedDate.slice(-4);
    return formattedDateWithComma;
  };

  const handleCreateCampaigns = async () => {
    const vacancy = await ATSService.createVacancy({
      vacancyTemplate: {
        name: "",
        description: "",
        image: "",
        keyBenefits: "",
        requiredSkills: "",
        shortCode: "",
        published: false,
      },
    });
    router.push(`/dashboard/vacancyprepublish?id=${vacancy.data.vacancy._id}`);
  };
  let propsNoObject = {
    id: "campaings",
    title: "My Campaigns",
    subtitle: "Create and manage your AI Recruitment Interview Campaigns.",
    buttontext: "+ Create new Campaigns",
    centraltext: "You have no Campaigns yet.",
    create: handleCreateCampaigns,
  };

  // if (true){return (<NoObjects props={propsNoObject}/> )}
  if (!initialLoadDone) return <Skeleton active />;
  if (vacancies.length == 0) {
    return (
      <NoObjects
        props={propsNoObject}
        onboarding={onboarding}
        setOnboarding={setOnboarding}
      />
    );
  }
  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full ">
        <div className="flex items-center mb-3 ">
          <div className="flex flex-col w-full  items-start">
            <h1 className="text-3xl font-semibold mb-1">My Campaigns</h1>
            <p className="font-normal text-base text-[#475467]">
              Create and manage your AI Recruitment Interview Campaigns.
            </p>
          </div>
          <button
            className="bg-gradient text-sm text-white font-semibold  leading-6 whitespace-nowrap p-2 rounded-md"
            onClick={handleCreateCampaigns}
          >
            + Create new Campaigns
          </button>
        </div>

        {/* <div className="container mx-auto p-4" id="vacancyContainer"> */}

        <div className="relative my-3 flex items-center">
          <input
            type="text"
            placeholder="Search for campaigns"
            className="block w-full text-2xlrounded-md border-0 py-2 pr-14  dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900  dark:bg-gray-900"
            value={searchTerm}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-x-4 lg:gap-x-6 gap-y-6 my-vacancies-grid mt-2">
          {removeDuplicateObjects(
            [singleVacancy, ...vacancies].filter((a) => !!a)
          ).map((vacancy) => (
            <div key={vacancy._id} className="bg-white rounded-lg p-2 md:p-4">
              <div className="flex justify-start my-1 items-center">
                <div className="flex flex-shrink gap-2 items-center">
                  <img src={partner.logo} height={30} width={30} />
                  <h3 className="font-semibold text-base ">
                    {partner.brandName}
                  </h3>
                </div>
                <h5 className="border border-solid border-[#ffb93a] text-sm text-[#b54708] bg-[#fffaeb] font-medium rounded-xl mx-5 px-2">
                  {vacancy.shortlistedApplicants} shortlisted
                </h5>
                <div className="flex items-center border border-solid rounded-xl px-2 border-[#b4c3ff] bg-[#0538ff] bg-opacity-5 gap-2">
                  <Avatar size={16} alt="Hero" src={vacancy.hero?.aiImage} />
                  <h5 className="font-medium text-sm bg-gradient bg-clip-text !text-transparent">
                    {vacancy.hero ? vacancy.hero.name : "Hero"}
                  </h5>
                </div>
                <Switch
                  className="flex flex-shrink ml-auto "
                  size="medium"
                  defaultChecked={vacancy.enabled !== false}
                  onChange={async (e) => {
                    await CrudService.update("Vacancy", vacancy._id, {
                      enabled: e,
                    });
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href={`/dashboard/vacancydetails?id=${vacancy._id}`}>
                  <div className="flex my-2 cursor-pointer items-center">
                    <h3 className="font-semibold text-base">{vacancy.name} </h3>
                    {vacancy.training && (
                      <h5 className="border border-solid border-[#FFC300] text-sm bg-[#f7dc6f] text-center font-medium rounded-xl mx-5 px-2">
                        TRAINING
                      </h5>
                    )}
                  </div>
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex py-2 wrap gap-7">
                  <div>
                    <p className="font-semibold text-xs">Date</p>
                    <div className="flex items-center gap-2 pt-1">
                      <CalendarIcon height={16} />
                      <span className="text-medium text-sm">
                        {formatDate(vacancy.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-xs ">Total Applicants</p>
                    <div className="flex items-center gap-2 pt-1 ">
                      <UsersIcon height={16} />
                      <span className="text-medium text-sm">
                        {vacancy.numberApplicants}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-xs">Interviewed</p>
                    <div className="flex items-center gap-2 pt-1">
                      <ChatBubbleOvalLeftIcon height={16} />
                      <span className="text-medium text-sm">
                        {vacancy.interviewedApplicants}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/dashboard/vacancydetails?id=${vacancy._id}`}>
                  <FaChevronCircleRight className="text-[#5067e8] h-10 w-10" />
                </Link>
              </div>
              <div className="flex gap-3 my-1 text-xs font-medium">
                <Link
                  className="border border-solid rounded-lg p-2 flex flex-1 w-full justify-center"
                  href={`/dashboard/vacancyedit?id=${vacancy._id}`}
                >
                  <div className="flex items-center gap-3">
                    <PencilIcon height={16} />
                    Edit
                  </div>
                </Link>
                <button className="border border-solid rounded-lg p-2 flex flex-1 w-full justify-center">
                  <Popconfirm
                    title="Are you sure to duplicate this funnel?"
                    onConfirm={async () => {
                      const vac = await ATSService.duplicateVacancy({
                        vacancyId: vacancy._id,
                      });
                      router.push(
                        `/dashboard/vacancydetails?id=${vac.data.vacancy._id}`
                      );
                    }}
                    className="flex items-center gap-3"
                  >
                    <DocumentDuplicateIcon height={16} />
                    Duplicate
                  </Popconfirm>
                </button>
                <button className="border border-solid rounded-lg p-2 flex flex-1 w-full justify-center">
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => handleFirstConfirm(vacancy._id)}
                    className="flex items-center gap-3"
                  >
                    <TrashIcon height={16} />
                    Delete
                  </Popconfirm>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex align-center justify-center w-full gap-4">
          <div className="flex justify-end mt-2 w-full ">
            {page > 2 && (
              <Button
                loading={loading}
                onClick={() => loadLessVacancies({}, "", page - 2)}
                className="w-[25%]"
              >
                Previous Page
              </Button>
            )}
          </div>

          <div className="flex justify-start mt-2 w-full">
            {total > PAGE_LIMIT * (page - 1) && (
              <Button
                loading={loading}
                onClick={() => loadMoreVacancies()}
                className="w-[25%]"
              >
                Next Page
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!promoteFunnel}
        onCancel={() => setPromoteFunnel(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <div>
          <div className="mx-auto max-w-7xl px-6 ">
            <div className="mt-20 flow-root">
              <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto  ">
                {tiers.map((tier) => (
                  <div key={tier.id} className="  pt-16  lg:pt-0 xl:px-14">
                    <h3
                      id={tier.id}
                      className="text-base font-semibold leading-7 "
                    >
                      {tier.name}
                    </h3>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span className="text-5xl font-bold tracking-tight ">
                        ${tier.price}
                      </span>
                    </p>

                    <Popconfirm
                      title={`Are you sure to promote? You will be charged $${tier.price}.`}
                      onConfirm={async () => {
                        try {
                          await ATSService.promoteFunnel(promoteFunnel, {
                            tier: tier.id,
                          });
                          ATSService.getActivePromotions().then(({ data }) => {
                            setActivePromotions(data.activePromotions);
                          });
                          setPromoteFunnel(null);
                        } catch (e) {
                          const link = e?.response?.data?.link;
                          if (link)
                            setTimeout(() => {
                              window.location.href = link;
                            }, 2000);
                        }
                      }}
                    >
                      <a
                        aria-describedby={tier.id}
                        className=" mt-10 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Promote now
                      </a>
                    </Popconfirm>
                    <p className="min-w-[100px] mt-10 text-sm font-semibold leading-6 ">
                      {tier.description}
                    </p>
                    <ul
                      role="list"
                      className="mt-6 space-y-3 text-sm leading-6"
                    >
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckCircleIcon
                            className="h-6 w-5 flex-none text-indigo-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal> */}
      {/* </div> */}

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

export default MyVacancies;
