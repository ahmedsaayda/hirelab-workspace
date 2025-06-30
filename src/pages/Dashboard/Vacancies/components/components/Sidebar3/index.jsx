import React from "react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Heading, Img } from "./..";

export default function Sidebar3({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  //use this function to collapse/expand the sidebar
  //function collapseSidebar() {
  //    setCollapsed(!collapsed)
  //}

  return (
    <Sidebar
      {...props}
      width="82px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      rootStyles={{ [`.${sidebarClasses.container}`]: { gap: 24 } }}
      className={`${props.className} flex flex-col h-screen pt-6 gap-6 top-0 smx:pt-5 bg-white-A700 !sticky overflow-auto rounded-[20px] mdx:hidden`}
    >
      <div className="flex">
        <Heading as="p" className="!font-semibold !text-blue_gray-500_01">
          MENU
        </Heading>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            padding: "12px",
            borderRadius: "12px",
            [`&:hover, &.ps-active`]: { backgroundColor: "#0E87FE !important" },
          },
        }}
        className="flex w-full flex-col items-center self-stretch pb-[38px] smx:pb-5"
      >
        <div className="flex flex-col gap-1">
          <MenuItem
            icon={
              <Img
                src="/images/img_bar_chart_2.svg"
                alt="barcharttwo"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_briefcase_01_white_a700.svg"
                alt="briefcaseone"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_tool_02.svg"
                alt="tooltwo"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_folder_code.svg"
                alt="foldercode"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_image_03.svg"
                alt="imagethree"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_line_chart_down_05.svg"
                alt="linechartdown"
                className="h-[24px] w-[24px]"
              />
            }
          />
        </div>
        <div className="flex">
          <Heading as="p" className="!font-semibold !text-blue_gray-500_01">
            GENERAL
          </Heading>
        </div>
        <div className="mt-[23px] flex flex-col gap-1">
          <MenuItem
            icon={
              <Img
                src="/images/img_settings_blue_gray_800_01.svg"
                alt="settings"
                className="h-[24px] w-[24px]"
              />
            }
          />
          <MenuItem
            icon={
              <Img
                src="/images/img_button_container.svg"
                alt="button"
                className="h-[24px] w-[24px]"
              />
            }
          />
        </div>
      </Menu>
    </Sidebar>
  );
}
