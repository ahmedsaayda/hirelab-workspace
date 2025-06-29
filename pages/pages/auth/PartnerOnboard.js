import { Divider, Modal, Popconfirm, Skeleton, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { GrInfo } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MultiStepComponent from "../../components/MultiStepComponent";
import { selectDarkMode, selectLoading } from "../../redux/auth/selectors";
import AuthService from "../../service/AuthService";
import PartnerService from "../../service/PartnerService";

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const PartnerOnboard = ({ hideWelcome = false }) => {
  const [me, setMe] = useState(null);
  const [smtp, setSmtp] = useState(null);
  const [SMTPModal, setSMTPModal] = useState(false);

  const router = useRouter();;
  const loading = useSelector(selectLoading);
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    PartnerService.getPartnerSecretConfig().then((data) =>
      setMe(data.data.partner)
    );
  }, []);

  const handleSave = (me) => {
    AuthService.updatePartnerConfig({
      ...me,
      silence: true,
    });
  };

  const debouncedChange = debounce((value) => handleSave(value), 800);

  const partnerRegistrationSteps = [
    {
      id: "step1",
      name: "Calendly",
      form: [
        {
          fieldName: "calendlyclientId",
          label: "Calendly Client ID*",
          type: "input",
          placeholder: "Enter your Calendly client ID",
          required: true,
          loom: "60d7cedadaba4f3886d08c21c39d566a?sid=ee4573fe-73bf-4f4e-b877-a5b6ff4b3dee",
          helpLink: "https://developer.calendly.com/console/apps",
        },
        {
          fieldName: "calendlyClientSecret",
          label: "Calendly Client Secret*",
          type: "input",
          placeholder: "Enter your Calendly client secret",
          required: true,
          loom: "e56ff857a656481689f461e1757e38cc?sid=13449edd-d2d4-42d5-b43d-be36b67573ec",
          helpLink: "https://developer.calendly.com/console/apps",
        },
        {
          type: "custom",
          CustomInputComponent: () => (
            <>
              <h2 className="font-bold text-lg">Information</h2>
              <div className="w-full">
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Name of app:</label>
                  <span>{me?.brandName}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(me?.brandName);
                      message.success("Copied to clipboard");
                    }}
                  >
                    <FaCopy />
                  </span>
                </div>
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Environment type</label>
                  <span>Production</span>
                </div>
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Redirect URI</label>
                  <span>{window.location.origin}/calendly</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/calendly`
                      );
                      message.success("Copied to clipboard");
                    }}
                  >
                    <FaCopy />
                  </span>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    {
      id: "step2",
      name: "Cloudinary",
      form: [
        {
          fieldName: "cloudinaryCloudName",
          label: "Cloudinary Cloud Name*",
          type: "input",
          placeholder: "Enter your Cloudinary cloud name",
          required: true,
          loom: "aeb92740abd548d7bc11e7d714017fd4?sid=979fda96-f651-4ead-a85d-4144c763df02",
          helpLink: "https://console.cloudinary.com/",
        },
        {
          fieldName: "cloudinaryAPIKey",
          label: "Cloudinary API Key*",
          type: "input",
          placeholder: "Enter your Cloudinary API key",
          required: true,
          loom: "3f5b3d7f0d5647028a58df374c3acfe7?sid=952b5d3d-7c86-4194-94f4-a75e3b49c5f0",
          helpLink: "https://console.cloudinary.com/",
        },
        {
          fieldName: "cloudinaryAPISecret",
          label: "Cloudinary API Secret*",
          type: "input",
          placeholder: "Enter your Cloudinary API secret",
          required: true,
          loom: "20f935e4e8bb4ec095de75ea426dd5d7?sid=5f7c3327-bd75-49a4-a459-06472edb90ff",
          helpLink: "https://console.cloudinary.com/",
        },
        {
          fieldName: "cloudinaryPreset",
          label: "Cloudinary Preset*",
          type: "input",
          placeholder: "Enter your Cloudinary preset",
          required: true,
          loom: "f8013faf7b554b979a9be84e39f21e70?sid=c750fcca-1741-4dc8-8c2f-d05988dbc314",
          helpLink: "https://console.cloudinary.com/settings",
        },
      ],
    },
    {
      id: "step3",
      name: "Stripe",
      form: [
        {
          fieldName: "stripeSecretKey",
          label: "Stripe Secret Key*",
          type: "input",
          placeholder: "Enter your Stripe secret key",
          required: true,
          loom: "71076436c50748ac9640161a8ce01b4a?sid=1ffd48c5-74a2-45b2-b715-525d58df6763",
          helpLink: "https://dashboard.stripe.com/apikeys",
        },
        {
          fieldName: "stripeWebsocketSigningKey",
          label: "Stripe Webhook Signing Key*",
          type: "input",
          placeholder: "Enter your Stripe webhook signing key",
          required: true,
          loom: "99d8b9669ba4474e822901521a0e15a0?sid=d413fd18-755c-48f5-ba95-db11d71001a1",
          helpLink: "https://dashboard.stripe.com/webhooks",
        },
        {
          type: "custom",
          CustomInputComponent: () => (
            <>
              <h2 className="font-bold text-lg">Information</h2>
              <div className="w-full">
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">
                    How to create Stripe account:
                  </label>
                  <a
                    className="cursor-pointer"
                    href="https://www.youtube.com/watch?v=JEtALC2t5dY&t=22s"
                    target="_blank"
                  >
                    <FaExternalLinkAlt className="mb-1" />
                  </a>
                </div>
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Webhook Endpoint URL:</label>
                  <span>
                    {process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/{me?._id}
                    /webhook
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/${me?._id}/webhook`
                      );
                      message.success("Copied to clipboard");
                    }}
                  >
                    <FaCopy />
                  </span>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    {
      id: "step4",
      name: "Open AI",
      form: [
        {
          fieldName: "openAIKey",
          label: "OpenAI API Key*",
          type: "input",
          placeholder: "Enter your OpenAI API key",
          required: true,
          loom: "430c7753e3f74b009d8615fc94cf98aa?sid=c0848a6c-dfa7-4618-b5fc-7d523cf71812",
          helpLink: "https://platform.openai.com/api-keys",
        },
      ],
    },
    {
      id: "step5",
      name: "Clarity",
      form: [
        {
          fieldName: "microsoftClarityID",
          label: "Microsoft Clarity ID (optional)",
          type: "input",
          placeholder: "Enter your Microsoft Clarity ID to activate analytics",
          loom: "b800850d95f34aaba5fce9ceed443a66?sid=dc561af3-e8ab-492e-85fb-ae88af6611ac",
          helpLink: "https://clarity.microsoft.com/projects",
        },
      ],
    },
    {
      id: "step6",
      name: "Twilio",
      form: [
        {
          fieldName: "twilioTwimlAppSID",
          label: "Twilio TwiML App SID (optional)",
          type: "input",
          placeholder: "Enter your Twilio TwiML App SID",
          loom: "26411b158a3140f3b6abe12e2e35a182?sid=ea67ee1b-822d-44be-b949-d36ed6dacb0f",
          helpLink:
            "https://console.twilio.com/us1/develop/phone-numbers/manage/twiml-apps?frameUrl=%2Fconsole%2Fvoice%2Ftwiml%2Fapps%3Fx-target-region%3Dus1",
        },
        {
          fieldName: "twilioAuthToken",
          label: "Twilio Auth Token (optional)",
          type: "input",
          placeholder: "Enter your Twilio auth token",
          loom: "8fe819cc79a44342a1f414937bd7d7fd?sid=bd91fe44-97fd-4dec-b4a5-f025d06f75a3",
          helpLink:
            "https://console.twilio.com/us1/account/keys-credentials/api-keys",
        },
        {
          fieldName: "twilioSenderPhone",
          label: "Twilio Sender Phone (optional)",
          type: "input",
          placeholder: "Enter your Twilio sender phone",
          loom: "34f9d74ed9664bb38f4fb40a8a63f800?sid=329434ed-1c77-4e86-a122-db757dbe28df",
          helpLink:
            "https://console.twilio.com/us1/develop/phone-numbers/manage/search?isoCountry=US&types[]=Local&types[]=Tollfree&capabilities[]=Sms&capabilities[]=Mms&capabilities[]=Voice&capabilities[]=Fax&searchTerm=&searchFilter=left&searchType=number",
        },
        {
          fieldName: "twilioAccountSID",
          label: "Twilio Account SID (optional)",
          type: "input",
          placeholder: "Enter your Account SID",
          loom: "2da97809d1e34d249bf3fed46f96d868?sid=f68a2865-d2a3-42ef-8477-02fc201b259a",
          helpLink:
            "https://console.twilio.com/us1/account/keys-credentials/api-keys",
        },
        {
          type: "custom",
          CustomInputComponent: () => (
            <>
              <h2 className="font-bold text-lg">Information</h2>
              <div className="w-full">
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Request URL:</label>
                  <span className="cursor-pointer">
                    {process.env.NEXT_PUBLIC_BACKEND_URL}/public/twilioVoice
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/twilioVoice`
                      );
                      message.success("Copied to clipboard");
                    }}
                  >
                    <FaCopy />
                  </span>
                </div>
                <div className="flex gap-2 items-end">
                  <label className="font-semibold">Status Callback URL:</label>
                  <span className="cursor-pointer">
                    {process.env.NEXT_PUBLIC_BACKEND_URL}
                    /public/twilioStatusCallback
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/twilioStatusCallback`
                      );
                      message.success("Copied to clipboard");
                    }}
                  >
                    <FaCopy />
                  </span>
                </div>
              </div>
            </>
          ),
        },
      ],
    },
    {
      id: "step8",
      name: "SMTP",
      form: [
        {
          type: "custom",
          CustomInputComponent: () => (
            <>
              <div>
                <label>SMTP</label>
              </div>
              <div className="w-full flex justify-center">
                {me?.smtp?.connectionStatus ? (
                  <Popconfirm
                    title="When you disconnect your SMTP, your emails will no longer be sent from your inbox."
                    onConfirm={async () => {
                      await PartnerService.disconnectSMTP();
                      PartnerService.getPartnerSecretConfig().then((data) => {
                        setMe(data.data.partner);
                        AuthService.me().then((data) => {
                          setOnboardingStatus(data.data.onboardingStatus);
                        });
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
                    disabled={loading}
                    loading={loading}
                  >
                    Connect
                  </button>
                )}
              </div>
            </>
          ),
          loom: "79f6e7aebae74a32a3bbbc05613c2675?sid=ecb9dfe4-79bd-4b12-aafb-3dd0df03a81d",
        },
      ],
    },
  ].filter((a) => {
    if (hideWelcome) return true;
    if (
      a.form.every(
        (x) => (a.name !== "SMTP" && x.type === "custom") || !!me?.[x.fieldName]
      )
    )
      return false;
    if (a.name === "SMTP" && !!me?.smtp?.connectionStatus) return false;
    return true;
  });

  if (!me) return <Skeleton active />;
  return (
    <>
      <div
        className={hideWelcome ? "" : "fixed left-0 top-0 w-[100vw] h-[100vh]"}
        style={
          hideWelcome
            ? {}
            : {
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: -1,
                backgroundImage: `url('/images/screenshots/payroll.png')`,
                filter: "blur(10px)",
              }
        }
      />
      <div
        className={
          hideWelcome
            ? ""
            : "relative flex min-h-screen flex-col justify-center overflow-hidden bg-transparent py-12"
        }
      >
        <div
          className={
            hideWelcome
              ? ""
              : "relative bg-white dark:bg-gray-900 px-6 pt-10 pb-9 shadow-xl dark:shadow-gray-400/50 hover:shadow-gray-600/50  mx-auto w-full max-w-lg rounded-2xl"
          }
        >
          <div
            className={
              hideWelcome
                ? ""
                : "mx-auto flex w-full max-w-md flex-col space-y-16"
            }
          >
            {!hideWelcome && (
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="font-semibold text-3xl">
                  <p>Partner Onboarding</p>
                </div>
                <div className="flex flex-row text-sm font-medium text-gray-400">
                  <p>
                    We are pleased to welcome you aboard as a valued partner in
                    the journey towards launching your recruitment software. To
                    ensure a smooth and efficient setup process, we have
                    prepared a step-by-step guide to assist you in configuring
                    all the necessary elements.
                  </p>
                </div>
              </div>
            )}
            <div>
              <MultiStepComponent
                loading={loading}
                displayUndoRedo
                steps={partnerRegistrationSteps}
                defaultFormData={me}
                passFormData={(formData) => {
                  if (!formData) return;
                  if (!hideWelcome) return;
                  debouncedChange(formData);
                }}
                onFinish={async (formData) => {
                  await AuthService.updatePartnerConfig({
                    ...formData,
                    silence: true,
                  });
                  router.push("/dashboard");
                }}
                onNext={async (formData) => {
                  await AuthService.updatePartnerConfig({
                    ...formData,
                    silence: true,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>

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
            const result = await PartnerService.updateSMTP({ smtp });

            if (!result.data?.smtp?.connectionStatus)
              return message.error("Connection was not successful");
            PartnerService.getPartnerSecretConfig().then((data) => {
              setMe(data.data.partner);
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

            {me?.smtp?.connectionStatus ? (
              <Popconfirm
                title="When you disconnect your SMTP, your emails will no longer be sent from your inbox."
                onConfirm={async () => {
                  await PartnerService.disconnectSMTP();
                  PartnerService.getPartnerSecretConfig().then((data) => {
                    setMe(data.data.partner);
                    AuthService.me().then((data) => {
                      setOnboardingStatus(data.data.onboardingStatus);
                    });
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
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Connect
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PartnerOnboard;
