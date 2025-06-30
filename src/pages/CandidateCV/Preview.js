import { Alert, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import CVService from "../../services/CVService";
import { Footer } from "../Landing/Footer";
import CVTemplate from "./CVTemplate";

const Preview = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState(null);

  useEffect(() => {
    const token = router.query.token;
    if (!token) return;

    setLoading(true);

    CVService.getCVData(token)
      .then(({ data }) => {
        setCandidateData(data);
      })
      .finally(() => setLoading(false));
  }, [router.query.token]);

  if (!candidateData && loading) return <Skeleton active />;
  if (!candidateData && !loading)
    return (
      <div className="m-4">
        <Alert type="error" message="Invalid CV link" />
      </div>
    );

  return (
    <>
      <div
        className="w-full border-box pt-5 pl-8 pr-8 pb-2"
        style={{ background: "center center / cover no-repeat transparent" }}
      >
        <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
          <div className="transition-wrapper" style={{}}>
            <div className="wrapper break-words text-center responsive font-semibold text-lg">
              <h4>
                Candidate CV:{" "}
                {candidateData?.candidate?.formData?.firstname ?? ""}{" "}
                {candidateData?.candidate?.formData?.lastname ?? ""}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {!candidateData?.cv?.submitted ? (
        <div className="flex items-center justify-center">
          <Alert type="info" message="Candidate has not submitted the CV" />
        </div>
      ) : candidateData?.cv?.alternativeUrl ? (
        <div>
          <div className="flex justify-end mb-2">
            <FaExternalLinkAlt
              onClick={() => {
                window.open(candidateData?.cv?.alternativeUrl);
              }}
              size={20}
              className="cursor-pointer"
            />
          </div>
          {candidateData?.cv?.alternativeUrl && (
            <div className="flex justify-center w-full">
              <iframe
                src={candidateData?.cv?.alternativeUrl}
                width="95%"
                height="700px"
              />
            </div>
          )}
        </div>
      ) : candidateData?.cv ? (
        <CVTemplate
          CVData={{
            cv: candidateData?.cv,
            candidate: candidateData?.candidate,
          }}
        />
      ) : (
        <>
          <Alert type="info" message="Candidate has not submitted the CV" />
        </>
      )}

      <br />
      <Footer />
    </>
  );
};

export default Preview;
