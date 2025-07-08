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
import { MapPin, Clock, Coins, Component, Pencil, Eye } from "lucide-react";
import Template1Preview from "./TemplatePreviews/Template1Preview.jsx";

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
  return (
    <div
      {...props}
      className={`${props.className} h-full w-full max-w-xs shadow-sm hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-lg overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Preview Section - Compact */}
        <div className="relative h-32 bg-slate-100 overflow-hidden">
          <Template1Preview landingPageData={props} />
          {/* Status Toggle - Overlay */}
          <div className="absolute top-2 right-2">
            <Switch
              size="small"
              loading={isSwitchLoading}
              checked={props?.published}
              onChange={async (e) => {
                setIsSwitchLoading(true);
                try {
                  await CrudService.update(
                    "LandingPageData",
                    props._id,
                    {
                      published: e,
                      publishedAt: e ? new Date() : null,
                      uppublishedAt: e ? null : new Date(),
                    }
                  );
                  await fetchData();
                  if (e) message.success("Funnel is live!");
                } catch (error) {
                  message.error("Failed to update status");
                } finally {
                  setIsSwitchLoading(false);
                }
              }}
            />
          </div>
        </div>
        
        {/* Content Section - Compact */}
        <div className="flex-1 p-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
            {heading}
          </h3>
          
          {/* Location - Inline */}
          {props?.location?.length > 0 && (
            <div className="flex items-center gap-1 mb-2 text-xs text-gray-600">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">
                {Array.isArray(props?.location)
                  ? props?.location.join(", ")
                  : props?.location}
              </span>
            </div>
          )}

          {/* Department - Compact */}
          {props.department && (
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                {props.department}
              </span>
            </div>
          )}

          {/* Analytics - Colorful Tags */}
          <div className="flex flex-wrap gap-2 items-start">
            {/* Visits Tag */}
            <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1">
              <Eye size={12} className="text-blue-600" />
              <span className="text-blue-600 text-xs font-medium">{visits} visits</span>
            </div>

            {/* Average Time Spent Tag */}
            <div className="flex items-center gap-1 bg-green-50 rounded-full px-2 py-1">
              <Clock size={12} className="text-green-600" />
              <span className="text-green-600 text-xs font-medium">{avgTimeSpent}s avg</span>
            </div>

            {/* Applicants Tag */}
            <div className="flex items-center gap-1 bg-purple-50 rounded-full px-2 py-1">
              <span className="text-purple-600 text-xs font-medium">{applicants} applicants</span>
            </div>

            {/* Days Live Tag */}
            <div className="flex items-center gap-1 bg-orange-50 rounded-full px-2 py-1">
              <span className="text-orange-600 text-xs font-medium">{daysLive} days live</span>
            </div>
          </div>
        </div>
        
        {/* Action Bar - Compact */}
        <div className="flex border-t border-gray-100 bg-gray-50">
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
            <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 transition-colors">
              <Img
                src="/images/more-vertical.svg"
                alt="menu"
                className="h-4 w-4"
              />
            </button>
          </Dropdown>

          <Link
            href={`/lp/${record._id}`}
            target="_blank"
            className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 transition-colors border-l border-gray-200"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Link>

          <Link
            href={`/edit-page/${record._id}`}
            className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 transition-colors border-l border-gray-200"
          >
            <Pencil className="h-4 w-4 text-gray-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
