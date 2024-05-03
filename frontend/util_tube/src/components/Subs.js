import { useUtil } from "../providers/UtilContext";

import styles from "./Subs.module.css";

const Subs = ({ className }) => {
  const { createStyleClass } = useUtil();

  return <div className={createStyleClass(styles, ["subs"], className)}></div>;
};

export default Subs;
