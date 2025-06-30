import { Alert, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PublicService from "../../../src/services/PublicService";
import { Footer } from "../Landing/Footer";

const Finished = () => {
  const router = useRouter();
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const token = router.query.token;
    if (!token) return;
    setSurveyData(null);

    PublicService.getSurvey(token).then((res) => {
      if (!res.data) return;
      setSurveyData(res.data);
    });
  }, [router.query.token]);

  if (!surveyData) return <Skeleton active />;

  return (
    <>
      <div className="content">
        <div
          className="w-full border-box pt-4 pl-8 pr-8 pb-4"
          style={{
            background: "center center / cover no-repeat transparent",
          }}
        >
          <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
            <div className="transition-wrapper" style={{}}>
              <div className="wrapper break-words text-left flex items-center flex-col responsive">
                <h2 className="font-bold text-3xl">
                  Thank You for Your Submission!
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full border-box pt-4 pl-6 pr-6 pb-2"
          style={{
            background: "center center / cover no-repeat transparent",
          }}
        >
          <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
            <div className="transition-wrapper" style={{}}>
              <div
                className="w-full border-box pb-6"
                style={{
                  background: "center center / cover no-repeat transparent",
                }}
              >
                <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
                  <div className="transition-wrapper" style={{}}>
                    <div className="wrapper break-words text-left flex items-center flex-col responsive">
                      <h4>
                        Your CV has been successfully received. We genuinely
                        value the time and effort you have invested in applying
                        for a position with us. Rest assured, your application
                        is under review, and we are looking forward to learning
                        more about your qualifications and experience. We will
                        contact you regarding the next steps in our recruitment
                        process. Your potential contribution is important to us,
                        and we appreciate your interest in joining our team.
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Finished;
