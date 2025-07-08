import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../../services/CrudService";
import ATS from "./ATS";

const Vacancy = () => {
  const [vacancyData, setVacancyData] = useState(null);
  const router = useRouter();
  const { query } = router;
  console.log("vacancyData", vacancyData);
  useEffect(() => {
    const id = query.id;
    if (!id) return;
    setVacancyData(null);

    CrudService.getSingle("LandingPageData", id,"vacancy page")
      .then((res) => {
        console.log(res);
        if (!res.data) return;
        setVacancyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [query.id]);

  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      <ATS
        VacancyId={vacancyData._id}
        vacancyInfo={{ name: vacancyData.vacancyTitle, ...vacancyData }}
      />
    </>
  );
};

export default Vacancy;
