import { useUtil } from "../providers/UtilContext";

import styles from "./Main.module.css";

import Folders from "./Folders";
import Subs from "./Subs";
import Footer from "./Footer";

const Main = ({ className }) => {
  const { createStyleClass } = useUtil();

  return (
    <>
      <div className={createStyleClass(styles, ["main"], className)}>
        <Folders className={styles.folders} />
        <Subs className={styles.subs} />
      </div>
      <Footer className={styles.footer} />
    </>
  );
};

export default Main;
