import {
  Divider,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  Tag,
  Typography,
} from "antd";
import Search from "antd/es/input/Search";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import DatePicker from "react-datepicker";
import { CiLink } from "react-icons/ci";
import { FaEdit, FaPlusCircle, FaUniversity } from "react-icons/fa";
import { FaClover } from "react-icons/fa6";
import { GoOrganization } from "react-icons/go";
import {
  IoIosAdd,
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiLinkUnlinkM } from "react-icons/ri";
import { TbCertificate } from "react-icons/tb";
import { VscOrganization } from "react-icons/vsc";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectDarkMode, selectLoading } from "../../../redux/auth/selectors";
import CVService from "../../../services/CVService";
import CrudService from "../../../services/CrudService";
import UploadService from "../../../services/UploadService";
import { Footer } from "../../Landing/Footer";
import EditTags from "./EditTags";
import { countryLanguages } from "./countries";

const { Option } = Select;

const CVTemplate = ({ isEditable = false, finishComponent, CVData }) => {
  let [searchParams] = useSearchParams();
  const [candidateData, setCandidateData] = useState(CVData ?? null);
  const [editMode, setEditMode] = useState(isEditable);
  const [selectedBirthday, setSelectedBirthday] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateEditModalOpen, setDateEditModalOpen] = useState(null);

  const [searchValueExperience, setSearchValueExperience] = useState("");
  const [searchValueVolunteer, setSearchValueVolunteer] = useState("");
  const [searchValueEducation, setSearchValueEducation] = useState("");
  const [searchValueCertifications, setSearchValueCertifications] =
    useState("");
  const [searchValueProjects, setSearchValueProjects] = useState("");

  const loading = useSelector(selectLoading);
  const fileInput5 = useRef();
  const fileInput4 = useRef();
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    if (CVData) return;
    const token = searchParams.get("token");
    if (!token) return;

    CVService.getCVData(token).then(({ data }) => {
      setCandidateData(data);
    });
  }, [searchParams, CVData]);

  const updateCVData = useCallback(
    async (data) => {
      const token = searchParams.get("token");
      if (!token) return;

      await CVService.updateCVData(token, data);
      await CVService.getCVData(token).then(({ data }) => {
        setCandidateData(data);
      });
    },
    [searchParams]
  );

  useEffect(() => {
    fileInput4.current = document.getElementById("fileInput4");
    fileInput4.current.addEventListener("change", async () => {
      const token = searchParams.get("token");
      if (!token) return;

      const selectedFile = fileInput4.current.files[0]; // Get the selected file
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 5);

        const cvData = await CVService.getCVData(token);

        updateCVData({
          files: [
            ...(cvData?.data?.cv?.files || []),
            {
              name: selectedFile.name,
              mimeType: selectedFile.type,
              src: result.data.secure_url,
            },
          ],
        });
        fileInput4.current.files[0] = "";
      } else {
        console.log("No file selected.");
      }
    });
  }, [updateCVData, searchParams]);

  useEffect(() => {
    fileInput5.current = document.getElementById("fileInput5");
    fileInput5.current.addEventListener("change", async () => {
      const selectedFile = fileInput5.current.files[0]; // Get the selected file
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 5);

        updateCVData({
          avatar: result.data.secure_url,
        });
        fileInput5.current.files[0] = "";
      } else {
        console.log("No file selected.");
      }
    });
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleDateChange = useCallback((date) => {
    setSelectedBirthday(date);
  }, []);

  if (!candidateData) return <Skeleton active />;
  if (finishComponent && candidateData?.cv?.submitted) return finishComponent;
  return (
    <>
      <div
        className="mb-5 flex items-center justify-between px-5 fixed top-0 bg-white dark:bg-gray-900 py-4 w-full"
        style={{ zIndex: 9999, visibility: CVData ? "hidden" : "visible" }}
      >
        <div className="mb-5 flex items-center gap-3 ">
          <FaEdit />
          <label>Edit Mode</label>
          <Switch checked={editMode} onChange={(e) => setEditMode(e)} />
          {loading && <Spin />}
        </div>

        <div>
          <Popconfirm
            title="Are you sure to submit your CV to the hiring manager?"
            onConfirm={async () => {
              if (loading) return;
              const token = searchParams.get("token");
              if (!token) return;

              await CVService.submitCV(token);
              await CVService.getCVData(token).then(({ data }) => {
                setCandidateData(data);
              });
            }}
          >
            <button className="rounded-md  px-3 py-2 text-sm font-semibold text-white bg-indigo-500">
              Submit CV
            </button>
          </Popconfirm>
        </div>
      </div>
      <main className="container mx-auto max-w-6xl px-4 py-4">
        <Divider className="mt-10" />

        <div className="gap-5 sm:grid lg:grid-cols-3">
          <div className="space-y-5">
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={
                      candidateData?.cv?.avatar || "/resume/defaultavatar.svg"
                    }
                    alt="Avatar"
                    className="h-14 w-14 cursor-pointer rounded-xl border-2 border-white shadow-sm dark:shadow-gray-400/50  dark:border-night-800"
                    onClick={async () => {
                      if (!editMode) return;
                      fileInput5?.current?.click?.();
                    }}
                  />

                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-400  dark:text-night-50">
                      {candidateData?.candidate?.formData?.firstname ?? ""}{" "}
                      {candidateData?.candidate?.formData?.lastname ?? ""}
                    </div>
                    {editMode ? (
                      <Typography.Paragraph
                        editable={{
                          onChange: (e) => {
                            if (!e) return;
                            updateCVData({
                              position: e,
                            });
                          },
                          tooltip: "Adjust position",
                        }}
                      >
                        {candidateData?.cv?.position}
                      </Typography.Paragraph>
                    ) : (
                      <div className="text-xs text-gray-400 dark:text-night-200">
                        {candidateData?.cv?.position}
                      </div>
                    )}

                    <div className="mt-2 inline-flex flex-wrap gap-3 items-start">
                      {!editMode &&
                        candidateData?.cv?.socialLinks?.map?.((link) => (
                          <a
                            href={link.href}
                            target="_blank"
                            className="cursor-pointer rounded-lg border border-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400 hover:bg-primary-500/20 hover:text-primary-500 dark:border-night-600 dark:hover:bg-primary-500/20"
                          >
                            {link.name}
                          </a>
                        ))}
                      {editMode &&
                        candidateData?.cv?.socialLinks?.map?.((link) => (
                          <div className="flex gap-0 items-start">
                            <a
                              href={link.href}
                              target="_blank"
                              className="cursor-pointer rounded-lg border border-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400 hover:bg-primary-500/20 hover:text-primary-500 dark:border-night-600 dark:hover:bg-primary-500/20"
                            >
                              {link.name}
                            </a>
                            <Typography.Paragraph
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const links = candidateData?.cv?.socialLinks;
                                  links.find((e) => e._id === link._id).name =
                                    e;

                                  updateCVData({
                                    socialLinks: links,
                                  });
                                },
                                tooltip: "Adjust title",
                              }}
                            >
                              {""}
                            </Typography.Paragraph>
                            <Typography.Paragraph
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const links = candidateData?.cv?.socialLinks;
                                  links.find((e) => e._id === link._id).href =
                                    e;

                                  updateCVData({
                                    socialLinks: links,
                                  });
                                },
                                icon: <CiLink />,
                                tooltip: "Adjust link",
                              }}
                            >
                              {""}
                            </Typography.Paragraph>

                            <MdDelete
                              onClick={() => {
                                const links = candidateData?.cv?.socialLinks;

                                updateCVData({
                                  socialLinks: links.filter(
                                    (e) => e._id !== link._id
                                  ),
                                });
                              }}
                              className="cursor-pointer text-red-500 relative top-0.5 start-1"
                            />
                          </div>
                        ))}
                      {editMode &&
                        candidateData?.cv?.socialLinks?.length === 0 && (
                          <Tag>Social Media</Tag>
                        )}
                      {editMode && candidateData?.cv?.socialLinks && (
                        <Typography.Paragraph
                          editable={{
                            onChange: (e) => {
                              updateCVData({
                                socialLinks: [
                                  ...candidateData?.cv?.socialLinks,
                                  { name: e, href: "#" },
                                ],
                              });
                            },
                            icon: <FaPlusCircle />,
                            tooltip: "Add Social Media",
                          }}
                        >
                          {""}
                        </Typography.Paragraph>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className />
            </div>
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                Files
              </h2>
              {candidateData?.cv?.files?.map?.((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-start gap-10"
                >
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-400 text-gray-400 dark:bg-night-700 dark:text-night-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 stroke-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <div className="font-medium   ">
                      <div className="text-sm text-gray-900 dark:text-gray-400  dark:text-night-100 truncate max-w-[160px]">
                        {file?.name}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-night-400 truncate max-w-[160px]">
                        {file?.mimeType}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <a
                      href={file?.src}
                      target="_blank"
                      className="cursor-pointer rounded-full bg-primary-500/20 py-2.5 px-2.5 text-primary-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="stroke- h-5 w-5 hover:animate-pulse"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </a>
                    {editMode && (
                      <MdDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          if (!candidateData?.cv?.files) return;
                          updateCVData({
                            files: candidateData?.cv?.files?.filter?.(
                              (e) => e._id !== file._id
                            ),
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div>
                {editMode && candidateData?.cv?.files && (
                  <button
                    type="button"
                    className="mt-2 rounded-md  px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      fileInput4?.current?.click?.();
                    }}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-400 text-gray-400 dark:bg-night-700 dark:text-night-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 stroke-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <div className="font-medium">
                      <div className="text-sm text-gray-900 dark:text-gray-400  dark:text-night-100">
                        {candidateData?.candidate?.formData?.email}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-night-400">
                        Email
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-400 text-gray-400 dark:bg-night-700 dark:text-night-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 stroke-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                        />
                      </svg>
                    </div>
                    <div className="font-medium">
                      <div className="text-sm text-gray-900 dark:text-gray-400  dark:text-night-100">
                        {candidateData?.candidate?.formData?.phone}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-night-400">
                        Phone
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-400 text-gray-400 dark:bg-night-700 dark:text-night-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 stroke-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                        />
                      </svg>
                    </div>
                    <div className="font-medium">
                      <div className="text-sm text-gray-900 dark:text-gray-400  dark:text-night-100 flex items-start gap-3">
                        {moment(candidateData?.cv?.birthday).format(
                          "DD MMM YYYY"
                        )}
                        {editMode && (
                          <button onClick={openModal}>
                            <FaEdit />
                          </button>
                        )}
                        <Modal
                          wrapClassName={`${darkMode ? "dark" : ""}`}
                          isOpen={editMode && modalIsOpen}
                          onRequestClose={closeModal}
                          contentLabel="Select Birthday"
                        >
                          <div className="text-center flex items-center justify-center w-full h-full">
                            <div className="text-left">
                              <h1 className="mb-2">Select your birthday</h1>
                              <div>
                                <DatePicker
                                  className="dark:bg-gray-900"
                                  selected={
                                    selectedBirthday ??
                                    new Date(candidateData?.cv?.birthday)
                                  }
                                  onChange={handleDateChange}
                                  maxDate={new Date()}
                                />
                              </div>
                              <div>
                                <button
                                  className="mt-2 px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                                  onClick={() => {
                                    if (selectedBirthday)
                                      updateCVData({
                                        birthday: selectedBirthday,
                                      });
                                    setSelectedBirthday(null);
                                    closeModal();
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </div>

                      <div className="text-xs text-gray-400 dark:text-night-400">
                        {moment().diff(
                          moment(candidateData?.cv?.birthday),
                          "years"
                        )}{" "}
                        years old
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                Skills
              </h2>
              {!editMode && (
                <div className="-m-2 flex flex-wrap">
                  {candidateData?.cv?.skills?.map?.((skill, i) => (
                    <Tag key={i}>
                      {skill.length > 20 ? `${skill.slice(0, 20)}...` : skill}
                    </Tag>
                  ))}
                </div>
              )}
              {editMode && (
                <div>
                  <EditTags
                    tags={candidateData?.cv?.skills}
                    setTags={(skills) =>
                      updateCVData({
                        skills,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {candidateData?.cv?.languages?.map?.((language) => (
                  <div
                    key={language._id}
                    className="flex min-w-[180px] cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-4 py-2 hover:bg-gray-100 dark:bg-gray-400 dark:border-night-700 dark:hover:bg-night-700"
                  >
                    <ReactCountryFlag
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm dark:shadow-gray-400/50  dark:border-night-700"
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      svg
                      cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                      cdnSuffix="svg"
                      countryCode={language.codeCountry}
                    />
                    <div className="font-medium">
                      <div className="text-xs text-gray-600 dark:text-night-200">
                        {language?.language}
                      </div>

                      <div className="flex items-start gap-2">
                        {editMode ? (
                          <Typography.Paragraph
                            editable={{
                              onChange: (e) => {
                                if (!e) return;
                                const languages = candidateData?.cv?.languages;
                                languages.find(
                                  (e) => e._id === language._id
                                ).level = e;

                                updateCVData({
                                  languages,
                                });
                              },
                              tooltip: "Change fluency",
                            }}
                          >
                            {language?.level?.length > 20
                              ? `${language?.level?.slice?.(0, 20)}...`
                              : language?.level}
                          </Typography.Paragraph>
                        ) : (
                          <div className="text-xs text-gray-400 dark:text-night-400">
                            {language?.level?.length > 20
                              ? `${language?.level?.slice?.(0, 20)}...`
                              : language?.level}
                          </div>
                        )}

                        {editMode && (
                          <MdDelete
                            onClick={() => {
                              const languages = candidateData?.cv?.languages;

                              updateCVData({
                                languages: languages.filter(
                                  (e) => e._id !== language._id
                                ),
                              });
                            }}
                            className="cursor-pointer text-red-500 relative top-0.5 start-1"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editMode && (
                <Select
                  mode="multiple"
                  className="mt-2"
                  style={{ width: "100%" }}
                  placeholder="Add Language"
                  optionLabelProp="label"
                  onChange={(e) => {
                    if (!e?.[0]) return;

                    updateCVData({
                      languages: [
                        ...candidateData?.cv?.languages,
                        { ...countryLanguages[e[0]], level: "Native" },
                      ],
                    });
                  }}
                  value={[]}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {countryLanguages.map((lang, i) => (
                    <Option key={i} value={i} label={`${lang.language}`}>
                      <div>
                        <Space>
                          <span>{lang.language}</span>
                          <ReactCountryFlag
                            svg
                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                            cdnSuffix="svg"
                            countryCode={lang.codeCountry}
                          />
                        </Space>
                      </div>
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-5 sm:mt-0 lg:col-span-2">
            <div className="card">
              <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                About me
              </h2>

              {editMode ? (
                <Typography.Paragraph
                  editable={{
                    onChange: (e) => {
                      if (!e) return;
                      updateCVData({
                        aboutMe: e,
                      });
                    },
                    tooltip: "Write something about yourself",
                  }}
                >
                  {candidateData?.cv?.aboutMe}
                </Typography.Paragraph>
              ) : (
                <p className="mb-5 text-sm text-gray-600 dark:text-night-200">
                  {candidateData?.cv?.aboutMe}
                </p>
              )}
            </div>

            <div className="card">
              {(editMode || candidateData?.cv?.experience?.length > 0) && (
                <h2 className="mb-4 text-lg font-semibold dark:text-night-50">
                  Experience
                </h2>
              )}
              {candidateData?.cv?.experience?.map?.((experience) => (
                <div key={experience._id} className="mb-5 flex items-start">
                  <GoOrganization className="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:shadow-gray-400/50  dark:border-night-700" />

                  <div className="ml-3 w-full space-y-5">
                    <div className="justify-between sm:flex">
                      <div className="space-y-2">
                        <div className="font-medium dark:text-night-50">
                          {editMode ? (
                            <Typography.Paragraph
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const experiences =
                                    candidateData?.cv?.experience;
                                  experiences.find(
                                    (e) => e._id === experience._id
                                  ).companyName = e;

                                  updateCVData({
                                    experience: experiences,
                                  });
                                },
                                tooltip: "Adjust company name",
                              }}
                            >
                              {experience?.companyName?.length > 30
                                ? `${experience?.companyName.slice(0, 30)}...`
                                : experience?.companyName}
                            </Typography.Paragraph>
                          ) : (
                            <>
                              {experience?.companyName?.length > 30
                                ? `${experience?.companyName.slice(0, 30)}...`
                                : experience?.companyName}
                            </>
                          )}
                        </div>
                        <div className="space-y-1 sm:flex sm:space-x-5">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                              />
                            </svg>
                            <span>
                              {editMode ? (
                                <Typography.Paragraph
                                  style={{ position: "relative", top: 6 }}
                                  editable={{
                                    onChange: (e) => {
                                      if (!e) return;
                                      const experiences =
                                        candidateData?.cv?.experience;
                                      experiences.find(
                                        (e) => e._id === experience._id
                                      ).position = e;

                                      updateCVData({
                                        experience: experiences,
                                      });
                                    },
                                    tooltip: "Adjust position",
                                  }}
                                >
                                  {experience?.position?.length > 30
                                    ? `${experience?.position.slice(0, 30)}...`
                                    : experience?.position}
                                </Typography.Paragraph>
                              ) : (
                                <>
                                  {experience?.position?.length > 30
                                    ? `${experience?.position.slice(0, 30)}...`
                                    : experience?.position}
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            <span>
                              {editMode ? (
                                <Typography.Paragraph
                                  style={{ position: "relative", top: 6 }}
                                  editable={{
                                    onChange: (e) => {
                                      if (!e) return;
                                      const experiences =
                                        candidateData?.cv?.experience;
                                      experiences.find(
                                        (e) => e._id === experience._id
                                      ).location = e;

                                      updateCVData({
                                        experience: experiences,
                                      });
                                    },
                                    tooltip: "Adjust location",
                                  }}
                                >
                                  {experience?.location?.length > 20
                                    ? `${experience?.location.slice(0, 20)}...`
                                    : experience?.location}
                                </Typography.Paragraph>
                              ) : (
                                <>
                                  {experience?.location?.length > 20
                                    ? `${experience?.location.slice(0, 20)}...`
                                    : experience?.location}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-between space-y-1 sm:block sm:text-right">
                        <div className="order-last inline-flex items-center rounded-lg bg-primary-500/20 px-2 py-1 text-xs font-medium text-primary-500">
                          {editMode ? (
                            <Typography.Paragraph
                              style={{ position: "relative", top: 6 }}
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const experiences =
                                    candidateData?.cv?.experience;
                                  experiences.find(
                                    (e) => e._id === experience._id
                                  ).contractType = e;

                                  updateCVData({
                                    experience: experiences,
                                  });
                                },
                                tooltip: "Adjust engagement type",
                              }}
                            >
                              {experience?.contractType?.length > 20
                                ? `${experience?.contractType.slice(0, 20)}...`
                                : experience?.contractType}
                            </Typography.Paragraph>
                          ) : (
                            <>
                              {experience?.contractType?.length > 20
                                ? `${experience?.contractType.slice(0, 20)}...`
                                : experience?.contractType}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                          </svg>
                          <span>
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "starting",
                                  ofYourXAt: "experience",
                                  organization: experience?.companyName,
                                  experience: "experience",
                                  _id: experience?._id,
                                  start: "start",
                                });
                              }}
                            >
                              {moment(experience?.start ?? "").format(
                                "MMM YYYY"
                              )}
                            </span>{" "}
                            -{" "}
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "ending",
                                  ofYourXAt: "experience",
                                  organization: experience?.companyName,
                                  experience: "experience",
                                  _id: experience?._id,
                                  start: "end",
                                });
                              }}
                            >
                              {experience?.end
                                ? moment(experience?.end).format("MMM YYYY")
                                : "Current"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-night-300">
                      {editMode ? (
                        <Typography.Paragraph
                          style={{ position: "relative", top: 6 }}
                          editable={{
                            onChange: (e) => {
                              if (!e) return;
                              const experiences = candidateData?.cv?.experience;
                              experiences.find(
                                (e) => e._id === experience._id
                              ).description = e;

                              updateCVData({
                                experience: experiences,
                              });
                            },
                            tooltip: "Adjust description",
                          }}
                        >
                          {experience?.description}
                        </Typography.Paragraph>
                      ) : (
                        <>{experience?.description}</>
                      )}
                    </p>

                    {editMode && (
                      <Space>
                        <Popconfirm
                          title="Are you sure to delete?"
                          onConfirm={async () => {
                            const experiences = candidateData?.cv?.experience;

                            await updateCVData({
                              experience: experiences.filter(
                                (e) => e._id !== experience._id
                              ),
                            });
                          }}
                        >
                          <MdDelete
                            size={25}
                            className="cursor-pointer text-red-500 relative"
                          />
                        </Popconfirm>

                        <IoIosArrowDropupCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const experiences = [
                              ...candidateData?.cv?.experience,
                            ]; // Create a shallow copy of the array.
                            const thisExperienceIdx = experiences.findIndex(
                              (e) => e._id === experience._id
                            );

                            if (thisExperienceIdx > 0) {
                              // Check if the experience is not already at the top.
                              // Swap the current experience with the one above it.
                              [
                                experiences[thisExperienceIdx],
                                experiences[thisExperienceIdx - 1],
                              ] = [
                                experiences[thisExperienceIdx - 1],
                                experiences[thisExperienceIdx],
                              ];

                              // Update the experience array in candidateData.
                              await updateCVData({
                                experience: experiences,
                              });
                            }
                          }}
                        />
                        <IoIosArrowDropdownCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const experiences = [
                              ...candidateData?.cv?.experience,
                            ]; // Create a shallow copy of the array.
                            const thisExperienceIdx = experiences.findIndex(
                              (e) => e._id === experience._id
                            );

                            if (thisExperienceIdx < experiences.length - 1) {
                              // Check if the experience is not already at the top.
                              // Swap the current experience with the one below it.
                              [
                                experiences[thisExperienceIdx],
                                experiences[thisExperienceIdx + 1],
                              ] = [
                                experiences[thisExperienceIdx + 1],
                                experiences[thisExperienceIdx],
                              ];

                              // Update the experience array in candidateData.
                              await updateCVData({
                                experience: experiences,
                              });
                            }
                          }}
                        />
                      </Space>
                    )}

                    <div className="border-b border-dashed border-gray-200 dark:border-gray-600  dark:border-night-600" />
                  </div>
                </div>
              ))}

              {editMode && (
                <>
                  <h2 className="text-md font-semibold">Add experience</h2>
                  <Search
                    enterButton={<IoIosAdd />}
                    placeholder="Type the name of the company"
                    value={searchValueExperience}
                    onChange={(e) => setSearchValueExperience(e.target.value)}
                    onSearch={async (e) => {
                      await updateCVData({
                        experience: [
                          ...candidateData?.cv?.experience,
                          {
                            companyName: e,
                            position: candidateData?.cv?.position,
                            location: "Remote",
                            start: new Date(),
                            end: null,
                            contractType: "Fulltime",
                            description:
                              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius",
                          },
                        ],
                      });
                      setSearchValueExperience("");
                    }}
                  />
                  <Divider />
                </>
              )}
            </div>

            <Modal
              wrapClassName={`${darkMode ? "dark" : ""}`}
              isOpen={editMode && dateEditModalOpen}
              onRequestClose={(e) => setDateEditModalOpen(false)}
              contentLabel="Select Date"
            >
              <div className="text-center flex items-center justify-center w-full h-full">
                <div className="text-left">
                  <h1 className="mb-2">
                    Select {dateEditModalOpen?.selectXDate} date of your{" "}
                    {dateEditModalOpen?.ofYourXAt}{" "}
                    {dateEditModalOpen?.at ?? "at"}{" "}
                    {dateEditModalOpen?.organization}
                  </h1>

                  <div>
                    <DatePicker
                      className="dark:bg-gray-900"
                      selected={
                        selectedDate === false
                          ? new Date()
                          : selectedDate
                          ? selectedDate
                          : candidateData?.cv?.[
                              dateEditModalOpen?.experience
                            ]?.find?.(
                              (e) => e._id === dateEditModalOpen?._id
                            )?.[dateEditModalOpen?.start]
                          ? new Date(
                              candidateData?.cv?.[
                                dateEditModalOpen?.experience
                              ]?.find?.(
                                (e) => e._id === dateEditModalOpen?._id
                              )?.[dateEditModalOpen?.start]
                            )
                          : new Date()
                      }
                      onChange={(e) => setSelectedDate(e)}
                      maxDate={new Date()}
                    />
                  </div>
                  {["ending", "expiry"].includes(
                    dateEditModalOpen?.selectXDate
                  ) && (
                    <div className="mt-2">
                      <Space>
                        <span>
                          {dateEditModalOpen?.selectXDate === "ending"
                            ? "Current"
                            : "Forever"}
                        </span>
                        <Switch
                          checked={
                            selectedDate === false
                              ? true
                              : selectedDate
                              ? false
                              : candidateData?.cv?.[
                                  dateEditModalOpen?.experience
                                ]?.find?.(
                                  (e) => e._id === dateEditModalOpen?._id
                                )?.[dateEditModalOpen?.start]
                              ? false
                              : true
                          }
                          onChange={(e) => {
                            if (e) setSelectedDate(false);
                            else setSelectedDate(new Date());
                          }}
                        />
                      </Space>
                    </div>
                  )}
                  <div>
                    <button
                      className="mt-2 px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                      onClick={() => {
                        if (selectedDate !== null) {
                          const items =
                            candidateData?.cv?.[dateEditModalOpen?.experience];
                          const item = items?.find?.(
                            (e) => e._id === dateEditModalOpen?._id
                          );
                          item[dateEditModalOpen?.start] =
                            selectedDate === false ? null : selectedDate;

                          updateCVData({
                            [`${dateEditModalOpen?.experience}`]: items,
                          });
                        }
                        setSelectedDate(null);
                        setDateEditModalOpen(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Modal>

            <div className="card">
              {(editMode || candidateData?.cv?.volunteerWork?.length > 0) && (
                <h2 className="mb-5 text-lg font-semibold dark:text-night-50">
                  Volunteer work
                </h2>
              )}
              {candidateData?.cv?.volunteerWork?.map?.((volunteerWork) => (
                <div key={volunteerWork._id} className="mb-5 flex items-start">
                  <VscOrganization className="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:shadow-gray-400/50  dark:border-night-700" />

                  <div className="ml-3 w-full space-y-5">
                    <div className="justify-between sm:flex">
                      <div className="space-y-2">
                        <div className="font-medium dark:text-night-50">
                          {editMode ? (
                            <Typography.Paragraph
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const volunteerWorks =
                                    candidateData?.cv?.volunteerWork;
                                  volunteerWorks.find(
                                    (e) => e._id === volunteerWork._id
                                  ).companyName = e;

                                  updateCVData({
                                    volunteerWork: volunteerWorks,
                                  });
                                },
                                tooltip: "Adjust organization name",
                              }}
                            >
                              {volunteerWork?.companyName?.length > 30
                                ? `${volunteerWork?.companyName.slice(
                                    0,
                                    30
                                  )}...`
                                : volunteerWork?.companyName}
                            </Typography.Paragraph>
                          ) : (
                            <>
                              {volunteerWork?.companyName?.length > 30
                                ? `${volunteerWork?.companyName.slice(
                                    0,
                                    30
                                  )}...`
                                : volunteerWork?.companyName}
                            </>
                          )}
                        </div>
                        <div className="space-y-1 sm:flex sm:space-x-5">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                              />
                            </svg>
                            <span>
                              {editMode ? (
                                <Typography.Paragraph
                                  style={{ position: "relative", top: 6 }}
                                  editable={{
                                    onChange: (e) => {
                                      if (!e) return;
                                      const volunteerWorks =
                                        candidateData?.cv?.volunteerWork;
                                      volunteerWorks.find(
                                        (e) => e._id === volunteerWork._id
                                      ).position = e;

                                      updateCVData({
                                        volunteerWork: volunteerWorks,
                                      });
                                    },
                                    tooltip: "Adjust position",
                                  }}
                                >
                                  {volunteerWork?.position?.length > 20
                                    ? `${volunteerWork?.position.slice(
                                        0,
                                        20
                                      )}...`
                                    : volunteerWork?.position}
                                </Typography.Paragraph>
                              ) : (
                                <>
                                  {volunteerWork?.position?.length > 20
                                    ? `${volunteerWork?.position.slice(
                                        0,
                                        20
                                      )}...`
                                    : volunteerWork?.position}
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            <span>
                              {editMode ? (
                                <Typography.Paragraph
                                  style={{ position: "relative", top: 6 }}
                                  editable={{
                                    onChange: (e) => {
                                      if (!e) return;
                                      const volunteerWorks =
                                        candidateData?.cv?.volunteerWork;
                                      volunteerWorks.find(
                                        (e) => e._id === volunteerWork._id
                                      ).location = e;

                                      updateCVData({
                                        volunteerWork: volunteerWorks,
                                      });
                                    },
                                    tooltip: "Adjust location",
                                  }}
                                >
                                  {volunteerWork?.location?.length > 20
                                    ? `${volunteerWork?.location.slice(
                                        0,
                                        20
                                      )}...`
                                    : volunteerWork?.location}
                                </Typography.Paragraph>
                              ) : (
                                <>
                                  {volunteerWork?.location?.length > 20
                                    ? `${volunteerWork?.location.slice(
                                        0,
                                        20
                                      )}...`
                                    : volunteerWork?.location}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-between space-y-1 sm:block sm:text-right">
                        <div className="order-last inline-flex items-center rounded-lg bg-primary-500/20 px-2 py-1 text-xs font-medium text-primary-500">
                          {editMode ? (
                            <Typography.Paragraph
                              style={{ position: "relative", top: 6 }}
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const volunteerWorks =
                                    candidateData?.cv?.volunteerWork;
                                  volunteerWorks.find(
                                    (e) => e._id === volunteerWork._id
                                  ).contractType = e;

                                  updateCVData({
                                    volunteerWork: volunteerWorks,
                                  });
                                },
                                tooltip: "Adjust engagement type",
                              }}
                            >
                              {volunteerWork?.contractType?.length > 20
                                ? `${volunteerWork?.contractType.slice(
                                    0,
                                    20
                                  )}...`
                                : volunteerWork?.contractType}
                            </Typography.Paragraph>
                          ) : (
                            <>
                              {volunteerWork?.contractType?.length > 20
                                ? `${volunteerWork?.contractType.slice(
                                    0,
                                    20
                                  )}...`
                                : volunteerWork?.contractType}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                          </svg>
                          <span>
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "starting",
                                  ofYourXAt: "volunteerWork",
                                  organization: volunteerWork?.companyName,
                                  experience: "volunteerWork",
                                  _id: volunteerWork?._id,
                                  start: "start",
                                });
                              }}
                            >
                              {moment(volunteerWork?.start ?? "").format(
                                "MMM YYYY"
                              )}
                            </span>{" "}
                            -{" "}
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "ending",
                                  ofYourXAt: "volunteerWork",
                                  organization: volunteerWork?.companyName,
                                  experience: "volunteerWork",
                                  _id: volunteerWork?._id,
                                  start: "end",
                                });
                              }}
                            >
                              {volunteerWork?.end
                                ? moment(volunteerWork?.end).format("MMM YYYY")
                                : "Current"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-night-300">
                      {editMode ? (
                        <Typography.Paragraph
                          style={{ position: "relative", top: 6 }}
                          editable={{
                            onChange: (e) => {
                              if (!e) return;
                              const volunteerWorks =
                                candidateData?.cv?.volunteerWork;
                              volunteerWorks.find(
                                (e) => e._id === volunteerWork._id
                              ).description = e;

                              updateCVData({
                                volunteerWork: volunteerWorks,
                              });
                            },
                            tooltip: "Adjust description",
                          }}
                        >
                          {volunteerWork?.description}
                        </Typography.Paragraph>
                      ) : (
                        <>{volunteerWork?.description}</>
                      )}
                    </p>

                    {editMode && (
                      <Space>
                        <Popconfirm
                          title="Are you sure to delete?"
                          onConfirm={async () => {
                            const volunteerWorks =
                              candidateData?.cv?.volunteerWork;

                            await updateCVData({
                              volunteerWork: volunteerWorks.filter(
                                (e) => e._id !== volunteerWork._id
                              ),
                            });
                          }}
                        >
                          <MdDelete
                            size={25}
                            className="cursor-pointer text-red-500 relative"
                          />
                        </Popconfirm>

                        <IoIosArrowDropupCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const volunteerWorks = [
                              ...candidateData?.cv?.volunteerWork,
                            ]; // Create a shallow copy of the array.
                            const thisvolunteerWorkIdx =
                              volunteerWorks.findIndex(
                                (e) => e._id === volunteerWork._id
                              );

                            if (thisvolunteerWorkIdx > 0) {
                              // Check if the volunteerWork is not already at the top.
                              // Swap the current volunteerWork with the one above it.
                              [
                                volunteerWorks[thisvolunteerWorkIdx],
                                volunteerWorks[thisvolunteerWorkIdx - 1],
                              ] = [
                                volunteerWorks[thisvolunteerWorkIdx - 1],
                                volunteerWorks[thisvolunteerWorkIdx],
                              ];

                              // Update the volunteerWork array in candidateData.
                              await updateCVData({
                                volunteerWork: volunteerWorks,
                              });
                            }
                          }}
                        />
                        <IoIosArrowDropdownCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const volunteerWorks = [
                              ...candidateData?.cv?.volunteerWork,
                            ]; // Create a shallow copy of the array.
                            const thisvolunteerWorkIdx =
                              volunteerWorks.findIndex(
                                (e) => e._id === volunteerWork._id
                              );

                            if (
                              thisvolunteerWorkIdx <
                              volunteerWorks.length - 1
                            ) {
                              // Check if the volunteerWork is not already at the top.
                              // Swap the current volunteerWork with the one below it.
                              [
                                volunteerWorks[thisvolunteerWorkIdx],
                                volunteerWorks[thisvolunteerWorkIdx + 1],
                              ] = [
                                volunteerWorks[thisvolunteerWorkIdx + 1],
                                volunteerWorks[thisvolunteerWorkIdx],
                              ];

                              // Update the volunteerWork array in candidateData.
                              await updateCVData({
                                volunteerWork: volunteerWorks,
                              });
                            }
                          }}
                        />
                      </Space>
                    )}

                    <div className="border-b border-dashed border-gray-200 dark:border-gray-600  dark:border-night-600" />
                  </div>
                </div>
              ))}

              {editMode && (
                <>
                  <h2 className="text-md font-semibold">Add volunteer work</h2>
                  <Search
                    enterButton={<IoIosAdd />}
                    placeholder="Type the name of the organization"
                    value={searchValueVolunteer}
                    onChange={(e) => setSearchValueVolunteer(e.target.value)}
                    onSearch={async (e) => {
                      await updateCVData({
                        volunteerWork: [
                          ...candidateData?.cv?.volunteerWork,
                          {
                            companyName: e,
                            position: candidateData?.cv?.position,
                            location: "Remote",
                            start: new Date(),
                            end: null,
                            contractType: "Fulltime",
                            description:
                              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius",
                          },
                        ],
                      });
                      setSearchValueVolunteer("");
                    }}
                  />
                  <Divider />
                </>
              )}
            </div>

            <div>
              <div className="card">
                {(editMode || candidateData?.cv?.academic?.length > 0) && (
                  <h2 className="mb-5 text-lg font-semibold dark:text-night-50">
                    Academic Career
                  </h2>
                )}

                {candidateData?.cv?.academic?.map?.((academic) => (
                  <div key={academic._id} className="mb-5 flex items-start">
                    <FaUniversity className="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:shadow-gray-400/50  dark:border-night-700" />

                    <div className="ml-3 w-full space-y-5">
                      <div className="justify-between sm:flex">
                        <div className="space-y-2">
                          <div className="font-medium dark:text-night-50">
                            {editMode ? (
                              <Typography.Paragraph
                                editable={{
                                  onChange: (e) => {
                                    if (!e) return;
                                    const academics =
                                      candidateData?.cv?.academic;
                                    academics.find(
                                      (e) => e._id === academic._id
                                    ).companyName = e;

                                    updateCVData({
                                      academic: academics,
                                    });
                                  },
                                  tooltip: "Adjust organization name",
                                }}
                              >
                                {academic?.companyName?.length > 30
                                  ? `${academic?.companyName.slice(0, 30)}...`
                                  : academic?.companyName}
                              </Typography.Paragraph>
                            ) : (
                              <>
                                {academic?.companyName?.length > 30
                                  ? `${academic?.companyName.slice(0, 30)}...`
                                  : academic?.companyName}
                              </>
                            )}
                          </div>

                          <div className="flex space-x-5">
                            <div className="flex items-start gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                              <span className="max-w-sm">
                                {editMode ? (
                                  <Typography.Paragraph
                                    style={{ position: "relative", top: 6 }}
                                    editable={{
                                      onChange: (e) => {
                                        if (!e) return;
                                        const academics =
                                          candidateData?.cv?.academic;
                                        academics.find(
                                          (e) => e._id === academic._id
                                        ).position = e;

                                        updateCVData({
                                          academic: academics,
                                        });
                                      },
                                      tooltip: "Adjust study field",
                                    }}
                                  >
                                    {academic?.position?.length > 30
                                      ? `${academic?.position.slice(0, 30)}...`
                                      : academic?.position}
                                  </Typography.Paragraph>
                                ) : (
                                  <>
                                    {academic?.position?.length > 30
                                      ? `${academic?.position.slice(0, 30)}...`
                                      : academic?.position}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start justify-between space-y-1 sm:block sm:text-right">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                              />
                            </svg>
                            <span>
                              <span
                                className={`${
                                  editMode ? "cursor-pointer" : ""
                                }`}
                                onClick={(e) => {
                                  if (!editMode) return;
                                  setDateEditModalOpen({
                                    selectXDate: "starting",
                                    ofYourXAt: "academic",
                                    organization: academic?.companyName,
                                    experience: "academic",
                                    _id: academic?._id,
                                    start: "start",
                                  });
                                }}
                              >
                                {moment(academic?.start ?? "").format(
                                  "MMM YYYY"
                                )}
                              </span>{" "}
                              -{" "}
                              <span
                                className={`${
                                  editMode ? "cursor-pointer" : ""
                                }`}
                                onClick={(e) => {
                                  if (!editMode) return;
                                  setDateEditModalOpen({
                                    selectXDate: "ending",
                                    ofYourXAt: "academic",
                                    organization: academic?.companyName,
                                    experience: "academic",
                                    _id: academic?._id,
                                    start: "end",
                                  });
                                }}
                              >
                                {academic?.end
                                  ? moment(academic?.end).format("MMM YYYY")
                                  : "Current"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {editMode && (
                        <Space>
                          <Popconfirm
                            title="Are you sure to delete?"
                            onConfirm={async () => {
                              const academics = candidateData?.cv?.academic;

                              await updateCVData({
                                academic: academics.filter(
                                  (e) => e._id !== academic._id
                                ),
                              });
                            }}
                          >
                            <MdDelete
                              size={25}
                              className="cursor-pointer text-red-500 relative"
                            />
                          </Popconfirm>

                          <IoIosArrowDropupCircle
                            size={25}
                            className="cursor-pointer"
                            onClick={async () => {
                              const academics = [
                                ...candidateData?.cv?.academic,
                              ]; // Create a shallow copy of the array.
                              const thisacademicIdx = academics.findIndex(
                                (e) => e._id === academic._id
                              );

                              if (thisacademicIdx > 0) {
                                // Check if the academic is not already at the top.
                                // Swap the current academic with the one above it.
                                [
                                  academics[thisacademicIdx],
                                  academics[thisacademicIdx - 1],
                                ] = [
                                  academics[thisacademicIdx - 1],
                                  academics[thisacademicIdx],
                                ];

                                // Update the academic array in candidateData.
                                await updateCVData({
                                  academic: academics,
                                });
                              }
                            }}
                          />
                          <IoIosArrowDropdownCircle
                            size={25}
                            className="cursor-pointer"
                            onClick={async () => {
                              const academics = [
                                ...candidateData?.cv?.academic,
                              ]; // Create a shallow copy of the array.
                              const thisacademicIdx = academics.findIndex(
                                (e) => e._id === academic._id
                              );

                              if (thisacademicIdx < academics.length - 1) {
                                // Check if the academic is not already at the top.
                                // Swap the current academic with the one below it.
                                [
                                  academics[thisacademicIdx],
                                  academics[thisacademicIdx + 1],
                                ] = [
                                  academics[thisacademicIdx + 1],
                                  academics[thisacademicIdx],
                                ];

                                // Update the academic array in candidateData.
                                await updateCVData({
                                  academic: academics,
                                });
                              }
                            }}
                          />
                        </Space>
                      )}

                      <div className="border-b border-dashed border-gray-200 dark:border-gray-600  dark:border-night-600" />
                    </div>
                  </div>
                ))}

                {editMode && (
                  <>
                    <h2 className="text-md font-semibold">Add education</h2>
                    <Search
                      enterButton={<IoIosAdd />}
                      placeholder="Type the name of the university"
                      value={searchValueEducation}
                      onChange={(e) => setSearchValueEducation(e.target.value)}
                      onSearch={async (e) => {
                        await updateCVData({
                          academic: [
                            ...candidateData?.cv?.academic,
                            {
                              companyName: e,
                              position: "",
                              location: "",
                              start: new Date(),
                              end: null,
                            },
                          ],
                        });
                        setSearchValueEducation("");
                      }}
                    />
                    <Divider />
                  </>
                )}
              </div>
              <div className="card">
                {(editMode || candidateData?.cv?.certification?.length > 0) && (
                  <h2 className="mb-5 text-lg font-semibold dark:text-night-50">
                    Certifications
                  </h2>
                )}
                {candidateData?.cv?.certification?.map?.((certification) => (
                  <div
                    key={certification._id}
                    className="mb-5 flex items-start"
                  >
                    <TbCertificate className="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:shadow-gray-400/50  dark:border-night-700" />

                    <div className="ml-3 w-full space-y-5">
                      <div className="justify-between sm:flex">
                        <div className="space-y-2">
                          <div className="font-medium dark:text-night-50">
                            {editMode ? (
                              <Typography.Paragraph
                                editable={{
                                  onChange: (e) => {
                                    if (!e) return;
                                    const certifications =
                                      candidateData?.cv?.certification;
                                    certifications.find(
                                      (e) => e._id === certification._id
                                    ).companyName = e;

                                    updateCVData({
                                      certification: certifications,
                                    });
                                  },
                                  tooltip: "Adjust organization name",
                                }}
                              >
                                {certification?.companyName?.length > 30
                                  ? `${certification?.companyName.slice(
                                      0,
                                      30
                                    )}...`
                                  : certification?.companyName}
                              </Typography.Paragraph>
                            ) : (
                              <>
                                {certification?.companyName?.length > 30
                                  ? `${certification?.companyName.slice(
                                      0,
                                      30
                                    )}...`
                                  : certification?.companyName}
                              </>
                            )}
                          </div>

                          <div className="flex space-x-5">
                            <div className="flex items-start gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                              <span className="max-w-sm text-sm font-medium">
                                {editMode ? (
                                  <Typography.Paragraph
                                    style={{ position: "relative", top: 6 }}
                                    editable={{
                                      onChange: (e) => {
                                        if (!e) return;
                                        const certifications =
                                          candidateData?.cv?.certification;
                                        certifications.find(
                                          (e) => e._id === certification._id
                                        ).position = e;

                                        updateCVData({
                                          certification: certifications,
                                        });
                                      },
                                      tooltip: "Adjust certification name",
                                    }}
                                  >
                                    {certification?.position}
                                  </Typography.Paragraph>
                                ) : (
                                  <>{certification?.position}</>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-gray-400 flex gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                              />
                            </svg>
                            <span>
                              <span
                                className={`${
                                  editMode ? "cursor-pointer" : ""
                                }`}
                                onClick={(e) => {
                                  if (!editMode) return;
                                  setDateEditModalOpen({
                                    selectXDate: "assignment",
                                    ofYourXAt: "certification",
                                    organization: certification?.companyName,
                                    experience: "certification",
                                    _id: certification?._id,
                                    start: "start",
                                  });
                                }}
                              >
                                {"Certified Date: " +
                                  moment(certification?.start ?? "").format(
                                    "MMM YYYY"
                                  )}
                              </span>{" "}
                              -{" "}
                              <span
                                className={`${
                                  editMode ? "cursor-pointer" : ""
                                }`}
                                onClick={(e) => {
                                  if (!editMode) return;
                                  setDateEditModalOpen({
                                    selectXDate: "expiry",
                                    ofYourXAt: "certification",
                                    organization: certification?.companyName,
                                    experience: "certification",
                                    _id: certification?._id,
                                    start: "end",
                                  });
                                }}
                              >
                                {certification?.end
                                  ? "Expires: " +
                                    moment(certification?.end).format(
                                      "MMM YYYY"
                                    )
                                  : "Forever"}
                              </span>
                            </span>
                          </div>
                        </div>
                        <Space>
                          {certification?.src && (
                            <a
                              href={certification?.src}
                              target="_blank"
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-2 py-2 text-xs text-gray-400 hover:bg-gray-100 dark:bg-gray-400 dark:border-night-700 dark:text-night-300 dark:hover:bg-night-700 h-8"
                            >
                              <span>Credential</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="h-4 w-4 stroke-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            </a>
                          )}
                          {editMode && (
                            <Typography.Paragraph
                              style={{ position: "relative", top: 6 }}
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const certifications =
                                    candidateData?.cv?.certification;
                                  certifications.find(
                                    (e) => e._id === certification._id
                                  ).src = e;

                                  updateCVData({
                                    certification: certifications,
                                  });
                                },
                                icon: <RiLinkUnlinkM />,
                                tooltip: "Adjust certification link",
                              }}
                            >
                              {""}
                            </Typography.Paragraph>
                          )}
                        </Space>
                      </div>

                      {editMode && (
                        <Space>
                          <Popconfirm
                            title="Are you sure to delete?"
                            onConfirm={async () => {
                              const certifications =
                                candidateData?.cv?.certification;

                              await updateCVData({
                                certification: certifications.filter(
                                  (e) => e._id !== certification._id
                                ),
                              });
                            }}
                          >
                            <MdDelete
                              size={25}
                              className="cursor-pointer text-red-500 relative"
                            />
                          </Popconfirm>

                          <IoIosArrowDropupCircle
                            size={25}
                            className="cursor-pointer"
                            onClick={async () => {
                              const certifications = [
                                ...candidateData?.cv?.certification,
                              ]; // Create a shallow copy of the array.
                              const thiscertificationIdx =
                                certifications.findIndex(
                                  (e) => e._id === certification._id
                                );

                              if (thiscertificationIdx > 0) {
                                // Check if the certification is not already at the top.
                                // Swap the current certification with the one above it.
                                [
                                  certifications[thiscertificationIdx],
                                  certifications[thiscertificationIdx - 1],
                                ] = [
                                  certifications[thiscertificationIdx - 1],
                                  certifications[thiscertificationIdx],
                                ];

                                // Update the certification array in candidateData.
                                await updateCVData({
                                  certification: certifications,
                                });
                              }
                            }}
                          />
                          <IoIosArrowDropdownCircle
                            size={25}
                            className="cursor-pointer"
                            onClick={async () => {
                              const certifications = [
                                ...candidateData?.cv?.certification,
                              ]; // Create a shallow copy of the array.
                              const thiscertificationIdx =
                                certifications.findIndex(
                                  (e) => e._id === certification._id
                                );

                              if (
                                thiscertificationIdx <
                                certifications.length - 1
                              ) {
                                // Check if the certification is not already at the top.
                                // Swap the current certification with the one below it.
                                [
                                  certifications[thiscertificationIdx],
                                  certifications[thiscertificationIdx + 1],
                                ] = [
                                  certifications[thiscertificationIdx + 1],
                                  certifications[thiscertificationIdx],
                                ];

                                // Update the certification array in candidateData.
                                await updateCVData({
                                  certification: certifications,
                                });
                              }
                            }}
                          />
                        </Space>
                      )}

                      <div className="border-b border-dashed border-gray-200 dark:border-gray-600  dark:border-night-600" />
                    </div>
                  </div>
                ))}

                {editMode && (
                  <>
                    <h2 className="text-md font-semibold">Add certification</h2>
                    <Search
                      enterButton={<IoIosAdd />}
                      placeholder="Type the name of the provider"
                      value={searchValueCertifications}
                      onChange={(e) =>
                        setSearchValueCertifications(e.target.value)
                      }
                      onSearch={async (e) => {
                        await updateCVData({
                          certification: [
                            ...candidateData?.cv?.certification,
                            {
                              companyName: e,
                              position: "",
                              start: new Date(),
                              end: null,
                            },
                          ],
                        });
                        setSearchValueCertifications("");
                      }}
                    />
                    <Divider />
                  </>
                )}
              </div>
            </div>

            <div className="card">
              {(editMode || candidateData?.cv?.project?.length > 0) && (
                <h2 className="mb-5 text-lg font-semibold dark:text-night-50">
                  Projects
                </h2>
              )}

              {candidateData?.cv?.project?.map?.((project) => (
                <div key={project._id} className="mb-5 flex items-start">
                  <FaClover className="h-14 w-14 shrink-0 rounded-xl border-2 border-gray-50 shadow-sm dark:shadow-gray-400/50  dark:border-night-700" />

                  <div className="ml-3 w-full space-y-5">
                    <div className="justify-between sm:flex">
                      <div className="space-y-2">
                        <div className="font-medium dark:text-night-50">
                          {editMode ? (
                            <Typography.Paragraph
                              editable={{
                                onChange: (e) => {
                                  if (!e) return;
                                  const projects = candidateData?.cv?.project;
                                  projects.find(
                                    (e) => e._id === project._id
                                  ).companyName = e;

                                  updateCVData({
                                    project: projects,
                                  });
                                },
                                tooltip: "Adjust project name",
                              }}
                            >
                              {project?.companyName?.length > 30
                                ? `${project?.companyName.slice(0, 30)}...`
                                : project?.companyName}
                            </Typography.Paragraph>
                          ) : (
                            <>
                              {project?.companyName?.length > 30
                                ? `${project?.companyName.slice(0, 30)}...`
                                : project?.companyName}
                            </>
                          )}
                        </div>

                        <div className="flex space-x-5">
                          <div className="flex items-start gap-1 text-sm font-medium text-gray-400 dark:text-night-400">
                            <span className="max-w-sm text-sm text-gray-600 dark:text-night-300">
                              {editMode ? (
                                <Typography.Paragraph
                                  style={{ position: "relative", top: 6 }}
                                  editable={{
                                    onChange: (e) => {
                                      if (!e) return;
                                      const projects =
                                        candidateData?.cv?.project;
                                      projects.find(
                                        (e) => e._id === project._id
                                      ).position = e;

                                      updateCVData({
                                        project: projects,
                                      });
                                    },
                                    tooltip: "Adjust project description",
                                  }}
                                >
                                  {project?.position?.length}
                                </Typography.Paragraph>
                              ) : (
                                <>{project?.position?.length}</>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 flex gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                            />
                          </svg>
                          <span>
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "starting",
                                  ofYourXAt: "project",
                                  organization: project?.companyName,
                                  experience: "project",
                                  _id: project?._id,
                                  start: "start",
                                  at: "",
                                });
                              }}
                            >
                              {moment(project?.start ?? "").format("MMM YYYY")}
                            </span>{" "}
                            -{" "}
                            <span
                              className={`${editMode ? "cursor-pointer" : ""}`}
                              onClick={(e) => {
                                if (!editMode) return;
                                setDateEditModalOpen({
                                  selectXDate: "ending",
                                  ofYourXAt: "project",
                                  organization: project?.companyName,
                                  experience: "project",
                                  _id: project?._id,
                                  start: "end",
                                  at: "",
                                });
                              }}
                            >
                              {project?.end
                                ? "Expires: " +
                                  moment(project?.end).format("MMM YYYY")
                                : "Current"}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Space>
                        {project?.src && (
                          <a
                            href={project?.src}
                            target="_blank"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 px-2 py-2 text-xs text-gray-400 hover:bg-gray-100 dark:bg-gray-400 dark:border-night-700 dark:text-night-300 dark:hover:bg-night-700 h-8"
                          >
                            <span>Live link</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="h-4 w-4 stroke-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                        {editMode && (
                          <Typography.Paragraph
                            style={{ position: "relative", top: 6 }}
                            editable={{
                              onChange: (e) => {
                                if (!e) return;
                                const projects = candidateData?.cv?.project;
                                projects.find(
                                  (e) => e._id === project._id
                                ).src = e;

                                updateCVData({
                                  project: projects,
                                });
                              },
                              icon: <RiLinkUnlinkM />,
                              tooltip: "Adjust project link",
                            }}
                          >
                            {""}
                          </Typography.Paragraph>
                        )}
                      </Space>
                    </div>

                    {editMode && (
                      <Space>
                        <Popconfirm
                          title="Are you sure to delete?"
                          onConfirm={async () => {
                            const projects = candidateData?.cv?.project;

                            await updateCVData({
                              project: projects.filter(
                                (e) => e._id !== project._id
                              ),
                            });
                          }}
                        >
                          <MdDelete
                            size={25}
                            className="cursor-pointer text-red-500 relative"
                          />
                        </Popconfirm>

                        <IoIosArrowDropupCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const projects = [...candidateData?.cv?.project]; // Create a shallow copy of the array.
                            const thisprojectIdx = projects.findIndex(
                              (e) => e._id === project._id
                            );

                            if (thisprojectIdx > 0) {
                              // Check if the project is not already at the top.
                              // Swap the current project with the one above it.
                              [
                                projects[thisprojectIdx],
                                projects[thisprojectIdx - 1],
                              ] = [
                                projects[thisprojectIdx - 1],
                                projects[thisprojectIdx],
                              ];

                              // Update the project array in candidateData.
                              await updateCVData({
                                project: projects,
                              });
                            }
                          }}
                        />
                        <IoIosArrowDropdownCircle
                          size={25}
                          className="cursor-pointer"
                          onClick={async () => {
                            const projects = [...candidateData?.cv?.project]; // Create a shallow copy of the array.
                            const thisprojectIdx = projects.findIndex(
                              (e) => e._id === project._id
                            );

                            if (thisprojectIdx < projects.length - 1) {
                              // Check if the project is not already at the top.
                              // Swap the current project with the one below it.
                              [
                                projects[thisprojectIdx],
                                projects[thisprojectIdx + 1],
                              ] = [
                                projects[thisprojectIdx + 1],
                                projects[thisprojectIdx],
                              ];

                              // Update the project array in candidateData.
                              await updateCVData({
                                project: projects,
                              });
                            }
                          }}
                        />
                      </Space>
                    )}

                    <div className="border-b border-dashed border-gray-200 dark:border-gray-600  dark:border-night-600" />
                  </div>
                </div>
              ))}

              {editMode && (
                <>
                  <h2 className="text-md font-semibold">Add project</h2>
                  <Search
                    enterButton={<IoIosAdd />}
                    placeholder="Type the name of your project"
                    value={searchValueProjects}
                    onChange={(e) => setSearchValueProjects(e.target.value)}
                    onSearch={async (e) => {
                      await updateCVData({
                        project: [
                          ...candidateData?.cv?.project,
                          {
                            companyName: e,
                            position: "",
                            start: new Date(),
                            end: null,
                          },
                        ],
                      });
                      setSearchValueProjects("");
                    }}
                  />
                  <Divider />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CVTemplate;
