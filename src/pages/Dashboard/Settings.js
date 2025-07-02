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
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Button,
  ColorPicker,
  Divider,
  Modal,
  Popconfirm,
  Progress,
  Skeleton,
  Space,
  Switch,
  Tooltip,
  message,
} from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { GrInfo } from "react-icons/gr";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import Select from "./Vacancies/components/Select";
import { countries } from "../../data/constants";
import {
  getPartner,
  selectDarkMode,
  selectLoading,
} from "../../redux/auth/selectors";
import AuthService from "../../services/AuthService";
import CalendlyService from "../../services/CalendlyService";
import SMTPService from "../../services/SMTPService";
import UploadService from "../../services/UploadService";
import { partner } from "../../constants";

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
  const [calendlyToken, setCalendlyToken] = useState(null);
  const [SMTPModal, setSMTPModal] = useState(false);
  const [changeEmailModal, setChangeEmailModal] = useState(false);
  const [smtp, setSmtp] = useState(null);
  const [eventTypes, setEventTypes] = useState(null);
  const loading = useSelector(selectLoading);
  const darkMode = useSelector(selectDarkMode);

  const fileInput = useRef(null);
  const fileInput31 = useRef(null);
  const fileInput32 = useRef(null);
  const fileInput33 = useRef(null);

  useEffect(() => {
    fileInput.current = document.getElementById("fileInput");
    if (fileInput.current)
      fileInput.current.addEventListener("change", async () => {
        const selectedFile = fileInput.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 1);
          await AuthService.updateMe({
            avatar: result.data.secure_url,
          });
          const res = await AuthService.me();
          setMe(res.data.me);
          setOnboardingStatus(res.data.onboardingStatus);

          // You can perform further actions with the selected file here
        } else {
          console.log("No file selected.");
        }
      });
  }, []);

  useEffect(() => {
    fileInput31.current = document.getElementById("fileInput31");
    if (fileInput31.current)
      fileInput31.current.addEventListener("change", async () => {
        const selectedFile = fileInput31.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 1);
          await AuthService.updateMe({
            jobPortalHeroImage: result.data.secure_url,
          });
          const res = await AuthService.me();
          setMe(res.data.me);
          setOnboardingStatus(res.data.onboardingStatus);

          // You can perform further actions with the selected file here
        } else {
          console.log("No file selected.");
        }
      });
  }, []);
  useEffect(() => {
    fileInput32.current = document.getElementById("fileInput32");
    if (fileInput32.current)
      fileInput32.current.addEventListener("change", async () => {
        const selectedFile = fileInput32.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 1);
          await AuthService.updateMe({
            jobPortalJobsSectionImage: result.data.secure_url,
          });
          const res = await AuthService.me();
          setMe(res.data.me);
          setOnboardingStatus(res.data.onboardingStatus);

          // You can perform further actions with the selected file here
        } else {
          console.log("No file selected.");
        }
      });
  }, []);
  useEffect(() => {
    fileInput33.current = document.getElementById("fileInput33");
    if (fileInput33.current)
      fileInput33.current.addEventListener("change", async () => {
        const selectedFile = fileInput33.current.files[0]; // Get the selected file
        if (selectedFile) {
          const result = await UploadService.upload(selectedFile, 1);
          await AuthService.updateMe({
            logo: result.data.secure_url,
          });
          const res = await AuthService.me();
          setMe(res.data.me);
          setOnboardingStatus(res.data.onboardingStatus);

          // You can perform further actions with the selected file here
        } else {
          console.log("No file selected.");
        }
      });
  }, []);

  const handleUpdate = useCallback(async () => {
    await AuthService.updateMe(softValue);
    const res = await AuthService.me();
    setMe(res.data.me);
    setOnboardingStatus(res.data.onboardingStatus);
    document.dispatchEvent(new CustomEvent("REFRESH.PROFILE"));


  }, [softValue]);

  useEffect(() => {
    setSoftValue(me);
    setSmtp(me?.smtp ?? null);
  }, [me]);

  useEffect(() => {
    if (!partner?.calendlyclientId) return;
    CalendlyService.getEventTypes().then(({ data }) => {
      setEventTypes(data.eventTypes);
    });
  }, [partner]);

  useEffect(() => {
    AuthService.me().then((data) => {
      setMe(data.data.me);
      setOnboardingStatus(data.data.onboardingStatus);
    });
  }, []);

  useEffect(() => {
    if (partner?.calendlyclientId)
      CalendlyService.getCurrentToken()
        .then(({ data }) => {
          setCalendlyToken(data);
        })
        .catch(() => setCalendlyToken(null));
  }, []);

  const getProps = (fieldKey) => ({
    value: softValue?.[fieldKey],
    onChange: (e) =>
      setSoftValue((current) => ({
        ...current,
        [fieldKey]: e?.target?.value ?? e,
      })),
  });

  const notificationConfig = [
    {
      title: "Security Alerts",
      id: "securityalerts",
      description:
        "Notifications regarding account security, like login from a new device or location.",
      push: true,
    },
    {
      title: "Platform Updates",
      id: "platformupdates",
      description:
        "Information about new features, updates, or maintenance schedules.",
    },

    {
      title: "Newsletter",
      id: "newsletter",
      description:
        "Regular updates on news, insights, and tips from our community.",
    },
    {
      title: "Support",
      id: "support",
      description: "Receive updates on your support inquiries.",
    },
  ];

  if (!softValue) return <Skeleton />;

  return (
    <div className="pl-6 space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form
          className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid  grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                    !softValue?.firstName ? "text-red font-semibold" : ""
                  }`}
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("firstName")}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                    !softValue?.lastName ? "text-red font-semibold" : ""
                  }`}
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("lastName")}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                >
                  Email
                </label>
                <div className="mt-2 relative">
                  <input
                    disabled
                    type="email"
                    className="block w-full bg-gray-200 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                    {...getProps("email")}
                  />
                  <button
                    onClick={() => setChangeEmailModal(true)}
                    className="absolute end-0 top-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                >
                  Phone
                </label>
                <div className="mt-2">
                  <PhoneInput
                    defaultCountry="US"
                    inputClass="dark:!bg-gray-900"
                    dropdownClass="dark:!text-black"
                    buttonClass="dark:!bg-gray-900"
                    value={softValue?.["phone"] ?? ""}
                    onChange={(e) =>
                      setSoftValue((current) => ({
                        ...current,
                        ["phone"]: e?.target?.value ?? e,
                      }))
                    }
                  />
                </div>
              </div>

              {me?.role !== "team-member" && (
                <>
                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                        !softValue?.line1 ? "text-red font-semibold" : ""
                      }`}
                    >
                      Line 1
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        {...getProps("line1")}
                      />
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                    >
                      Line 2
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        {...getProps("line2")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                        !softValue?.city ? "text-red font-semibold" : ""
                      }`}
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        {...getProps("city")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                        !softValue?.state ? "text-red font-semibold" : ""
                      }`}
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        {...getProps("state")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  ${
                        !softValue?.zipCode ? "text-red font-semibold" : ""
                      }`}
                    >
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                        {...getProps("zipCode")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                    >
                      Country
                    </label>
                    <div className="mt-2">
                      <Select options={countries} {...getProps("country")} />
                    </div>
                  </div>
                </>
              )}
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

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
            Brand
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Adjust your brand
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

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
            Security
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Change your password here.
          </p>
        </div>

        <form
          className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const current = e.target[0].value;
            const newPassword = e.target[1].value;
            const repeatNew = e.target[2].value;
            await AuthService.updatePassword({
              current,
              repeatNew,
              newPassword,
            });
            e.target[0].value = "";
            e.target[1].value = "";
            e.target[2].value = "";
          }}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                    !softValue?.firstName ? "text-red font-semibold" : ""
                  }`}
                >
                  Current password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                    !softValue?.firstName ? "text-red font-semibold" : ""
                  }`}
                >
                  New password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                    !softValue?.firstName ? "text-red font-semibold" : ""
                  }`}
                >
                  Repeat new password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:shadow-gray-400/50  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {me?.role !== "admin" && (
        <>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0 mt-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
                Account
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This is your account information.
              </p>
            </div>

            <form
              className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 mt-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="px-4 py-6 sm:p-8 ">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 "
                    >
                      Photo
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      {me?.avatar ? (
                        <img
                          className="h-12 w-12 text-gray-300 rounded-full object-cover"
                          src={me.avatar}
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
                          fileInput?.current?.click?.();
                        }}
                      >
                        Change
                      </button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Upload a clean profile avatar to personalize your profile.
                    </p>
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
        </>
      )}

      {me?.role !== "team-member" && (
        <div
          className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3"
          id="integrations"
        >
          <div className="px-4 sm:px-0 mt-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Integrations
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Manage all of your integrations here.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 mt-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* {partner?.calendlyclientId && (
              <>
                <div className="px-4 py-6 sm:p-8 flex gap-3 items-center justify-start">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <div>
                        <div className="flex items-center justify-start gap-5">
                          <div>
                            <Space>
                              <label
                                className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                                  !calendlyToken?.access_token
                                    ? "text-[#FFA000] font-bold"
                                    : ""
                                }`}
                              >
                                Calendly
                              </label>
                              {!calendlyToken?.access_token && (
                                <Tooltip title="By connecting your Calendly account, you can streamline your interview scheduling with candidates. This will also enable you to automatically schedule video meetings.">
                                  <GrInfo className="text-[#FFA000]" />
                                </Tooltip>
                              )}
                            </Space>

                            <div className="mt-2">
                              {calendlyToken?.access_token ? (
                                <Popconfirm
                                  title="Your calendar scheduling functionality will stop working. Are you sure to proceed?"
                                  onConfirm={async () => {
                                    await CalendlyService.disconnectCalendly();
                                    AuthService.me().then((data) => {
                                      setMe(data.data.me);
                                      setOnboardingStatus(
                                        data.data.onboardingStatus
                                      );
                                    });
                                    CalendlyService.getCurrentToken().then(
                                      (data) => {
                                        setCalendlyToken(data.access_token);
                                      }
                                    );
                                  }}
                                >
                                  <button className="px-2 py-1 text-sm border border-red-500 text-red rounded">
                                    Disconnect
                                  </button>
                                </Popconfirm>
                              ) : (
                                <button
                                  className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                                  onClick={async () => {
                                    const res =
                                      await CalendlyService.getAuthURI();
                                    window.location.href = res.data.authUri;
                                  }}
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                          <img
                            src="/images/logos/calendly2.png"
                            style={{ height: 50 }}
                          />
                        </div>
                      </div>

                      <div>
                        {calendlyToken?.access_token && (
                          <div className="mt-2">
                            <label className="text-sm">
                              Selecting a default event type for interviews will
                              help you to automate your scheduling and let you
                              focus on the conversations that matter.
                            </label>
                            <div className="mt-2">
                              <Select
                                style={{ width: 200 }}
                                value={softValue.preferredCalendlyEvent}
                                onChange={(value) => {
                                  setSoftValue((e) => ({
                                    ...e,
                                    preferredCalendlyEvent: value,
                                  }));
                                }}
                                options={
                                  eventTypes
                                    ? eventTypes.map((eventType) => ({
                                        value: eventType.uri,
                                        label: eventType.name,
                                      }))
                                    : []
                                }
                                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
              </>
            )} */}

            <div className="px-4 py-6 sm:p-8 ">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <div className="flex items-center justify-start gap-3">
                    <label
                      htmlFor="street-address"
                      className={`"block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 " ${
                        !softValue?.smtp?.connectionStatus
                          ? "text-[#FFA000] font-bold"
                          : ""
                      }`}
                    >
                      SMTP
                    </label>
                    {!softValue?.smtp?.connectionStatus && (
                      <Tooltip title="By connecting your SMTP, you can send automated or manual emails to your candidates from your own inbox.">
                        <GrInfo className="text-[#FFA000]" />
                      </Tooltip>
                    )}
                  </div>

                  <div className="mt-2">
                    {softValue?.smtp?.connectionStatus ? (
                      <Popconfirm
                        title="When you disconnect your SMTP, your emails will no longer be sent from your inbox."
                        onConfirm={async () => {
                          await SMTPService.disconnectSMTP();
                          AuthService.me().then((data) => {
                            setMe(data.data.me);
                            setOnboardingStatus(data.data.onboardingStatus);
                          });
                        }}
                      >
                        <button className="px-2 py-1 text-sm border border-red-500 text-red rounded">
                          Disconnect
                        </button>
                      </Popconfirm>
                    ) : (
                      <button
                        className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                        onClick={() => {
                          setSMTPModal(true);
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {[
              // "Google Calendar",
              // "Outlook Calendar",
              // "Google Meets",
              // "Facebook Ads",
              // "Google Adwords",
              // "Apple Search Ads",
              // "Bing Ads",
              // "Linkedin Ads",
              // "Tiktok Ads",
              // "Zapier",
              // "Airtable",
              // "DocuSign",
              // "PandaDoc",
            ].map((item, i) => (
              <div className="px-4 py-6 sm:p-8 " key={i}>
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <div className="flex items-center justify-start gap-3">
                      <label
                        htmlFor="street-address"
                        className={`block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400  text-[#555]`}
                      >
                        {item}
                      </label>
                      <Tooltip title="Coming soon">
                        <GrInfo className="text-[#555]" />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}

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
      )}

      {me?.role !== "team-member" && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-400 ">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-400/50  ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="px-4 py-6 sm:p-8">
              <div className="max-w-2xl space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-400 ">
                    By Email
                  </legend>
                  <div className="mt-6 space-y-6">
                    {notificationConfig
                      .filter(
                        (n) => !n.push && (!n.scope || n.scope === me?.role)
                      )
                      .map((item, index) => (
                        <div className="relative flex gap-x-3" key={index}>
                          <div className="flex h-6 items-center">
                            <input
                              id={`notification-email-${index}`}
                              name={`notification-email-${index}`}
                              checked={softValue?.notification?.[`${item.id}`]}
                              onChange={(e) => {
                                setSoftValue((v) => ({
                                  ...v,
                                  notification: {
                                    ...v.notification,
                                    [`${item.id}`]: e.target.checked,
                                  },
                                }));
                              }}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor={`notification-email-${index}`}
                              className="font-medium text-gray-900 dark:text-gray-400 "
                            >
                              {item.title}
                            </label>
                            <p className="text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </fieldset>
                {/* <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-400 ">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-gray-600 mb-4">
                  These are delivered via SMS to your mobile phone.
                </p>
                {notificationConfig
                  .filter((n) => !!n.push && (!n.scope || n.scope === me?.role))
                  .map((item, index) => (
                    <div className="relative flex gap-x-3 mt-4" key={index}>
                      <div className="flex h-6 items-center">
                        <input
                          id={`notification-phone-${index}`}
                          name={`notification-phone-${index}`}
                          checked={softValue?.notification?.[`${item.id}`]}
                          onChange={(e) => {
                            setSoftValue((v) => ({
                              ...v,
                              notification: {
                                ...v.notification,
                                [`${item.id}`]: e.target.checked,
                              },
                            }));
                          }}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor={`notification-phone-${index}`}
                          className="font-medium text-gray-900 dark:text-gray-400 "
                        >
                          {item.title}
                        </label>
                        <p className="text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
              </fieldset> */}
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
      )}

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
            const result = await SMTPService.updateSMTP({ smtp });

            if (!result.data?.smtp?.connectionStatus)
              return message.error("Connection was not successful");
            await AuthService.me().then((data) => {
              setMe(data.data.me);
              setOnboardingStatus(data.data.onboardingStatus);
              setSMTPModal(false);
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

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!changeEmailModal}
        onCancel={() => setChangeEmailModal(false)}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const newEmail = e.target[0].value;
            const password = e.target[1].value;
            await AuthService.handleUpdateEmailRequest({
              newEmail,
              password,
            });
            setChangeEmailModal(false);
          }}
        >
          <label className="font-bold mt-5">New email</label>
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
            placeholder="Enter new email"
          />
          <div className="mt-5">
            <label className="font-bold mt-5 ">Current password</label>
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
              placeholder="Enter your current password"
              type="password"
            />
          </div>
          <div className="flex justify-between">
            <div />
            <Button
              className="px-2 py-1 mt-5 text-sm bg-indigo-500 text-white rounded"
              disabled={loading}
              loading={loading}
              htmlType="submit"
            >
              Connect
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
