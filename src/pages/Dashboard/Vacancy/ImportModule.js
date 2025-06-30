import { Alert, Button, Select, Spin, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectLoading } from "../../../redux/auth/selectors";
import ATSService from "../../../services/ATSService";
import CrudService from "../../../services/CrudService";
import { mappedVacancySubmission } from "./ATS";
import {
  selectUser,
} from "../../../redux/auth/selectors";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

const ImportModule = ({
  bulkUploadProcess,
  setBulkUploadProcess,
  VacancyId,
}) => {
  const [loading, setLoading] = useState(false);
  const backendLoading = useSelector(selectLoading);
  const [existingEmails, setExistingEmails] = useState([]);
  const user = useSelector(selectUser);

  
  

  return (
    <>
      <Alert
        type="info"
        message="Please check and verify the data"
        className="mt-5"
      />
      {bulkUploadProcess?.mappedItems ? (
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 mt-5 mb-3">
            <thead>
              <tr className="font-bold">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  Delete
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  Firstname
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  Lastname
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  LinkedIn URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-[#333333]"
                >
                  CV URL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
              {bulkUploadProcess?.mappedItems?.map((line, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrashIcon
                    width={20}
                      onClick={() => {
                        setBulkUploadProcess((cur) => {
                          const current = { ...cur };

                          current.mappedItems.splice(i, 1);

                          return current;
                        });
                      }}
                      className="cursor-pointer text-red-500 relative top-0.5 start-1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography.Paragraph
                      editable={{
                        icon:<PencilIcon width={12} className="cursor-pointer text-[#0538FF] "/>,
                        onChange: (e) => {
                          setBulkUploadProcess((cur) => {
                            const current = { ...cur };

                            current.mappedItems[i].firstname = e;

                            return current;
                          });
                        },
                      }}
                    >
                      {line?.firstname ?? ""}
                    </Typography.Paragraph>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography.Paragraph
                      editable={{
                        icon:<PencilIcon width={12} className="cursor-pointer text-[#0538FF] "/>,
                        onChange: (e) => {
                          setBulkUploadProcess((cur) => {
                            const current = { ...cur };

                            current.mappedItems[i].lastname = e;

                            return current;
                          });
                        },
                      }}
                    >
                      {line?.lastname ?? ""}
                    </Typography.Paragraph>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex">
                    {existingEmails?.includes?.(line?.email) &&
                      (user?.isAdmin ||
                        user?.leadModuleAccess ||
                        process.env.NODE_ENV !== "production") &&
                      "*"}
                    <Typography.Paragraph
                      editable={{
                        icon:<PencilIcon width={12} className="cursor-pointer text-[#0538FF] "/>,
                        onChange: (e) => {
                          setBulkUploadProcess((cur) => {
                            const current = { ...cur };

                            current.mappedItems[i].email = e;

                            return current;
                          });
                        },
                      }}
                    >
                      {line?.email ?? ""}
                    </Typography.Paragraph>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography.Paragraph
                      editable={{
                        icon:<PencilIcon width={12} className="cursor-pointer text-[#0538FF] "/>,
                        onChange: (e) => {
                          setBulkUploadProcess((cur) => {
                            const current = { ...cur };

                            current.mappedItems[i].phone = e;

                            return current;
                          });
                        },
                      }}
                    >
                      {line?.phone ?? ""}
                    </Typography.Paragraph>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Typography.Paragraph
                      editable={{
                        icon:<PencilIcon width={12} className="cursor-pointer text-[#0538FF] "/>,
                        onChange: (e) => {
                          setBulkUploadProcess((cur) => {
                            const current = { ...cur };

                            current.mappedItems[i].linkedInUrl = e;

                            return current;
                          });
                        },
                      }}
                    >
                      {line?.linkedInUrl ?? ""}
                    </Typography.Paragraph>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <Button
            type="primary"
              onClick={async () => {
                setLoading(true);

                try {
                  const chunk = (arr, size) =>
                    Array.from(
                      { length: Math.ceil(arr.length / size) },
                      (v, i) => arr.slice(i * size, i * size + size)
                    );

                  const chunks = chunk(
                    bulkUploadProcess.mappedItems.map((formData) => ({
                      VacancyId,
                      stageId: bulkUploadProcess.stageId,
                      formData,
                      searchIndex: JSON.stringify(formData),
                    })),
                    25
                  );

                  for (const bulkItems of chunks) {
                    const result = await CrudService.create(
                      "VacancySubmission",
                      {
                        bulkItems,
                      }
                    );

                    if (result.data?.result)
                      await ATSService.importCandidates({
                        candidateIds: result.data.result.map((a) => a._id),
                      });
                  }

                  document.dispatchEvent(new CustomEvent("REFRESH.ATS"));

                  setBulkUploadProcess({});
                } catch (e) {
                } finally {
                  setLoading(false);
                }
              }}
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
              disabled={loading}
            >
              {!loading ? "Import" : <Spin>Import</Spin>}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="font-bold flex items-center justify-between mt-5 mb-3">
            <div>Column of Imported File</div>
            <div>Target Column</div>
          </div>
          {bulkUploadProcess?.json?.[0] &&
            Object.keys(bulkUploadProcess?.json?.[0]).map((key, i) => (
              <div key={i} className="flex items-center justify-between mb-1">
                <div>{key}</div>
                <div>
                  <Select
                    className="min-w-[120px]"
                    value={bulkUploadProcess?.mappings?.[key]}
                    allowClear
                    onChange={(e) =>
                      setBulkUploadProcess((cur) => {
                        const current = { ...cur };
                        if (!current?.mappings) current.mappings = {};

                        current.mappings[key] = e;

                        localStorage[
                          `importfile_mapping_${Object.keys(
                            bulkUploadProcess.json[0]
                          ).join("_")}`
                        ] = JSON.stringify(current.mappings);

                        return current;
                      })
                    }
                  >
                    {mappedVacancySubmission
                      .filter((item) => {
                        return (
                          !bulkUploadProcess?.mappings ||
                          bulkUploadProcess?.mappings[key] === item.value ||
                          !Object.values(bulkUploadProcess.mappings).includes(
                            item.value
                          )
                        );
                      })
                      .map((item) => (
                        <Select.Option
                          key={item.value}
                          value={item.value}
                          label={item.label}
                        >
                          {item.label}
                        </Select.Option>
                      ))}
                  </Select>
                </div>
              </div>
            ))}

          <div className="flex justify-end mt-2">
            <Button
            type="primary"
              onClick={async () => {
                const keys = Object.keys(bulkUploadProcess.mappings);
                const values = Object.values(bulkUploadProcess.mappings);

                if (!values.includes("email"))
                  return message.info(
                    "Please select a mapping column for email"
                  );
                if (
                  !values.includes("firstname") &&
                  !values.includes("fullname")
                )
                  return message.info(
                    "Please select a mapping column for firstname or fullname"
                  );
                if (
                  !values.includes("lastname") &&
                  !values.includes("fullname")
                )
                  return message.info(
                    "Please select a mapping column for lastname or fullname"
                  );

                const emailKey = Object.keys(bulkUploadProcess.mappings).find(
                  (key) => bulkUploadProcess.mappings[key] === "email"
                );
                if (emailKey) {
                  const emails = bulkUploadProcess.json.map(
                    (item) => item[emailKey]
                  );

                  const existing = await ATSService.getExisting(emails);

                  const existingEmails = existing.data.items.map(
                    (d) => d?.email
                  );
                  setExistingEmails(Array.from(new Set(existingEmails)));
                }

                const mappedItems = bulkUploadProcess.json
                  .map((item) => {
                    const mappedItem = {};
                    for (const key of keys)
                      mappedItem[bulkUploadProcess.mappings[key]] = item[key];

                    if (mappedItem.fullname) {
                      mappedItem.firstname = mappedItem.fullname
                        .split(" ")
                        ?.slice(0, -1)
                        ?.join(" ");
                      mappedItem.lastname = mappedItem.fullname
                        .split(" ")
                        ?.slice(-1)
                        ?.join(" ");
                      if (!mappedItem.firstname && mappedItem.lastname) {
                        mappedItem.firstname = `${mappedItem.lastname}`;
                        mappedItem.lastname = "";
                      }

                      delete mappedItem.fullname;
                    }
                    return mappedItem;
                  })
                  .filter((a) => {
                    if (Object.keys(a).every((key) => !a[key])) return false;

                    return true;
                  });
                setBulkUploadProcess((current) => ({
                  ...current,
                  mappedItems,
                }));
              }}
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
              disabled={backendLoading}
            >
              {!backendLoading ? "Import" : <Spin>Import</Spin>}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ImportModule;
