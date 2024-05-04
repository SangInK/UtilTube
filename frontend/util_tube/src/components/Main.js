import { useEffect, useState } from "react";
import { useUtil } from "../providers/UtilContext";

import styles from "./Main.module.css";

import Folders from "./Folders";
import Subs from "./Subs";
import Footer from "./Footer";

const Main = ({ className }) => {
  const { executeFetch, createStyleClass, setIsRunning } = useUtil();

  const [datas, setDatas] = useState({
    folders: [],
    subs: [],
    currentFolder: 0,
    currentSubs: [],
  });

  const [mode, setMode] = useState("read");

  useEffect(() => {
    setIsRunning(true);

    const getData = async () => {
      try {
        const folders = await executeFetch({
          method: "GET",
          path: "subs/folders/",
        });

        const subs = await executeFetch({
          method: "GET",
          path: "subs/0",
        });

        setDatas({ folders, subs, currentSubs: subs });
      } catch (e) {
      } finally {
        setIsRunning(false);
      }
    };

    getData();
  }, [executeFetch]);

  return (
    <>
      <div className={createStyleClass(styles, ["main"], className)}>
        <Folders
          className={styles.folders}
          datas={datas}
          setDatas={setDatas}
          mode={mode}
          setMode={setMode}
        />

        {mode === "move" ? (
          <h3>move</h3>
        ) : (
          <Subs className={styles.subs} subs={datas.currentSubs} />
        )}
      </div>
      <Footer className={styles.footer} />
    </>
  );
};

export default Main;
