import { Modal } from "antd";
import React from "react";
import Draggable from "react-draggable";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import useWindowDimensions from "../../hook/useWindowDimensions";
import { setPhoneCandidate } from "../../redux/auth/actions";
import { getPhoneCandidate, selectDarkMode } from "../../redux/auth/selectors";
import { store } from "../../redux/store";
import PhoneCallBox from "./PhoneCallBox";

const PhoneWidget = () => {
  const phoneCandidate = useSelector(getPhoneCandidate);
  const { width } = useWindowDimensions();
  const darkMode = useSelector(selectDarkMode);

  if (width < 500)
    return (
      <>
        <Modal
          wrapClassName={`${darkMode ? "dark" : ""}`}
          open={!!phoneCandidate}
          onCancel={() => {
            store.dispatch(setPhoneCandidate(null));
            document.dispatchEvent(new CustomEvent("HANG_UP_PHONE"));
          }}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          destroyOnClose
        >
          <PhoneCallBox candidateId={phoneCandidate} />
        </Modal>
      </>
    );

  return (
    <>
      {!!phoneCandidate && (
        <Draggable>
          <div
            className="bg-white dark:bg-gray-900 w-[320px] fixed rounded-md p-2"
            style={{ zIndex: 2000, bottom: 100, right: 20 }}
          >
            <div
              className="absolute  cursor-pointer bg-gray-200 rounded-md transition ease-in-out delay-150 hover:scale-110"
              style={{ zIndex: 2001, top: 5, right: 5 }}
              onTouchStart={() => {
                store.dispatch(setPhoneCandidate(null));
                document.dispatchEvent(new CustomEvent("HANG_UP_PHONE"));
              }}
              onClick={() => {
                store.dispatch(setPhoneCandidate(null));
                document.dispatchEvent(new CustomEvent("HANG_UP_PHONE"));
              }}
            >
              <RxCross2 size={25} className="text-black dark:text-gray-600" />
            </div>

            <PhoneCallBox candidateId={phoneCandidate} />
          </div>
        </Draggable>
      )}
    </>
  );
};

export default PhoneWidget;
