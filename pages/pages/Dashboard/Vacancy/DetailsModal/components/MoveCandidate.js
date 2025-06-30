import React, { useCallback, useEffect, useState } from "react";
import { Button, Divider, Input, message, Select } from "antd";
import ATSService from "../../../../../../src/services/ATSService";
import { useSelector } from "react-redux";
import { selectLoading } from "../../../../../../src/redux/auth/selectors";

function MoveCandidate({
  stages,
  currentStage,
  candidateId,
  setMoveCandidate,
  reloadStages,
}) {
  const [selectedValue, setSelectedValue] = useState(currentStage);
  console.log(stages);
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const loading = useSelector(selectLoading);

  const handleSubmit = async (e, selectedValue, candidateId) => {
    e.preventDefault;
    await ATSService.moveCandidate({
      targetStage: selectedValue,
      candidateId: candidateId,
    }).then(() => {
      reloadStages({ noLoadingDisplay: true });
      setMoveCandidate(null);
    });
  };
  return (
    <>
      <label className="custom-label-title">Move Candidate</label>
      <div className="w-full ">
        <label className="custom-label">Select Stage</label>
        <div className="flex gap-2 mb-4 ">
          <Select value={selectedValue} onChange={handleChange}>
            {stages.map((option) => {
              return (
                <Option key={option.id} value={option.id}>
                  {option.title}
                </Option>
              );
            })}
          </Select>
        </div>
        <Divider />
        <div className="grid grid-cols-2 mt-4 gap-x-2">
          <Button onClick={() => setMoveCandidate(null)}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={(e) => handleSubmit(e, selectedValue, candidateId)}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
export default MoveCandidate;
