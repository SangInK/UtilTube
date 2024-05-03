import { useUtil } from "../providers/UtilContext";

import styles from "./Subs.module.css";

const Subs = ({ className, subs }) => {
  const { createStyleClass } = useUtil();
  console.log(subs);

  return <div className={createStyleClass(styles, ["subs"], className)}></div>;
};

export default Subs;
