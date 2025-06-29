import { Device } from "@twilio/voice-sdk";
import { Skeleton, Space, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { MdFileCopy } from "react-icons/md";
import CrudService from "../../service/CrudService";
import PhoneService from "../../service/PhoneService";

const PhoneCallBox = ({ candidateId, customerData }) => {
  const [candidateData, setCandidateData] = useState(null);

  const [currentCall, setCurrentCall] = useState(null);

  // Warning on page refresh blocker
  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    // if the form is NOT unchanged, then set the onbeforeunload
    if (currentCall) window.addEventListener("beforeunload", handler);
    // clean it up, if the dirty state changes
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [currentCall]);

  useEffect(() => {
    if (!candidateId) return;
    CrudService.getSingle("VacancySubmission", candidateId).then(({ data }) => {
      if (data) setCandidateData(data);
    });
  }, [candidateId]);

  useEffect(() => {
    if (!customerData) return;
    setCandidateData({ formData: customerData });
  }, [customerData]);

  const handleCall = useCallback(async () => {
    if (!candidateData.formData?.phone) return;

    const phone =
      "+" +
      `${candidateData.formData?.phone}`
        ?.replace?.("'", "")
        ?.replace?.("+", "");

    const result = await PhoneService.startCall({
      customerPhone: phone,
    });

    const device = new Device(result.data.token);
    console.log(device);

    device.connect({
      phone,
    });
    setCurrentCall(device);

    device.on("error", function (error) {
      console.log("Device Error:", error);
    });
    device.on("disconnect", function (disconnect) {
      console.log("Device disconnect:", disconnect);
    });
    device.on("cancel", function (cancel) {
      console.log("Device cancel:", cancel);
    });
    device.on("offline", function (offline) {
      console.log("Device offline:", offline);
    });
  }, [candidateData]);

  useEffect(() => {
    if (!currentCall) return;

    // Check connection every 5 seconds
    const checkCall = () => {
      setTimeout(() => {
        PhoneService.outboundCallConnectionCheck().then((data) => {
          const isActive = data.data.isActive;
          console.log(isActive);
          if (isActive) checkCall();
          else setCurrentCall(null);
        });
      }, 5000);
    };

    checkCall();
  }, [currentCall]);

  const handleHangup = useCallback(() => {
    currentCall?.destroy?.();
    setCurrentCall(null);
  }, [currentCall]);
  useEffect(() => {
    document.addEventListener("HANG_UP_PHONE", handleHangup);
    return () => document.removeEventListener("HANG_UP_PHONE", handleHangup);
  }, [handleHangup]);

  if (!candidateData) return <Skeleton active />;
  return (
    <>
      <h1 className="text-lg font-bold mb-5">Phone Call</h1>
      <div>
        <strong>Candidate:</strong> {candidateData?.formData?.firstname}{" "}
        {candidateData?.formData?.lastname}
      </div>
      <div className=" flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <strong>Number:</strong>
          <a href={`tel:${candidateData.formData?.phone}`}>
            {candidateData.formData?.phone}
          </a>

          <MdFileCopy
            title="Copy Number"
            className="cursor-pointer"
            onClick={async () => {
              navigator.clipboard.writeText(candidateData.formData?.phone);
              message.success("Copied to clipboard");
            }}
          />
        </div>

        {currentCall ? (
          <>
            <button
              className="px-2 py-1 text-sm bg-white dark:bg-gray-900 text-red-400 border border-red-400 rounded mt-2"
              type="primary"
              onClick={() => {
                currentCall?.destroy?.();
                setCurrentCall(null);
              }}
            >
              Hang up
            </button>
          </>
        ) : (
          <button
            className="px-2 py-1 text-sm bg-indigo-500 text-white rounded mt-2"
            key="save"
            type="primary"
            onClick={handleCall}
          >
            <Space className="mt-1">
              <IoMdCall size={18} className="relative" style={{ top: 1 }} />
              <div>Call</div>
            </Space>
          </button>
        )}
      </div>
    </>
  );
};

export default PhoneCallBox;
