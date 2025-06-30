import React from "react";

import { Button, Modal } from "antd";
import { useRouter } from "next/router";
import illustration from "../../../../../pages/assets/img/illustration.png"

export default function SuccessPage({ onClose }) {
  const router = useRouter();;

  return (
    <Modal open={true} onCancel={onClose} footer={null} width={425} centered>
      <div className="py-6">
        <h2 className="mb-4 text-lg font-semibold text-center text-black-900">Success!</h2>
        <div className=" text-center">
          <p className="text-gray-600">
            You have successfully finished onboarding!
          </p>
          <img
            src={illustration}
            alt="Success illustration"
            className="mx-auto my-8"
          />
        </div>
        <div className="w-full border-t mb-4" style={{ borderColor: "#EAECF0" }} />

        <div className="flex justify-between gap-4">
          <Button
            type="text"
            className="w-1/2 text-gray-700 border-gray-300"
            onClick={() => {
              // router.back()

              router.push("/onboarding");
            }}
          >
            Back
          </Button>
          <Button
            type="primary"
            onClick={() => {
              // router.push("/dashboard")
              router.push("/dashboard/media-library");
            }}
            className="flex-1 custom-button"
          >
            Go to Library
          </Button>
        </div>
      </div>
    </Modal>
  );
}
