import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../../services/CrudService";
import ATS from "./ATS";
import NewATS from "./NewATS";

const Vacancy = () => {
  const [vacancyData, setVacancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { query } = router;
  
  useEffect(() => {
    const id = query.id;
    setLoading(true);
    
    if (!id) {
      // No ID means multi-job overview - no specific vacancy data needed
      setVacancyData(null);
      setLoading(false);
      return;
    }

    // Fetch specific vacancy data when ID is provided
    setVacancyData(null);
    CrudService.getSingle("LandingPageData", id, "vacancy page")
      .then((res) => {
        console.log("Single vacancy data:", res);
        if (res.data) {
          setVacancyData(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching vacancy:", err);
        setLoading(false);
      });
  }, [query.id]);

  if (loading) return <Skeleton active />;
  
  return (
    <>
      <NewATS
        VacancyId={vacancyData?._id || null}
        vacancyInfo={vacancyData ? { name: vacancyData.vacancyTitle, ...vacancyData } : null}
        isMultiJobView={!query.id}
      />
    </>
  );
};

export default Vacancy;
