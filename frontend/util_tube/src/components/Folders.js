import { memo, useState } from "react";

import { useMain } from "./Main";
import { useUtil } from "../providers/UtilContext";

import styles from "./Folders.module.css";

import addIcon from "../assets/Folder/icons8-add-folder-30.png";
import allIcon from "../assets/Folder/icons8-select-all-30.png";
import deleteIcon from "../assets/Folder/icons8-delete-folder-30.png";
import moveIcon from "../assets/Folder/icons8-move-stock-30.png";
import cancelIcon from "../assets/Folder/icons8-cancel-30.png";

const Folder2 = ({ className, folder, subs, onClick, onClickDelete, mode }) => {
  const folderType = folder.folder_name
    ? "folder"
    : folder.icon === addIcon
    ? "plus"
    : folder.icon === moveIcon || folder.icon === cancelIcon
    ? "move"
    : "all";

  const [isMouseOver, setIsMouseOver] = useState(false);

  /**
   *
   * @param {*} e event 객체
   */
  const handleClick = async (e) => {
    e.preventDefault();

    if (isMouseOver) return;

    if (mode === "read") {
      if (folderType === "folder") {
        onClick(folder.id, subs);
      } else if (folderType === "plus") {
        onClick((current) => (current === "read" ? "create" : "read"));
      } else if (folderType === "move") {
        onClick((current) => (current === "read" ? "move" : "read"));
      } else if (folderType === "all") {
        await onClick();
      }
    } else {
      if (folderType === "folder") {
        console.log("test");
      } else if (folderType === "move") {
        onClick((current) => (current === "read" ? "move" : "read"));
      }
    }
  };

  /**
   *
   * @param {*} e event 객체
   */
  const handleClickDelete = async (e) => {
    e.preventDefault();

    await onClickDelete(folder.id);
  };

  const handleMouse = (e) => {
    setIsMouseOver(e.type === "mouseover" ? true : false);
  };

  return (
    <div
      className={className}
      title={folderType !== "folder" ? folder.alt : folder.folder_name}
      onClick={handleClick}
    >
      {folderType === "folder" ? (
        <button
          title="폴더 삭제"
          onClick={handleClickDelete}
          onMouseOver={handleMouse}
          onMouseLeave={handleMouse}
        >
          <img src={deleteIcon} alt="폴더 삭제" />
        </button>
      ) : null}
      {folderType === "folder" ? (
        <p className={styles.folderName}>{folder.folder_name}</p>
      ) : (
        <img src={folder.icon} alt={folder.alt} />
      )}
      {folderType === "folder" || folderType === "all" ? (
        <p className={styles.folderInfo}>
          {folderType === "all" && "총"}채널수: {subs.length}
        </p>
      ) : null}
    </div>
  );
};

const FolderForm2 = ({ className, onClickCancel, onSubmit }) => {
  const [folderName, setFolderName] = useState("");
  const { isRunning } = useUtil();

  /**
   *
   * @param {*} e evnet 객체
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRunning) return;

    if (folderName === "") return;

    const data = {
      folder_name: folderName,
    };

    await onSubmit(data);
    setFolderName("");
  };

  /**
   *
   * @param {*} e evnet 객체
   */
  const handleChange = (e) => {
    setFolderName(e.target.value);
  };

  /**
   * 폴더 입력 모드 취소
   */
  const handleClickCancel = () => {
    onClickCancel((current) => (current === "read" ? "craete" : "read"));
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        name="folderName"
        className={styles.input}
        onChange={handleChange}
        value={folderName}
      />
      <div>
        <button type="submit">생성</button>
        <button type="button" onClick={handleClickCancel}>
          취소
        </button>
      </div>
    </form>
  );
};

const Folder = ({ className, folder, subs }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { setDatas, mode, setMode, deleteFolder, selectSubs } = useMain();
  const { setIsRunning } = useUtil();

  const folderType = folder.folder_name
    ? "folder"
    : folder.icon === addIcon
    ? "plus"
    : folder.icon === moveIcon || folder.icon === cancelIcon
    ? "move"
    : "all";

  const handleClickFolder = async (e) => {
    e.preventDefault();
    setIsRunning(true);

    if (isMouseOver) return;

    if (mode === "read") {
      if (folderType === "folder") {
        setDatas((current) => ({
          ...current,
          currentFolder: folder.id,
          currentSubs: [...subs],
        }));
      } else if (folderType === "plus") {
        setMode((current) => (current === "read" ? "create" : "read"));
      } else if (folderType === "all") {
        const subs = await selectSubs();

        setDatas((current) => ({
          ...current,
          subs: [...subs],
          currentFolder: 0,
          currentSubs: [...subs],
        }));
      } else if (folderType === "move") {
        setMode((current) => (current === "read" ? "move" : "read"));
      }
    } else if (mode === "move") {
      if (folderType === "folder") {
        console.log("folder");
      } else if (folderType === "move") {
        setMode((current) => (current === "read" ? "move" : "read"));
      }
    }
    setIsRunning(false);
  };

  const handleClickDelete = async (e) => {
    setIsRunning(true);

    const folderId = folder.id;

    await deleteFolder(folderId);

    setDatas((current) => {
      const deleteIndex = current.folders.findIndex(
        (item) => item.id === folderId
      );

      const checkCurrentFolder =
        folderId !== 0 && current.currentFolder !== folderId;

      return {
        ...current,
        folders: [
          ...current.folders.slice(0, deleteIndex),
          ...current.folders.slice(deleteIndex + 1),
        ],
        currentFolder: checkCurrentFolder ? current.currentFolder : 0,
        currentSubs: checkCurrentFolder ? current.currentSubs : current.subs,
      };
    });
    setIsRunning(false);
  };

  const handleMouseEvent = (e) => {
    setIsMouseOver(e.type === "mouseover" ? true : false);
  };

  return (
    <div
      className={className}
      title={folderType !== "folder" ? folder.alt : folder.folder_name}
      onClick={handleClickFolder}
    >
      {folderType === "folder" ? (
        <button
          title="폴더 삭제"
          onClick={handleClickDelete}
          onMouseOver={handleMouseEvent}
          onMouseLeave={handleMouseEvent}
        >
          <img src={deleteIcon} alt="폴더 삭제" />
        </button>
      ) : null}

      {folderType === "folder" ? (
        <p className={styles.folderName}>{folder.folder_name}</p>
      ) : (
        <img src={folder.icon} alt={folder.alt} />
      )}

      {folderType === "folder" || folderType === "all" ? (
        <p className={styles.folderInfo}>
          {folderType === "all" && "총"}채널수: {subs.length}
        </p>
      ) : null}
    </div>
  );
};

const FolderForm = ({ className }) => {
  const [folderName, setFolderName] = useState("");

  const { setMode, setDatas, createFolder } = useMain();
  const { isRunning, setIsRunning } = useUtil();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true);

    if (isRunning || folderName === "") return;

    const data = {
      folder_name: folderName,
    };

    const result = await createFolder(data);

    setDatas((current) => ({
      ...current,
      folders: [...current.folders, result],
    }));
    setFolderName("");

    setIsRunning(false);
  };

  const handleClickCancel = () => {
    setMode((current) => (current === "read" ? "craete" : "read"));
  };

  /**
   *
   * @param {*} e evnet 객체
   */
  const handleChange = (e) => {
    setFolderName(e.target.value);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        name="folderName"
        className={styles.input}
        onChange={handleChange}
        value={folderName}
      />
      <div>
        <button type="submit">생성</button>
        <button type="button" onClick={handleClickCancel}>
          취소
        </button>
      </div>
    </form>
  );
};

const Folders = memo(({ className }) => {
  {
    const { createStyleClass } = useUtil();
    const { datas, setDatas, mode, setMode } = useMain();

    return (
      <div className={createStyleClass(styles, ["folders"], className)}>
        {mode === "read" || mode === "move" ? (
          <div className={styles.buttonDiv}>
            <Folder
              className={`${styles.folderButton} ${
                mode === "move" ? styles.disabled : ""
              }`}
              folder={{ icon: addIcon, alt: "폴더 추가" }}
            />
            <Folder
              className={styles.folderButton}
              folder={{
                icon: mode === "read" ? moveIcon : cancelIcon,
                alt: mode === "read" ? "채널 이동 모드" : "취소",
              }}
            />
          </div>
        ) : (
          <FolderForm className={styles.folderForm} />
        )}

        <Folder
          className={`${styles.folder} ${styles.small} ${
            mode === "move" ? styles.disabled : ""
          }`}
          folder={{ icon: allIcon, alt: "전체 폴더" }}
          subs={datas.subs}
        />

        {datas.folders.map((folder) => {
          const subs = datas.subs.filter(
            (sub) => sub?.folder?.id === folder.id
          );

          return (
            <Folder
              key={folder.id}
              className={styles.folder}
              folder={folder}
              subs={subs}
            />
          );
        })}
      </div>
    );
  }
});

const Folders2 = memo(({ className, datas, setDatas, mode, setMode }) => {
  const { createStyleClass, executeFetch, setIsRunning } = useUtil();

  /**
   *
   * @param {int} folderId
   */
  const handleClickDelete = async (folderId) => {
    setIsRunning(true);

    await executeFetch({
      method: "DELETE",
      path: `subs/folder/${folderId}`,
    });

    setDatas((current) => {
      const deleteIndex = current.folders.findIndex(
        (item) => item.id === folderId
      );

      const checkCurrentFolder =
        folderId !== 0 && current.currentFolder !== folderId;

      return {
        ...current,
        folders: [
          ...current.folders.slice(0, deleteIndex),
          ...current.folders.slice(deleteIndex + 1),
        ],
        currentFolder: checkCurrentFolder ? current.currentFolder : 0,
        currentSubs: checkCurrentFolder ? current.currentSubs : current.subs,
      };
    });
    setIsRunning(false);
  };

  /**
   *
   * @param {Array} subs
   */
  const handleClickSelect = async (folderId = 0, subs = null) => {
    setIsRunning(true);

    if (subs == null) {
      const subs = await executeFetch({
        method: "GET",
        path: "subs/0",
      });

      setDatas({
        ...datas,
        subs: [...subs],
        currentFolder: folderId,
        currentSubs: [...subs],
      });
    } else {
      setDatas({ ...datas, currentFolder: folderId, currentSubs: [...subs] });
    }

    setIsRunning(false);
  };

  /**
   *
   * @param {object} data
   */
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

  return (
    <div className={createStyleClass(styles, ["folders"], className)}>
      {mode === "read" || mode === "move" ? (
        <div className={styles.buttonDiv}>
          <Folder
            className={`${styles.folderButton} ${
              mode === "move" ? styles.disabled : ""
            }`}
            folder={{ icon: addIcon, alt: "폴더 추가" }}
            onClick={setMode}
            mode={mode}
          />
          <Folder
            className={styles.folderButton}
            folder={{
              icon: mode === "read" ? moveIcon : cancelIcon,
              alt: mode === "read" ? "채널 이동 모드" : "취소",
            }}
            onClick={setMode}
            mode={mode}
          />
        </div>
      ) : (
        <FolderForm
          className={styles.folderForm}
          onClickCancel={setMode}
          onSubmit={handleSubmit}
        />
      )}
      <Folder
        className={`${styles.folder} ${styles.small} ${
          mode === "move" ? styles.disabled : ""
        }`}
        folder={{ icon: allIcon, alt: "전체 폴더" }}
        onClick={handleClickSelect}
        subs={datas.subs}
        mode={mode}
      />

      {datas.folders.map((folder) => {
        const subs = datas.subs.filter((sub) => sub?.folder?.id === folder.id);

        return (
          <Folder
            key={folder.id}
            className={styles.folder}
            folder={folder}
            subs={subs}
            onClick={handleClickSelect}
            onClickDelete={handleClickDelete}
            mode={mode}
          />
        );
      })}
    </div>
  );
});

export default Folders;
