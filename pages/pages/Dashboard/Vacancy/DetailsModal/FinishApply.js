import { vapi } from "@vapi-ai/web";
import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Skeleton,
  TimePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import { BoltIcon, CalendarIcon, LightBulbIcon, PlayCircleIcon, SpeakerWaveIcon, WifiIcon } from "@heroicons/react/24/outline";
import CVService from "../../../../service/CVService";
import { selectLoading } from "../../../../redux/auth/selectors";


const FinishApply = () => {
  let [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState(null);


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

  return (
    <>
        <div className="w-[80vw] flex m-auto flex-col">
          <div
            className="w-full border-box pt-5 pl:4 md:pl-8 pr-4 md:pr-8 pb-2"
            style={{
              background: "center center / cover no-repeat transparent",
            }}
          >
            <div className="mx-auto max-w-md sm:max-w-xl w-full md:max-w-3xl lg:max-w-4xl">
              <div className="transition-wrapper" style={{}}>
                <img src={"/images/application_sent.png"} className="m-auto w-40 mt-5 "/>
                <div >
                <h2 className=" my-4 wrapper break-words text-center responsive font-bold text-2xl">Thanks for your application</h2>
                <h5 className="mx-auto my-4 wrapper break-words text-center responsive  text-lg">
                    Welcome{" "}
                    {candidateData?.candidate?.formData?.firstname ?? ""}! 
                </h5>
                <h5 className="mx-auto my-4 wrapper break-words text-center responsive  text-lg">
                    As earlier communicated, you will be talking to{" "}
                    {candidateData?.vacancy?.hero?.name ?? "Taylor"}, our AI
                    driven recruiter. Please pick a date and time to specify when we should call you and start the interview process.
                </h5>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 md:w-[60vw] m-auto">
          <div className="w-full flex justify-center items-center bg-white p-5 rounded-lg border border-solir border-[#D0D5DD]">
            <Link className="w-full text-center flex justify-center items-center flex-col" href={`/interview?token=${searchParams.get("token")}&schedule=false`}>
            <div className="shrink-0 border border-[#EAECF0] p-2 rounded-md mb-2"><PlayCircleIcon width={20}/></div>
              Start Interview Now
            </Link>
          </div>
          <div className="w-full flex justify-center items-center bg-white p-5 rounded-lg border border-solir border-[#D0D5DD]">
            <Link className="w-full text-center flex justify-center items-center flex-col" href={`/interview?token=${searchParams.get("token")}&schedule=true`}>
            <div className="shrink-0 border border-[#EAECF0] p-2 rounded-md mb-2"><CalendarIcon width={20}/></div>
              Plan Your Interview
            </Link>
          </div>
        </div>
        </div>
    </>
  );
};

export default FinishApply;
