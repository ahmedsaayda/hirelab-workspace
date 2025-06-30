import { Modal } from "antd";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { SiGofundme, SiPatreon } from "react-icons/si";
import { useSelector } from "react-redux";
import { getPartner, selectUser } from "../../../src/redux/auth/selectors";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { useRouter } from "next/router";
import Link from "next/link";

export function Footer({ data }) {
  const partner = data || useSelector(getPartner);
  const user = useSelector(selectUser);
  const router = useRouter();

  const socialMediaMap = {
    facebook: <FaFacebook size={25} />,
    twitter: <FaTwitter size={25} />,
    linkedin: <FaLinkedin size={25} />,
    instagram: <FaInstagram size={25} />,
    youtube: <FaYoutube size={25} />,
    pinterest: <FaPinterest size={25} />,
    tiktok: <FaTiktok size={25} />,
    github: <FaGithub size={25} />,
    gofundme: <SiGofundme size={25} />,
    patreon: <SiPatreon size={25} />,
  };

  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <Link href="/" aria-label="Home">
            <Logo className="mx-auto h-10 w-auto" />
          </Link>
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex flex-col justify-start gap-2">
              {(partner?.termlyPrivacyDataID || partner?.PrivacyText) && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`${user ? "/dashboard" : ""}/legal/privacy`);
                  }}
                >
                  Privacy
                </div>
              )}
              {(partner?.termlyTermsDataID || partner?.TermsText) && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`${user ? "/dashboard" : ""}/legal/terms`);
                  }}
                >
                  Terms
                </div>
              )}
              {(partner?.termlyAcceptableUseDataID ||
                partner?.AcceptableUseText) && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`${user ? "/dashboard" : ""}/legal/acceptableUse`);
                  }}
                >
                  Acceptable Use
                </div>
              )}
              {(partner?.termlyCookieDataID || partner?.CookieText) && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`${user ? "/dashboard" : ""}/legal/cookie`);
                  }}
                >
                  Cookies
                </div>
              )}
              {(partner?.termlyDisclaimerDataID || partner?.DisclaimerText) && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`${user ? "/dashboard" : ""}/legal/disclaimer`);
                  }}
                >
                  Disclaimer
                </div>
              )}
              {partner?.termlyConsentBannerID && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    window.displayPreferenceModal();
                    return false;
                  }}
                  id="termly-consent-preferences"
                >
                  Consent Preferences
                </div>
              )}
              {partner?.termlyDSARForm && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://app.termly.io/notify/${partner?.termlyDSARForm}`
                    );
                  }}
                >
                  DSAR
                </div>
              )}
              {partner?.termlyDSARForm && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://app.termly.io/notify/${partner?.termlyDSARForm}`
                    );
                  }}
                >
                  Do Not Sell or Share My Personal information
                </div>
              )}
              {partner?.termlyDSARForm && (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://app.termly.io/notify/${partner?.termlyDSARForm}`
                    );
                  }}
                >
                  Limit the Use Of My Sensitive Personal Information
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            {partner?.socialMedia
              ?.filter?.((media) => !!socialMediaMap?.[media.platform])
              ?.map?.((media) => (
                <Link
                href={media.link}
                  target="_blank"
                  className="group dark:text-black"
                  aria-label={media.platform}
                >
                  {socialMediaMap[media.platform]}
                </Link>
              ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0 smx:pl:5">
            Copyright &copy; {new Date().getFullYear()} {partner?.brandName}.
            All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
