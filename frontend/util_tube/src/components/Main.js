import { useEffect, useState, createContext, useContext } from "react";

import { useUtil } from "../providers/UtilContext";

import styles from "./Main.module.css";

import Folders from "./Folders";
import Subs from "./Subs";
import Footer from "./Footer";

const MainContext = createContext({
  datas: {},
  setDatas: () => {},
  mode: "read",
  setMode: () => {},
  selectFolder: () => {},
  createFolder: () => {},
  deleteFolder: () => {},
  selectSubs: () => {},
});

const MainProvider = ({ children }) => {
  const { executeFetch } = useUtil();
  const [datas, setDatas] = useState({
    folders: [],
    subs: [],
    currentFolder: 0,
    currentSubs: [],
  });

  const [mode, setMode] = useState("read");

  const selectFolder = async () => {
    const folders = await executeFetch({
      method: "GET",
      path: "subs/folders/",
    });

    return folders;
  };

  const deleteFolder = async (folderId) => {
    await executeFetch({
      method: "DELETE",
      path: `subs/folder/${folderId}`,
    });
  };

  const createFolder = async (data) => {
    const result = await executeFetch({
      method: "POST",
      path: "subs/folders/",
      data: data,
    });

    return result;
  };

  const selectSubs = async (folderId = 0) => {
    const subs = await executeFetch({
      method: "GET",
      path: `subs/${folderId}`,
    });

    return subs;
  };

  return (
    <MainContext.Provider
      value={{
        datas,
        setDatas,
        mode,
        setMode,
        selectFolder,
        createFolder,
        deleteFolder,
        selectSubs,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => {
  try {
    const context = useContext(MainContext);

    return context;
  } catch (error) {
    console.error(`fialed useContext :: ${error}`);
  }
};

const Main = ({ className }) => {
  const { executeFetch, createStyleClass, setIsRunning } = useUtil();
  const { setDatas, mode, selectFolder, selectSubs } = useMain();

  useEffect(() => {
    setIsRunning(true);

    const getData = async () => {
      try {
        const folders = await selectFolder();

        const subs = await selectSubs();

        setDatas({ folders, subs, currentSubs: subs, currentFolder: 0 });
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
        <Folders className={styles.folders} />

        {mode === "move" ? <h3>move</h3> : <Subs className={styles.subs} />}
      </div>
      <Footer className={styles.footer} />
    </>
  );
};

const Main2 = ({ className }) => {
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

export default ({ className }) => (
  <MainProvider>
    <Main className={className} />
  </MainProvider>
);
