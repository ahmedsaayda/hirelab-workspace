import React, { useState, useRef } from "react";
import { Input, Upload, Button, message, Avatar, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import UploadService from "../../../services/UploadService";
import axios from "axios";
import CrudService from "../../../services/CrudService";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";
import { formatDistanceToNow } from "date-fns";

/* 

const CandidateNoteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
    attatchments: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    LandingPageDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandingPageData",
    },
    replies: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userFullName: { type: String, default: "" },
        note: { type: String, default: "" },
        attatchments: { type: Array, default: [] },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

*/

const getInitials = (user) => {
  if (user?.firstName) return user.firstName[0];
  if (user?.lastName) return user.lastName[0];
  if (user?.email) return user.email[0].toUpperCase();
  return "?";
};

const formatTimeAgo = (date) => {
  console.log("date", date);
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const formatTime = (date) => {
  const d = new Date(date);
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();
};

const NoteDetail = ({
  onCancel,
  defaultValue,
  isNew = false,
  candidateId,
  reload,
}) => {
  const [note, setNote] = useState(defaultValue?.note || "");
  const [fileList, setFileList] = useState(defaultValue?.attatchments || []);
  const [isEdit, setIsEdit] = useState(isNew);
  const [uploading, setUploading] = useState(false);
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(defaultValue?.replies || []);
  const [showReplyForm, setShowReplyForm] = useState(false);
  console.log("candidateId", candidateId);
  console.log("isEdit", isEdit);
  console.log("defaultValue", defaultValue);
  console.log("defaultValue", defaultValue?.attatchments);

  /* 
  A typcial note looks like this:

  {
    _id: '6743a87d931ed4af05de49ea',
    loggedBy: {
      _id: '66033b377d48e591ff8abcf4',
      email: 'x45@test.com',
      avatar: 
        'https://res.cloudinary.com/dvq0ouupb/image/upload/v1711507386/kd1zkx8fqii0bvwpg7fm.png',
      firstName: 'Test',
      lastName: 'X'
    },
    note: 'note1',
    attatchments: [
      {
        secureUrl: 
          'https://res.cloudinary.com/dvq0ouupb/raw/upload/v1732487291/mbjl9jx70ggjvzbsdvdz.docx',
        fileName: 'Dummy file.docx',
        fileSize: 9932,
        fileType: 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        secureUrl: 
          'https://res.cloudinary.com/dvq0ouupb/raw/upload/v1732487292/ovwhlgsiao35oq7uyefd.xlsx',
        fileName: 'Book1.xlsx',
        fileSize: 8828,
        fileType: 
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      {
        secureUrl: 
          'https://res.cloudinary.com/dvq0ouupb/image/upload/v1732487293/czxm9hx00gr1xxogagcx.png',
        fileName: 'téléchargement.png',
        fileSize: 3691,
        fileType: 'image/png'
      }
    ],
    vacancySubmission: '6740ea99e3a9ce85c8da2d88',
    createdAt: '2024-11-24T22:28:13.545Z',
    replies: [],
    updatedAt: '2024-11-24T22:28:13.545Z',
    __v: 0
  }
  
  */

  console.log(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
  );

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };
  const user = useSelector(selectUser);
  console.log("user", user);

  const handleUpload = async ({ file }) => {
    setUploading(true);
    try {
      const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
      const response = await axios.post(cloudinaryUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const secureUrl = response.data.secure_url;
      const fileName = file.name;
      const fileSize = file.size;
      const fileType = file.type;

      return {
        secureUrl,
        fileName,
        fileSize,
        fileType,
      };
    } catch (error) {
      console.error("Error uploading file to Cloudinary", error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Note submitted", data);
    try {
      let res = null;
      if (isNew) {
        // Add note
        let attatchments = [];

        console.log("fileList", fileList);
        if (fileList.length > 0) {
          console.log("fileList", fileList);
          try {
            for (const file of fileList) {
              const { secureUrl, fileName, fileSize, fileType } =
                await handleUpload({
                  file: file.originFileObj,
                });
              console.log("secureUrl", secureUrl, fileName, fileSize);
              attatchments.push({
                secureUrl,
                fileName,
                fileSize,
                fileType,
              });
            }
          } catch (error) {
            console.error(error);
          }
        }

        console.log("attatchments", attatchments);

        res = await CrudService.create("CandidateNote", {
          note,
          attatchments,
          loggedBy: user._id,
          vacancySubmission: candidateId,
        });
      } else {
        // Update note
        let attatchments = [];
        if (fileList.length > 0) {
          console.log("fileList", fileList);
          try {
            for (const file of fileList) {
              const { secureUrl, fileName, fileSize, fileType } =
                await handleUpload({
                  file: file.originFileObj,
                });
              console.log("secureUrl", secureUrl, fileName, fileSize);
              attatchments.push({
                secureUrl,
                fileName,
                fileSize,
                fileType,
              });
            }
          } catch (error) {
            console.error(error);
          }
        }

        console.log("attatchments", attatchments);

        attatchments = [...defaultValue.attatchments, ...attatchments];

        res = await CrudService.update("CandidateNote", defaultValue._id, {
          note,
          attatchments,
        });
      }

      console.log("res", res);
      message.success("Note added successfully");
      setIsEdit(false);
      onCancel();
      setFileList([]);
      setNote("");
      reload();
    } catch (error) {
      console.error(error);
      message.error("Failed to add note");
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        note,
        attachment: fileList[0]?.originFileObj,
      });
    }
    // Reset form
  };

  const beforeUpload = (file) => {
    const isValidType = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ].includes(file.type);
    if (!isValidType) {
      message.error(
        "You can only upload image, PDF, Word, Excel, or text files!"
      );
      return Upload.LIST_IGNORE;
    }

    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      return new Promise((resolve, reject) => {
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          const isValidSize = img.width <= 800 && img.height <= 400;
          if (!isValidSize) {
            message.error("Image dimensions should not exceed 800x400px!");
            reject();
          } else {
            resolve();
          }
        };
      });
    }

    return true;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      const newReply = {
        user_id: user._id,
        userFullName: `${user.firstName} ${user.lastName}`,
        note: reply,
        attatchments: [],
        createdAt: new Date(),
      };

      const res = await CrudService.update("CandidateNote", defaultValue._id, {
        replies: [...replies, newReply],
      });

      setReplies([...replies, newReply]);
      setReply("");
      setShowReplyForm(false);
      message.success("Reply added successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to add reply");
    }
  };

  if (!defaultValue && !isNew) return null;
  if (isEdit) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-semibold">Add notes</h2>
        <div className="mb-4">
          <label htmlFor="note" className="block mb-1 text-sm text-gray-600">
            Note
          </label>
          <Input.TextArea
            id="note"
            value={note}
            onChange={handleNoteChange}
            placeholder="Some text here"
            className="w-full"
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </div>
        <div className="flex flex-col w-full mb-4 ">
          <p className="mb-1 text-sm text-gray-600">
            Add attachment (optional)
          </p>
          <Upload
            accept=".svg,.png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={5}
            className="relative flex items-center justify-center flex-grow w-full p-4 px-40 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 cursor-grabbing "
          >
            {!fileList ||
              (fileList.length === 0 && (
                <div className="">
                  <UploadOutlined className="mb-1 text-2xl text-gray-400" />
                  <p className="mb-1 text-blue-500">Click to upload</p>
                  <p className="text-gray-500">or drag and drop</p>
                  <p className="mt-1 text-xs text-gray-400">
                    (Max file size: 5MB)
                  </p>
                </div>
              ))}
            <svg
              width="40"
              height="41"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-0 right-0 m-2"
            >
              <path
                d="M35 39.75H11C9.20507 39.75 7.75 38.2949 7.75 36.5V4.5C7.75 2.70508 9.20508 1.25 11 1.25H27C27.1212 1.25 27.2375 1.29816 27.3232 1.38388L38.1161 12.1768C38.2018 12.2625 38.25 12.3788 38.25 12.5V36.5C38.25 38.2949 36.7949 39.75 35 39.75Z"
                fill="white"
                stroke="#D0D5DD"
                stroke-width="1.5"
              />
              <path
                d="M27 1V8.5C27 10.7091 28.7909 12.5 31 12.5H38.5"
                stroke="#D0D5DD"
                stroke-width="1.5"
              />
              <rect x="1" y="18" width="28" height="17" rx="2" fill="#D92D20" />
              <path
                d="M4.73367 31V23.55H7.51367C8.02034 23.55 8.46701 23.6433 8.85367 23.83C9.24701 24.01 9.55367 24.2767 9.77367 24.63C9.99367 24.9767 10.1037 25.4 10.1037 25.9C10.1037 26.3933 9.99034 26.8167 9.76367 27.17C9.54367 27.5167 9.24034 27.7833 8.85367 27.97C8.46701 28.1567 8.02034 28.25 7.51367 28.25H6.09367V31H4.73367ZM6.09367 27.05H7.53367C7.78034 27.05 7.99367 27.0033 8.17367 26.91C8.35367 26.81 8.49367 26.6733 8.59367 26.5C8.69367 26.3267 8.74367 26.1267 8.74367 25.9C8.74367 25.6667 8.69367 25.4667 8.59367 25.3C8.49367 25.1267 8.35367 24.9933 8.17367 24.9C7.99367 24.8 7.78034 24.75 7.53367 24.75H6.09367V27.05ZM11.218 31V23.55H12.278L16.378 29.07L15.828 29.18V23.55H17.188V31H16.118L12.078 25.44L12.578 25.33V31H11.218ZM22.1602 31.12C21.6268 31.12 21.1335 31.0233 20.6802 30.83C20.2268 30.6367 19.8302 30.3667 19.4902 30.02C19.1502 29.6733 18.8835 29.2667 18.6902 28.8C18.5035 28.3333 18.4102 27.8233 18.4102 27.27C18.4102 26.7167 18.5002 26.2067 18.6802 25.74C18.8668 25.2667 19.1268 24.86 19.4602 24.52C19.8002 24.1733 20.1968 23.9067 20.6502 23.72C21.1035 23.5267 21.5968 23.43 22.1302 23.43C22.6635 23.43 23.1402 23.52 23.5602 23.7C23.9868 23.88 24.3468 24.12 24.6402 24.42C24.9335 24.7133 25.1435 25.0367 25.2702 25.39L24.0602 25.97C23.9202 25.5833 23.6835 25.27 23.3502 25.03C23.0168 24.79 22.6102 24.67 22.1302 24.67C21.6635 24.67 21.2502 24.78 20.8902 25C20.5368 25.22 20.2602 25.5233 20.0602 25.91C19.8668 26.2967 19.7702 26.75 19.7702 27.27C19.7702 27.79 19.8702 28.2467 20.0702 28.64C20.2768 29.0267 20.5602 29.33 20.9202 29.55C21.2802 29.77 21.6935 29.88 22.1602 29.88C22.5402 29.88 22.8902 29.8067 23.2102 29.66C23.5302 29.5067 23.7868 29.2933 23.9802 29.02C24.1735 28.74 24.2702 28.41 24.2702 28.03V27.46L24.8902 28H22.1302V26.85H25.6302V27.6C25.6302 28.1733 25.5335 28.68 25.3402 29.12C25.1468 29.56 24.8835 29.93 24.5502 30.23C24.2235 30.5233 23.8535 30.7467 23.4402 30.9C23.0268 31.0467 22.6002 31.12 22.1602 31.12Z"
                fill="white"
              />
            </svg>
          </Upload>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} className="flex-1">
            Add
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex flex-col py-4 space-y-4">
        <div className="absolute top-0 flex gap-2 right-2">
          <button
            onClick={() => {
              setIsEdit(true);
              setNote(defaultValue?.note);
            }}
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={async () => {
              try {
                console.log("defaultValue", defaultValue);
                const res = await CrudService.delete(
                  "CandidateNote",
                  defaultValue._id
                );

                console.log("res", res);

                message.success("Note deleted successfully");
                onCancel();
                reload();
              } catch (error) {
                console.log("error", error);
                message.error("Failed to delete note");
              }
            }}
          >
            <button>
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
        <div className="flex items-start space-x-3">
          <Avatar
            src={defaultValue?.loggedBy?.avatar}
            className="flex-shrink-0"
            size={40}
          >
            {!defaultValue?.loggedBy?.avatar &&
              getInitials(defaultValue?.loggedBy)}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 ">
              <span className="mr-auto font-medium">
                {defaultValue?.loggedBy?.firstName}{" "}
                {defaultValue?.loggedBy?.lastName}
              </span>
              <span className="ml-auto text-gray-500">•</span>
              <span className="text-gray-500">
                {formatTime(defaultValue?.createdAt)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">
                {defaultValue?.createdAt
                  ? formatTimeAgo(defaultValue?.createdAt)
                  : ""}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{defaultValue?.note}</p>
            {defaultValue?.attatchments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultValue?.attatchments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 space-x-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <span>{attachment.fileName}</span>
                  </a>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-2 space-x-4">
              <span className="text-sm text-[#5207CD]">
                {replies.length} replies
              </span>
              <Button
                type="link"
                className="flex items-center h-auto gap-2 p-0 text-[#5207CD]"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6668 3.33337V4.50004C16.6668 7.3003 16.6668 8.70043 16.1219 9.76999C15.6425 10.7108 14.8776 11.4757 13.9368 11.9551C12.8672 12.5 11.4671 12.5 8.66683 12.5H3.3335M3.3335 12.5L7.50016 8.33337M3.3335 12.5L7.50016 16.6667"
                    stroke="#5207CD"
                    stroke-width="1.67"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Reply
              </Button>
            </div>
            {showReplyForm && (
              <div className="mt-4">
                <Input.TextArea
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Write a reply..."
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() => setShowReplyForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleReplySubmit}
                    className="flex-1"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
            {replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {replies.map((reply, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Avatar
                      src={reply.userAvatar}
                      className="flex-shrink-0"
                      size={30}
                    >
                      {!reply.userAvatar && getInitials(reply)}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="mr-auto font-medium">
                          {reply.userFullName}
                        </span>
                        <span className="ml-auto text-gray-500">•</span>
                        <span className="text-gray-500">
                          {formatTime(reply.createdAt)}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          {reply.createdAt
                            ? formatTimeAgo(reply.createdAt)
                            : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">{reply.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default NoteDetail;
