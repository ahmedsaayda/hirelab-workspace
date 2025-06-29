import React, { useState } from "react";
import { Button } from "antd";
import { CheckOutlined, PlusCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../redux/auth/selectors";
import SuccessPage from "../success/index";

export default function LocationPage() {
  const router = useRouter();;
  const user = useSelector(selectUser);
  const allAddresses = user?.allAddresses || [];
  const [selectedCities, setSelectedCities] = useState([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleCitySelect = (city) => {
    if (city === "Other") {
      router.push("/onboarding/location/add");
    } else {
      setSelectedCities((prevSelectedCities) =>
        prevSelectedCities.includes(city)
          ? prevSelectedCities.filter((item) => item !== city)
          : [...prevSelectedCities, city]
      );
    }
  };

  const handleAddLocation = () => {
    router.push("/onboarding/location/add");
  };

  const handleBack = () => {
    router.push("/onboarding/hiring-team");
  };

  const handleSuccessful = () => {
    setIsSuccessModalVisible(true);
  };

  return (
    <div className="bg-white ">
      {/* Main Content */}
      <div className="max-w-3xl py-6 mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Location</h1>
          <p className="text-gray-600">
            Select cities you would like to hire team.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {allAddresses.map((address) => (
            <button
              key={address.city}
              onClick={() => handleCitySelect(address.city)}
              className={`relative flex h-[72px] items-center justify-center rounded-lg border ${selectedCities.includes(address.city)
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-200 hover:bg-gray-50"
                } text-sm transition-colors`}
            >
              {address.city}
              {selectedCities.includes(address.city) && (
                <CheckOutlined className="absolute text-blue-600 right-2 top-2" />
              )}
            </button>
          ))}
          <button
            onClick={() => handleCitySelect('Other')}
            className="relative flex h-[72px] items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <PlusCircleOutlined className="text-blue-600" />
              <span>Other</span>
            </div>
          </button>
        </div>

        <div className="flex justify-between gap-6 pt-6 mt-6 border-t border-gray-200">
          <Button
            type="text"
            className="w-1/2 text-gray-700 border-gray-300"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            type="primary"
            className="w-1/2 custom-button"
            onClick={handleSuccessful}
          >
            Save & Next
          </Button>
        </div>
      </div>

      {/* Help Widget */}
      {/* <div className="fixed flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm bottom-4 right-4">
        <QuestionCircleOutlined className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm font-medium">Having trouble?</p>
          <p className="text-xs text-gray-500">
            Feel free to contact us and we will help you through the process.
          </p>
        </div>
        <Button
          type="link"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          Contact us
        </Button>
      </div> */}
      {isSuccessModalVisible && <SuccessPage onClose={() => setIsSuccessModalVisible(false)} />}
    </div>
  );
}
