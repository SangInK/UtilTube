import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { executeFetch } from "../libs/fetctUtil";
import { createStyleClass } from "../libs/commonUtil";

import UtilView from "../components/UtilView";

const UtilContext = createContext({
  isRunning: true,
  setIsRunning: () => {},
  executeFetch: () => {},
  createStyleClass: () => {},
  execCustomHook: () => {},
});

export const UtilProvider = ({ children }) => {
  const [classArray, setClassArray] = useState(["disabled"]);
  const [isRunning, setIsRunning] = useState(true);

  const screenAbled = useCallback(() => {
    setClassArray((current) => {
      return current.filter((item) => item !== "disabled");
    });
  }, []);

  const screenDisabled = useCallback(() => {
    setClassArray((current) => [...current, "disabled"]);
  }, []);

  useEffect(() => {
    if (isRunning) {
      screenDisabled();
    } else {
      screenAbled();
    }
  }, [isRunning, screenAbled, screenDisabled]);

  return (
    <UtilContext.Provider
      value={{ isRunning, setIsRunning, executeFetch, createStyleClass }}
    >
      <UtilView classArray={classArray} />
      {children}
    </UtilContext.Provider>
  );
};

export const useUtil = () => {
  try {
    const context = useContext(UtilContext);

    return context;
  } catch (error) {
    console.error(`fialed useContext :: ${error}`);
  }
};
