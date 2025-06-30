import { Alert } from "antd";
import { AiOutlineFall } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
// import ReactPlayer from 'react-player'

function Overview({ lastCall, currentStage, candidate }) {
  console.log("1", lastCall);
  if (!lastCall)
    return (
      <Alert
        type="info"
        message="Candidate has not been interviewed yet"
        className="mb-3"
      />
    );
  return (
    <div className="flex flex-col gap-5 ">
      {/* 3 CARDS */}
      <div className="flex gap-3">
        <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">
          Status {currentStage}
        </div>
        <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">
          Overall Score {lastCall?.aiValidation?.score ?? 0}/100
        </div>
        <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">
          Talent Pool Rank
        </div>
      </div>
      {/* summary section */}
      <div className="grid grid-cols-2 gap-x-5">
        {/* summary */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-[16px]">Summary</h3>
          {!lastCall.transcript ||
            (lastCall.transcript.length < 500 && (
              <div className="flex h-[30px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">
                The interview was too short to make an analysis
              </div>
            ))}
          {lastCall?.transcrtipt?.length > 500 && !lastCall.aiValidation && (
            <div className="flex h-[30px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">
              Processing the interview results...
            </div>
          )}
          {lastCall.transcript.length > 500 && (
            <div>
              <div className="flex gap-2 items-center">
                {" "}
                <BsStars
                  color="green"
                  fontSize={"20px"}
                  style={{ fontWeight: "bolder" }}
                />{" "}
                <span className="text-gray-500 font-bold mb-2 mt-4">
                  CANDIDATE HIGHLIGTH
                </span>
              </div>
              <ol className="flex flex-col gap-2">
                {lastCall?.aiValidation?.highlight?.map?.((ele, index) => (
                  <li className="flex gap-2 justify-start items-center capitalize text-[12px]">
                    <div
                      style={{
                        height: "5px",
                        width: "5px",
                        background: "black",
                        borderRadius: "50%",
                      }}
                    ></div>{" "}
                    {ele}
                  </li>
                ))}
              </ol>
              <div className="flex gap-2 items-center">
                {" "}
                <AiOutlineFall
                  color="#F46652"
                  fontSize={"20px"}
                  style={{ fontWeight: "bolder" }}
                />{" "}
                <span className="text-gray-500 font-bold mb-2 mt-4">
                  CANDIDATE LOWLIGHT
                </span>
              </div>
              <ol className="flex flex-col gap-2">
                {lastCall?.aiValidation?.lowlight?.map?.((ele, index) => (
                  <li className="flex gap-2 justify-start items-center capitalize text-[12px]">
                    <div
                      style={{
                        height: "5px",
                        width: "5px",
                        background: "black",
                        borderRadius: "50%",
                      }}
                    ></div>{" "}
                    {ele}
                  </li>
                ))}
              </ol>
              <h1 className="text-gray-500 font-bold mt-2">
                CANDIDATE’S SKILLS
              </h1>
              <div className="flex flex-wrap gap-3">
                {lastCall?.aiValidation?.skills?.map?.((ele) => (
                  <div className="h-[30px] w-min-[100px] flex justify-center items-center border capitalize p-2 border-black rounded-lg bg-gray-200 font-bold ">
                    {ele}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* video */}
        <div className="flex flex-col gap-1">
          <div className="h-[227px] w-full bg-blue flex w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid bg-gray-200 ">
            {candidate?.videoUrls ? (
              // <ReactPlayer height={"227px"} controls={true} url={[{src:lastCall.videoUrl}]} style={{borderRadius:"10px", width:"100%"}}/>
              <div>
                <p>VIDEO HERE </p>
                <p>{candidate?.videoUrls?.[candidate.videoUrls.length - 1]}</p>
              </div>
            ) : (
              <p>Video not found</p>
            )}
          </div>
          <h3 className="text-gray-500 font-bold mb-2 mt-4">TRANSCRIPT</h3>
          <p
            className="mt-1 text-sm text-gray-900 space-y-4"
            dangerouslySetInnerHTML={{
              __html:
                lastCall?.transcript
                  ?.replace?.(/\n/g, "<br>")
                  .replace(/(User:|AI:)/g, "<strong>$1</strong>") ?? "",
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}
export default Overview;
