import { Card, Typography } from "antd";
import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Radar as ChartjsRadar } from "react-chartjs-2";

const { Text } = Typography;

const MAX_STRING_LENGTH = 20;
const CallStatsComponent = ({ callData, averageSkills }) => {
  const [candidateData, setCandidateData] = useState({
    skills: [],
    explanation: "",
    score: 0,
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

  const chartData = {
    labels: candidateData.labels,
    datasets: [
      {
        label: "Candidate Skills",
        data: candidateData.dataPoints,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Average",
        data: candidateData.averagePoints,
        backgroundColor: "rgba(34, 122, 205, 0.2)",
        borderColor: "rgba(34, 122, 205, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r;
            }
            return label;
          },
          title: function (context) {
            const index = context[0].dataIndex;
            return candidateData.skills[index].fullSkill;
          },
        },
      },
    },
    scales: {
      r: {
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 14,
          },
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const scoreColor =
    candidateData.score >= 8
      ? "text-green-500"
      : candidateData.score >= 6.5
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <>
    {console.log(callData,candidateData)}
      <div className="flex flex-col items-center">
        <Card bordered={false} className="w-full max-w-xl">
          <ChartjsRadar data={chartData} options={options} />
          <div className="text-center my-4">
            <Text strong className={scoreColor}>
              Score: {candidateData.score}
            </Text>
          </div>
          <Text className="block text-gray-600">
            {candidateData.explanation}
          </Text>
        </Card>
      </div>
    </>
  );
};

export default CallStatsComponent;
