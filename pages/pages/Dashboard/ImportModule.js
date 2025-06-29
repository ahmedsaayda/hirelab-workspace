import React, { useRef, useState } from "react";

import { Alert, Button, Modal, Select, Spin, Typography, message } from "antd";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import qrcode from "yaqrcode";

import { handleXLSXTOJSON } from "../components/Board/services/utils";

import {
  selectDarkMode,
  selectLoading,
  selectUser,
} from "../../redux/auth/selectors";

async function generatePDF(items) {
  // Instantiate a new jsPDF document
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  console.log(items.length);

  for (let i = 0; i < items.length; i++) {
    // Add a new page for each item if not the first
    if (i % 10 === 0 && i !== 0) doc.addPage();

    // Draw the image directly from the URL
    const imageUrl = items[i].imageUrl;

    // You have to deal with the asynchronous nature of addImage if it is a URL
    // Here we load the image first and then continue with the loop
    try {
      const mod = i % 10;
      const yDiff = Math.floor(mod / 2) * 50;
      const xDiff = mod % 2 === 0 ? 0 : 100;

      if (imageUrl)
        await new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 3000);
          try {
            doc.setFontSize(8);
            doc.text(`${items[i].sku}`, 40 + xDiff, 14 + yDiff); // x, y
            doc.text(`Size: ${items[i].size}`, 35 + xDiff, 18 + yDiff); // x, y
            doc.text(`Price: $${items[i].price}`, 35 + xDiff, 22 + yDiff);
            doc.text(`Qty: ${items[i].quantity}`, 55 + xDiff, 22 + yDiff);

            let img = new Image();
            img.crossOrigin = "Anonymous"; // Attempt to deal with CORS
            img.onload = () => {
              doc.addImage(img, "PNG", 10 + xDiff, 10 + yDiff, 20, 20); // x, y, width, height
              // Add the base64 QR code as an image
              // Note: If QR code is not displayed correctly, ensure the base64 data is correct and in a supported format
              if (!items[i].qr) {
                return resolve();
              }
              const qrCodeData = items[i].qr.split(";base64,").pop();
              doc.addImage(qrCodeData, "PNG", 40 + xDiff, 24 + yDiff, 15, 15); // x, y, width, height
              resolve();
            };
            img.onerror = reject;
            img.src = imageUrl;
          } catch (e) {
            resolve();
          }
        });
    } catch (e) {}

    console.log(i);
  }

  // Save the PDF
  doc.save("bulk-items.pdf");
}

// This is your data structure based on the image provided
const bulkUploadProcess = {
  mappedItems: [
    // ... your items here
  ],
};

const targetFields = [
  { value: "sku", label: "SKU" },
  { value: "imageUrl", label: "Image URL" },
  { value: "size", label: "Size" },
  { value: "price", label: "Price" },
  { value: "quantity", label: "Quantity" },
  { value: "qr", label: "QR Code", hideFromMap: true },
];

const ImportModule = () => {
  const [bulkUploadProcess, setBulkUploadProcess] = useState({});
  const [lastScroll, setLastScroll] = useState(0);
  const darkMode = useSelector(selectDarkMode);
  const loading = useSelector(selectLoading);

  const fileInputRef = useRef(null);

  const handleStartImport = () => {
    setLastScroll(window.scrollY);

    fileInputRef.current.value = "";
    setBulkUploadProcess({});
    fileInputRef.current.click();
  };

  const columns = Array.from(
    new Set(
      bulkUploadProcess?.json?.map?.((line) => Object.keys(line))?.flat?.() ??
        []
    )
  );

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      handleXLSXTOJSON({ sheet: file }, async (json) => {
        json.shift();

        let mappings = {};
        try {
          mappings = JSON.parse(localStorage[`importfile_mapping`]);
        } catch (e) {}

        setBulkUploadProcess((current) => ({ ...current, json, mappings }));
      });
    }
  };

  return (
    <>
      <Button
        className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
        onClick={handleStartImport}
      >
        Import Excel
      </Button>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!bulkUploadProcess?.json?.[0]}
        onCancel={() => setBulkUploadProcess({})}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose
        afterOpenChange={(e) => {
          if (!e) window.scrollTo(0, lastScroll);
        }}
      >
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
                    className="px-6 py-3 text-left text-xs text-gray-500"
                  >
                    Delete
                  </th>
                  {targetFields.map((t, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-3 text-left text-xs text-gray-500"
                    >
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                {bulkUploadProcess?.mappedItems?.map((line, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MdDelete
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
                    {targetFields.map((t, idx) => (
                      <td key={idx} className="px-6 py-4 whitespace-nowrap">
                        <Typography.Paragraph
                          editable={{
                            onChange: (e) => {
                              setBulkUploadProcess((cur) => {
                                const current = { ...cur };

                                current.mappedItems[i + 1][t.value] = e;

                                return current;
                              });
                            },
                          }}
                        >
                          {line?.[t.value] ?? ""}
                        </Typography.Paragraph>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-3">
              <button
                onClick={async () => {
                  generatePDF(bulkUploadProcess.mappedItems);

                  // setBulkUploadProcess({});
                }}
                className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                disabled={loading}
              >
                {!loading ? "Confirm" : <Spin>Confirm</Spin>}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="font-bold flex items-center justify-between mt-5 mb-3">
              <div>Column of Imported File</div>
              <div>Target Column</div>
            </div>
            {columns &&
              columns.map((key, i) => (
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

                          localStorage[`importfile_mapping`] = JSON.stringify(
                            current.mappings
                          );

                          return current;
                        })
                      }
                    >
                      {targetFields
                        .filter((item) => {
                          if (item.hideFromMap) return false;
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
              <button
                onClick={async () => {
                  const keys = Object.keys(bulkUploadProcess.mappings);
                  const values = Object.values(bulkUploadProcess.mappings);

                  const mappedItems = bulkUploadProcess.json
                    .map((item) => {
                      const mappedItem = {};
                      for (const key of keys)
                        mappedItem[bulkUploadProcess.mappings[key]] = item[key];

                      try {
                        if (mappedItem.sku)
                          mappedItem.qr = qrcode(mappedItem.sku, {
                            size: 80,
                          });
                      } catch (e) {}

                      mappedItem.quantity = mappedItem.quantity || "1";

                      return mappedItem;
                    })
                    .filter((a) => {
                      if (
                        Object.keys(a).every(
                          (key) => !a[key] || key === "quantity"
                        )
                      )
                        return false;

                      return true;
                    });

                  setBulkUploadProcess((current) => ({
                    ...current,
                    mappedItems,
                  }));
                }}
                className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                disabled={loading}
              >
                {!loading ? "Confirm" : <Spin>Confirm</Spin>}
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* For bulk upload */}
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.csv"
      />
    </>
  );
};

export default ImportModule;
