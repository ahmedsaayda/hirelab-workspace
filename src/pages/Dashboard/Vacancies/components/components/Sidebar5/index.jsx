import React from "react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Heading, Img } from "./..";

export default function Sidebar5({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  //use this function to collapse/expand the sidebar
  //function collapseSidebar() {
  //    setCollapsed(!collapsed)
  //}

  return (
    <Sidebar
      {...props}
      width="90px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      rootStyles={{ [`.${sidebarClasses.container}`]: { gap: 19 } }}
      className={`${props.className} flex flex-col h-screen pt-[33px] gap-[19px] top-0 px-4 mdx:p-5 smx:pt-5 border-blue_gray-50 border-r border-solid bg-white-A700 !sticky overflow-auto mdx:hidden`}
    >
      <Heading size="4xl" as="h5" className="!text-[#000000]_01">
        Sections
      </Heading>
      <Menu
        menuItemStyles={{
          button: {
            padding: "14px",
            borderRadius: "8px",
            [`&:hover, &.ps-active`]: { backgroundColor: "#eff8ff !important" },
          },
        }}
        rootStyles={{ ["&>ul"]: { gap: "8.00px" } }}
        className="flex w-full flex-col"
      >
        <MenuItem>
          <div className="flex flex-col items-center py-[3px] pr-0.5">
            <Img
              src="/images/img_flex_align_top.svg"
              alt="flexaligntop"
              className="h-[10px] w-[13px]"
            />
          </div>
        </MenuItem>
        <MenuItem
          icon={
            <Img
              src="/images/img_button_base.svg"
              alt="buttonbase"
              className="h-[10px] w-[13px] rounded-[50%]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_user_01_blue_gray_500_01.svg"
              alt="userone"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_message_chat_circle.svg"
              alt="messagechat"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_calendar.svg"
              alt="calendar"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_briefcase_01.svg"
              alt="briefcaseone"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_edit_04.svg"
              alt="editfour"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_search_blue_gray_500_01.svg"
              alt="search"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_button_base_blue_gray_500_01.svg"
              alt="buttonbase"
              className="h-[10px] w-[13px] rounded-[50%]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_trend_up_01.svg"
              alt="trendupone"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_megaphone.svg"
              alt="megaphone"
              className="h-[10px] w-[13px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_search.svg"
              alt="search"
              className="h-[10px] w-[13px] rounded-[50%]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_flex_align_top.svg"
              alt="flexalign"
              className="h-[10px] w-[13px]"
            />
          }
        />
      </Menu>
    </Sidebar>
  );
}
