import React from "react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Heading, Img } from "./..";

export default function Sidebar18({ ...props }) {
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
      rootStyles={{ [`.${sidebarClasses.container}`]: { gap: 30 } }}
      className={`${props.className} flex flex-col h-screen pt-[33px] gap-[30px] top-0 mdx:p-5 smx:pt-5 border-blue_gray-50 border-r border-solid bg-white-A700 !sticky overflow-auto mdx:hidden`}
    >
      <Heading size="4xl" as="h5" className="!text-black-900_01">
        Sections
      </Heading>
      <Menu
        menuItemStyles={{
          button: {
            padding: 0,
          },
        }}
        className="flex w-full flex-col self-stretch"
      >
        <MenuItem
          icon={
            <Img
              src="/images/img_flex_align_top.svg"
              alt="flexaligntop"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_button_base.svg"
              alt="buttonbase"
              className="h-[40px] w-[50px] rounded-lg"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_user_01_blue_gray_500_01.svg"
              alt="userone"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_message_chat_circle.svg"
              alt="messagechat"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_calendar.svg"
              alt="calendar"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_briefcase_01.svg"
              alt="briefcaseone"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_edit_04.svg"
              alt="editfour"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_search_blue_gray_500_01.svg"
              alt="search"
              className="h-[40px] w-[50px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_button_base_gray_100_01.svg"
              alt="buttonbase"
              className="h-[40px] w-[50px] rounded-lg"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_search.svg"
              alt="search"
              className="h-[40px] w-[50px] rounded-lg"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_flex_align_top.svg"
              alt="flexalign"
              className="h-[40px] w-[50px]"
            />
          }
        />
      </Menu>
    </Sidebar>
  );
}
