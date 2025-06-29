import { Divider } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getPartner } from "../../redux/auth/selectors";

export function Footer() {
  const partner = useSelector(getPartner);
  const router = useRouter();;

  return (
    <footer>
      {/* <Divider /> */}
      <nav className="mt-10 text-sm" aria-label="quick links">
        <div className="-my-1 flex justify-start gap-x-4">
          {(partner?.termlyPrivacyDataID || partner?.PrivacyText) && (
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push("/dashboard/legal/privacy");
              }}
            >
              Privacy
            </div>
          )}
          {(partner?.termlyTermsDataID || partner?.TermsText) && (
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push("/dashboard/legal/terms");
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
                router.push("/dashboard/legal/acceptableUse");
              }}
            >
              Acceptable Use
            </div>
          )}
          {(partner?.termlyCookieDataID || partner?.CookieText) && (
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push("/dashboard/legal/cookie");
              }}
            >
              Cookies
            </div>
          )}
          {(partner?.termlyDisclaimerDataID || partner?.DisclaimerText) && (
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push("/dashboard/legal/disclaimer");
              }}
            >
              Disclaimer
            </div>
          )}
        </div>
      </nav>
    </footer>
  );
}
