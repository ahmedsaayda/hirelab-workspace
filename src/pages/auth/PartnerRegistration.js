import { Alert, message } from "antd";
import Cookies from "js-cookie";
import React from "react";
import { useRouter } from "next/router";
import MultiStepComponent from "../Dashboard/Vacancies/components/MultiStepComponent";
import { login, setPartner } from "../../redux/auth/actions";
import { store } from "../../redux/store";
import AuthService from "../../services/AuthService";
import PublicService from "../../services/PublicService";

const partnerRegistrationSteps = [
  {
    id: "step1",
    name: "Basic Information",
    form: [
      {
        fieldName: "brandName",
        label: "Brand Name",
        type: "input",
        placeholder: "Enter your brand name",
        required: true,
      },
      {
        type: "custom",
        CustomInputComponent: () => (
          <>
            <Alert
              type="info"
              message="You will have the opportunity to modify this later"
            />
          </>
        ),
      },
    ],
  },
  {
    id: "step2",
    name: "Personal Information",
    form: [
      {
        fieldName: "firstName",
        label: "First Name",
        type: "input",
        placeholder: "Enter firstname",
        required: true,
      },
      {
        fieldName: "lastName",
        label: "Last Name",
        type: "input",
        placeholder: "Enter lastname",
        required: true,
      },
      {
        fieldName: "email",
        label: "Email",
        type: "input",
        placeholder: "Enter your email",
        required: true,
      },
    ],
  },
  {
    id: "step3",
    name: "Authentication",
    form: [
      {
        fieldName: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
      {
        fieldName: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Retype your password",
        required: true,
      },
    ],
  },
];

const PartnerRegistration = ({ onFinishPartnerRegister }) => {
  const router = useRouter();;
  const handleSubmit = async (e) => {
    console.log(e);
    if (e.confirmPassword !== e.password)
      return message.error("Retyped password does not match");

    const res = await PublicService.signupPartner(e);
    store.dispatch(setPartner(res.data.partner));
    onFinishPartnerRegister();

    const result = await AuthService.login({
      email: e.email,
      password: e.password,
    });
    if (!result?.data?.accessToken)
      return message.error("Could not load user data");

    Cookies.set("accessToken", result?.data?.accessToken);
    Cookies.set("refreshToken", result?.data?.refreshToken);

    const me = await AuthService.me();
    if (!me?.data) return message.error("Could not load user data");

    store.dispatch(login(me.data.me));

    router.push("/dashboard");
  };

  return (
    <>
      <MultiStepComponent
        steps={partnerRegistrationSteps}
        onFinish={handleSubmit}
      />
    </>
  );
};

export default PartnerRegistration;
