import {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

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
    subs: {},
    currentFolder: 0,
    currentSubs: [],
  });

  const [mode, setMode] = useState("read");

  const selectFolder = useCallback(async () => {
    const folders = await executeFetch({
      method: "GET",
      path: "subs/folders/",
    });

    return folders;
  }, [executeFetch]);

  const deleteFolder = useCallback(
    async (folderId) => {
      await executeFetch({
        method: "DELETE",
        path: `subs/folder/${folderId}`,
      });
    },
    [executeFetch]
  );

  const createFolder = useCallback(
    async (data) => {
      const result = await executeFetch({
        method: "POST",
        path: "subs/folders/",
        data: data,
      });

      return result;
    },
    [executeFetch]
  );

  const selectSubs = useCallback(
    async (folderId = 0, nextPageToken = "firstSearch") => {
      const subs = await executeFetch({
        method: "GET",
        path: `subs/${folderId}/${nextPageToken}`,
      });

      return subs;
    },
    [executeFetch]
  );

  const providerValue = useMemo(
    () => ({
      datas,
      setDatas,
      mode,
      setMode,
      selectFolder,
      createFolder,
      deleteFolder,
      selectSubs,
    }),
    [createFolder, datas, deleteFolder, mode, selectFolder, selectSubs]
  );

  return (
    <MainContext.Provider value={providerValue}>
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

        setDatas({ folders, subs, currentSubs: subs.items, currentFolder: 0 });
      } catch (e) {
      } finally {
        setIsRunning(false);
      }
    };

    getData();
  }, [executeFetch, setIsRunning, selectFolder, selectSubs, setDatas]);

  return (
    <>
      <div className={createStyleClass(styles, ["main"], className)}>
        <Folders className={styles.folders} />

        {mode === "move" ? (
          <h3>move</h3>
        ) : (
          <Subs className={styles.subsWrapper} />
        )}
      </div>
      <Footer className={styles.footer} />
    </>
  );
};

const MainComponent = ({ className }) => {
  return (
    <MainProvider>
      <Main className={className} />
    </MainProvider>
  );
};

export default MainComponent;
