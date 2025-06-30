import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  LinkOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Heading, Img } from "../../../../../../dhwise-components/index.jsx";
import { Dropdown, Popconfirm, Switch, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Eye,
  Pencil,
  PencilLine,
  PencilLineIcon,
  SquarePen,
  Trash2,
  PlayCircle
} from "lucide-react";

import HeroForm from "./modals/sectionTemplateForms/hero-form.jsx";
import TestimonialsForm from "./modals/sectionTemplateForms/testimonials-form.jsx";
import LeaderIntroductionForm from "./modals/sectionTemplateForms/leader-introduction-form.jsx";
import JobDescriptionForm from "./modals/sectionTemplateForms/job-description.jsx";
import CompanyFactsForm from "./modals/sectionTemplateForms/company-facts.jsx";
import RecruiterContactForm from "./modals/sectionTemplateForms/recruiter-contact-form.jsx";
import CandidateProcessForm from "./modals/sectionTemplateForms/candidate-process-form.jsx";
import VideoSectionForm from "./modals/sectionTemplateForms/video-form.jsx";
import PhotoCarouselForm from "./modals/sectionTemplateForms/photo-carousel-form.jsx";
import AboutCompanyForm from "./modals/sectionTemplateForms/about-the-company-form.jsx";
import JobSpecificationsForm from "./modals/sectionTemplateForms/job-specifications-form.jsx";
import AgendaForm from "./modals/sectionTemplateForms/agenda-form.jsx";
import EVPMissionForm from "./modals/sectionTemplateForms/evp-mission-form.jsx";
import GrowthPathForm from "./modals/sectionTemplateForms/growth-path-form.jsx";
import TextBoxForm from "./modals/sectionTemplateForms/text-box-form.jsx";



export default function VideoCard({ videoUrl }) {
  const videoRef = useRef(null);
  const [videoDetails, setVideoDetails] = useState({
    duration: "",
    resolution: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => {
        const durationInSeconds = video.duration;
        const formattedDuration = new Date(durationInSeconds * 1000)
          .toISOString()
          .substr(11, 8);
        const resolution = `${video.videoWidth} x ${video.videoHeight}`;
        setVideoDetails({ duration: formattedDuration, resolution });
      };
    }
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }else{
      setIsPlaying(false)
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-[200px] object-cover"
        controls={isPlaying}
        muted={!isPlaying}
        onClick={() => !isPlaying && handlePlay()}
      />

      {/* Overlay Play Button (show only if not playing) */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-white bg-opacity-60 rounded-full p-2">
            <PlayCircle className="text-[#ffffffa8] w-12 h-12" />
          </div>
        </div>
      )}

      {/* Duration */}
      <div className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white rounded bg-black bg-opacity-50">
        {videoDetails.duration}
      </div>

      {/* Resolution */}
      <div className="absolute top-2 left-2 px-2 py-1 text-xs text-white rounded bg-black bg-opacity-50">
        {videoDetails.resolution}
      </div>
    </div>
  );
}



export function MediaCard({
  _id,
  title,
  description,
  tags,
  thumbnail,
  type,
  duration,
  resolution,
  selected,
  templateData,
  source,
  size,
  onSelect,
  onEdit,
  onRename,
  onDelete,
  hideDescription = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpenForSection, setIsEditModalOpenForSection] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getTagStyle = (type) => {
    switch (type) {
      case "location":
        return "bg-blue-50 text-blue-600";
      case "department":
        return "bg-purple-50 text-purple-600";
      case "role":
        return "bg-pink-50 text-pink-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const handleSendTemplateParent = async (updatedData) => {
    try {
      setIsSaving(true);
      await onEdit?.(_id, updatedData);
      setIsEditModalOpenForSection(false);
    } catch (error) {
      console.error("Error updating template:", error);
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="overflow-hidden transition-shadow bg-[#f8f8f8] rounded-lg shadow-sm shadow-gray-400 hover:shadow-md hover:shadow-gray-700 flex flex-col ">
      <div
        className="relative aspect-video cursor-pointer"
        onClick={() => onSelect?.(_id)} // 🔹 Entire area is clickable
      >
        {type === "video" || templateData?.type === "videoSection" ? (
          <VideoCard videoUrl={thumbnail} />
        ) : (
          <>
            <div className="absolute px-2 py-1 text-xs text-white rounded bottom-2 left-2 bg-light_blue-A700 bg-opacity-15">
              {size}
            </div>
            <img
              src={thumbnail}
              alt={title}
              className="object-cover w-full h-[200px] rounded-lg"
            />
            <div className="absolute px-2 py-1 text-xs text-white rounded top-2 left-2 bg-light_blue-A700 bg-opacity-15">
              {resolution}
            </div>
          </>
        )}

        {/* ✅ This remains visually highlighted when selected */}
        <Button
          icon={<CheckCircleOutlined />}
          className={`absolute top-2 right-2 rounded-full border ${selected
              ? "text-white bg-blue-500 border-blue-500 shadow"
              : "text-gray-400 bg-white/80 border-transparent"
            } transition-all duration-200 ease-in-out pointer-events-none`}
        />
      </div>

      <div className="p-4 py-2 flex flex-col justify-between flex-grow ">
        <div>
          <h3 className="mb-2 font-medium text-gray-900 line-clamp-1">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(
                  tag.type
                )}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
          {!hideDescription && (
            <div className="mb-4">
              <h4 className="mb-1 text-sm font-medium text-gray-700">
                Meta Description
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
            </div>
          )}
        </div>
        <div className="flex  gap-1 !bg-blue-red-400">
          {/* <Button
            type="text"
            icon={<MoreOutlined />}
            className="text-gray-400  bg-[#F8F8F8] rounded-full w-20 h-6 flex items-center justify-center"
          /> */}
          <Dropdown
            menu={{
              items: [
                {
                  key: "98",
                  label: <div>Rename</div>,
                  onClick: () => {
                    onRename?.(_id);
                  },
                },
                {
                  key: "99",
                  label: <div>Delete</div>,
                  danger: true,
                  // onClick: async () => {
                  //   await CrudService.delete("LandingPageData", record._id);
                  //   await fetchData();
                  // },
                  onClick: () => {
                    onDelete?.(_id);
                  },
                },
              ],
            }}
          >
            <button
              title="Move Up"
              onClick={(e) => e.preventDefault()}
              className="flex w-full justify-center rounded-[14px] rounded-e-none bg-gray-50_01 hover:text-black-900 py-2"
            >
              <Img
                src="/images/more-vertical.svg"
                alt="image"
                className="h-[16px] "
              />
            </button>
          </Dropdown>

          {/* <Button
            type="text"
            icon={<EyeOutlined />}
            className="text-gray-400  bg-[#F8F8F8] rounded-full w-20 h-6 flex items-center justify-center"
          /> */}
          {/* <Button
            type="text"
            icon={<EditOutlined  />}
            className="text-gray-400  bg-[#F8F8F8] rounded-full w-20 h-6 flex items-center justify-center"
            onClick={() => onEdit?.(_id)} 
           /> */}
          <Modal
            title="Media Preview"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width={1000}
          >
            <div className="flex flex-col lg:flex-row gap-4 h-full">
              {/* Media Section */}
              <div className="lg:w-1/2 flex items-start ">
                {type === "video" ? (
                  <video
                    src={thumbnail}
                    className="w-full h-auto max-h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-auto max-h-full object-cover"
                  />
                )}
              </div>

              {/* Information Section */}
              <div className="lg:w-1/2 flex flex-col justify-center overflow-y-auto">
                <h3 className="font-semibold">{title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(
                        tag.type
                      )}`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm">{description}</p>
                {size && <p className="text-gray-600 text-xs">Size: {size}</p>}
                {resolution && (
                  <p className="text-gray-600 text-xs">
                    Resolution: {resolution}
                  </p>
                )}

                <div className="w-full flex gap-1 mt-2">
                  {/* Rename Button */}
                  <button
                    onClick={() => onRename?.(_id)}
                    className="group flex w-full justify-center items-center gap-1 rounded-[14px] rounded-e-none bg-gray-50_01 hover:bg-blue-400 hover:text-white py-2"
                  >
                    <PencilLineIcon
                      className="text-gray-600 group-hover:text-white"
                      size={15}
                    />
                    Rename
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit?.(_id)}
                    className="group flex w-full justify-center items-center gap-1 bg-gray-50_01 hover:bg-green-400 hover:text-white py-2"
                  >
                    <SquarePen
                      className="text-gray-600 group-hover:text-white"
                      size={15}
                    />
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete?.(_id)}
                    className="group flex w-full justify-center items-center gap-1 rounded-[14px] rounded-s-none bg-gray-50_01 hover:bg-red-400 hover:text-white py-2"
                  >
                    <Trash2
                      className="text-gray-600 group-hover:text-white"
                      size={15}
                    />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          {type === "section-template" && (
            <Modal
              title={`Edit ${title}`}
              open={isEditModalOpenForSection}
              onCancel={() => setIsEditModalOpenForSection(false)}
              footer={null}
              width={800}
              destroyOnClose
            >
              {templateData?.type === "hero" && (
                <HeroForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === 'testimonial' && (
                  <TestimonialsForm
                    initialData={templateData}
                    onSave={handleSendTemplateParent}
                    isSaving={isSaving}
                  />
                )}
              {templateData?.type === "leaderIntro" && (
                <LeaderIntroductionForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "jobDescription" && (
                <JobDescriptionForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "companyFacts" && (
                <CompanyFactsForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "recruiterContact" && (
                <RecruiterContactForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "candidateProcess" && (
                <CandidateProcessForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "videoSection" && (
                <VideoSectionForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "photoCarousel" && (
                <PhotoCarouselForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "aboutCompany" && (
                <AboutCompanyForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "jobSpecification" && (
                <JobSpecificationsForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "agenda" && (
                <AgendaForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}

              {templateData?.type === "evpMission" && (
                <EVPMissionForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "growthPath" && (
                <GrowthPathForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {templateData?.type === "textBox" && (
                <TextBoxForm
                  initialData={templateData}
                  onSave={handleSendTemplateParent}
                  isSaving={isSaving}
                />
              )}
              {/* Add more template types as needed */}
            </Modal>
          )}

          <button
            title={"View"}
            onClick={() => setIsModalOpen(true)}
            className="flex w-full justify-center  bg-gray-50_01 hover:text-black-900 py-2"
          >
            <Eye className="h-4 w-4 text-gray-500 hover:text-black" />
          </button>

          <button
            title={"Edit"}
            onClick={() => {
              setIsEditModalOpenForSection(true);
              if (type !== "section-template" && onEdit) {
                onEdit(_id);
              }
            }}
            className="flex w-full justify-center rounded-[14px] rounded-s-none bg-gray-50_01 hover:text-black-900 py-2"
          >
            <Pencil className="h-4 w-4 text-gray-500 hover:text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
