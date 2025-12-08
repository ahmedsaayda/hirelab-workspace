import { MegaphoneIcon } from "@heroicons/react/20/solid";
import { Button, Dropdown, Popconfirm, Switch, message } from "antd";
import React, { useState } from "react";
import { IoIosMegaphone } from "react-icons/io";
import { IoMegaphoneSharp } from "react-icons/io5";
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { SiPlatformdotsh } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/router";
import CrudService from "../../../../../../services/CrudService.js";
import { Heading, Img, Text } from "../index.jsx";
import HeroSection from "../../../../../Landingpage/HeroSection.js";
import { MapPin, Clock, Coins, Component, Pencil, Eye, Copy } from "lucide-react";
import Template1Preview from "./TemplatePreviews/Template1Preview.jsx";
import HeroThumbnail from "./HeroThumbnail.jsx";
import { formatAvgTime } from "../../../../../../utils/timeFormat";
import { LinkOutlined } from "@ant-design/icons";
import LandingPageService from "../../../../../../services/landingPageService.js";

export const oauthUri = `https://www.facebook.com/v19.0/dialog/oauth?response_type=token&display=popup&client_id=${process.env.NEXT_PUBLIC_META_APP_KEY
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_LIVE_URL + "/dashboard/vacancies"
  )}&auth_type=rerequest&scope=email%2Cmanage_fundraisers%2Cread_insights%2Cpublish_video%2Ccatalog_management%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_show_list%2Cread_page_mailboxes%2Cads_management%2Cads_read%2Cbusiness_management%2Cpages_messaging%2Cpages_messaging_subscriptions%2Cinstagram_basic%2Cinstagram_manage_comments%2Cinstagram_manage_insights%2Cinstagram_content_publish%2Cleads_retrieval%2Cwhatsapp_business_management%2Cinstagram_manage_messages%2Cpage_events%2Cpages_read_engagement%2Cpages_manage_metadata%2Cpages_read_user_content%2Cpages_manage_ads%2Cpages_manage_posts%2Cpages_manage_engagement%2Cwhatsapp_business_messaging%2Cinstagram_shopping_tag_products%2Cinstagram_branded_content_brand%2Cinstagram_branded_content_creator%2Cinstagram_branded_content_ads_brand%2Cinstagram_manage_events`;

export default function VacanciesCard({
  position = "Position",
  heading = "Design Lead",
  deadlinetwo = "Date Created:",
  mar42024 = "MAR 4 2024",
  // Updated props for new analytics data
  visits = 0,
  avgTimeSpent = 0,
  applicants = 0,
  daysLive = 0,
  record,
  fetchData,
  user,
  AILoading,
  backendLoading,
  handleGenerateAt,
  onDuplicate,
  onRename,
  ...props
}) {
  const router = useRouter();;
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const handleCopyLink = () => {
    const id = record?._id || props?._id;
    const generatedLink = `${process.env.NEXT_PUBLIC_LIVE_URL}/lp/${id}`;
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => message.success("Link copied to clipboard!"))
      .catch(() => message.error("Failed to copy link"));
  };
  return (
    <div
      {...props}
      className={`${props.className} h-full w-full max-w-xs shadow-sm hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-lg overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Preview Section - Compact */}
        <div className="overflow-hidden relative h-36 bg-slate-100">
          <HeroThumbnail landingPageData={props} />
          {/* Status Toggle - Overlay */}
          <div className="absolute top-2 right-2">
            <Switch
              size="small"
              loading={isSwitchLoading}
              checked={props?.published}
              onChange={async (e) => {
                setIsSwitchLoading(true);
                try {
                  if(e){
                  await LandingPageService.publishLandingPage(props._id, "page");
                  }else{
                    await LandingPageService.unPublishLandingPage(props._id, "page");
                  }
                  await fetchData();
                  if (e) message.success("Funnel is live!");
                } catch (error) {
                  console.log(error);
                  message.error("Failed to update status"+error);
                } finally {
                  setIsSwitchLoading(false);
                }
              }}
            />
          </div>
        </div>
        
        {/* Content Section - Compact */}
        <div className="flex-1 p-3">
          {/* Title (single line with ellipsis) */}
          <h3
            className="mb-2 text-sm font-semibold leading-tight text-gray-900 truncate"
            title={heading}
          >
            {heading}
          </h3>

          {/* Tags: Location + Department */}
          <div className="flex gap-2 items-center mb-2 w-full">
            {props?.location?.length > 0 && (
              <span 
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded bg-purple-100 text-purple-700 min-w-0 ${
                  props.department ? 'flex-1' : 'max-w-full'
                }`}
                title={Array.isArray(props?.location) ? props?.location.join(", ") : props?.location}
              >
                <MapPin size={12} className="flex-shrink-0" />
                <span className="truncate">
                  {Array.isArray(props?.location)
                    ? props?.location.join(", ")
                    : props?.location}
                </span>
              </span>
            )}

            {props.department && (
              <span 
                className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded bg-rose-100 text-rose-700 min-w-0 ${
                  props?.location?.length > 0 ? 'flex-1' : 'max-w-full'
                }`}
                title={props.department}
              >
                <span className="truncate">
                  {props.department}
                </span>
              </span>
            )}
          </div>

          {/* Analytics: compact two-row layout */}
          <div className="mt-1 space-y-1 text-xs text-gray-600">
            <div className="flex gap-4 items-center">
              <span className="flex gap-1 items-center">
                <Clock size={12} /> {daysLive} days
              </span>
              <span className="flex gap-1 items-center">
                <Component size={12} /> {applicants || 0} applicants
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="flex gap-1 items-center">
                <Eye size={12} /> {visits || 0} visits
              </span>
              <span className="flex gap-1 items-center">
                <Clock size={12} /> {typeof avgTimeSpent === 'string' ? avgTimeSpent : formatAvgTime(avgTimeSpent)} Avg
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Bar - Compact */}
        <div className="flex bg-gray-50 border-t border-gray-100">
          <Dropdown
            menu={{
              items: [
                {
                  key: "97",
                  label: <div>Duplicate</div>,
                  onClick: onDuplicate,
                },
                {
                  key: "197",
                  label: (
                    <Link href={`/dashboard/ats?id=${props._id}`}>ATS</Link>
                  ),
                },
                {
                  key: "98",
                  label: <div>Rename</div>,
                  onClick: onRename,
                },
                {
                  key: "99",
                  label: <div>Delete</div>,
                  danger: true,
                  onClick: async () => {
                    await CrudService.delete("LandingPageData", record._id);
                    await fetchData();
                  },
                },
              ].filter((a) => !a?.hide),
            }}
          >
            <button className="flex flex-1 justify-center items-center py-2 transition-colors hover:bg-gray-100">
              <Img
                src="/images/more-vertical.svg"
                alt="menu"
                className="w-4 h-4"
              />
            </button>
          </Dropdown>

          <button
            onClick={handleCopyLink}
            className="flex flex-1 justify-center items-center py-2 border-l border-gray-200 transition-colors hover:bg-gray-100"
            title="Copy public link"
          >
            <LinkOutlined className="w-4 h-4 text-gray-600" />
          </button>

          <Link
            href={`/lp/${record._id}`}
            target="_blank"
            className="flex flex-1 justify-center items-center py-2 border-l border-gray-200 transition-colors hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>

          <Link
            href={`/edit-page/${record._id}`}
            className="flex flex-1 justify-center items-center py-2 border-l border-gray-200 transition-colors hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
