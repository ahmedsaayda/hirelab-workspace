import { Allotment } from "allotment";
import { Alert, Popconfirm, Skeleton, Space, Tour } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MultiStepComponent from "../../../components/MultiStepComponent";
import MultiStepConfigurator from "../../../components/MultiStepConfigurator";
import { eeoForm, personalDataCollection } from "../../../data/constants";
import useWindowDimensions from "../../../hook/useWindowDimensions";
import { getPartner } from "../../../redux/auth/selectors";
import CrudService from "../../../service/CrudService";

const VacancyEditForm = () => {
  let [searchParams] = useSearchParams();
  const router = useRouter();;
  const [vacancyData, setVacancyData] = useState(null);
  const [tourOpen, setTourOpen] = useState(!localStorage?.editFormTour);
  const [funnelSteps, setFunnelSteps] = useState([]);
  const vidRef = useRef();
  const partner = useSelector(getPartner);
  const { width } = useWindowDimensions();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  useEffect(() => {
    if (vacancyData?.form) setFunnelSteps(vacancyData.form);
  }, [vacancyData]);

  useEffect(() => {
    if (vidRef.current) vidRef.current.play();
  }, [vidRef]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    if (!partner) return;
    setVacancyData(null);
    setFunnelSteps([]);

    CrudService.getSingle("Vacancy", id).then((res) => {
      if (!res.data) return;
      if (!res.data?.form) {
        router.push(`/dashboard/vacancyedit?id=${id}`);
      } else {
        setVacancyData(res.data);
        setFunnelSteps(res.data.form);
      }
    });
  }, [searchParams, partner]);

  if (!vacancyData) return <Skeleton active />;
  if (!funnelSteps) return <Skeleton active />;

  const tourSteps = [
    {
      title: "Preview Your Form",
      description: `View a candidate's perspective of the form on the left.`,
      target: () => ref1.current,
    },
    {
      title: "Customize Steps",
      description:
        "On the right, edit steps or form elements within each step.",
      target: () => ref2.current,
    },
    {
      title: "Publish Campaign",
      description: "Ready to go live? Publish your hero here.",
      target: () => ref3.current,
    },
    {
      title: "Edit Funnel Settings",
      description:
        "Return here to adjust your funnel; all changes are saved automatically.",
      target: () => ref4.current,
    },
  ];

  return (
    <>
      <Tour
        open={tourOpen && width > 1200}
        onClose={() => {
          setTourOpen(false);
          localStorage.editFormTour = "true";
        }}
        steps={tourSteps}
      />

      {width > 1200 ? (
        <div style={{ minHeight: "80vh" }}>
          <Allotment defaultSizes={[150, 150]}>
            <Allotment.Pane snap>
              <div style={{ minWidth: 350, minHeight: "80vh" }} ref={ref1}>
                <MultiStepComponent
                  steps={[
                    ...(Array.isArray(funnelSteps)
                      ? funnelSteps
                      : typeof funnelSteps === "object"
                      ? Object.values(funnelSteps)
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
                />
              </div>
            </Allotment.Pane>
            <Allotment.Pane snap>
              <div style={{ minWidth: 350 }} ref={ref2}>
                <MultiStepConfigurator
                  funnelSteps={[
                    ...(Array.isArray(funnelSteps)
                      ? funnelSteps
                      : typeof funnelSteps === "object"
                      ? Object.values(funnelSteps)
                      : []),
                  ]}
                  setFunnelSteps={(e) => {
                    const result = typeof e === "function" ? e(funnelSteps) : e;

                    setFunnelSteps(result);

                    const id = searchParams.get("id");
                    if (!id) return;
                    CrudService.update("Vacancy", id, { form: result });
                  }}
                />
              </div>
            </Allotment.Pane>
          </Allotment>
        </div>
      ) : (
        <MultiStepConfigurator
          funnelSteps={[
            ...(Array.isArray(funnelSteps)
              ? funnelSteps
              : typeof funnelSteps === "object"
              ? Object.values(funnelSteps)
              : []),
          ]}
          setFunnelSteps={(e) => {
            const result = typeof e === "function" ? e(funnelSteps) : e;

            setFunnelSteps(result);

            const id = searchParams.get("id");
            if (!id) return;
            CrudService.update("Vacancy", id, { form: result });
          }}
        />
      )}

      <Space className="justify-end flex">
        <button
          className="px-2 py-1 text-sm bg-white-500 border border-indigo-500 text-indigo-500 rounded"
          type="primary"
          onClick={async () => {
            const id = searchParams.get("id");
            if (!id) return;

            router.push(`/dashboard/vacancyedit?id=${id}`);
          }}
        >
          Back to funnel settings
        </button>

        <button
          ref={ref3}
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          type="primary"
          onClick={async () => {
            const id = searchParams.get("id");
            if (!id) return;
            const addition = vacancyData?.published ? "" : "&new=true";

            await CrudService.update("Vacancy", id, {
              published: true,
            });

            router.push(`/dashboard/vacancy?id=${id}${addition}`);
          }}
        >
          Publish Campaign
        </button>
      </Space>
    </>
  );
};

export default VacancyEditForm;
