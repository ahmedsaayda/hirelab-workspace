import React, { useState } from "react";
import { Button, Input, message, Radio, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../src/redux/auth/selectors";
import AuthService from "../../../../../../src/services/AuthService";

const { Text } = Typography;



export default function AddLocation() {
  // const router = useRouter()
  const router = useRouter();;
  const [addressType, setAddressType] = useState("Home");
  const [formData, setFormData] = useState({
    country: "France",
    city: "Lyon",
    officeName: "namename",
    yourLocation: "Lyon",
    street: "namename",
    address: "Lyon",
  });

  const user = useSelector(selectUser);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", { ...formData, addressType });
    // router.push("/location");

    try {
      const allAddresses = [
        ...(user?.allAddresses || []),
        {
          ...formData,
          addressType,
        },
      ];
      const res = await AuthService.updateMe({
        allAddresses: allAddresses,
      });
      console.log("res", res);
      message.success("Address added successfully");
      router.push("/onboarding/location");
    } catch (error) {
      message.error("Failed to add address");
    }
  };

  return (
    <div className="bg-white ">
      <div className="flex">
        <div className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold">Location</h1>
              <p className="text-gray-600">
                Select cities you would like to hire team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    Country
                  </Text>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    City
                  </Text>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    Office Name
                  </Text>
                  <Input
                    name="officeName"
                    value={formData.officeName}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    Your Location
                  </Text>
                  <Input
                    name="yourLocation"
                    value={formData.yourLocation}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    Street
                  </Text>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Text className="mb-1.5 block text-sm text-gray-700">
                    Address
                  </Text>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Text className="mb-1.5 block text-sm text-gray-700">
                  Save Address as
                </Text>
                <Radio.Group
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="mt-1.5 flex gap-8"
                >
                  <Radio value="Home">Home</Radio>
                  <Radio value="Office">Office</Radio>
                  <Radio value="Other">Other</Radio>
                </Radio.Group>
              </div>

              <div className="flex justify-between gap-6 pt-6 border-t border-gray-200">
                <Button
                  type="text"
                  className="w-1/2 text-gray-700 border-gray-300"
                  onClick={() => {
                    router.push(-1);
                  }}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  className="w-1/2 custom-button"
                  htmlType="submit"
                >
                  Add location
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
