import { Allotment } from "allotment";
import { Skeleton, message } from "antd";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import MultiStepComponent from "../Vacancies/components/MultiStepComponent";
import MultiStepConfigurator from "../Vacancies/components/MultiStepConfigurator";
import AuthService from "../../../services/AuthService";

const SurveyFormSetup = ({ surveyFormActive, setSurveyFormActive }) => {
  const [me, setMe] = useState(null);
  const [surveyForm, setSurveyForm] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.me().then(({ data }) => {
      setMe(data.me);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setSurveyForm(me?.surveyForm?.form ?? []);
  }, [me]);

  if (loading) return <Skeleton active />;
  return (
    <div
      className="survey-form m-5 rounded"
      style={{
        display: surveyFormActive ? "block" : "none",
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 2000,
        background: "white",
      }}
    >
      <div
        onClick={() => {
          setSurveyFormActive(false);
        }}
        className="cursor-pointer bg-gray-200 rounded-md transition ease-in-out delay-150 hover:scale-110"
        style={{ position: "fixed", zIndex: 2001, top: 10, right: 10 }}
      >
        <RxCross2 size={25} />
      </div>

      {me ? (
        <div className="m-4 ">
          <div>
            <Allotment defaultSizes={[150, 150]}>
              <Allotment.Pane snap>
                <MultiStepComponent
                  steps={[
                    ...(Array.isArray(surveyForm)
                      ? surveyForm
                      : typeof surveyForm === "object"
                      ? Object.values(surveyForm)
                      : []),
                  ]}
                />
              </Allotment.Pane>
              <Allotment.Pane snap>
                <div id="multiFormContainer">
                  <MultiStepConfigurator
                    enableKPI
                    funnelSteps={surveyForm ?? []}
                    setFunnelSteps={(e) => {
                      const result =
                        typeof e === "function" ? e(surveyForm ?? []) : e;
                      setSurveyForm(result);

                      AuthService.updateMe({
                        ...me,
                        surveyForm: {
                          ...me.surveyForm,
                          form: surveyForm,
                        },
                        silent: true,
                      });
                    }}
                  />

                  <div className="p-10 pt-0">
                    <button
                      className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-400 rounded"
                      onClick={() => {
                        setSurveyFormActive(false);
                      }}
                    >
                      Close the configurator
                    </button>
                  </div>
                </div>
              </Allotment.Pane>
            </Allotment>
          </div>
        </div>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default SurveyFormSetup;
