import { Alert, Divider, Popconfirm, Skeleton, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPartner, selectLoading } from "../../../src/redux/auth/selectors";
import CalendlyService from "../../../src/services/CalendlyService";
import { partner } from "../../../src/constants";

const CalendlyEventSelector = ({ refresh }) => {
  const [eventTypes, setEventTypes] = useState(null);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    CalendlyService.getEventTypes().then(({ data }) => {
      setEventTypes(data.eventTypes);
    });
  }, []);

  if (!eventTypes) return <Skeleton />;
  return (
    <div
      className="flex justify-center items-center h-full min-h-[100vh]"
      style={{
        // backgroundImage: partner?.authImage || backgroundImage,
        backgroundImage: `url(${
          partner?.authImage
            ? partner?.authImage
            : "/images/background-auth.jpg"
        })`,
      }}
    >
      <div className="container  flex flex-wrap justify-center p-10 text-center m-10 bg-white dark:bg-gray-900 rounded-lg">
        <h2 className="font-semibold text-lg">
          Connect Your Calendly to Get Started
        </h2>

        <div>
          <p>
            We see that you've successfully linked your Calendly account –
            that's a great first step. To streamline your interview scheduling
            process, please select a default event type from the options below.
            This will be the meeting template that interviewees will use to book
            a time with you.
          </p>

          <p>
            Selecting a default event type for interviews will help you to
            automate your scheduling and let you focus on the conversations that
            matter. If you need any help along the way, we're here for you!
          </p>
        </div>

        <div className="mt-5">
          {eventTypes.map((eventType, i) => (
            <button
              key={i}
              style={{ background: eventType.color }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded m-2 transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={async () => {
                await CalendlyService.setPreferedEventType(eventType.uri);
                refresh();
              }}
            >
              {eventType.name}
            </button>
          ))}
        </div>

        <div>
          {eventTypes.length === 0 && (
            <Alert
              type="warning"
              message={
                <div className="text-left">
                  <p>
                    We are not able to provide you with any options, because you
                    haven't set up any booking events in your Calendly account
                    yet. No worries, it's a quick fix:
                  </p>

                  <ol>
                    <li>Head over to your Calendly dashboard.</li>
                    <li>
                      Create at least one event type to be used for interviews.
                    </li>
                    <li>
                      Come back here, and voilà, your event should appear.
                    </li>
                  </ol>
                </div>
              }
            />
          )}
        </div>

        <div
          className="mt-5"
          style={{ visibility: loading ? "visible" : "hidden" }}
        >
          <Spin />
        </div>

        <Divider />

        <div>
          <div>
            Would you like to instead disconnect your calendly integration?
          </div>
          <div className="mt-3">
            <Popconfirm
              title="Your calendar scheduling functionality will stop working. Are you sure to proceed?"
              onConfirm={async () => {
                await CalendlyService.disconnectCalendly();
                refresh();
              }}
            >
              <button className="px-2 py-1 text-sm border border-red-500 text-red rounded">
                Disconnect
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* <SupportWidget /> */}
    </div>
  );
};

export default CalendlyEventSelector;
