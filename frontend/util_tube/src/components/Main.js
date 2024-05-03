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
    currentSubs: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const folders = await executeFetch({
          method: "GET",
          path: "subs/folders/",
        });

        // const subs = await executeFetch({
        //   method: "GET",
        //   path: "subs/0",
        // });

        // setDatas({ folders, subs });
        setDatas({ folders, subs: [], currentSubs: [] });
      } catch (e) {
      } finally {
      }
    };

    // user가 빈 값이 아닐 경우 폴더와 구독 채널 조회
    getData();
  }, [executeFetch]);

  //#region folders
  const handleClick = async (subs = null) => {
    // if (subs == null) {
    //   subs = await executeFetch({ method: "GET", path: "subs/0" });
    // } else {
    //   console.log(subs);
    //   setDatas({ ...datas, currentSubs: [...subs] });
    // }
  };

  const handleClickDelete = async (folderId) => {
    setIsRunning(true);

    const result = await executeFetch({
      method: "DELETE",
      path: `subs/folder/${folderId}`,
    });

    setDatas((current) => {
      const deleteIndex = current.folders.findIndex(
        (item) => item.id == folderId
      );

      return {
        ...current,
        folders: [
          ...current.folders.slice(0, deleteIndex),
          ...current.folders.slice(deleteIndex + 1),
        ],
        //subs: result.subs,
      };
    });

    setIsRunning(false);
  };

  const handleSubmit = async (data) => {
    setIsRunning(true);

    const result = await executeFetch({
      method: "POST",
      path: "subs/folders/",
      data: data,
    });

    setDatas((current) => ({
      ...current,
      folders: [...current.folders, result],
    }));

    setIsRunning(false);
  };

  //#endregion

  return (
    <>
      <div className={createStyleClass(styles, ["main"], className)}>
        <Folders
          className={styles.folders}
          datas={datas}
          onClickSelect={handleClick}
          onClickDelete={handleClickDelete}
          onSubmit={handleSubmit}
        />
        <Subs className={styles.subs} subs={datas.currentSubs} />
      </div>
      <Footer className={styles.footer} />
    </>
  );
};

export default Main;
