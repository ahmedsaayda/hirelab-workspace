import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Skeleton, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { selectUser, selectDarkMode } from "../../../redux/auth/selectors";
import CrudService from "../../../services/CrudService";
import ATSService from "../../../services/ATSService";

const VacancySelector = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector(selectUser);
  const darkMode = useSelector(selectDarkMode);
  const router = useRouter();

  useEffect(() => {
    const loadVacancies = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await CrudService.search("LandingPageData", 100, 1, {
          filters: { user_id: user._id, 
            // published: true
           },
          sort: { createdAt: -1 },
        });

        if (response.data?.items) {
          setVacancies(response.data.items);
        }
      } catch (error) {
        console.error("Error loading vacancies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, [user]);

  const filteredVacancies = vacancies.filter((vacancy) =>
    vacancy.vacancyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vacancy.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVacancySelect = (vacancyId) => {
    router.push(`/dashboard/ats?id=${vacancyId}`);
  };

  if (loading) return <Skeleton active />;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Select a Vacancy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a vacancy to view and manage candidates
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search vacancies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
            size="large"
          />
        </div>

        {/* Vacancy List */}
        <div className="space-y-3">
          {filteredVacancies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm ? "No vacancies found matching your search" : "No published vacancies found"}
              </p>
            </div>
          ) : (
            filteredVacancies.map((vacancy) => (
              <div
                key={vacancy._id}
                onClick={() => handleVacancySelect(vacancy._id)}
                className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {vacancy.companyLogo && (
                        <img
                          src={vacancy.companyLogo}
                          alt={vacancy.companyName}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {vacancy.vacancyTitle}
                          </h3>
                          {vacancy.published && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Published
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {vacancy.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Department:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vacancy.department || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Language:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vacancy.lang || "N/A"}
                        </span>
                      </div>

                      {vacancy.salaryRange && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Salary:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {vacancy.salaryCurrency}{vacancy.salaryMin} - {vacancy.salaryCurrency}{vacancy.salaryMax} / {vacancy.salaryTime}
                          </span>
                        </div>
                      )}

                      {vacancy.location && vacancy.location.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">
                            Location:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {vacancy.location[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancySelector;