import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CrudService from "../../../service/CrudService";
import StatsDashboard from "../StatsDashboard";

const VacancyStats = () => {
  const router = useRouter();
  const [vacancyId, setVacancyId] = useState(null);
  const [vacancyData, setVacancyData] = useState(null);
  const [back, setBack] = useState("");

  useEffect(() => {
    const id = router.query.id;
    if (!id) return;
    setVacancyId(id);

    CrudService.getSingle("Vacancy", id).then(({ data }) => {
      setVacancyData(data);
    });
  }, [router.query.id]);

  useEffect(() => {
    const back = router.query.back;
    if (!back) return;
    setBack(back);
  }, [router.query.back]);

  if (!vacancyId) return <Skeleton active />;
  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      <StatsDashboard
        funnelId={vacancyId}
        vacancyData={vacancyData}
        back={back}
      />
    </>
  );
};

export default VacancyStats;
