import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../../service/CrudService";
import ATS from "./ATS";

const Vacancy = () => {
  const [vacancyData, setVacancyData] = useState(null);
  let [searchParams] = useSearchParams();
  console.log("vacancyData", vacancyData);
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    setVacancyData(null);

    CrudService.getSingle("LandingPageData", id)
      .then((res) => {
        console.log(res);
        if (!res.data) return;
        setVacancyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchParams]);

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
