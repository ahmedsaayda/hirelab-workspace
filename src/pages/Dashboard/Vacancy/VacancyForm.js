import { Alert, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MultiStepComponent from "../Vacancies/components/MultiStepComponent";
import { eeoForm, personalDataCollection } from "../../../../src/data/constants";
import CrudService from "../../../../src/services/CrudService";

const VacancyForm = () => {
  const router = useRouter();
  const [vacancyData, setVacancyData] = useState(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    setVacancyData(null);

    CrudService.search("VacancySubmission", 5, 1, {
      filters: { VacancyId: id },
    }).then((res) => {
      if (res.data.items.length > 0) router.push(`/dashboard/vacancy`);
      else {
        CrudService.getSingle("Vacancy", id).then((res) => {
          if (!res.data) return;
          setVacancyData(res.data);
        });
      }
    });
  }, [searchParams]);

  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      <div>
        <MultiStepComponent
          displaySteps={vacancyData.displaySteps}
          AIEnhancements={vacancyData.AIEnhancements}
          steps={[
            ...(Array.isArray(vacancyData.form)
              ? vacancyData.form
              : typeof vacancyData.form === "object"
              ? Object.values(vacancyData.form)
              : []),
            vacancyData?.eeodc
              ? {
                  id: "eeodc",
                  name: "EEODC",
                  form: [
                    {
                      type: "custom",
                      CustomInputComponent: () => (
                        <>
                          <h2 className="font-bold text-lg">
                            EEO Data Collection
                          </h2>
                          <Alert
                            type="info"
                            message="The following questions are part of our commitment to ensuring equal opportunities. Participation in this data collection is entirely voluntary, and all questions are optional. Your responses will not influence any individual hiring decisions. Instead, the data collected will be aggregated across multiple participants. This process is designed exclusively for our internal use, to monitor our progress towards achieving specific goals related to ensuring equal employment opportunities. Should you prefer not to respond to any query, please feel free to proceed to the next section of the form."
                          />
                        </>
                      ),
                    },
                    ...eeoForm,
                  ],
                }
              : null,
            {
              id: "contact",
              name: "Contact Information",
              form: [...personalDataCollection],
            },
          ].filter((a) => !!a)}
          onFinish={async (formData) => {
            const id = searchParams.get("id");
            if (!id) return;

            await CrudService.create("VacancySubmission", {
              VacancyId: id,
              formData,
              searchIndex: JSON.stringify(formData),
            });

            router.push(`/dashboard/vacancy`);
          }}
        />
      </div>
    </>
  );
};

export default VacancyForm;
