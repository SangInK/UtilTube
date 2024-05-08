import { memo, useState } from "react";

import { useMain } from "./Main";
import { useUtil } from "../providers/UtilContext";

import styles from "./Folders.module.css";

import addIcon from "../assets/Folder/icons8-add-folder-30.png";
import allIcon from "../assets/Folder/icons8-select-all-30.png";
import deleteIcon from "../assets/Folder/icons8-delete-folder-30.png";
import moveIcon from "../assets/Folder/icons8-move-stock-30.png";
import cancelIcon from "../assets/Folder/icons8-cancel-30.png";

const Folder = ({ className, folder, subs }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const [styleArray, setStyleArray] = useState([]);

  const { setDatas, mode, setMode, deleteFolder, selectSubs } = useMain();
  const { createStyleClass, setIsRunning } = useUtil();

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

    if (folderType === "folder") {
      setDatas((current) => ({
        ...current,
        currentFolder: folder.id,
        currentSubs: [...subs],
      }));
    } else if (folderType === "all") {
      if (mode === "read") {
        const newSubs = await selectSubs();

        setDatas((current) => ({
          ...current,
          subs: { ...newSubs },
          currentFolder: 0,
          currentSubs: [...newSubs.items],
        }));
      }
    } else if (folderType === "plus") {
      if (mode === "read") {
        setMode((current) => (current === "read" ? "create" : "read"));
      }
    } else if (folderType === "move") {
      if (mode === "read") {
        setMode((current) => (current === "read" ? "move" : "read"));
        setDatas((current) => ({
          ...current,
          currentFolder:
            current.currentFolder === 0
              ? current.folders[0].id
              : current.currentFolder,
        }));
      } else if (mode === "move") {
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
      className={createStyleClass(styles, styleArray, className)}
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
          {folderType === "all" && "총"}채널수: {subs?.length}
        </p>
      ) : null}
    </div>
  );
};

const FolderForm = ({ className }) => {
  const [folderName, setFolderName] = useState("");

  const { setMode, setDatas, createFolder } = useMain();
  const { isRunning, setIsRunning } = useUtil();

  const handleChange = (e) => {
    setFolderName(e.target.value);
  };

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
    const { datas, mode } = useMain();

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
          subs={datas.subs.items}
        />

        {datas.folders.map((folder) => {
          const subs = datas.subs.items.filter(
            (sub) => sub?.folder?.id === folder.id
          );

          return (
            <Folder
              key={folder.id}
              className={`${styles.folder} ${
                mode === "move" && folder.id === datas.currentFolder
                  ? styles.selected
                  : null
              }`}
              folder={folder}
              subs={subs}
            />
          );
        })}
      </div>
    );
  }
});

export default Folders;
