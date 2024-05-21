import { memo, useState } from "react";

import { useMain } from "./Main";
import { useUtil } from "../providers/UtilContext";

import styles from "./Folders.module.css";

import addIcon from "../assets/Folder/icons8-add-folder-30.png";
import allIcon from "../assets/Folder/icons8-select-all-30.png";
import deleteIcon from "../assets/Folder/icons8-delete-folder-30.png";
import moveIcon from "../assets/Folder/icons8-move-stock-30.png";
import cancelIcon from "../assets/Folder/icons8-cancel-30.png";
import youtubeIcon from "../assets/Folder/icons8-youtube-30.png";
import refreshIcon from "../assets/Folder/icons8-refresh-30.png";

const Folder = ({ className, folder, subs }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const { datas, setDatas, mode, setMode, deleteFolder, selectSubs } =
    useMain();
  const { setIsRunning } = useUtil();

  const folderType = folder.folder_name
    ? "folder"
    : folder.icon === addIcon
    ? "plus"
    : folder.icon === youtubeIcon
    ? "youtube"
    : folder.icon === moveIcon || folder.icon === cancelIcon
    ? "move"
    : "all";

  const handleClickFolder = (e) => {
    e.preventDefault();

    if (isMouseOver) return;

    setIsRunning(true);

    if (folderType === "folder") {
      setDatas((current) => ({
        ...current,
        currentFolder: folder.id,
        currentSubs: [...subs],
      }));
    } else if (folderType === "all") {
      if (mode === "create" || mode === "read") {
        setDatas((current) => ({
          ...current,
          currentFolder: 0,
          currentSubs: [...current.subs.items],
        }));
      }
    } else if (folderType === "plus") {
      if (mode === "read") {
        setMode((current) => (current === "read" ? "create" : "read"));
      }
    } else if (folderType === "youtube") {
      if (mode === "create" || mode === "read") {
        setDatas((current) => ({
          ...current,
          currentFolder: "youtube",
          currentSubs: [...subs],
        }));
      }
    } else if (folderType === "move") {
      if (mode === "read") {
        if (datas.folders.length <= 0) {
          setIsRunning(false);
          return;
        }

        setMode((current) => (current === "read" ? "move" : "read"));

        setDatas((current) => {
          const currentFolder =
            current.currentFolder === 0 || current.currentFolder === "youtube"
              ? current.folders[0]?.id ?? 0
              : current.currentFolder;

          const currentSubs =
            current.currentFolder === 0 || current.currentFolder === "youtube"
              ? current.subs.items.filter(
                  (item) => item.folder?.id === currentFolder
                )
              : current.currentSubs;

          return {
            ...current,
            currentFolder: currentFolder,
            currentSubs: [...currentSubs],
          };
        });
      } else if (mode === "move") {
        setMode((current) => (current === "read" ? "move" : "read"));
      }
    }

    setIsRunning(false);
  };

  const handleClickRefresh = async (e) => {
    if (mode === "move") return;

    setIsRunning(true);

    const result = await selectSubs();

    setDatas((current) => ({
      ...current,
      subs: { ...result },
      currentFolder: 0,
      currentSubs: [...result.items],
    }));

    setIsRunning(false);
  };

  const handleClickDelete = async (e) => {
    e.preventDefault();
    if (mode === "move") return;

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
        subs: {
          ...current.subs,
          items: [
            ...current.subs.items.filter(
              (item) => item.folder?.id !== folderId
            ),
            ...current.subs.items
              .filter((item) => item.folder?.id === folderId)
              .map((item) => {
                return {
                  subs_id: item.subs_id,
                  title: item.title,
                  description: item.description,
                  thumbnails: item.thumbnails,
                };
              }),
          ],
        },
        currentFolder: checkCurrentFolder ? current.currentFolder : 0,
        currentSubs: checkCurrentFolder
          ? current.currentSubs
          : current.subs.items,
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
          className={`${mode === "move" ? styles.disabled : ""}`}
        >
          <img src={deleteIcon} alt="폴더 삭제" />
        </button>
      ) : null}
      {folderType === "all" ? (
        <button
          title="구독채널 새로고침"
          onClick={handleClickRefresh}
          onMouseOver={handleMouseEvent}
          onMouseLeave={handleMouseEvent}
          className={`${mode === "move" ? styles.disabled : ""}`}
        >
          <img src={refreshIcon} alt="구독채널 새로고침" />
        </button>
      ) : null}

      {folderType === "folder" ? (
        <p className={styles.folderName}>{folder.folder_name}</p>
      ) : (
        <img src={folder.icon} alt={folder.alt} />
      )}

      {folderType === "folder" ||
      folderType === "all" ||
      folderType === "youtube" ? (
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

    if (isRunning || folderName === "") return;
    setIsRunning(true);

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
  const { createStyleClass } = useUtil();
  const { datas, mode } = useMain();

  return (
    <div className={className}>
      <div className={`${styles.folders} ${styles.buttonFolders}`}>
        {mode === "read" || mode === "move" ? (
          <div className={styles.buttonDiv}>
            <Folder
              className={`${styles.folderButton} ${
                mode === "move" ? styles.disabled : ""
              }`}
              folder={{ icon: addIcon, alt: "폴더 추가" }}
            />
            <Folder
              className={`${styles.folderButton} ${
                datas.folders.length <= 0 ? styles.disabled : ""
              }`}
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
          } ${datas.currentFolder === 0 ? styles.selected : null}`}
          folder={{ icon: allIcon, alt: "전체 폴더" }}
          subs={datas.subs.items}
        />

        <Folder
          className={`${styles.folder} ${styles.small} ${
            mode === "move" ? styles.disabled : ""
          } ${datas.currentFolder === "youtube" ? styles.selected : null}`}
          folder={{ icon: youtubeIcon, alt: "youtube 폴더" }}
          subs={
            datas.subs.items &&
            datas.subs.items.filter((item) => item?.folder === undefined)
          }
        />
      </div>

      <div className={styles.folders}>
        {datas.folders.map((folder) => {
          const subs = datas.subs.items.filter(
            (sub) => sub?.folder?.id === folder.id
          );

          return (
            <Folder
              key={folder.id}
              className={`${styles.folder} ${
                folder.id === datas.currentFolder ? styles.selected : null
              }`}
              folder={folder}
              subs={subs}
            />
          );
        })}
      </div>
    </div>
  );
});

export default Folders;
