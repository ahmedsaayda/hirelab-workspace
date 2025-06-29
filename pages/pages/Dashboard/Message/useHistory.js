import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (newPresent) => {
    const newHistory = history.slice(0, index + 1);
    const present = newHistory[index];

    if (present !== newPresent) {
      newHistory.push(newPresent);
      setIndex(newHistory.length - 1);
      setHistory(newHistory);
    }
  };

  const undo = () => {
    setIndex(Math.max(0, index - 1));
  };

  const redo = () => {
    setIndex(Math.min(history.length - 1, index + 1));
  };

  const present = useMemo(() => history[index], [history, index]);

  return { state: present, setState, undo, redo };
};

export default useHistory;
