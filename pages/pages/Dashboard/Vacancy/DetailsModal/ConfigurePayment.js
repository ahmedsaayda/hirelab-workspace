import React, { useCallback, useEffect, useState } from "react";
// import {
//   Button,
//   Divider,
//   Input,
//   message,
// } from "antd";
import { Button, Form, Input, message, Modal } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../src/redux/auth/selectors";
import UserService from "../../../../../src/services/UserService";

const ConfigurePayment = ({ setBilling, billing }) => {
  const [isModalVisible, setIsModalVisible] = useState(
    billing && !stripeCustomerId
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const user = useSelector(selectUser);
  const stripeCustomerId = user?.subscription?.customer_id;
  const [stripeid, setStripeid] = useState("");

  useEffect(() => {
    setIsModalVisible(billing && !stripeCustomerId);
  }, [billing, stripeCustomerId]);

  //       const cardDetails = {
  //   number: '4242424242424242',
  //   exp_month: 12,
  //   exp_year: 2024,
  //   cvc: '123',
  // };

  const handleOk = async () => {
    try {
      if (currentStep === 0) {
        setCurrentStep(1);
      } else if (currentStep === 1) {
        //LOOK FOR USER ON STRIPE OR CREATE IT - SAVE DE USERID ON DB
        const response = await UserService.getOrCreateStripeUser(user);
        console.log(response);
        if (response && response.data.url) {
          window.location.href = response.data.url;
        } else {
          throw new Error("Failed to get or create Stripe user");
        }
      }
    } catch (error) {
      console.error("Error in handleOk:", error);
    }
  };

  const handleCancel = () => {
    setBilling(false);
    setCurrentStep(0);
    form.resetFields();
  };

  const renderModalContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <p>
            Your campaigns will remain in training mode until you provide a
            valid payment method. Please note that you will only be charged for
            interviews conducted, based on their duration, in accordance with
            our payment policy. Follow the steps to set up your payment method
            in Stripe.
          </p>
        );
      case 1:
        return (
          <p>
            If we find a Stripe account associated with the email you used to
            register, we will automatically connect it. If not, we will create a
            new Stripe account for you. You will then be redirected to Stripe to
            set up your payment method.
          </p>
        );
      // case 2:
      //   return (
      //     <></>
      //   );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title={
          currentStep === 0
            ? "Payment Information"
            : currentStep === 1
            ? "Stripe account"
            : "Card Details"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={
          currentStep === 2 ? "Register payment method on Stripe" : "Next"
        }
        cancelText="Cancel"
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default ConfigurePayment;
