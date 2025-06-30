import { MegaphoneIcon } from "@heroicons/react/20/solid";
import { Button, Dropdown, Popconfirm, Switch, message } from "antd";
import React, { useState } from "react";
import { IoIosMegaphone } from "react-icons/io";
import { IoMegaphoneSharp } from "react-icons/io5";
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { SiPlatformdotsh } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/router";
import CrudService from "../../../../../../src/services/CrudService";
import { Heading, Img, Text } from "..";
import HeroSection from "../../../../Landingpage/HeroSection";
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
  viewstwo = "Views:",
  zipcode = "6728",
  text = "293",
  applicants = "applicants",
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
  console.log("props==>", props);
  return (
    console.log("props==>", props),
    (
      <div
        {...props}
        className={`${props.className} h-full w-full shadow-lg  border-gray-300  bg-white  rounded-[12px] pb-2`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <div className="p-1">
              <div className="overflow-hidden  w-full rounded-lg pointer-events-none bg-slate-300">
                <Template1Preview landingPageData={props} />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 p-1 px-2 w-full">
              {/* flex items-start self-stretch justify-between gap-2  */}
              <div className="w-full">
                <div className="flex gap-2 justify-between items-center w-full">
                  {/* <Heading size="3xl" as="h6" className="!text-gray-900  card-title mb-2">
                  {heading}
                </Heading> */}
                  <Text
                    as="p"
                    className="!font-normal !text-blue_gray-700_01 py-1"
                  >
                    {position}
                  </Text>
                  <div className="w-fit">
                    <Switch
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
                <h1
                  className="mb-1 text-xs font-medium text-gray-900 sm:text-sm md:text-base lg:text-lg xl:text-lg"
                  title={heading}
                >
                  {heading?.length > 30
                    ? heading.substring(0, 30) + "..."
                    : heading}
                </h1>

                {/* {
                  props.department && (
                    <Text
                      as="p"
                      className=" !text-light_blue-A700 !text-xs px-2 py-0.5 text-center mb-1 bg-light_red-A700 bg-opacity-15 rounded-full"
                    >
                      {props.department}
                    </Text>
                  )
                } */}
              </div>

              <div className="flex flex-wrap gap-4 items-start">
                {/* Views and Zipcode */}
                <div className="flex gap-6 items-center flex-wrap">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Img
                      src="/images/img_vertical_container_blue_gray_500_01.svg"
                      alt="viewsone"
                      className="h-[16px] w-[16px]"
                    />
                    <Text
                      size="lg"
                      as="p"
                      className="!text-blue_gray-500_01"
                    >
                      {viewstwo}
                    </Text>


                  <Text
                    size="lg"
                    as="p"
                    className="self-start !font-medium !text-blue_gray-700 flex-shrink-0"
                  >
                    {zipcode}
                  </Text>
                  </div>


                  {props?.location?.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center max-w-full">
                      <MapPin size={16} className="text-gray-600 flex-shrink-0" />
                      <Text
                        size="lg"
                        as="p"
                        className="self-start !font-medium !text-blue_gray-700 break-words"
                      >
                        {Array.isArray(props?.location)
                          ? props?.location.join(" - ")
                          : props?.location || ""}
                      </Text>
                    </div>
                  )}
                </div>

                {/* Department (conditionally wraps) */}
                {props.department && (
                  <div className="flex items-center gap-0.5  sm:mt-0">
                    <Component size={16} className="text-gray-600 flex-shrink-0" />
                    <Text
                      as="p"
                      className="!text-light_blue-A700 !text-xs px-2  text-center bg-light_red-A700 bg-opacity-15 rounded-full"
                    >
                      {props.department}
                    </Text>
                  </div>
                )}
              </div>




              <div className="flex flex-wrap  rounded-[14px] bg-gray-100_01 px-[5px]">
                <Text
                  as="p"
                  className="self-start !text-light_blue-A700 !text-xs px-1 py-0.5 text-center"
                >
                  {text}
                </Text>
                <Text
                  as="p"
                  className="self-end !text-light_blue-A700 !text-xs px-1 py-0.5 text-center"
                >
                  {applicants}
                </Text>
              </div>
            </div>
          </div>
          <div className="flex gap-1 px-2">
            <Dropdown
              menu={{
                items: [
                  // {
                  //   key: "2",
                  //   label: <div>Promote</div>,
                  //   hide: props.published,  
                  //   onClick: () => {
                  //     const accessToken = user?.metaAccessToken;
                  //     if (!accessToken) return (window.location.href = oauthUri);

                  //     if (
                  //       !user?.metaAccessExpiry ||
                  //       new Date(user?.metaAccessExpiry * 1000) < new Date()
                  //     ) {
                  //       return (window.location.href = oauthUri);
                  //     }

                  //     if (!AILoading && !backendLoading) handleGenerateAt(record);
                  //   },
                  // },

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
              <a
                onClick={(e) => e.preventDefault()}
                className="flex w-full justify-center rounded-[14px] rounded-e-none bg-gray-50_01   cursor-pointer py-2"
              >
                <Img
                  src="/images/more-vertical.svg"
                  alt="image"
                  className="h-[16px] "
                />
              </a>
            </Dropdown>

            <Link
              href={`/lp/${record._id}`}
              target="_blank"
              className="flex justify-center py-2 w-full bg-gray-50_01"
            >
              <Eye className="h-4 w-4 !text-gray-500 !hover:text-black" />
            </Link>

            <Link
              href={`/edit-page/${record._id}`}
              className="flex w-full justify-center rounded-[14px] rounded-s-none bg-gray-50_01  py-2"
            >
              <Pencil className="h-4 w-4 !text-gray-500 hover:text-black" />
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
