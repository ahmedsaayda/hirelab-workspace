import { Modal, Spin } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { selectDarkMode, selectLoading } from "../../../redux/auth/selectors";
import CrudService from "../../../services/CrudService";
const HiringManagerAddModal = ({
  addHiringManagerModal,
  setAddHiringManagerModal,
  reloadTemplates,
  setSelectedHiringManagers,
  setSelectedHiringManager,
}) => {
  const darkMode = useSelector(selectDarkMode);
  const backendLoading = useSelector(selectLoading);

  return (
    <>
      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!addHiringManagerModal}
        onCancel={() => setTimeout(() => setAddHiringManagerModal(false), 750)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        title="Add a hiring manager contact"
      >
        <form
          className="mt-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const firstname = e.target[1].value;
            const lastname = e.target[2].value;
            const jobTitle = e.target[3].value;

            if (!email) throw new Error("Email is required");
            if (!firstname) throw new Error("Firstname is required");

            const current = await CrudService.create("HiringManagerContact", {
              email,
              firstname,
              lastname,
              jobTitle,
            });
            if (current?.data?.result?._id && setSelectedHiringManagers)
              setSelectedHiringManagers((e) => [
                ...e,
                current?.data?.result?._id,
              ]);
            if (current?.data?.result?._id && setSelectedHiringManager)
              await setSelectedHiringManager(current?.data?.result?._id);
            await reloadTemplates();

            setAddHiringManagerModal(false);
          }}
        >
          <label className="font-semibold">Email</label>
          <input
            type="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 "
          />
          <div className="flex items-center justify-between gap-1 mt-5">
            <div className="w-full">
              <label className="font-semibold">Firstname</label>
              <input className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 " />
            </div>
            <div className="w-full">
              <label className="font-semibold">Lastname</label>
              <input className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 " />
            </div>
          </div>
          <label className="font-semibold">Job Title</label>
          <input className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-400  shadow-sm dark:shadow-gray-400/50  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-900 " />
          <div className="flex justify-end w-full">
            <button
              disabled={backendLoading}
              type="submit"
              className="px-2 py-1 mt-10 text-sm text-white bg-indigo-500 rounded"
            >
              {backendLoading ? <Spin>Add</Spin> : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default HiringManagerAddModal;
