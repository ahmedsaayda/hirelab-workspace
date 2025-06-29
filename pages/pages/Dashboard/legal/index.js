// NOTE: In Next.js, routing is file-based. These route components should be moved to individual pages
// import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { getPartner } from "../../../redux/auth/selectors";
import AcceptableUse from "./AcceptableUse";
import Cookie from "./Cookie";
import Disclaimer from "./Disclaimer";
import Privacy from "./Privacy";
import Terms from "./Terms";

// TODO: Convert to Next.js file-based routing:
// - pages/dashboard/legal/privacy.js (Privacy)
// - pages/dashboard/legal/terms.js (Terms) 
// - pages/dashboard/legal/cookie.js (Cookie)
// etc.

const Legal = () => {
  // In Next.js, this component would be removed and routes would be handled by file structure
  const partner = useSelector(getPartner);
  return (
    <div>
      {/* This component needs to be restructured for Next.js file-based routing */}
      {/* Each route should become its own page file */}
    </div>
  );
};

export default Legal;
