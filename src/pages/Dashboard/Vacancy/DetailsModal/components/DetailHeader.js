import { UserAddOutlined, WechatWorkOutlined } from "@ant-design/icons";
import React from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa";
import StageTabs from "./StageTabs";
import CandidateAvatarInfo from "./CandidateAvatarInfo";
import {
  ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

function DetailHeader({ candidateInfo, _stages, onEmail, reloadStages }) {
  const getLastStage = () => {
    let __stages = [];
    _stages.forEach((ele) => {
      if (ele.atStage !== "") __stages.push(ele);
    });
    return __stages[__stages.length - 1].atStage;
  };

  console.log("candidate.stageId", candidateInfo.stageId);
  console.log("stages", _stages);
  const findStageeIndex = () => {
    const stage = candidateInfo.stageId;
    let index = -1;
    _stages.forEach((ele, i) => {
      if (ele.id === stage) index = i;
    });
    return index;
  };
  const findex = findStageeIndex();

  console.log("findStageeIndex", findStageeIndex());
  return (
    <>
      <div className="h-[17dvh] w-[100%] flex dark:bg-gray-700">
        <CandidateAvatarInfo
          candidateInfo={candidateInfo}
          _stages={_stages}
          getLastStage={getLastStage}
          reloadStages={reloadStages}
        >
          {_stages.map((_stageData, index) => (
            <StageTabs
              index={index}
              stageData={_stageData}
              classObj={{
                height: "h-[20px]",
                width: "w-[20px]",
                rounded: "rounded-[2px]",
              }}
              currentStageIndex={findex}
            />
          ))}
        </CandidateAvatarInfo>

        <div className="h-[90%] w-[50%]  flex justify-end items-center gap-3 dark:bg-gray-600">
          {/* <button className="flex h-[40px] min-w-[92px] flex-row items-center justify-center gap-2 rounded-lg border border-solid border-gray-300 bg-hireheroes-white px-[15px] text-center text-[14px] font-semibold text-gray-700">
            <ChatBubbleLeftRightIcon width={20}/> Chat
          </button> */}
          <button
            className="flex h-[40px] min-w-[92px] flex-row items-center justify-center gap-2 rounded-lg border border-solid border-gray-300 bg-hireheroes-white px-[15px] text-center text-[14px] font-semibold text-gray-700"
            onClick={() => onEmail(candidateInfo?._id)}
          >
            {" "}
            <EnvelopeIcon width={20} /> Send email
          </button>
          {/* <button className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-solid border-gray-300 px-2.5">
            <EllipsisVerticalIcon width={20}/>
          </button> */}
        </div>
      </div>
    </>
  );
}

export default DetailHeader;
