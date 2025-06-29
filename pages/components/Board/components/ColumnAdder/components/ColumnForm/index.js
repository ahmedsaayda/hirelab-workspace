import { Space } from "antd";
import { createRef } from "react";
import { when } from "../../../../services/utils";

function ColumnForm({ onConfirm, onCancel }) {
  // FIXME use hook
  const inputColumnTitle = createRef();

  function addColumn(event) {
    event.preventDefault();

    when(inputColumnTitle.current.value)(onConfirm);
  }

  return (
    <div
      className="react-kanban-column dark:bg-gray-800"
      style={{ minWidth: "230px" }}
    >
      <form onSubmit={addColumn}>
        <div>
          <input
            type="text"
            ref={inputColumnTitle}
            autoFocus
            className="dark:bg-gray-900"
          />
        </div>
        <div className="mt-2 w-full flex items-center justify-center">
          <Space>
            <button
              className="px-2 py-1 text-sm bg-indigo-500 text-white rounded"
              type="submit"
            >
              Add
            </button>
            <button
              className="px-2 py-1 text-sm bg-red-500 text-white rounded"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </Space>
        </div>
      </form>
    </div>
  );
}

export default ColumnForm;
