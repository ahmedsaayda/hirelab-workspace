import { Divider } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectLoading } from "../../../../src/redux/auth/selectors";
import ATSService from "../../../../src/services/ATSService";
import CrudService from "../../../../src/services/CrudService";
import { Button } from "../../Landing/Button";

const PAGINATION_LIMIT = 9;

const CreateVacancy = () => {
  const router = useRouter();;
  const [vacancyTemplates, setVacancyTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageLoading = useSelector(selectLoading);

  const loadMoreVacancies = useCallback(
    async (filters = {}, text = "", alternativePage) => {
      setLoading(true);
      try {
        const data = {
          filters: { ...filters },
        };
        if (text) data.text = text;
        const response = await CrudService.search(
          "VacancyTemplate",
          PAGINATION_LIMIT,
          alternativePage ?? page,
          data
        );

        console.log(response);
        const newVacancies = response.data.items;
        setTotal(response.data.total);
        setVacancyTemplates((prevVacancies) => [
          ...prevVacancies,
          ...newVacancies,
        ]);
        setPage((prevPage) => prevPage + 1);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    if (loading) return;
    const handleScroll = () => {
      const container = document.getElementById("vacancyTemplateContainer");

      if (
        container &&
        window.innerHeight + window.scrollY >= container.scrollHeight - 100
      ) {
        loadMoreVacancies({}, searchTerm);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, searchTerm]);

  // Function to handle the input change with debounce
  const searchTimer = useRef();
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);

    // Delay the execution of the search function by 300 milliseconds (adjust as needed)
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setVacancyTemplates([]);

      const query = {};

      loadMoreVacancies(query, newValue, 1);
    }, 1000);
  };

  useEffect(() => {
    loadMoreVacancies();
  }, []);

  return (
    <>
      <div className="container p-4 mx-auto" id="vacancyTemplateContainer">
        <div className="flex flex-col items-center mt-2">
          <button
            className="px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700"
            onClick={async () => {
              if (pageLoading) return;
              const vacancy = await ATSService.createVacancy({
                vacancyTemplate: {
                  name: "",
                  description: "",
                  image: "",
                  keyBenefits: "",
                  requiredSkills: "",
                  published: false,
                },
              });
              router.push(
                `/dashboard/vacancyprepublish?id=${vacancy.data.vacancy._id}`
              );
            }}
          >
            Start from scratch
          </button>

          <Divider>or choose a template below</Divider>
        </div>

        <div className="relative flex items-center mt-2">
          <input
            type="text"
            placeholder="Search Templates"
            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900  dark:bg-gray-900"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid gap-4 mt-5 md:grid-cols-2 lg:grid-cols-3">
          {vacancyTemplates.map((vacancyTemplate) => (
            <div
              key={vacancyTemplate._id}
              className="max-w-sm overflow-hidden transition duration-300 ease-in-out shadow-lg rounded-xl dark:shadow-gray-400/50 hover:shadow-gray-600/50 hover:shadow-2xl"
            >
              <img className="w-full" src={vacancyTemplate.image} alt="" />
              <div className="px-6 py-4">
                <div className="mb-2 text-xl font-bold">
                  {vacancyTemplate.name}
                </div>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {vacancyTemplate.description}
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <strong>Key Benefits:</strong> {vacancyTemplate.keyBenefits}
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  <strong>Required Skills:</strong>{" "}
                  {vacancyTemplate.requiredSkills}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <button
                  className="px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-indigo-700"
                  onClick={async () => {
                    if (pageLoading) return;
                    const vacancy = await ATSService.createVacancy({
                      vacancyTemplate,
                    });
                    router.push(
                      `/dashboard/vacancyprepublish?id=${vacancy.data.vacancy._id}`
                    );
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {total >= PAGINATION_LIMIT * page && (
        <div className="flex justify-center mt-5">
          <Button
            loading={loading}
            onClick={() => loadMoreVacancies({}, searchTerm)}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default CreateVacancy;
