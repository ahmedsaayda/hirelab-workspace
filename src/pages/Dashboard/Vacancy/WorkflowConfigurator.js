import {
  Button,
  Divider,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { GrInfo } from "react-icons/gr";
import { IoMdSave } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectDarkMode, selectLoading } from "../../../redux/auth/selectors";
import AuthService from "../../../services/AuthService";
import CrudService from "../../../services/CrudService";
import HiringManagerAddModal from "../ForwardResume/HiringManagerAddModal";
import VariableMessageBox from "../Message/VariableMessageBox";
import VariableSMSBox from "../Message/VariableSMSBox";
import SurveyFormSetup from "./SurveyFormSetup";

const GeneralWorkflowConfigurator = ({ VacancyId }) => {
  const [me, setMe] = useState(null);
  const [stages, setStages] = useState(null);
  const [vacancyData, setVacancyData] = useState(null);
  const loading = useSelector(selectLoading);

  const reloadData = useCallback(async () => {
    if (!VacancyId) return;

    AuthService.me().then(({ data }) => setMe(data.me));
    CrudService.search("VacancyStage", 1000, 1, {
      filters: { vacancyId: VacancyId },
      sort: { sort: 1, createdAt: 1 },
    }).then(({ data }) => {
      setStages(data.items);
    });

    CrudService.getSingle("Vacancy", VacancyId).then(({ data }) => {
      setVacancyData(data);
    });
  }, [VacancyId]);
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const handleConfigChange = useCallback(
    async (field, value) => {
      if (!VacancyId) return;

      await CrudService.update("Vacancy", VacancyId, {
        [field]: value,
      }).then(() => reloadData());
    },
    [reloadData, VacancyId]
  );

  if (!me) return <Skeleton active />;
  if (!stages) return <Skeleton active />;
  if (!vacancyData) return <Skeleton active />;
  return (
    <>
      <h2 className="custom-label-title">General Workflow Configuration</h2>

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When a candidate applies, automatically assign them to the stage{" "}
          <span className="text-transparent bg-gradient bg-clip-text">
            {stages?.find?.((s) => s._id === vacancyData?.onApplyAssignStage)
              ?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onApplyAssignStage}
          onChange={(value) => handleConfigChange("onApplyAssignStage", value)}
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When you send a meeting request to candidate, automatically assign
          them to the stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.(
              (s) => s._id === vacancyData?.onRequestMeetingAssignStage
            )?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onRequestMeetingAssignStage}
          onChange={(value) =>
            handleConfigChange("onRequestMeetingAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />

      {/* <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When I send meeting request to candidate, automatically mark them as a{" "}
          <span className="bg-gradient text-transparent bg-clip-text">qualified</span> candidate
        </label>
        <Switch
          loading={loading}
          checked={vacancyData?.onRequestMeetingMarkAsQualified}
          onChange={(value) =>
            handleConfigChange("onRequestMeetingMarkAsQualified", value)
          }
        />
      </div>
      <Divider /> */}

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate scheduled a meeting, automatically assign them to the
          stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.(
              (s) => s._id === vacancyData?.onScheduledMeetingAssignStage
            )?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onScheduledMeetingAssignStage}
          onChange={(value) =>
            handleConfigChange("onScheduledMeetingAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When a scheduled meeting has been cancelled, automatically assign
          candidate to the stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.(
              (s) => s._id === vacancyData?.onCancelledMeetingAssignStage
            )?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onCancelledMeetingAssignStage}
          onChange={(value) =>
            handleConfigChange("onCancelledMeetingAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When phone interview has been completed, automatically assign them to
          the stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.(
              (s) => s._id === vacancyData?.onPhoneCallEndAssignStage
            )?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onPhoneCallEndAssignStage}
          onChange={(value) =>
            handleConfigChange("onPhoneCallEndAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate is qualified, automatically assign them to the stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.(
              (s) => s._id === vacancyData?.onQualifiedAssignStage
            )?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onQualifiedAssignStage}
          onChange={(value) =>
            handleConfigChange("onQualifiedAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate is marked as rejected, automatically assign them to the
          stage{" "}
          <span className="bg-gradient text-transparent bg-clip-text">
            {stages?.find?.((s) => s._id === vacancyData?.onRejectedAssignStage)
              ?.name ?? "None"}
          </span>
        </label>
        <Select
          style={{ width: 200 }}
          loading={loading}
          value={vacancyData?.onRejectedAssignStage}
          onChange={(value) =>
            handleConfigChange("onRejectedAssignStage", value)
          }
        >
          <Select.Option key={1} value={null}>
            None
          </Select.Option>
          {stages.map((stage) => (
            <Select.Option key={stage._id} value={stage._id}>
              {stage?.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Divider />
    </>
  );
};

const WorkflowConfigurator = ({ workflow, VacancyId }) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [surveyFormActive, setSurveyFormActive] = useState(false);
  const [webhookURL, setWebhookURL] = useState("");
  const [activatedMessagingTemplate, setActivatedMessagingTemplate] =
    useState(null);
  const loading = useSelector(selectLoading);
  const darkMode = useSelector(selectDarkMode);
  const [stages, setStages] = useState(null);
  const [addHiringManagerModal, setAddHiringManagerModal] = useState(null);
  const [hiringManagers, setHiringManagers] = useState([]);
  const [activatedSMSTemplate, setActivatedSMSTemplate] = useState(null);

  const reloadData = useCallback(() => {
    if (!!workflow?.stageId) {
      CrudService.getSingle("VacancyStage", workflow.stageId).then(({ data }) =>
        setWorkflowData(data)
      );
    }

    CrudService.search("HiringManagerContact", 10000000, 1, {
      sort: { createdAt: 1 },
    }).then(({ data }) => {
      setHiringManagers(data.items);
    });
  }, [workflow]);
  useEffect(() => {
    reloadData();
  }, [reloadData]);
  useEffect(() => {
    if (!VacancyId) return;

    CrudService.search("VacancyStage", 1000, 1, {
      filters: { vacancyId: VacancyId },
      sort: { sort: 1, createdAt: 1 },
    }).then(({ data }) => {
      setStages(data.items);
    });
  }, [VacancyId]);

  useEffect(() => {
    setWebhookURL(workflowData?.onEnterPushWebhookURL ?? "");
  }, [workflowData]);

  const handleConfigChange = useCallback(
    async (field, value) => {
      if (!workflow?.stageId) return;

      await CrudService.update("VacancyStage", workflow.stageId, {
        [field]: value,
      }).then(() => reloadData());
    },
    [reloadData, workflow]
  );

  if (workflow === "general")
    return <GeneralWorkflowConfigurator VacancyId={VacancyId} />;
  if (!workflowData) return <Skeleton active />;
  if (!stages) return <Skeleton active />;

  return (
    <>
      <h2 className="custom-label-title">
        Workflow Configuration for{" "}
        <span className="bg-gradient text-transparent bg-clip-text">{workflowData?.name}</span>
      </h2>
      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate enters stage {workflowData?.name}, send them{" "}
          <span className="bg-gradient text-transparent bg-clip-text">an automated email</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterSendCVCompleteRequest}
          onChange={(value) =>
            handleConfigChange("onEnterSendCVCompleteRequest", value)
          }
        />
      </div>

      <Space>
        <Button
        type="primary"
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("CVCompleteRequest");
          }}
        >
          Change Email Template
        </Button>
      </Space>

      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate enters stage {workflowData?.name}, send them{" "}
          <span className="bg-gradient text-transparent bg-clip-text">an automated SMS</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterSendSMS}
          onChange={(value) => handleConfigChange("onEnterSendSMS", value)}
        />
      </div>

      <Space>
        <Button
        type="primary"
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedSMSTemplate("onEnterSendSMSBody");
          }}
        >
          Change SMS Template
        </Button>
      </Space>

      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate enters stage {workflowData?.name}, send them{" "}
          <span className="bg-gradient text-transparent bg-clip-text">an AI call</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterCall}
          onChange={(value) => handleConfigChange("onEnterCall", value)}
        />
      </div>

      <Space>
        <Button
        type="primary"
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedSMSTemplate("onEnterCallScript");
          }}
        >
          Change Call Script
        </Button>
      </Space>

      {/* <Divider /> */}
      {/* <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, send them{" "}
          <span className="bg-gradient text-transparent bg-clip-text">request to submit the survey</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterSendSurveySubmitRequest}
          onChange={(value) =>
            handleConfigChange("onEnterSendSurveySubmitRequest", value)
          }
        />
      </div>

      <Space>
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("SurveySubmitRequest");
          }}
        >
          Change Email Template
        </button>
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            setSurveyFormActive(true);
          }}
        >
          Change Survey Form
        </button>
      </Space>

      <Divider /> */}

      {/* <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, send them{" "}
          <span className="bg-gradient text-transparent bg-clip-text">a document to sign</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterSendDocument}
          onChange={(value) => handleConfigChange("onEnterSendDocument", value)}
        />
      </div>

      <Space>
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("DocumentRequestInvite");
          }}
        >
          Change Email Template
        </button>
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("DocumentRequest");
          }}
        >
          Change Document Template
        </button>
      </Space>
      <Space className="mt-2">
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("DocumentRequestHiringManager");
          }}
        >
          Change Hiring Manager Reminder
        </button>
        <button
          className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
          onClick={async () => {
            if (loading) return;
            setActivatedMessagingTemplate("DocumentRequestCompletion");
          }}
        >
          Change Completion Confirmation
        </button>
      </Space> */}

      {workflowData?.onEnterSendDocument && (
        <>
          <div className=" flex gap-3 items-center mt-5">
            <label className="custom-label">
              When the document has been signed, move the candidate into{" "}
              <span className="bg-gradient text-transparent bg-clip-text">
                {stages?.find?.(
                  (s) => s._id === workflowData?.onDocumentSignAssignStage
                )?.name ?? "None"}{" "}
              </span>
            </label>
            <Select
              style={{ width: 200 }}
              loading={loading}
              value={workflowData?.onDocumentSignAssignStage || null}
              onChange={(value) =>
                handleConfigChange("onDocumentSignAssignStage", value)
              }
            >
              <Select.Option key={1} value={null}>
                None
              </Select.Option>
              {stages.map((stage) => (
                <Select.Option key={stage._id} value={stage._id}>
                  {stage?.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex w-full justify-between items-center gap-1 mt-5">
            <label className="custom-label">
              {!workflowData?.offerExpiration ? (
                <>The offer should not expire</>
              ) : (
                <>
                  When the candidate fails to sign within{" "}
                  <span className="bg-gradient text-transparent bg-clip-text">
                    {workflowData?.offerExpiration}
                  </span>{" "}
                  days, the offer should expire
                </>
              )}
            </label>
            <Space>
              <InputNumber
                value={workflowData?.offerExpiration ?? 0}
                onChange={(value) =>
                  handleConfigChange("offerExpiration", value)
                }
              />
              <Tooltip
                title={
                  !workflowData?.offerExpiration
                    ? "You can automatically revoke the offer when candidate fails to sign within the specified number of days"
                    : `The offer will be automatically rescinded ${workflowData?.offerExpiration} days following its issuance. To prevent the offer from being withdrawn, you may adjust this duration to 0 days.`
                }
              >
                <GrInfo />
              </Tooltip>
            </Space>
          </div>

          <div className="flex w-full justify-between items-center gap-1 mt-5">
            <Space>
              <label className="font-bold">Hiring Manager</label>
              <Tooltip
                title={`You can designate a specific hiring manager to be accountable for signing the document, provided that the template includes a signature field for this role. This individual will also be the primary recipient of all reminders throughout the document signing process.`}
              >
                <GrInfo />
              </Tooltip>
            </Space>
            <div>
              <div className="w-full flex items-center">
                <Select
                  className="grow"
                  style={{ width: 175 }}
                  value={workflowData?.DocumentRequestHiringManager ?? null}
                  onChange={(e) =>
                    handleConfigChange("DocumentRequestHiringManager", e)
                  }
                  showSearch
                  filterOption={(input, option) => {
                    const label = option.label
                      .replace(/\@\[/g, "")
                      .replace(/\]\((.)*\)/g, "")
                      .toLowerCase();
                    return label.includes(input.toLowerCase());
                  }}
                >
                  <Select.Option key={1} value={null} label={"None"}>
                    None
                  </Select.Option>
                  {hiringManagers.map((t) => (
                    <Select.Option
                      value={t._id}
                      label={
                        `${t.firstname} ${t.lastname} <${t.email}>`.slice(
                          0,
                          40
                        ) || "-"
                      }
                    >
                      <Space className="flex justify-between">
                        <div>
                          {`${t.firstname} ${t.lastname} <${t.email}>`.slice(
                            0,
                            40
                          ) || "-"}
                        </div>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
                <Button
                type="primary"
                  onClick={() => {
                    setAddHiringManagerModal(true);
                  }}
                  className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
                  disabled={loading}
                >
                  {!loading ? (
                    "Add Hiring Manager"
                  ) : (
                    <Spin>Add Hiring Manager</Spin>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Divider />

      <div className="mb-5 flex gap-3 items-center">
        <label className="custom-label">
          When candidate enters stage {workflowData?.name}, push candidate data
          into an external webhook
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterPushWebhook}
          onChange={(value) => handleConfigChange("onEnterPushWebhook", value)}
        />
      </div>

      <h2 className="custom-label">Webhook URL</h2>
      <Search
        enterButton={<IoMdSave />}
        className="dark:text-gray-900"
        placeholder="https://webhook.site/..."
        value={webhookURL}
        onChange={(e) => setWebhookURL(e.target.value)}
        onSearch={async (e) => {
          handleConfigChange("onEnterPushWebhookURL", webhookURL).then(() =>
            message.success("Webhook URL successfully updated")
          );
        }}
      />

      <Divider />
      {/* <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">qualified</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsQualified}
          onChange={(value) =>
            handleConfigChange("onEnterMarkAsQualified", value)
          }
        />
      </div>
      <Divider />
      <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">not qualified</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsNotQualified}
          onChange={(value) =>
            handleConfigChange("onEnterMarkAsNotQualified", value)
          }
        />
      </div>

      <Divider />
      <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">scheduled for meeting</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsScheduledForMeeting}
          onChange={(value) =>
            handleConfigChange("onEnterMarkAsScheduledForMeeting", value)
          }
        />
      </div>
      <Divider />
      <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">not scheduled for meeting</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsNotScheduledForMeeting}
          onChange={(value) =>
            handleConfigChange("onEnterMarkAsNotScheduledForMeeting", value)
          }
        />
      </div>

      <Divider />
      <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">hired</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsHired}
          onChange={(value) => handleConfigChange("onEnterMarkAsHired", value)}
        />
      </div>
      <Divider />
      <div className="mb-5 flex gap-3 items-center">
        <label className="font-bold">
          When candidate enters stage {workflowData?.name}, mark them as{" "}
          <span className="bg-gradient text-transparent bg-clip-text">not hired</span>
        </label>
        <Switch
          loading={loading}
          checked={workflowData?.onEnterMarkAsNotHired}
          onChange={(value) =>
            handleConfigChange("onEnterMarkAsNotHired", value)
          }
        />
      </div> */}

      {/* <Divider /> */}
      <div className="mb-5">
        <div className=" flex gap-3 items-center">
          <label className="custom-label">
            When candidates stay too long in stage {workflowData?.name}, move
            them into{" "}
            <span className="bg-gradient text-transparent bg-clip-text">
              {stages?.find?.((s) => s._id === workflowData?.onIdleAssignStage)
                ?.name ?? "None"}{" "}
            </span>
          </label>
          <Select
            style={{ width: 200 }}
            loading={loading}
            value={workflowData?.onIdleAssignStage || null}
            onChange={(value) => handleConfigChange("onIdleAssignStage", value)}
          >
            <Select.Option key={1} value={null}>
              None
            </Select.Option>
            {stages.map((stage) => (
              <Select.Option key={stage._id} value={stage._id}>
                {stage?.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {workflowData?.onIdleAssignStage && (
          <div className="flex w-full justify-end items-center gap-1">
            <label className="custom-label">Delay</label>
            <Space>
              <InputNumber
                value={workflowData?.idleHours ?? 0}
                onChange={(value) => handleConfigChange("idleHours", value)}
              />
              <Tooltip
                title={`Candidates will be moved ${
                  workflowData?.idleHours ?? 0
                } hour${
                  workflowData?.idleHours > 1 ? "s" : ""
                } of idle time waiting in this stage.`}
              >
                <GrInfo />
              </Tooltip>
            </Space>
          </div>
        )}
      </div>

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!activatedMessagingTemplate}
        onCancel={() => setActivatedMessagingTemplate(null)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <VariableMessageBox
          workflowData={workflowData}
          defaultSubject={
            workflowData?.[`${activatedMessagingTemplate}Subject`]
          }
          defaultBody={workflowData?.[`${activatedMessagingTemplate}Body`]}
          onSend={async (subject, body) => {
            setActivatedMessagingTemplate(null);
            if (workflow?.stageId)
              await CrudService.update("VacancyStage", workflow.stageId, {
                [`${activatedMessagingTemplate}Subject`]: subject,
                [`${activatedMessagingTemplate}Body`]: body,
              }).then(() => reloadData());
          }}
          additionalVariables={
            activatedMessagingTemplate === "DocumentRequest"
              ? [
                  {
                    id: "offerExpirationDate",
                    display: "Offer Expiration Date",
                  },
                  {
                    id: "hiringAuthorityPrintedName",
                    display: "Hiring Authority Printed Name",
                  },
                  {
                    id: "hiringAuthorityJobTitle",
                    display: "Hiring Authority Job Title",
                  },
                  { id: "candidateAddress", display: "Candidate's Address" },
                  {
                    id: "candidateSignature",
                    display: "Candidate's Signature",
                  },
                  {
                    id: "candidateSignatureDate",
                    display: "Candidate's Signature Date",
                  },
                  {
                    id: "hiringAuthoritySignature",
                    display: "Hiring Authority Signature",
                  },
                  {
                    id: "hiringAuthoritySignatureDate",
                    display: "Hiring Authority Signature Date",
                  },
                ]
              : activatedMessagingTemplate === "DocumentRequestInvite"
              ? [
                  {
                    id: "documentSigningLink",
                    display: "Document Signing Link",
                  },
                  {
                    id: "documentTitle",
                    display: "Document Title",
                  },
                  {
                    id: "offerExpirationDate",
                    display: "Offer Expiration Date",
                  },
                ]
              : activatedMessagingTemplate === "DocumentRequestHiringManager"
              ? [
                  {
                    id: "hiringManagerSigningLink",
                    display: "Hiring Manager Signing Link",
                  },
                  {
                    id: "hiringAuthorityPrintedName",
                    display: "Hiring Authority Printed Name",
                  },
                  {
                    id: "hiringAuthorityJobTitle",
                    display: "Hiring Authority Job Title",
                  },
                ]
              : activatedMessagingTemplate === "DocumentRequestCompletion"
              ? [
                  {
                    id: "documentTitle",
                    display: "Document Title",
                  },
                  {
                    id: "documentSigningLink",
                    display: "Document Signing Link",
                  },
                ]
              : []
          }
        />
      </Modal>

      <SurveyFormSetup
        surveyFormActive={surveyFormActive}
        setSurveyFormActive={setSurveyFormActive}
      />

      <HiringManagerAddModal
        addHiringManagerModal={addHiringManagerModal}
        setAddHiringManagerModal={setAddHiringManagerModal}
        reloadTemplates={reloadData}
        setSelectedHiringManager={async (e) =>
          await handleConfigChange("DocumentRequestHiringManager", e)
        }
      />

      <Modal
        wrapClassName={`${darkMode ? "dark" : ""}`}
        open={!!activatedSMSTemplate}
        onCancel={() => setActivatedSMSTemplate(null)}
        destroyOnClose
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <VariableSMSBox
          workflowData={workflowData}
          defaultBody={workflowData?.[`${activatedSMSTemplate}`]}
          onSend={async (body) => {
            setActivatedSMSTemplate(null);
            if (workflow?.stageId)
              await CrudService.update("VacancyStage", workflow.stageId, {
                [`${activatedSMSTemplate}`]: body,
              }).then(() => reloadData());
          }}
          disableTemplate={activatedSMSTemplate === "onEnterCallScript"}
        />
      </Modal>
    </>
  );
};

export default WorkflowConfigurator;
