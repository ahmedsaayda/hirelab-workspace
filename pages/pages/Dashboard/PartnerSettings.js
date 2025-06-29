/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Alert,
  Button,
  ColorPicker,
  Divider,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Skeleton,
  Space,
  Switch,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { GrInfo } from "react-icons/gr";
import { useSelector } from "react-redux";
import { THEME_OPTIONS } from ".";
import Select from "../../components/Select";
import { brandColor } from "../../data/constants";
import { currencies } from "../../data/currencies";
import { selectDarkMode, selectLoading } from "../../redux/auth/selectors";
import AuthService from "../../service/AuthService";
import PartnerService from "../../service/PartnerService";
import UploadService from "../../service/UploadService";
import { CallToAction } from "../Landing/CallToAction";
import { Faqs } from "../Landing/Faqs";
import { Footer } from "../Landing/Footer";
import { Hero } from "../Landing/Hero";
import { Pricing, featureMap } from "../Landing/Pricing";
import { PrimaryFeatures } from "../Landing/PrimaryFeatures";
import { SecondaryFeatures } from "../Landing/SecondaryFeatures";
import { Testimonials } from "../Landing/Testimonials";
import PartnerOnboard from "../auth/PartnerOnboard";

export const replaceAtIndex = (arr, index, newValue) => {
  // Create a copy of the original array
  const newArray = [...arr];

  // Check if the provided index is within the valid range
  if (index >= 0 && index < newArray.length) {
    // Replace the element at the specified index with the new value
    newArray[index] = newValue;
  } else {
    // Handle the case where the index is out of range
    console.error("Index is out of range");
  }

  // Return the modified array
  return newArray;
};

export const removeAtIndex = (arr, index) => {
  // Create a copy of the original array
  const newArray = [...arr];

  // Check if the provided index is within the valid range
  if (index >= 0 && index < newArray.length) {
    // Use splice() to remove the element at the specified index
    newArray.splice(index, 1);
  } else {
    // Handle the case where the index is out of range
    console.error("Index is out of range");
  }

  // Return the modified array
  return newArray;
};
function getColorFun(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (Math.ceil(r) << 16) + (Math.ceil(g) << 8) + Math.ceil(b))
      .toString(16)
      .slice(1)
  );
}

export default function Example() {
  const [me, setMe] = useState(null);
  const [softValue, setSoftValue] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [smtp, setSmtp] = useState(null);
  const [SMTPModal, setSMTPModal] = useState(false);
  const loading = useSelector(selectLoading);
  const darkMode = useSelector(selectDarkMode);

  const fileInput2 = useRef(null);
  const fileInput3 = useRef(null);
  const fileInput7 = useRef(null);
  const fileInput8 = useRef(null);

  useEffect(() => {
    fileInput3.current = document.getElementById("fileInput3");

    fileInput3.current.addEventListener("change", async () => {
      const selectedFile = fileInput3.current.files[0]; // Get the selected file
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 1);
        await AuthService.updatePartnerConfig({
          authImage: result.data.secure_url,
        });
        const res = await PartnerService.getPartnerSecretConfig();
        setMe(res.data.partner);

        const data = await AuthService.me();
        setOnboardingStatus(data.data.onboardingStatus);
        document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
      } else {
        console.log("No file selected.");
      }
    });
  }, []);

  useEffect(() => {
    fileInput2.current = document.getElementById("fileInput2");

    fileInput2.current.addEventListener("change", async () => {
      const selectedFile = fileInput2.current.files[0]; // Get the selected file
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 1);
        await AuthService.updatePartnerConfig({
          logo: result.data.secure_url,
        });
        const res = await PartnerService.getPartnerSecretConfig();
        setMe(res.data.partner);

        const data = await AuthService.me();
        setOnboardingStatus(data.data.onboardingStatus);
        document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
      } else {
        console.log("No file selected.");
      }
    });
  }, []);

  useEffect(() => {
    fileInput7.current = document.getElementById("fileInput7");

    fileInput7.current.addEventListener("change", async () => {
      const selectedFile = fileInput7.current.files[0];
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 1);
        await AuthService.updatePartnerConfig({
          dashboardLogo: result.data.secure_url,
        });
        const res = await PartnerService.getPartnerSecretConfig();
        setMe(res.data.partner);

        const data = await AuthService.me();
        setOnboardingStatus(data.data.onboardingStatus);
        document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
      } else {
        console.log("No file selected.");
      }
    });
  }, []);

  useEffect(() => {
    fileInput8.current = document.getElementById("fileInput8");

    fileInput8.current.addEventListener("change", async () => {
      const selectedFile = fileInput8.current.files[0];
      if (selectedFile) {
        const result = await UploadService.upload(selectedFile, 1);
        await AuthService.updatePartnerConfig({
          favicon: result.data.secure_url,
        });
        const res = await PartnerService.getPartnerSecretConfig();
        setMe(res.data.partner);

        const data = await AuthService.me();
        setOnboardingStatus(data.data.onboardingStatus);
        document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
      } else {
        console.log("No file selected.");
      }
    });
  }, []);

  const handleUpdate = useCallback(async () => {
    await AuthService.updatePartnerConfig(softValue);
    const res = await PartnerService.getPartnerSecretConfig();
    setMe(res.data.partner);

    const data = await AuthService.me();
    setOnboardingStatus(data.data.onboardingStatus);
    document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
  }, [softValue]);

  useEffect(() => {
    setSoftValue(me);
    setSmtp(me?.smtp ?? null);
  }, [me]);

  useEffect(() => {
    PartnerService.getPartnerSecretConfig().then((data) => {
      setMe(data.data.partner);
      AuthService.me().then((data) => {
        setOnboardingStatus(data.data.onboardingStatus);
      });
    });
  }, []);

  const getProps = (fieldKey, required = false) => ({
    value: softValue?.[fieldKey],
    onChange: (e) => {
      if (!e?.target?.value && required) return;
      setSoftValue((current) => ({
        ...current,
        [fieldKey]: e?.target?.value ?? e,
      }));
    },
  });

  const items = [
    {
      key: "1",
      label: "General",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              General
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Setup the core details of your business.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.brandName ? "text-red font-semibold" : ""
                  }`}
                >
                  Brand name
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("brandName", true)}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.siteTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  Site Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("siteTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.metaDescription ? "text-red font-semibold" : ""
                  }`}
                >
                  Meta Description
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("metaDescription")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8 col-span-full">
              <label
                htmlFor="logo"
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                  !softValue?.logo ? "text-red font-semibold" : ""
                }`}
              >
                Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {me?.logo ? (
                  <img
                    className="h-12 w-12 text-gray-300 rounded-full"
                    src={me.logo}
                  />
                ) : (
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    fileInput2.current.click();
                  }}
                >
                  Change
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Set your brand apart! Your logo is a pivotal aspect of your
                brand identity, appearing on your website, emails, and marketing
                materials. It's essential for brand recognition and user trust.
                Ensure your logo is clear, distinctive, and aligns with your
                brand's aesthetic. We recommend using a high-resolution PNG or
                SVG file for crisp display across all devices and screen sizes.
                The ideal dimensions are 40x40.
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8 col-span-full ">
              <label
                htmlFor="logo"
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
              >
                Dashboard Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {me?.dashboardLogo ? (
                  <img
                    className="h-12 w-12 text-gray-300 rounded-full bg-gray-200 bg-center"
                    src={me.dashboardLogo}
                  />
                ) : (
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    fileInput7.current.click();
                  }}
                >
                  Change
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={async () => {
                    await AuthService.updatePartnerConfig({
                      ...softValue,
                      dashboardLogo: "",
                    });
                    const res = await PartnerService.getPartnerSecretConfig();
                    setMe(res.data.partner);

                    const data = await AuthService.me();
                    setOnboardingStatus(data.data.onboardingStatus);
                    document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));
                  }}
                >
                  Remove
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Uploading a dashboard logo is an optional feature. In the
                absence of a custom logo, our system will utilize your default
                logo, which is displayed above the sidebar menu in your
                dashboard.
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8 col-span-full">
              <label
                htmlFor="photo"
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                  !softValue?.favicon ? "text-red font-semibold" : ""
                }`}
              >
                Favicon
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {me?.favicon ? (
                  <img
                    className="h-12 w-12 text-gray-300 rounded-full"
                    src={me.favicon}
                  />
                ) : (
                  <UserCircleIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    fileInput8.current.click();
                  }}
                >
                  Change
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Upload a clean favicon here. A favicon is the small, iconic
                image that represents your website in a browser's tab,
                bookmarks, and history. It's often the first visual element
                users notice when they find your site, making it a crucial part
                of your branding. Choose a favicon that's simple, recognizable,
                and reflects your brand's identity. Accepted formats are .ico,
                .png, and .jpg. The ideal size is 32x32 or 16x16 pixels for
                optimal clarity across devices.
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Prefer simple colors on marketing website
              </label>
              <div>
                <Switch
                  checked={softValue?.lpSimpleColors}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      lpSimpleColors: e,
                    })
                  }
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Activate this option if you don't like the{" "}
                <a
                  href="/images/background-auth.jpg"
                  target="_blank"
                  className="text-blue-600 font-bold"
                >
                  blurry blue background
                </a>
                .
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8 col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Authentication Page Background
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {me?.authImage ? (
                  <img
                    className="h-24 w-24 text-gray-300 "
                    src={me.authImage}
                  />
                ) : (
                  <Skeleton.Image />
                )}
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={async () => {
                    fileInput3.current.click();
                  }}
                >
                  Change
                </button>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                This is the picture that will show up on authentication page.
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Trial days
              </label>
              <div>
                <InputNumber
                  value={softValue?.trialDays}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      trialDays: e,
                    })
                  }
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Here, you can set the duration of the free trial period for new
                users. Enter the number of days to grant users access to your
                platform without needing immediate payment. Setting this period
                allows potential customers to explore and understand the value
                of your service risk-free, enhancing user acquisition and
                satisfaction. If you set the trial days to '0', users will be
                required to provide their credit card details to start using the
                system immediately. This can be an effective approach for
                immediate revenue generation or for services targeting committed
                users from the start.
              </p>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Default Currency
              </label>
              <div>
                <Select
                  options={currencies.map((currency) => ({
                    value: currency.iso,
                    label: `${currency.title} (${currency.symbol})`,
                  }))}
                  {...getProps("currency")}
                  className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "2",
      label: "Theme Configuration",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Theme Configuration
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Adjust the UI according to your preferences.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                >
                  Theme
                </label>
                <Select
                  options={THEME_OPTIONS}
                  value={softValue?.theme}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      theme: e,
                    })
                  }
                />
              </div>
              <br />
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                >
                  Theme Color
                </label>
                <ColorPicker
                  value={softValue?.themeColor ?? brandColor}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      themeColor: getColorFun(
                        e.metaColor.r,
                        e.metaColor.g,
                        e.metaColor.b
                      ),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },

    {
      key: "5",
      label: "Hero Section",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Hero Section
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your hero section on the marketing
              website here.
            </p>
          </div>

          <form
            className="bg-white  shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Hero data={softValue} />

            <div className="px-4 py-6 sm:p-8">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Display video at hero section
              </label>
              <div>
                <Switch
                  checked={softValue?.videoAtHeroActive}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      videoAtHeroActive: e,
                    })
                  }
                />
              </div>
            </div>

            {softValue?.videoAtHeroActive && (
              <div className="px-4 py-6 sm:p-8">
                <div className="sm:col-span-2">
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Video source
                  </label>
                  <div>
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                      {...getProps("videoAtHero")}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.heroTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  Hero title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("heroTitle")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.heroSubline ? "text-red font-semibold" : ""
                  }`}
                >
                  Hero subline
                </label>
                <div>
                  <textarea
                    rows={5}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("heroSubline")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.heroCTA ? "text-red font-semibold" : ""
                  }`}
                >
                  Hero CTA
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("heroCTA")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
              >
                Include trusted companies below hero section
              </label>
              <div>
                <Switch
                  checked={softValue?.includeTrustedCompanies}
                  onChange={(e) =>
                    setSoftValue({
                      ...me,
                      includeTrustedCompanies: e,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "6",
      label: "Primary Features",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Primary Features
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your primary features on the marketing
              website here.
            </p>
          </div>

          <form
            className="bg-white  shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <PrimaryFeatures data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.primaryFeaturesTitle
                      ? "text-red font-semibold"
                      : ""
                  }`}
                >
                  Primary Features Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("primaryFeaturesTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.primaryFeaturesSubline
                      ? "text-red font-semibold"
                      : ""
                  }`}
                >
                  Primary Features Subline
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("primaryFeaturesSubline")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="mt-2">
                {softValue?.primaryFeatures?.map?.((link, index) => (
                  <div key={index} className="flex space-x-2 items-start">
                    <div className="block w-1/2">
                      <input
                        type="text"
                        className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        placeholder="Link"
                        value={link.title}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            primaryFeatures: replaceAtIndex(
                              v.primaryFeatures,
                              index,
                              {
                                title: e.target.value,
                                description:
                                  v.primaryFeatures[index].description,
                                image: v.primaryFeatures[index].image,
                              }
                            ),
                          }));
                        }}
                      />

                      <div className="mt-2 flex items-center gap-x-3">
                        {link?.image ? (
                          <img
                            className="h-12 w-12 text-gray-300"
                            src={link.image}
                          />
                        ) : (
                          <Skeleton.Image />
                        )}
                        <button
                          type="button"
                          className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => {
                            const fileInputId = `fileInput-${index}`;
                            const fileInput =
                              document.getElementById(fileInputId);
                            fileInput.click();
                          }}
                        >
                          Change
                        </button>

                        <input
                          type="file"
                          id={`fileInput-${index}`}
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile) {
                              const result = await UploadService.upload(
                                selectedFile,
                                3
                              );
                              // Update the link with the new image URL
                              setSoftValue((v) => ({
                                ...v,
                                primaryFeatures: replaceAtIndex(
                                  v.primaryFeatures,
                                  index,
                                  {
                                    ...v.primaryFeatures[index],
                                    image: result.data.secure_url, // Assuming result.data.secure_url is the URL of the uploaded image
                                  }
                                ),
                              }));
                            } else {
                              console.log("No file selected.");
                            }
                          }}
                        />
                      </div>
                      <p className="text-sm">Ratio should be 3:2</p>
                    </div>

                    <textarea
                      rows={5}
                      type="text"
                      placeholder="Link"
                      className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                      value={link.description}
                      onChange={(e) => {
                        setSoftValue((v) => ({
                          ...v,
                          primaryFeatures: replaceAtIndex(
                            v.primaryFeatures,
                            index,
                            {
                              title: v.primaryFeatures[index].title,
                              description: e.target.value,
                              image: v.primaryFeatures[index].image,
                            }
                          ),
                        }));
                      }}
                    />

                    <FaDeleteLeft
                      size={25}
                      title="Delete"
                      color="#333"
                      className="cursor-pointer"
                      onClick={() =>
                        setSoftValue((v) => ({
                          ...v,
                          primaryFeatures: removeAtIndex(
                            v.primaryFeatures,
                            index
                          ),
                        }))
                      }
                    />
                  </div>
                ))}
                <button
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    softValue?.primaryFeatures?.length < 3
                      ? "text-red font-semibold"
                      : ""
                  }`}
                  onClick={(e) => {
                    setSoftValue((v) => ({
                      ...v,
                      primaryFeatures: [
                        ...v.primaryFeatures,
                        { title: "", description: "", image: "" },
                      ],
                    }));
                  }}
                >
                  + Add Feature
                </button>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  This section is to give a first idea of the feature set that
                  your platform offers.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },

    {
      key: "20",
      label: "Secondary Features",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Secondary Features
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your secondary features on the marketing
              website here.
            </p>
          </div>

          <form
            className="bg-white  shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <SecondaryFeatures data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.secondaryFeaturesTitle
                      ? "text-red font-semibold"
                      : ""
                  }`}
                >
                  Core Values Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("secondaryFeaturesTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.secondaryFeaturesSubline
                      ? "text-red font-semibold"
                      : ""
                  }`}
                >
                  Core Values Subline
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("secondaryFeaturesSubline")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="mt-2">
                {softValue?.secondaryFeatures?.map?.((link, index) => (
                  <div key={index}>
                    <div className="flex space-x-2 items-start">
                      <div className="block w-1/2">
                        <input
                          type="text"
                          className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                          placeholder="Link"
                          value={link.name}
                          onChange={(e) => {
                            setSoftValue((v) => ({
                              ...v,
                              secondaryFeatures: replaceAtIndex(
                                v.secondaryFeatures,
                                index,
                                {
                                  ...v.secondaryFeatures[index],
                                  name: e.target.value,
                                }
                              ),
                            }));
                          }}
                        />
                        <input
                          type="text"
                          className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                          placeholder="Link"
                          value={link.summary}
                          onChange={(e) => {
                            setSoftValue((v) => ({
                              ...v,
                              secondaryFeatures: replaceAtIndex(
                                v.secondaryFeatures,
                                index,
                                {
                                  ...v.secondaryFeatures[index],
                                  summary: e.target.value,
                                }
                              ),
                            }));
                          }}
                        />

                        <div className="mt-2 flex items-center gap-x-3">
                          {link?.image ? (
                            <img
                              className="h-12 w-12 text-gray-300"
                              src={link.image}
                            />
                          ) : (
                            <Skeleton.Image />
                          )}
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              const fileInputId = `fileInput-2-${index}`;
                              const fileInput =
                                document.getElementById(fileInputId);
                              fileInput.click();
                            }}
                          >
                            Change
                          </button>

                          <input
                            type="file"
                            id={`fileInput-2-${index}`}
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const selectedFile = e.target.files[0];
                              if (selectedFile) {
                                const result = await UploadService.upload(
                                  selectedFile,
                                  3
                                );
                                // Update the link with the new image URL
                                setSoftValue((v) => ({
                                  ...v,
                                  secondaryFeatures: replaceAtIndex(
                                    v.secondaryFeatures,
                                    index,
                                    {
                                      ...v.secondaryFeatures[index],
                                      image: result.data.secure_url, // Assuming result.data.secure_url is the URL of the uploaded image
                                    }
                                  ),
                                }));
                              } else {
                                console.log("No file selected.");
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm">Ratio should be 3:2</p>

                        <div className="mt-2 flex items-center gap-x-3">
                          {link?.icon ? (
                            <div className={"w-9 rounded-lg bg-slate-500"}>
                              <img
                                src={link.icon}
                                alt=""
                                style={{ width: 36, height: 36 }}
                              />
                            </div>
                          ) : (
                            <Skeleton.Image />
                          )}
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              const fileInputId = `fileInput-3-${index}`;
                              const fileInput =
                                document.getElementById(fileInputId);
                              fileInput.click();
                            }}
                          >
                            Change
                          </button>

                          <input
                            type="file"
                            id={`fileInput-3-${index}`}
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const selectedFile = e.target.files[0];
                              if (selectedFile) {
                                const result = await UploadService.upload(
                                  selectedFile,
                                  1
                                );
                                // Update the link with the new icon URL
                                setSoftValue((v) => ({
                                  ...v,
                                  secondaryFeatures: replaceAtIndex(
                                    v.secondaryFeatures,
                                    index,
                                    {
                                      ...v.secondaryFeatures[index],
                                      icon: result.data.secure_url, // Assuming result.data.secure_url is the URL of the uploaded image
                                    }
                                  ),
                                }));
                              } else {
                                console.log("No file selected.");
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm">Ratio should be 1:1</p>
                      </div>

                      <textarea
                        rows={5}
                        type="text"
                        placeholder="Link"
                        className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.description}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            secondaryFeatures: replaceAtIndex(
                              v.secondaryFeatures,
                              index,
                              {
                                ...v.secondaryFeatures[index],
                                description: e.target.value,
                              }
                            ),
                          }));
                        }}
                      />

                      <FaDeleteLeft
                        size={25}
                        title="Delete"
                        color="#333"
                        className="cursor-pointer"
                        onClick={() =>
                          setSoftValue((v) => ({
                            ...v,
                            secondaryFeatures: removeAtIndex(
                              v.secondaryFeatures,
                              index
                            ),
                          }))
                        }
                      />
                    </div>
                    <Divider />
                  </div>
                ))}
                <button
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    softValue?.secondaryFeatures?.length < 3
                      ? "text-red font-semibold"
                      : ""
                  }`}
                  onClick={(e) => {
                    setSoftValue((v) => ({
                      ...v,
                      secondaryFeatures: [
                        ...v.secondaryFeatures,
                        {
                          name: "",
                          summary: "",
                          description: "",
                          image: "",
                          icon: "",
                        },
                      ],
                    }));
                  }}
                >
                  + Add Value
                </button>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  This section is to summarize the core value of your software
                  for the user.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "21",
      label: "CTA",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              CTA
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your CTA on the marketing website here.
            </p>
          </div>

          <form
            className="bg-white  shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <CallToAction data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.ctaTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  CTA Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("ctaTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.ctaSubtext ? "text-red font-semibold" : ""
                  }`}
                >
                  CTA Subtext
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("ctaSubtext")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.ctaButtontext ? "text-red font-semibold" : ""
                  }`}
                >
                  CTA Button
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("ctaButtontext")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "22",
      label: "Testimonials",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Testimonials
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your testimonials on the marketing
              website here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Testimonials data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.socialProofTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  Testimonial Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("socialProofTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.socialProofSubtext
                      ? "text-red font-semibold"
                      : ""
                  }`}
                >
                  Testimonial Subline
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("socialProofSubtext")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="mt-2">
                {softValue?.reviews?.map?.((link, index) => (
                  <div key={index}>
                    <div key={index} className="flex space-x-2 items-start">
                      <div className="block w-1/2">
                        <input
                          type="text"
                          className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                          placeholder="Link"
                          value={link.author.name}
                          onChange={(e) => {
                            setSoftValue((v) => ({
                              ...v,
                              reviews: replaceAtIndex(v.reviews, index, {
                                ...v.reviews[index],
                                author: {
                                  ...v.reviews[index].author,
                                  name: e.target.value,
                                },
                              }),
                            }));
                          }}
                        />
                        <input
                          type="text"
                          className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                          placeholder="Link"
                          value={link.author.role}
                          onChange={(e) => {
                            setSoftValue((v) => ({
                              ...v,
                              reviews: replaceAtIndex(v.reviews, index, {
                                ...v.reviews[index],
                                author: {
                                  ...v.reviews[index].author,
                                  role: e.target.value,
                                },
                              }),
                            }));
                          }}
                        />

                        <div className="mt-2 flex items-center gap-x-3">
                          {link.author.image ? (
                            <img
                              className="h-10 w-10 text-gray-300 rounded-full"
                              src={link.author.image}
                            />
                          ) : (
                            <UserCircleIcon
                              className="h-12 w-12 text-gray-300"
                              aria-hidden="true"
                            />
                          )}
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              const fileInputId = `fileInput-5-${index}`;
                              const fileInput =
                                document.getElementById(fileInputId);
                              fileInput.click();
                            }}
                          >
                            Change
                          </button>

                          <input
                            type="file"
                            id={`fileInput-5-${index}`}
                            style={{ display: "none" }}
                            onChange={async (e) => {
                              const selectedFile = e.target.files[0];
                              if (selectedFile) {
                                const result = await UploadService.upload(
                                  selectedFile,
                                  3
                                );
                                // Update the link with the new image URL
                                setSoftValue((v) => ({
                                  ...v,
                                  reviews: replaceAtIndex(v.reviews, index, {
                                    ...v.reviews[index],
                                    author: {
                                      ...v.reviews[index].author,
                                      image: result.data.secure_url,
                                    },
                                  }),
                                }));
                              } else {
                                console.log("No file selected.");
                              }
                            }}
                          />
                        </div>
                        <p className="text-sm">Ratio should be 1:1</p>
                      </div>

                      <textarea
                        rows={5}
                        type="text"
                        placeholder="Link"
                        className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.content}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            reviews: replaceAtIndex(v.reviews, index, {
                              ...v.reviews[index],
                              content: e.target.value,
                            }),
                          }));
                        }}
                      />

                      <FaDeleteLeft
                        size={25}
                        title="Delete"
                        color="#333"
                        className="cursor-pointer"
                        onClick={() =>
                          setSoftValue((v) => ({
                            ...v,
                            reviews: removeAtIndex(v.reviews, index),
                          }))
                        }
                      />
                    </div>
                    <Divider />
                  </div>
                ))}
                <button
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    softValue?.reviews?.length < 4
                      ? "text-red font-semibold"
                      : ""
                  }`}
                  onClick={(e) => {
                    setSoftValue((v) => ({
                      ...v,
                      reviews: [
                        ...v.reviews,
                        {
                          content: "",
                          author: { name: "", role: "", image: "" },
                        },
                      ],
                    }));
                  }}
                >
                  + Add Testimonial
                </button>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  This section is to give a first idea of the feature set that
                  your platform offers.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "23",
      label: "Pricing",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Pricing
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure your pricing model here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Pricing data={softValue} />

            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.pricingTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  Pricing Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("pricingTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.pricingSubtext ? "text-red font-semibold" : ""
                  }`}
                >
                  Pricing Subline
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("pricingSubtext")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.pricingCTA ? "text-red font-semibold" : ""
                  }`}
                >
                  Pricing CTA
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("pricingCTA")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="mt-2">
                {softValue?.pricing?.map?.((link, index) => (
                  <div key={index}>
                    <div className="flex space-x-2 items-center">
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.name}
                        placeholder="Package name"
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              name: e.target.value,
                            }),
                          }));
                        }}
                      />
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.description}
                        placeholder="Package description"
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              description: e.target.value,
                            }),
                          }));
                        }}
                      />

                      <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={async () => {
                          const res =
                            await PartnerService.checkPricingDeletable(
                              softValue.pricing[index]._id
                            );

                          if (!res.data.deletable)
                            return message.error(
                              `Unable to delete: ${res.data.count} users are currently subscribed to this package.`
                            );

                          setSoftValue((v) => ({
                            ...v,
                            pricing: removeAtIndex(v.pricing, index),
                          }));
                        }}
                      >
                        <FaDeleteLeft
                          size={50}
                          title="Delete"
                          color="#f00"
                          className="cursor-pointer"
                        />
                      </Popconfirm>
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Monthly price
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.monthlyPrice / 100}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              monthlyPrice: Math.max(0, e * 100),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Annual price
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.annualPrice / 100}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              annualPrice: Math.max(0, e * 100),
                            }),
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Maximum funnels
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.maxFunnels}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              maxFunnels: Math.max(0, e),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Maximum candidates
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.maxCandidates}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              maxCandidates: Math.max(0, e),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Maximum message templates
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.maxMessaging}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              maxMessaging: Math.max(0, e),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Maximum team mates
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.maxTeamSize}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              maxTeamSize: Math.max(0, e),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Extra monthly price per team mate
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.extraPerTeamMonthly / 100}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              extraPerTeamMonthly: Math.max(0, e * 100),
                            }),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                        Extra annual price per team mate
                      </label>
                      <InputNumber
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        value={link.extraPerTeamAnnual / 100}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            pricing: replaceAtIndex(v.pricing, index, {
                              ...v.pricing[index],
                              extraPerTeamAnnual: Math.max(0, e * 100),
                            }),
                          }));
                        }}
                      />
                    </div>

                    {Object.keys(featureMap).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 ">
                          {featureMap[key]}
                        </label>
                        <Switch
                          checked={link.features.includes(key)}
                          onChange={(e) => {
                            setSoftValue((v) => {
                              let features = [...v.pricing[index].features];
                              if (e && !features.includes(key))
                                features.push(key);
                              else if (!e && features.includes(key))
                                features = features.filter((a) => a !== key);

                              return {
                                ...v,
                                pricing: replaceAtIndex(v.pricing, index, {
                                  ...v.pricing[index],
                                  features,
                                }),
                              };
                            });
                          }}
                        />
                      </div>
                    ))}

                    <Divider />
                  </div>
                ))}
                <button
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    softValue?.pricing?.length === 0
                      ? "text-red font-semibold"
                      : ""
                  }`}
                  onClick={(e) => {
                    setSoftValue((v) => ({
                      ...v,
                      pricing: [
                        ...v.pricing,
                        {
                          monthlyPrice: 0,
                          annualPrice: 0,
                          name: "",
                          description: "",
                          maxFunnels: 0,
                          maxCandidates: 0,
                          maxMessaging: 0,
                          maxTeamSize: 0,
                          extraPerTeamMonthly: 0,
                          extraPerTeamAnnual: 0,
                          features: [],
                        },
                      ],
                    }));
                  }}
                >
                  + Add Price
                </button>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Adjust the pricing model of your SaaS business.
                </p>
                <Divider />
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "543",
      label: "RC System",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              RC System
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the parameters of the rechargable credit system and
              anything related to the usage-based fees of the platform. Charge
              your users for their usage, and make profits each time they use
              your services.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    RC Exchange ($)
                  </label>
                  <Tooltip title="This is equivalent $ amount of 1 RC.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("default_rcToDollarExchange")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Default Credit
                  </label>
                  <Tooltip title="This is the free credits a users should have in their account upon successful registration.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("default_rcCredit")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Minimum Purchase Amount
                  </label>
                  <Tooltip title="This is the minimum amount of RC a user can choose when purchasing RC.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("default_minimumRCPurchase")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Maximum Purchase Amount
                  </label>
                  <Tooltip title="This is the maximum amount of RC a user can choose when purchasing RC.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("default_maximumRCPurchase")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    RC Cost per SMS
                  </label>
                  <Tooltip title="This is the amount of RC required for sending 1 SMS.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("smsRCCost")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    RC Cost per Minute of Phone Call
                  </label>
                  <Tooltip title="This is the amount of RC required for making 1 minute of phone call.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("minuteCallRCCost")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Resale Factor for Candidate Sourcing
                  </label>
                  <Tooltip title="This configuration is to decide how many times more your users is charged for using the candidate sourcing system compared to your cost.">
                    <GrInfo />
                  </Tooltip>
                </Space>
                <div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("candidateSourcingProfitFactor")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "24",
      label: "FAQ",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              FAQs
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your FAQs on the marketing website here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Faqs data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.faqTitle ? "text-red font-semibold" : ""
                  }`}
                >
                  FAQ Title
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("faqTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.faqSubtext ? "text-red font-semibold" : ""
                  }`}
                >
                  FAQ Subline
                </label>
                <div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("faqSubtext")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              {softValue?.FAQ?.map?.((link, index) => (
                <div key={index}>
                  <div key={index} className="flex space-x-2 items-start">
                    <div className="block w-1/2">
                      <input
                        type="text"
                        className="rounded-md w-full border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        placeholder="Link"
                        value={link.question}
                        onChange={(e) => {
                          setSoftValue((v) => ({
                            ...v,
                            FAQ: replaceAtIndex(v.FAQ, index, {
                              ...v.FAQ[index],
                              question: e.target.value,
                            }),
                          }));
                        }}
                      />
                    </div>

                    <textarea
                      rows={5}
                      type="text"
                      placeholder="Link"
                      className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                      value={link.answer}
                      onChange={(e) => {
                        setSoftValue((v) => ({
                          ...v,
                          FAQ: replaceAtIndex(v.FAQ, index, {
                            ...v.FAQ[index],
                            answer: e.target.value,
                          }),
                        }));
                      }}
                    />

                    <FaDeleteLeft
                      size={25}
                      title="Delete"
                      color="#333"
                      className="cursor-pointer"
                      onClick={() =>
                        setSoftValue((v) => ({
                          ...v,
                          FAQ: removeAtIndex(v.FAQ, index),
                        }))
                      }
                    />
                  </div>
                  <Divider />
                </div>
              ))}
              <button
                onClick={(e) => {
                  setSoftValue((v) => ({
                    ...v,
                    FAQ: [
                      ...v.FAQ,
                      {
                        content: "",
                        author: { name: "", role: "", image: "" },
                      },
                    ],
                  }));
                }}
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                  softValue?.FAQ?.length < 4 ? "text-red font-semibold" : ""
                }`}
              >
                + Add FAQ
              </button>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Here you can add commonly asked questions by your prospects.
              </p>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: "25",
      label: "Footer",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Footer
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your footer on the marketing website
              here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Footer data={softValue} />
            <div className="px-4 py-6 sm:p-8">
              <div className="mt-2">
                {softValue?.socialMedia?.map?.((link, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    <Select
                      options={[
                        { value: "facebook", label: "Facebook" },
                        { value: "twitter", label: "Twitter" },
                        { value: "linkedin", label: "LinkedIn" },
                        { value: "instagram", label: "Instagram" },
                        { value: "youtube", label: "YouTube" },
                        { value: "pinterest", label: "Pinterest" },
                        { value: "tiktok", label: "TikTok" },
                        { value: "github", label: "GitHub" },
                        { value: "gofundme", label: "GoFundMe" },
                        { value: "patreon", label: "Patreon" },
                      ]}
                      onChange={(e) => {
                        setSoftValue((v) => ({
                          ...v,
                          socialMedia: replaceAtIndex(v.socialMedia, index, {
                            link: v.socialMedia[index].link,
                            platform: e,
                          }),
                        }));
                      }}
                      value={link.platform}
                      className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    />
                    <input
                      type="text"
                      placeholder="Link"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                      value={link.link}
                      onChange={(e) => {
                        setSoftValue((v) => ({
                          ...v,
                          socialMedia: replaceAtIndex(v.socialMedia, index, {
                            platform: v.socialMedia[index].platform,
                            link: e.target.value,
                          }),
                        }));
                      }}
                    />

                    <FaDeleteLeft
                      size={25}
                      title="Delete"
                      color="#333"
                      className="cursor-pointer"
                      onClick={() =>
                        setSoftValue((v) => ({
                          ...v,
                          socialMedia: removeAtIndex(v.socialMedia, index),
                        }))
                      }
                    />
                  </div>
                ))}
                <button
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    softValue?.socialMedia?.length === 0
                      ? "text-red font-semibold"
                      : ""
                  }`}
                  onClick={(e) => {
                    setSoftValue((v) => ({
                      ...v,
                      socialMedia: [
                        ...v.socialMedia,
                        { link: "", platform: "facebook" },
                      ],
                    }));
                  }}
                >
                  + Add Social Link
                </button>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Connect with your audience by sharing your social media
                  profiles.
                </p>
                <Divider />
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },

    {
      key: "7",
      label: "Legals",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Legals
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Configure the content of your legal pages here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <h2 className="text-lg font-bold">Termly Legal Texts</h2>
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
                >
                  Termly Privacy Policy ID
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("termlyPrivacyDataID")}
                  />
                </div>
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
                >
                  Termly Terms and Conditions ID
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("termlyTermsDataID")}
                  />
                </div>
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
                >
                  Termly Acceptable Use Policy ID
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("termlyAcceptableUseDataID")}
                  />
                </div>
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
                >
                  Termly Cookie Policy ID
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("termlyCookieDataID")}
                  />
                </div>
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
                >
                  Termly Disclaimer ID
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("termlyDisclaimerDataID")}
                  />
                </div>
              </div>

              <Divider />
              <h2 className="text-lg font-bold">Termly Widgets</h2>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Termly Consent
              </label>
              <div>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                  {...getProps("termlyConsentBannerID")}
                />
              </div>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Termly DSAR Form
              </label>
              <div>
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                  {...getProps("termlyDSARForm")}
                />
              </div>

              <Divider />
              <h2 className="text-lg font-bold">Rich text</h2>

              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Privacy Policy
              </label>
              <div className="dark:text-black">
            
              </div>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Terms and Conditions
              </label>
              <div className="dark:text-black">
              
              </div>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Acceptable Use Policy
              </label>
              <div className="dark:text-black">
            
              </div>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Cookie Policy
              </label>
              <div className="dark:text-black">
             
              </div>
              <label
                className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  mt-2`}
              >
                Disclaimer
              </label>
              <div className="dark:text-black">
            
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },

    {
      key: "31",
      label: "API",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              API
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Setup third party API integrations with your SaaS business.
            </p>
            {softValue?.disableAPIEdit && (
              <Alert
                type="info"
                className="mt-2"
                message={
                  <>
                    <div className="flex justify-end">
                      <FaLock />
                    </div>
                    To maintain the highest standards of service continuity and
                    uptime, we have prudently restricted the ability to modify
                    certain API settings. This measure is essential to prevent
                    any inadvertent disruptions to the services that your users
                    rely on. Should you need to alter any configurations, we
                    kindly request that you reach out to us at{" "}
                    <a href="mailto:info@booklified.com">info@booklified.com</a>{" "}
                    for expert assistance and guidance.
                  </>
                }
              />
            )}
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <PartnerOnboard hideWelcome />
          </form>
        </div>
      ),
    },
    {
      key: "32",
      label: "Support",
      children: (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Support
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Setup your support configuration.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                >
                  Widget Title
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("supportWidgetTitle")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <label
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                >
                  Widget Subtitle
                </label>
                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("supportWidgetSubTitle")}
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-6 sm:p-8">
              <div className="sm:col-span-2">
                <Space>
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 `}
                  >
                    Scheduling URL
                  </label>
                  <Tooltip title="Here you can input your calendar booking URL (for instance, Calendly) in the space provided. This will enable users to find an option in the menu to arrange a live meeting with you directly.">
                    <GrInfo />
                  </Tooltip>
                </Space>

                <div>
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("calendlySchedulingURL")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <button
                onClick={handleUpdate}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ),
    },
  ];

  if (!softValue) return <Skeleton />;

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="sticky top-16 z-30 flex h-12 shrink-0 items-center  border-b border-gray-200 dark:border-gray-600  bg-white dark:bg-gray-900  shadow-sm dark:shadow-gray-400/50 ">
        <div className="whitespace-nowrap mr-2 mb-2">SaaS Completion</div>
        <Progress
          percent={onboardingStatus?.partnerCompletion}
          status={onboardingStatus?.partnerCompletion < 100 ? "active" : null}
        />
      </div>

      <Tabs defaultActiveKey="1" items={items} />

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!SMTPModal}
        onCancel={() => setSMTPModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleUpdate();
            const result = await PartnerService.updateSMTP({ smtp });

            if (!result.data?.smtp?.connectionStatus)
              return message.error("Connection was not successful");
            PartnerService.getPartnerSecretConfig().then((data) => {
              setMe(data.data.partner);
              setSMTPModal(false);
              AuthService.me().then((data) => {
                setOnboardingStatus(data.data.onboardingStatus);
              });
            });
          }}
        >
          <div className="mt-10 mb-2 flex items-center justify-between gap-3">
            <label>Host</label>
            <input
              type="text"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.host}
              onChange={(e) => setSmtp((x) => ({ ...x, host: e.target.value }))}
            />
          </div>
          <div className="my-2 flex items-center justify-between gap-3">
            <label>Port</label>
            <input
              type="number"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.port}
              onChange={(e) => setSmtp((x) => ({ ...x, port: e.target.value }))}
            />
          </div>
          <div className="my-2 flex items-center justify-between gap-3">
            <label>Email</label>
            <input
              type="email"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.email}
              onChange={(e) =>
                setSmtp((x) => ({ ...x, email: e.target.value }))
              }
            />
          </div>
          <div className="my-2 flex items-center justify-between gap-3">
            <label>Password</label>
            <input
              type="password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.password}
              onChange={(e) =>
                setSmtp((x) => ({ ...x, password: e.target.value }))
              }
            />
          </div>

          <Divider />

          <div className="flex items-center justify-start gap-3">
            <h2 className="text-lg font-semibold">DKIM Settings</h2>
            <a
              href="https://easydmarc.com/tools/dkim-record-generator"
              target="_blank"
            >
              <Tooltip title="DomainKeys Identified Mail (DKIM) is an email authentication method that helps protect email senders and recipients from spam, spoofing, and phishing. It allows an email receiver to check that an email claimed to have come from a specific domain was indeed authorized by the owner of that domain. Using a DKIM generator, such as the one available at EasyDMARC's DKIM Record Generator (click on the lightbulb icon to navigate there), you can easily create these keys. Fill in the 'Domain' and 'Key Selector' fields with the appropriate information for your domain, then generate and use the provided private key here. Your public key will be part of the DKIM record you add to your domain's DNS settings.">
                <GrInfo />
              </Tooltip>
            </a>
          </div>

          <div className="my-2 flex items-center justify-between gap-3">
            <label>Domain</label>
            <input
              type="text"
              placeholder="your-domain.com"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.dkimDomain}
              onChange={(e) =>
                setSmtp((x) => ({ ...x, dkimDomain: e.target.value }))
              }
            />
          </div>
          <div className="my-2 flex items-center justify-between gap-3">
            <label>Key Selector</label>
            <input
              type="text"
              placeholder="s2"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.dkimKeySelector}
              onChange={(e) =>
                setSmtp((x) => ({ ...x, dkimKeySelector: e.target.value }))
              }
            />
          </div>
          <div className="my-2 flex items-center justify-between gap-3">
            <label>Private Key</label>
            <textarea
              rows={4}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              value={smtp?.dkimPrivateKey}
              onChange={(e) =>
                setSmtp((x) => ({ ...x, dkimPrivateKey: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-between">
            <div />
            <Button
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
              htmlType="submit"
              disabled={loading}
              loading={loading}
            >
              Connect
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
