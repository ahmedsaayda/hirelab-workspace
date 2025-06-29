import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import ATSService from "../../../../../service/ATSService";

function CandidateAvatarInfo({
  candidateInfo,
  reloadStages,
  _stages,
  children,
  getLastStage,
}) {
  const [visible, setVisible] = useState(false);
  console.log(candidateInfo._id);
  // Function to handle visibility change
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onMoveCard = (targetStage, candidateId) => {
    console.log(targetStage, candidateId);
    ATSService.moveCandidate({
      targetStage: targetStage,
      candidateId: candidateId,
      destinationCol: [`${candidateId}`],
    }).then(() => {
      reloadStages({ noLoadingDisplay: true });
    });
  };
  return (
    <>
      <div className="h-[90%] w-[50%] p-1 flex gap-2 justify-center items-center dark:bg-gray-700">
        <div className="h-[100px] w-[100px] border border-black flex justify-center items-center rounded-full">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQtmJihq_VAgrb4BrSPeSM2v6HXpDiU6XlVWRXIUJoHQ&s"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="h-[100%] w-[50%] p-1 flex flex-col justify-start">
          <div
            style={{ fontSize: "18px" }}
            className="h-[45%] w-[100%]  flex justify-start items-end font-bold dark:text-white"
          >
            {`${candidateInfo?.formData?.firstname} ${candidateInfo?.formData?.lastname}`}
          </div>
          <div
            style={{ fontSize: "15px" }}
            className="h-[15%] w-[100%] flex justify-start items-center"
          >
            {getLastStage()}
            <Dropdown
              overlay={
                <Menu>
                  {_stages.map((s) => (
                    <Menu.Item
                      onClick={() => onMoveCard(s.id, candidateInfo._id)}
                    >
                      {s.title}
                    </Menu.Item>
                  ))}
                </Menu>
              }
              onVisibleChange={handleVisibleChange}
              visible={visible}
              trigger={["click"]}
            >
              <FaAngleDown />
            </Dropdown>
          </div>
          <div className="h-[30%] w-[100%]  flex gap-1 justify-start items-center">
            {children}
            {/* {_stages.map((_stageData, index) => (
                <StageTabs
                  index={index}
                  stageData={_stageData}
                  classObj={{
                    height: "h-[20px]",
                    width: "w-[20px]",
                    rounded: "rounded-[2px]",
                  }}
                />
              ))} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateAvatarInfo;
