// NOTE: In Next.js, routing is file-based. These route components should be moved to individual pages
// import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Forgot from "./Forgot";
import KYC from "./KYC";
import Login from "./Login";
import OTPEmail from "./OTPEmail";
import OTPPhone from "./OTPPhone";
import PasswordReset from "./PasswordReset";
import PartnerRegistration from "./PartnerRegistration";
import Register from "./Register";
import Subscription from "./Subscription";
import VertifyEmail from "./VertifyEmail";

// TODO: Convert to Next.js file-based routing:
// - pages/auth/login.js (Login)
// - pages/auth/register.js (Register) 
// - pages/auth/forgot.js (Forgot)
// etc.

const Auth = () => {
  // In Next.js, this component would be removed and routes would be handled by file structure
  return (
    <div>
      {/* This component needs to be restructured for Next.js file-based routing */}
      {/* Each route should become its own page file */}
    </div>
  );
};

export default Auth;
