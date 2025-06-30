import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  message,
  Progress,
  Skeleton,
} from "antd";
import moment from "moment";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { selectLoading } from "../../../../../src/redux/auth/selectors";
import ATSService from "../../../../../src/services/ATSService";
import CrudService from "../../../../../src/services/CrudService";
// import { Img } from "../../../auth/components/Img";
// import UserDetail from "../../../auth/components/UserDetail";
// Placeholder components
const Img = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);
const UserDetail = ({ userDetailsHeading, userDetailsDescription }) => (
  <div className="flex flex-col gap-2">
    <h3 className="font-semibold">{userDetailsHeading}</h3>
    <p className="text-gray-600">{userDetailsDescription}</p>
  </div>
);
import { Footer } from "../../Footer";
// import {useDropzone} from 'react-dropzone'
import { DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import Dropzone, { useDropzone } from "react-dropzone";
import { info } from "sass";
import CloudinaryUpload from "../../../../../src/components/CloudinaryUpload";
import PublicService from "../../../../../src/services/PublicService";
import UploadService from "../../../../../src/services/UploadService";
//import "../modals.scss"

function OnlineApply() {
  // const {getRootProps, getInputProps} = useDropzone()
  const router = useRouter();
  const { query } = router;
  const id = "demo";
  const [vacancyData, setVacancyData] = useState({});
  const [steps, setSteps] = useState(1);
  const fileInputRef = useRef(null);
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [applicant, setApplicant] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    cvUrl: "",
    linkedInUrl: "",
  });

  useEffect(async () => {
    // const id = query.id;
    if (!id) return;
    setVacancyData(null);

    await PublicService.getVacancyData(id).then((res) => {
      console.log(res);
      if (!res.data) return;
      setVacancyData(res.data);
    });

    setLoading(false);
  }, [id]);

  const backendLoading = useSelector(selectLoading);

  const data = [
    {
      userDetailsHeading: "Your details",
      userDetailsDescription: "Please provide your personal details",
    },
    {
      userDetailsHeading: "Upload CV",
      userDetailsDescription: "Upload your CV",
    },
  ];

  console.log(vacancyData);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (
        acceptedFiles.length > 0 &&
        acceptedFiles?.[0]?.type === "application/pdf"
      ) {
        fileInputRef.current = acceptedFiles;
        setFileUploaded(true);

        console.log("Loaded:", acceptedFiles?.[0]?.name);
        console.log(fileInputRef);
      } else {
        console.error("Invalid file type. Only PDFs are allowed.");
      }
    },
    [fileInputRef]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if file is selected
      console.log(fileInputRef.current);
      const file = fileInputRef.current?.[0];

      const updatedApplicant = {
        ...applicant,
      };

      if (file) {
        const uploadResult = await UploadService.upload(file, 1);
        updatedApplicant.cvUrl = uploadResult.data.secure_url;
      }

      // Prepare form data for submission
      const formData = updatedApplicant;
      console.log("Form data:", formData);

      // Create vacancy submission
      const submissionResult = await PublicService.createVacancySubmission({
        VacancyId: id,
        formData,
        funnelUUID: localStorage?.[`funnelUUID_${id}`],
        tracking: {
          utm_campaign: query.utm_campaign ?? null,
          utm_source: query.utm_source ?? null,
          utm_medium: query.utm_medium ?? null,
          utm_content: query.utm_content ?? null,
          utm_term: query.utm_term ?? null,
          salesforce_uuid: query.salesforce_uuid ?? null,
        },
      });

      console.log("submissionResult", submissionResult);

      // Check if submission was successful
      if (submissionResult.data) {
        // Get apply token
        const response = await PublicService.generateCandidateToken(
          submissionResult.data._id
        );

        // Navigate to interview schedule if token is received
        if (response.data?.candidateToken) {
          setTimeout(
            () =>
              (window.location.href = `/interview-schedule?token=${response.data?.candidateToken}`),
            1000
          );
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      setFileUploaded(false);
      fileInputRef.current = null;
    }
  };

  if (loading) return <Skeleton active />;
  if (!vacancyData?.enabled)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">We are sorry!</h1>
        <p className="text-xl">
          The vacancy you are looking for is no longer available.
        </p>
      </div>
    );

  return (
    <div className="w-full bg-[#f8f8f8] flex">
      <div className="flex w-[40%] xl:w-[30%] min-h-screen flex-col items-start hidden md:block">
        <div className="flex w-full h-full flex-col rounded-[12px] border border-solid border-[#eaecf0] bg-[#ffffff] p-6  md:gap-[330px] sm:gap-[220px] sm:p-5 justify-between">
          <div className="flex flex-col gap-12 ">
            <div className="flex justify-center">
              <Img src="/logo_hh.png" alt="Logo Icon" className="h-[32px]" />
            </div>
            <div className="flex flex-col gap-7">
              <Suspense fallback={<div>Loading feed...</div>}>
                {data.map((d, index) => (
                  <UserDetail {...d} key={"orderList" + index} />
                ))}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      {steps == 1 && (
        <div className="flex flex-col mx-20 my-5 w-full ">
          <h1 className="text-2xl font-bold">Your details</h1>
          <form className="h-full item display flex flex-col justify-between">
            <div className="mb-2 mt-5 w-full flex flex-col">
              <label className="text-[20px]">First Name</label>
              <Input
                type="text"
                value={applicant.firstname}
                onChange={(e) =>
                  setApplicant({ ...applicant, firstname: e.target.value })
                }
                className="w-full mb-2 dark:bg-gray-900 h-[44px]"
                placeholder="Firstname"
                required
              />
              <label className="text-[20px]">Last Name</label>
              <Input
                type="text"
                value={applicant.lastname}
                onChange={(e) =>
                  setApplicant({ ...applicant, lastname: e.target.value })
                }
                className="w-full mb-2 dark:bg-gray-900"
                placeholder="Lastname"
                required
              />
              <label className="text-[20px]">Email Adress</label>
              <Input
                type="email"
                value={applicant.email}
                onChange={(e) =>
                  setApplicant({ ...applicant, email: e.target.value })
                }
                className="w-full mb-2 dark:bg-gray-900"
                placeholder="Email"
                required
              />
              <label className="text-[20px]">Phone Number</label>
              <PhoneInput
                inputStyle={{ width: "100%", height: "40px" }}
                placeholder="Phone"
                defaultCountry="US"
                value={applicant.phone}
                onChange={(e) => setApplicant({ ...applicant, phone: e })}
                className="mb-2"
                inputClass="dark:!bg-gray-900"
                dropdownClass="dark:!text-black"
                buttonClass="dark:!bg-gray-900"
              />
              <div className="flex gap-2 items-center mt-1">
                <Checkbox
                  required={true}
                  checked={check}
                  onChange={() => setCheck(!check)}
                >
                  I agree to the privacy policy.
                </Checkbox>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-2 mt-4 ">
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (check) {
                    setSteps(2);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      )}
      {steps == 2 && (
        <div className="flex flex-col mx-20 my-5 w-full ">
          <h1 className="text-2xl font-bold">Upload CV</h1>
          <form className="h-full item display flex flex-col justify-between">
            <div className="mb-2 mt-5 w-full flex flex-col">
              <Dropzone
                className="cursor-pointer"
                onDrop={onDrop}
                accept="application/pdf"
                maxSize={1048576}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className=" rounded-md bg-[#ffffff] border-0 py-3 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 flex flex-col items-center justify-center h-[40vh]"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      id={`cvInput`}
                      accept="application/pdf"
                      {...getInputProps()}
                    />
                    <p className="text-center">
                      <span className="text-semibold bg-gradient !text-transparent bg-clip-text">
                        Click to upload{" "}
                      </span>
                      or drag and drop
                    </p>
                    <p className="text-center">PDF (max 1MB)</p>
                    <img></img>
                  </div>
                )}
              </Dropzone>
              {fileInputRef.current && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 my-4 flex">
                  <div className="m-auto">
                    <FilePdfOutlined style={{ fontSize: "60px" }} />
                  </div>
                  <div className="flex items-center flex-col justify-between w-full m-2">
                    <div className="flex items-center  justify-between w-full ">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fileInputRef.current[0].name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(
                            fileInputRef.current[0].size /
                            (1024 * 1024)
                          ).toFixed(2)}
                          MB
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={(e) => removeFile(e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <DeleteOutlined className="text-xl" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 w-full">
                      <div className="bg-gradient rounded-full h-2 overflow-hidden flex-grow flex">
                        <div className="bg-gradient h-full w-full"></div>
                      </div>
                      <div>
                        <span className="ml-2 whitespace-nowrap">100 %</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <label>Add Linkedin Profile</label>
              <Input
                type="linkedin"
                value={applicant.linkedInUrl}
                onChange={(e) =>
                  setApplicant({ ...applicant, linkedInUrl: e.target.value })
                }
                className="w-full mb-2 dark:bg-gray-900"
                placeholder="Linkedin.com/Taylor-johnston-484"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-2 mt-4 ">
              <Button className="bg-[#ffffff]" onClick={() => setSteps(1)}>
                Back
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={backendLoading}
                onClick={(e) => handleSubmit(e)}
              >
                Apply
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OnlineApply;
