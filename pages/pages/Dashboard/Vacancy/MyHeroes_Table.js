import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Avatar, Popconfirm } from "antd"; // Si estás usando Ant Design para los avatares
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import CrudService from "../../../service/CrudService";
// import { voices } from "../../InterviewBookCall";
// Placeholder voices object
const voices = {
  en: { label: "English" },
  es: { label: "Spanish" },
  fr: { label: "French" },
  de: { label: "German" },
};

const MyHeroesTable = ({ data, handleSecondConfirm }) => {
  const router = useRouter();;
  // const [singleVacancy, setSingleVacancy] = useState(null);

  // const handleSecondConfirm = async (vacancyId) => {
  //   await CrudService.delete("Hero", vacancyId);
  //   setSingleVacancy(null);
  //   setVacancies((c) => c.filter((e) => e._id !== vacancyId));
  // };

  const speedOptions = [
    { value: 0.85, label: "Slow" },
    { value: 1, label: "Normal" },
    { value: 1.35, label: "Fast" },
    { value: 1.6, label: "Ultra Fast" },
  ];

  function getSpeedLabel(speedValue) {
    const option = speedOptions.find((opt) => opt.value === speedValue);
    return option ? option.label : "Unknown";
  }

  const languageOptions = Object.keys(voices).map((key) => ({
    value: key,
    label: voices[key].label,
  }));

  function getLanguageLabel(languageValue) {
    const option = languageOptions.find((opt) => opt.value === languageValue);
    return option ? option.label : "Unknown";
  }

  return (
    <div className="rounded-lg h-full">
      <table className="w-full text-sm text-left font-inter text-[#475467] h-full">
        <thead className="text-xs bg-white">
          <tr>
            {[
              "Name",
              "Speech Speed",
              "Language",
              "Type of Interviewer",
              "Actions",
            ].map((header, index) => (
              <th
                key={header}
                scope="col"
                className={` px-6 py-3 ${index === 0 ? "rounded-s-lg" : ""} ${
                  index === 5 ? "rounded-e-lg" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <div className="mb-1"></div>
        <tbody className="bg-white text-sm font-normal capitalize">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50 ">
              <td
                className={`px-6 py-4 ${
                  rowIndex === 0 ? "rounded-tl-lg" : ""
                } `}
              >
                <div className="flex items-center">
                  <Avatar src={row.aiImage} className="mr-3 h-10 w-10" />
                  <span className="font-medium text-sm text-gray-900">
                    {row.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">{getSpeedLabel(row.aiSpeed)}</td>

              <td className="px-6 py-4">{getLanguageLabel(row.aiLanguage)}</td>
              <td className="px-6 py-4">{row.aiStyle}</td>
              <td
                className={`px-6 py-4 flex h-full items-center ${
                  rowIndex === 0 ? "rounded-tr-lg" : ""
                }`}
              >
                <Popconfirm
                  title="Are you sure?"
                  onConfirm={() => handleSecondConfirm(row._id)}
                >
                  <TrashIcon
                    title="Delete"
                    className="cursor-pointer text-red-500 pr-2 h-5"
                  />
                </Popconfirm>
                <PencilIcon
                  title="Edit"
                  className="cursor-pointer text-indigo-500 pl-2 h-5"
                  onClick={async () => {
                    router.push(`/dashboard/heroedit?id=${row._id}`);
                  }}
                />
              </td>
            </tr>
          ))}
          <tr className="h-full">
            <td
              className="bg-white h-full rounded-bl-lg rounded-br-lg "
              colSpan="6"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MyHeroesTable;
