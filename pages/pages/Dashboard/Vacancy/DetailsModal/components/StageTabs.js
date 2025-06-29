import { Tooltip } from "antd";
import React from "react";

function StageTabs({
  index,
  stageData,
  classObj,
  candidate,
  currentStageIndex,
}) {
  console.log("candidate", candidate?.stageId);
  console.log({ index, stageData, classObj });
  const colors = ["#7F56D9", "#0E87FE", "#F75656", "#EF6820", "#0A8F63"];
  console.log("currentStageIndex", currentStageIndex);
  console.log({ index, currentStageIndex });

  return (
    <>
      <Tooltip placement={"top"} title={`${stageData?.title}`}>
        <div
          key={index}
          style={{
            background:
              stageData.color !== "#eeeeee"
                ? `${index < colors.length ? colors[index] : "#0538FF"}`
                : "#eeeeee",
          }}
          className={`${classObj.height} ${classObj.width} flex justify-center items-center text-white ${classObj.rounded}`}
        >
          {currentStageIndex >= index ? index + 1 : ""}
        </div>
      </Tooltip>
    </>
  );
}

export default StageTabs;
