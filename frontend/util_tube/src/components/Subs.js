import { memo, useEffect } from "react";
import { useUtil } from "../providers/UtilContext";

import styles from "./Subs.module.css";

const Subs = memo(({ className, subs }) => {
  const { createStyleClass, setIsRunning } = useUtil();
  console.log(subs);

  useEffect(() => {
    setIsRunning(false);
  }, []);

  return <div className={createStyleClass(styles, ["subs"], className)}></div>;
});

export default Subs;
