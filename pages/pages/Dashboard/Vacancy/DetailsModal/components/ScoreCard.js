import { AiOutlineFall } from "react-icons/ai";
import { BsStars } from "react-icons/bs";
import SkillsTabs from "./SkillsTabs";
import MyRadarChart from "./RadarChart";
import { useEffect, useState } from "react";
import { Alert } from "antd";

const MAX_STRING_LENGTH = 20;
function ScoreCard({callData,currentStage, averageSkills,lastCall, averageCultural, averageEmotional }) {
 console.log("averageEmotional ", averageEmotional )
  const [activeItem, setActiveItem]= useState("Skills")

  const [candidateData, setCandidateData] = useState({
    skills: [],
    explanation: "",
    score: 0,
    labels: [],
    dataPoints: [],
  });

  const [culturalData, setCulturalData] = useState({
    skills: [],
    explanation: "",
    labels: [],
    dataPoints: [],
  });

  const [emotionalData, setEmotionalData] = useState({
    skills: [],
    explanation: "",
    labels: [],
    dataPoints: [],
  });

  useEffect(() => {
    setCandidateData({
      skills: [],
      explanation: "",
      score: 0,
      labels: [],
      dataPoints: [],
    });
    if (!callData?.aiValidation) return;

    const skills = Object.keys(callData.aiValidation)
      .filter(
        (key) =>
          key !== "score" && typeof callData.aiValidation[key] === "number"
      )
      .map((key) => ({
        skill:
          key.length > MAX_STRING_LENGTH
            ? key.substring(0, MAX_STRING_LENGTH) + "..."
            : key,
        value: callData.aiValidation[key],
        fullSkill: key,
      }));

    setCandidateData((prevData) => ({
      ...prevData,
      skills: skills,
      explanation: callData.aiValidation.explanation ?? "",
      score: callData.aiValidation.score ?? 0,
      labels: skills.map((s) => s.skill),
      dataPoints: skills.map((s) => s.value),
      averagePoints: averageSkills
        ? Object.keys(averageSkills).map((s) => averageSkills[s])
        : [],
    }));
  }, [callData]);

  useEffect(() => {
    setEmotionalData({
      skills: [],
      explanation: "",
      labels: [],
      dataPoints: [],
    });
    if (!callData?.aiValidationEmotional) return;

    const skills = Object.keys(callData.aiValidationEmotional)
      .filter(
        (key) =>
          key !== "score" && typeof callData.aiValidationEmotional[key] === "number"
      )
      .map((key) => ({
        skill:
          key.length > MAX_STRING_LENGTH
            ? key.substring(0, MAX_STRING_LENGTH) + "..."
            : key,
        value: callData.aiValidationEmotional[key],
        fullSkill: key,
      }));

    setEmotionalData((prevData) => ({
      ...prevData,
      skills: skills,
      explanation: callData.aiValidationEmotional.explanation ?? "",
      labels: skills.map((s) => s.skill),
      dataPoints: skills.map((s) => s.value),
      averagePoints: averageEmotional
        ? Object.keys(averageEmotional).map((s) => averageEmotional[s])
        : [],
    }));
  }, [callData]);

  useEffect(() => {
    setCulturalData({
      skills: [],
      explanation: "",
      labels: [],
      dataPoints: [],
    });
    if (!callData?.aiValidationCultural) return;

    const skills = Object.keys(callData.aiValidationCultural)
      .filter(
        (key) =>
          key !== "score" && typeof callData.aiValidationCultural[key] === "number"
      )
      .map((key) => ({
        skill:
          key.length > MAX_STRING_LENGTH
            ? key.substring(0, MAX_STRING_LENGTH) + "..."
            : key,
        value: callData.aiValidationCultural[key],
        fullSkill: key,
      }));

    setCulturalData((prevData) => ({
      ...prevData,
      skills: skills,
      explanation: callData.aiValidationCultural.explanation ?? "",
      labels: skills.map((s) => s.skill),
      dataPoints: skills.map((s) => s.value),
      averagePoints: averageCultural
        ? Object.keys(averageCultural).map((s) => averageCultural[s])
        : [],
    }));
  }, [callData]);

  const getChartData = (active) => {
   let data = ""
   if (active == "Skills"){data = candidateData}
   if (active == "Emotional"){data = emotionalData}
   if (active == "Cultural"){data = culturalData}
   console.log("data",data)
   let chartData =
    data.labels.map((label, index)=>(
      {subject: label,
      candidate:data.dataPoints[index],
      average: data.averagePoints[index]
      }
    ))

   return chartData
  }




if(!callData)return <Alert type="info" message="Candidate has not been interviewed yet" className="mb-3"/>
return(
  <div className="flex flex-col gap-5 ">
    {/* 3 CARDS */}
    <div className="flex gap-3">
    <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">Status {currentStage}</div>
    <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">Overall Score {callData?.aiValidation?.score ?? 0}/100</div>
    <div className="flex h-[40px] w-full flex-row items-center justify-center gap-2 rounded-lg border border-solid border-hireheroes-gray-300  px-[33px] text-center text-[14px] font-semibold text-gray-700 sm:px-5">Talent Pool Rank</div>
    </div>
    {/* SCORECARD */}
    <div className="grid grid-cols-2 gap-x-5">
        {/* GRAPH*/}
        <div className="flex flex-col gap-2">
        <h3 className="text-gray-500 font-bold text-[16px]">APPLICANT ANALYSES</h3>
        <MyRadarChart data={getChartData(activeItem)}/>
        </div>
        {/* TABS */}
        <div className="flex flex-col gap-1">

          <SkillsTabs data={getChartData(activeItem)} lastCall={lastCall} activeItem={activeItem} setActiveItem={setActiveItem}/>
        </div>
    </div>
  </div>
)
}
export default ScoreCard;