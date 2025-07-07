import React from "react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Heading, Img } from "./..";

export default function Sidebar15({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  //use this function to collapse/expand the sidebar
  //function collapseSidebar() {
  //    setCollapsed(!collapsed)
  //}

  return (
    <Sidebar
      {...props}
      width="274px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      className={`${props.className} flex flex-col h-screen pt-6 top-0 smx:pt-5 bg-white-A700 !sticky overflow-auto rounded-[20px] mdx:hidden`}
    >
      <div className="flex self-start px-6 smx:px-5">
        <Heading as="p" className="!font-semibold !text-blue_gray-500_01">
          MENU
        </Heading>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            padding: "12px",
            gap: "12px",
            alignSelf: "start",
            color: "#344054",
            fontWeight: 500,
            fontSize: "16px",
            borderRadius: "12px",
            [`&:hover, &.ps-active`]: {
              color: "#ffffff",
              backgroundColor: "#5207CD !important",
            },
          },
        }}
        className="mt-6 flex w-full flex-col items-center self-stretch"
      >
        <div className="flex w-[88%] flex-col gap-1 mdx:w-full">
          <MenuItem
            icon={
              <Img
                src="/images/img_bar_chart_2.svg"
                alt="barcharttwo"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Dashboard
          </MenuItem>
          <MenuItem
            icon={
              <Img
                src="/images/img_briefcase_01_white_a700.svg"
                alt="briefcaseone"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Vacancies
          </MenuItem>
          <MenuItem
            icon={
              <Img
                src="/images/img_tool_02.svg"
                alt="tooltwo"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Tools
          </MenuItem>
          <MenuItem
            icon={
              <Img
                src="/images/img_folder_code.svg"
                alt="foldercode"
                className="h-[24px] w-[24px]"
              />
            }
          >
            ATS
          </MenuItem>
          <MenuItem
            icon={
              <Img
                src="/images/img_image_03.svg"
                alt="imagethree"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Media Library
          </MenuItem>
          <MenuItem
            icon={
              <Img
                src="/images/img_line_chart_down_05.svg"
                alt="linechartdown"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Analytics
          </MenuItem>
        </div>
        <div className="flex self-start px-6 pb-1 smx:px-5">
          <Heading as="p" className="!font-semibold !text-blue_gray-500_01">
            GENERAL
          </Heading>
        </div>
        <div className="mt-5 flex w-[88%] mdx:w-full">
          <MenuItem
            icon={
              <Img
                src="/images/img_settings_blue_gray_800_01.svg"
                alt="settings"
                className="h-[24px] w-[24px]"
              />
            }
          >
            Settings
          </MenuItem>
        </div>
      </Menu>
      {!collapsed ? (
        <Img
          src="/images/img_button_container_light_blue_a700.svg"
          alt="button"
          className="mt-[60px] h-[56px] w-full mdx:h-auto"
        />
      ) : null}
    </Sidebar>
  );
}
