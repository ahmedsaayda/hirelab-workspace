import React from "react";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";
import { Heading, Img } from "./..";

export default function Sidebar9({ ...props }) {
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
      className={`${props.className} flex flex-col h-screen pt-[33px] gap-[19px] top-0 px-4 border-blue_gray-50 border-r border-solid bg-white-A700 !sticky overflow-auto`}
    >
      <Heading size="4xl" as="h5" className="!text-[#000000]_01">
        Sections
      </Heading>
      <Menu
        menuItemStyles={{
          button: {
            padding: "11px",
            borderRadius: "8px",
            [`&:hover, &.ps-active`]: { backgroundColor: "#eff8ff !important" },
          },
        }}
        rootStyles={{ ["&>ul"]: { gap: "27.00px" } }}
        className="flex w-full flex-col"
      >
        <MenuItem
          icon={
            <Img
              src="/images/img_flex_align_top_light_blue_a700.svg"
              alt="flexaligntop"
              className="h-[18px] w-[18px]"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_search.svg"
              alt="search"
              className="h-[18px] w-[18px] rounded-lg"
            />
          }
        />
        <MenuItem
          icon={
            <Img
              src="/images/img_flex_align_top.svg"
              alt="flexalign"
              className="h-[18px] w-[18px]"
            />
          }
        />
      </Menu>
    </Sidebar>
  );
}
