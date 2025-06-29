import { Menu, Transition } from "@headlessui/react";
import { Alert, Modal, Skeleton } from "antd";
import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import ATSService from "../../../service/ATSService";
import CrudService from "../../../service/CrudService";

const FunnelTemplateLibrary = ({ onFinish, vacancyId }) => {
  const [modal, contextHolder] = Modal.useModal();
  const [templates, setTemplates] = useState(null);
  const [queryFilter, setQueryFilter] = useState("ALL");

  useEffect(() => {
    CrudService.search("FunnelConfigTemplates", 1000, 1, {}).then(({ data }) =>
      setTemplates(
        data.items.map((item) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          category: item.category,
        }))
      )
    );
  }, []);

  if (!templates) return <Skeleton active />;
  return (
    <>
      <div className="flex items-center justify-between mt-5">
        <h1 className="text-lg font-bold mb-2">Funnel Library</h1>
        <div>
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button
                type="button"
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-400  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <FaFilter />
                Filter
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 shadow-lg dark:shadow-gray-400/50 hover:shadow-gray-600/50  ring-1 ring-black ring-opacity-5 focus:outline-none">
                {[
                  { _id: "ALL", name: "All candidates" },
                  { _id: "recruitment", name: "Recruitment" },
                  { _id: "sales", name: "Sales" },
                  { _id: "partnership", name: "Partnership" },
                ].map((item) => (
                  <Menu.Item key={item._id}>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active || queryFilter === item._id
                            ? "bg-gray-100 dark:bg-gray-400 dark:bg-gray-600"
                            : "",
                          "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300  cursor-pointer"
                        )}
                        onClick={() => {
                          setQueryFilter(item._id);
                        }}
                      >
                        {item.name}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {!localStorage?.informationTemplateLibrary001 && (
        <Alert
          type="info"
          message="The funnel template library is a curated collection of pre-built funnel configurations designed to streamline and standardize processes such as sales, recruitment, or partnership engagement. It offers a range of funnel templates that encapsulate best practices and successful strategies, allowing for quick implementation and ensuring consistent approaches across different scenarios."
          closable
          onClose={() => (localStorage.informationTemplateLibrary001 = "true")}
        />
      )}

      <div className="grid grid-cols-1 gap-4 mt-2">
        {templates
          .filter((e) => {
            if (queryFilter === "ALL") return true;

            return e?.category?.includes?.(queryFilter);
          })
          .map((template) => (
            <div
              key={template._id}
              className="p-4 border rounded-lg hover:shadow-md dark:shadow-gray-400/50 hover:shadow-gray-600/50  cursor-pointer transition duration-300"
              onClick={() =>
                modal.confirm({
                  title: "Confirm Overwrite",
                  content:
                    "By applying this template, your current funnel configuration including stages, automated emails, and workflow settings will be replaced. All candidates will be moved to the 'Uncategorized' column. Are you sure you want to proceed?",
                  okText: "Continue",
                  cancelText: "Cancel",
                  closable: true,
                  onOk: async () => {
                    await ATSService.loadFunnelConfigTemplateIntoVacancy({
                      templateId: template._id,
                      vacancyId,
                    });
                    onFinish();
                  },
                })
              }
            >
              <h2 className="text-lg font-semibold">{template.title}</h2>
              <p className="text-gray-500 mt-2">{template.description}</p>
            </div>
          ))}
      </div>

      {contextHolder}
    </>
  );
};

export default FunnelTemplateLibrary;
