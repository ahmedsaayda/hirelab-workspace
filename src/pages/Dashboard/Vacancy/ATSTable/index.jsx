import React from "react";

import { Table, Rate, Dropdown, Avatar } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ATSService from "../../../../services/ATSService";
import CrudService from "../../../../services/CrudService";


export default function ATSTable({
  handleMoveCandidate,
  reloadStages,
  vacancyInfo,
  candidates,
  boardColumns,
  onCardOptionClick,
}) {
  const stages = vacancyInfo.stages;

  console.log(candidates);
  console.log(stages);

  const onMoveCard = (targetStage, candidateId) => {
    const thisColumn = boardColumns.find((column) => column.id === candidateId);
    console.log(targetStage, candidateId);
    const destinationCol = thisColumn?.cards?.map((card) => card.id) || [];
    destinationCol.push(candidateId);
    console.log(destinationCol);
    ATSService.moveCandidate({
      targetStage: targetStage,
      candidateId: candidateId,
      destinationCol,
    }).then((data) => {
      console.log(data);
      reloadStages({ noLoadingDisplay: true });
    });
  };
  // each table will accept the possible stages from the vaacancy page
  console.log(stages);
  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "formData",

      render: (data, record) => {
        console.log(record);
        const getName = () => {
          return data.fullname?.trim() ? data.fullname : data.email;
        };
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onCardOptionClick(record._id, "details-modal")}
          >
            {renderAvatar({ fullname: getName(), avatar: data.avatar })}
            <span className="font-medium">{getName()}</span>
          </div>
        );
      },
    },
    {
      title: "Stages",
      dataIndex: "stageId",
      render: (stage, record) => {
        console.log(stage);
        console.log(record);

        const column = {
          total: stages.length,
          progress: stages.findIndex((s) => s.id === stage?._id) + 1,
          name: stages.find((s) => {
            console.log(s.id);
            console.log(stage);
            return s.id === stage?._id;
          })?.title,
        };

        console.log(column);

        const stageIndex = vacancyInfo.stages.findIndex(
          (s) => s.id === stage?._id
        );
        console.log(stageIndex);

        console.log(stage?.name);
        console.log(stage?.name, stageIndex, getStageColor(stageIndex));
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{stage.name}</span>

              <Dropdown
                menu={{
                  items: stages.map((stage) => ({
                    label: (
                      <button
                        className={` px-2 py-1 rounded-md`}
                        onClick={() => onMoveCard(stage.id, record._id)}
                      >
                        {stage.title}
                      </button>
                    ),
                    key: stage,
                  })),
                }}
                trigger={["click"]}
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Dropdown>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: column.total }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square text-white font-medium w-[18px] rounded-sm flex items-center justify-center
                      
                    ${
                      index < column.progress
                        ? getStageColor(stageIndex)
                        : "bg-[#EAECF0]"
                    }`}
                >
                  {index < column.progress ? index + 1 : ""}
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      title: "Applied date",
      dataIndex: "createdAt",
      render: (date) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Position applied to",
      dataIndex: ["LandingPageDataId", "vacancyTitle"],
      render: (position) => {
        return (
          <span className=" text-primary hover:underline">{position}</span>
        );
      },
    },
    {
      title: "Rating",
      dataIndex: "stars",
      render: (rating, recod) => {
        const id = recod._id;
        return (
          <Rate
            onChange={async (value) => {
              console.log(value);
              await CrudService.update("VacancySubmission", id, {
                stars: value,
              })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            defaultValue={rating}
            className="text-amber-400 whitespace-nowrap"
          />
        );
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => {
        console.log(record);
        return (
          <Dropdown
            menu={{
              //details-modal , edit-modal, delete-modal, email,schedule
              items: [
                { key: "delete-modal", label: "Edit candidate" },
                { key: "email", label: "Email candidate" },
                { key: "schedule", label: "Schedule interview" },
                { key: "delete-modal", label: "Delete" },
              ],
              onClick: ({ key }) => {
                console.log("key", key);
                onCardOptionClick(record?._id, key);
              },
            }}
            trigger={["click"]}
          >
            <EllipsisOutlined className="text-xl cursor-pointer" />
          </Dropdown>
        );
      },
    },
  ];

  const data = [
    {
      key: "1",
      name: "Mary Markle",
      avatar: "/placeholder.svg",
      stage: { name: "New Applied", progress: 1, total: 4 },
      appliedDate: "Jan 4, 2024",
      position: "Design Lead",
      rating: 5,
    },
    {
      key: "2",
      name: "Jack Tim",
      avatar: "/placeholder.svg",
      stage: { name: "Tests", progress: 4, total: 4 },
      appliedDate: "Jan 4, 2024",
      position: "Design Lead",
      rating: 4,
    },
    {
      key: "3",
      name: "Leo Bars",
      avatar: "/placeholder.svg",
      stage: { name: "Hired", progress: 5, total: 5 },
      appliedDate: "Jan 2, 2024",
      position: "Design Lead",
      rating: 4,
    },
    // Add more sample data as needed
  ];

  const renderAvatar = (card) => {
    console.log(card);
    console.log(card.avatar, card.fullname);
    //render avatar or initials (name or email)
    if (card.avatar) {
      return <Avatar size={32} src={card.avatar} />;
    }
    const name = card.fullname?.trim() ? card.fullname : card.email;
    console.log(name);
    return (
      <span className="flex items-center justify-center w-6 font-medium text-white bg-gray-500 rounded-full text-md aspect-square">
        {name[0]}
      </span>
    );
  };

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={candidates}
        pagination={{
          total: candidates.length,
          pageSize: 10,
          showSizeChanger: true,
        }}
        className="[&_.ant-table-thead_.ant-table-cell]:bg-gray-50 [&_.ant-table-thead_.ant-table-cell]:font-medium"
        rowSelection={{
          type: "checkbox",
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}

function getStageColor(index) {
  console.log(index);
  switch (index) {
    case 0:
      return "bg-[#7F56D9]";
    case 1:
      return "bg-[#0E87FE]";
    case 2:
      return "bg-[#F75656]";
    case 3:
      return "bg-[#EF6820]";
    case 4:
      return "bg-[#0A8F63]";
    default:
      return "";
  }
}
