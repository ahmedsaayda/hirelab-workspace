import {
  Badge,
  Button,
  message,
  Modal,
  Popconfirm,
  Skeleton,
  Switch,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { MdDelete, MdEdit, MdFileCopy } from "react-icons/md";
import { PiKanbanFill, PiTestTubeFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { brandColor } from "../../../data/constants";
import {
  getPartner,
  selectDarkMode,
  selectUser,
} from "../../../redux/auth/selectors";
import ATSService from "../../../service/ATSService";
import CrudService from "../../../service/CrudService";
import InterviewBookCall from "../../InterviewBookCall";
import OnboardUser from "../OnboardUser";
import MyHeroesTable from "./MyHeroes_Table";
import NoObjects from "./NoObjects";

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

const PAGE_LIMIT = 9;

const MyHeroes = () => {
  const user = useSelector(selectUser);
  const partner = useSelector(getPartner);
  let [searchParams] = useSearchParams();
  const router = useRouter();;
  const [vacancies, setVacancies] = useState([]);
  const [singleVacancy, setSingleVacancy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testHero, setTestHero] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const darkMode = useSelector(selectDarkMode);
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
        };
        if (text) data.text = text;
        const response = await CrudService.search(
          "Hero",
          PAGE_LIMIT,
          alternativePage ?? page,
          data
        );
        setVacancies(response.data.items);
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
        };
        if (text) data.text = text;
        const response = await CrudService.search(
          "Hero",
          PAGE_LIMIT,
          alternativePage ?? page,
          data
        );
        setVacancies(response.data.items);
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
      const id = searchParams.get("id");
      const isNew = searchParams.get("new");
      if (!id) return;

      const searchedVacancy = await CrudService.getSingle("Hero", id);
      setSingleVacancy({ ...searchedVacancy.data, isNew: isNew === "true" });
    };
    getSingle();
  }, [searchParams]);

  // Function to handle the input change with debounce
  const searchTimer = useRef();
  const handleInputChange = (event) => {
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
    console.log(vacancies);
  }, []);

  const handleSecondConfirm = async (vacancyId) => {
    await CrudService.delete("Hero", vacancyId);
    setSingleVacancy(null);
    setVacancies((c) => c.filter((e) => e._id !== vacancyId));
  };

  const handleCreateHero = async () => {
    const hero = await CrudService.create("Hero", {
      user_id: user._id,
    });
    if (hero?.data?.result?._id)
      router.push(`/dashboard/heroedit?id=${hero?.data?.result?._id}`);
  };

  let propsNoObject = {
    id: "heroes",
    title: "My Heroes",
    subtitle: "Create and manage your autonomous AI Recruitment Assistant.",
    buttontext: "+ Create new HireHero",
    centraltext: "You have no HireHeroes yet.",
    create: handleCreateHero,
  };

  //if (true){return (<NoObjects props={propsNoObject}/> )}
  if (!initialLoadDone) return <Skeleton active />;
  if (vacancies.length == 0) {
    return <NoObjects props={propsNoObject} />;
  }
  return (
    <>
      <div className="flex flex-col w-full ">
        <div className="flex items-center mb-3">
          <div className="flex flex-col w-full  items-start">
            <h1 className="text-3xl font-semibold mb-1">My Heroes</h1>
            <p className="font-normal text-base text-[#475467]">
              Create and manage your autonomous AI Recruitment Assistant.
            </p>
          </div>
          <button
            className="bg-gradient text-sm  text-white font-semibold  leading-6 whitespace-nowrap p-2 rounded-md"
            onClick={handleCreateHero}
          >
            + Create new HireHero
          </button>
        </div>

        <div className="py-3 h-full">
          <MyHeroesTable
            data={removeDuplicateObjects(
              [singleVacancy, ...vacancies].filter((a) => !!a)
            )}
            handleSecondConfirm={handleSecondConfirm}
          />
        </div>

        {/* 

                    <Popconfirm
                      title="Are you sure to duplicate this hero?"
                      onConfirm={async () => {
                        const dupe = { ...vacancy };
                        delete dupe._id;
                        const vac = await CrudService.create("Hero", {
                          ...dupe,
                        });
                        router.push(
                          `/dashboard/heroedit?id=${vac.data.result._id}`
                        );
                      }}
                    >
                      <HiMiniDocumentDuplicate
                        title="Duplicate Hero"
                        className="cursor-pointer text-indigo-500"
                      />
                    </Popconfirm>

                    <PiTestTubeFill
                      className="cursor-pointer text-indigo-500"
                      title="Test"
                      onClick={() => {
                        setTestHero(vacancy);
                      }}
                    />

       */}
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
        open={!!testHero}
        onCancel={() => setTestHero(null)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        title={`Test ${testHero?.name}`}
      >
        <InterviewBookCall testHero={testHero} />
      </Modal>  */}

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

export default MyHeroes;
