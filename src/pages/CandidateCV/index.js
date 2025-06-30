import { Alert, Divider, Skeleton, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectLoading } from "../../redux/auth/selectors";
import CVService from "../../services/CVService";
import UploadService from "../../services/UploadService";
import { Footer } from "../Landing/Footer";
import CVTemplate from "./CVTemplate";
import Finished from "./Finished";

const CandidateCV = () => {
  let [searchParams] = useSearchParams();
  const router = useRouter();;
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [candidateData, setCandidateData] = useState(null);

  const fileInput = useRef(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    fileInput.current = document.getElementById("fileInput6");
    if (fileInput.current)
      fileInput.current.addEventListener("change", async () => {
        const selectedFile = fileInput.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 5);

          await CVService.submitCV(token, result.data.secure_url);

          await CVService.getCVData(token).then(({ data }) => {
            setCandidateData(data);
          });
          fileInput.current.files[0] = "";
        } else {
          console.log("No file selected.");
        }
      });
  }, [searchParams]);

  const backendLoading = useSelector(selectLoading);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    setLoading(true);

    CVService.getCVData(token)
      .then(({ data }) => {
        setCandidateData(data);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (!candidateData && loading) return <Skeleton active />;
  if (!candidateData && !loading)
    return (
      <div className="m-4">
        <Alert type="error" message="Invalid CV link" />
      </div>
    );
  if (candidateData?.cv?.submitted) return <Finished />;

  if (!started)
    return (
      <>
        <div
          className="w-full border-box pt-5 pl-8 pr-8 pb-2"
          style={{ background: "center center / cover no-repeat transparent" }}
        >
          <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
            <div className="transition-wrapper" style={{}}>
              <div className="wrapper break-words text-center responsive font-semibold text-lg">
                <h4>Welcome to Your Next Career Step!</h4>
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full border-box pt-4 pl-6 pr-6 pb-0"
          style={{ background: "center center / cover no-repeat transparent" }}
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
                    <div className="wrapper break-words text-center responsive">
                      <h4>
                        We're thrilled to guide you through a seamless CV
                        submission process. Our portal features an in-built CV
                        generator tailored for your convenience—feel free to
                        utilize it to craft your professional profile. If you
                        have a pre-existing CV, you're just a click away from
                        uploading it directly. Our team is dedicated to a
                        meticulous review of each application, seeking to match
                        your unique skills and experiences with our dynamic
                        roles. Upload your CV and propel your career forward. We
                        eagerly await the opportunity to discover your
                        potential. Thank you for choosing to advance your career
                        with us!
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-md sm:max-w-xl w-full">
          <div className="transition-wrapper" style={{}}>
            <button
              onClick={() => {
                if (backendLoading) return;
                setStarted(true);
              }}
              className="py-4 px-6 rounded-md mx-auto max-w-md block cursor-pointer border-none w-full box-border button transition text-center transform active:scale-90 "
              type="button"
            >
              <div
                className="w-full border-box "
                style={{
                  background: "center center / cover no-repeat transparent",
                }}
              >
                <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
                  <div className="transition-wrapper" style={{}}>
                    <div className="wrapper break-words text-center p-4 bg-indigo-500 rounded text-white font-bold">
                      <h3>Submit your CV using our in-built CV generator</h3>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <Divider className="my-2" />

            <button
              className="py-4 px-6 rounded-md mx-auto max-w-md block cursor-pointer border-none w-full box-border button transition text-center transform active:scale-90 "
              type="button"
              onClick={() => {
                if (backendLoading) return;
                fileInput?.current?.click?.();
              }}
            >
              <div
                className="w-full border-box "
                style={{
                  background: "center center / cover no-repeat transparent",
                }}
              >
                <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
                  <div className="transition-wrapper" style={{}}>
                    <div className="wrapper break-words text-center p-4 bg-indigo-500 rounded text-white font-bold">
                      <h3>Or upload from device</h3>
                    </div>
                  </div>
                </div>
              </div>
            </button>
            {backendLoading && (
              <div className="w-full text-center">
                <Spin />
              </div>
            )}
          </div>
        </div>

        <Footer />
      </>
    );

  return (
    <>
      <CVTemplate isEditable finishComponent={<Finished />} />
      <Footer />
    </>
  );
};

export default CandidateCV;
