import React, { useMemo, useState } from "react";
import { Modal, Divider } from "antd";
import * as Icons from "lucide-react/dist/esm/icons";
import { Button, Img, Input } from "../Dashboard/Vacancies/components/components";

// New IconRenderer component
export const IconRenderer = ({ icon, className, size = 24, ...props }) => {
  
  // Check if it's a custom SVG path
  if (typeof icon === "string" && icon.endsWith(".svg")) {
    return <Img src={icon} alt="icon" className={className} loading="lazy" />;
  }

  // Handle Lucide icons
  const LucideIcon = Icons[icon];
  if (LucideIcon) {
    return (
      <LucideIcon
        size={size}
        className={className}
        style={{ width: size, height: size }}
        {...props}
        
      />
    );
  }

  return null;
};

const IconsSelector = ({ visible, onSelect, onCancel=()=>{} }) => {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  console.log(Icons);

  const iconList = useMemo(() => {
    return Object.keys(Icons).filter(
      (key) => Icons[key]?.$$typeof === Symbol.for("react.forward_ref")
    );
  }, []);

  console.log(iconList);
  const filteredIcons = useMemo(() => {
    const trimmedSearch = search.trim().toLowerCase();

    if (trimmedSearch === "") {
      return iconList;
    }
    return iconList.filter((icon) =>
      icon.toLowerCase().includes(trimmedSearch)
    );
  }, [iconList, search]);

  console.log(filteredIcons);

  return (
    <Modal
      closeIcon={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={200}
      className="!max-w-[500px]"
      // Ensure the height is not to exceed the screen height
      style={{ maxHeight: "calc(100vh - 150px)" }}
    >
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-semibold">Choose an icon</h2>

        <button onClick={onCancel}>X</button>
      </div>
      <div className="px-4">
        <Divider className="mt-2 mb-1" />
      </div>
      <div className="px-1">
        <Input
          value={search} // Pass the value of search here
          onChange={(e) => setSearch(e)} // Handle changes to update the search state
          className={"rounded-lg"}
          placeholder="Search icons"
          prefix={
            <Img
              src="/images/img_search_blue_gray_500.svg"
              alt="search"
              className="h-[20px] w-[20px]"
            />
          }
        />
      </div>
      <div
        className="flex flex-wrap gap-7 justify-start items-start p-2 mt-1"
        style={{
          height: "50vh",
          maxHeight: "520px",
          overflowY: "auto",
          padding: "0 10px",
        }}
      >
        {filteredIcons.map((icon) => {
          const isSelected = selectedIcon === icon;
          return (
            <div
              key={icon}
              className={`rounded cursor-pointer h-[40px] w-[40px] hover:text-blue-500`}
              onClick={() => {
                setSelectedIcon(icon);
              }}
            >
              <IconRenderer
                icon={icon}
                className={`${isSelected ? "text-blue-500" : ""}  ${
                  isSelected ? "border-blue-500" : "border-transparent"
                }`}
                size={40}
              />
            </div>
          );
        })}
      </div>
      <div className="px-4">
        <Divider />
      </div>
      <Button
        onClick={() => {
          onSelect(selectedIcon);
          onCancel();
        }}
        shape="round"
        className={`w-full border border-solid  bg-[#0E87FE] text-white-A700 font-semibold smx:px-5 ${
          selectedIcon ? "" : "opacity-50 !cursor-default"
        } `}
      >
        Confirm
      </Button>
    </Modal>
  );
};

export default IconsSelector;
