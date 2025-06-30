import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Input, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import LinkService from "../../../../services/LinkService";

const ApplicationLink = ({ shortLink, setShortLink, setlinkModal }) => {
  const [optRequired, setOptRequired] = useState(true);
  const [editedValue, setEditedValue] = useState(shortLink);
  const router = useRouter();
  const { query } = router;

  return (
    <>
      <label className="custom-label-title">Share Link Generated</label>
      <div className="w-full ">
        <label className="custom-label">Share Link</label>
        <div className="flex gap-2 mb-4 items-center ">
          {process.env.NEXT_PUBLIC_SHORTENER_APP_LINK}/
          <Input
            value={editedValue?.split?.("/")?.reverse?.()?.[0]}
            onChange={(e) =>
              setEditedValue(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
            }
            contentEditable={false}
          />
          <button
            className="border border-black border-solid rounded-md p-2"
            onClick={() => {
              navigator.clipboard
                .writeText(shortLink)
                .then(() => {
                  console.log("URL copied to clipboard!");
                  message.info("Link copied successfully!");
                })
                .catch((err) => {
                  console.error("Failed to copy:", err);
                });
            }}
          >
            <DocumentDuplicateIcon
              width={20}
              className="cursor-pointer text-indigo-500"
            />
          </button>
        </div>
        {/* <div className="flex flex-col gap-4">
        <Space size={20} style={{display:"flex", justifyContent:"space-between"}}>
            <div className="flex items-center">
            <label className="custom-label">Require Resume</label>
            <Tooltip overlayInnerStyle={{ 
    backgroundImage: 'linear-gradient(90deg, #0538FF, #6B57F5)', 
    color: 'white', 
    borderRadius: '8px', 
    padding: '10px'
  }}
 title="Tooltip">
      <QuestionMarkCircleIcon width={20} className="text-gray"/>
      </Tooltip>
      </div>
            <Switch />
        </Space>
        <Space size={20} style={{display:"flex", justifyContent:"space-between"}}>
            <label className="custom-label">Opt-In Required</label>
            <Switch/>
        </Space>
        {optRequired &&
        <Input value={"By clicking this button you accept that ACME Corp uses AI for the interview purposes. We do this so we can ensure a fair application process for all and allow you to present your self in full. Your data will be protect ."}/>}
        
        {optRequired &&<Input placeholder="Copy paste your company‘s privacy link"/>}
        </div> */}
        <Divider />
        <div className="grid grid-cols-2 gap-x-2 mt-4">
          <Button onClick={() => setlinkModal(false)}>Cancel</Button>
          <Button
            type="primary"
            onClick={async () => {
              const res = await LinkService.updateShortLink(
                `apply/${query.id}`,
                editedValue
              );
              console.log(res);
              setShortLink(res.data.shortLink);

              message.info("Link updated");
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default ApplicationLink;
