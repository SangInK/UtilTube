import { useState } from "react";
import { useUtil } from "../providers/UtilContext";

import styles from "./Folders.module.css";

import addIcon from "../assets/Folder/icons8-add-folder-30.png";
import allIcon from "../assets/Folder/icons8-select-all-30.png";
import deleteIcon from "../assets/Folder/icons8-delete-folder-30.png";

const Folder = ({ className, folder, subs, onClick, onClickDelete }) => {
  const folderType = folder.folder_name
    ? "folder"
    : folder.icon == addIcon
    ? "plus"
    : "all";

  /**
   *
   * @param {*} e event 객체
   */
  const handleClick = async (e) => {
    e.preventDefault();

    if (folderType === "folder") {
      onClick(subs);
    } else if (folderType === "plus") {
      onClick((current) => (current === "read" ? "craete" : "read"));
    } else if (folderType === "all") {
      await onClick();
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

  return (
    <div
      className={className}
      title={folderType !== "folder" ? folder.alt : folder.folder_name}
      onClick={handleClick}
    >
      {folderType === "folder" ? (
        <button title="폴더 삭제" onClick={handleClickDelete}>
          <img src={deleteIcon} alt="폴더 삭제" />
        </button>
      ) : null}
      {folderType === "folder" ? (
        <p className={styles.folderName}>{folder.folder_name}</p>
      ) : (
        <img src={folder.icon} />
      )}
      {folderType === "folder" ? (
        <p className={styles.folderInfo}>채널수: {subs.length}</p>
      ) : null}
    </div>
  );
};

const FolderForm = ({ className, onClickCancel, onSubmit }) => {
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

const Folders = ({
  className,
  datas,
  onClickSelect,
  onClickDelete,
  onSubmit,
}) => {
  const { createStyleClass } = useUtil();
  const [mode, setMode] = useState("read");

  /**
   *
   * @param {int} folderId
   */
  const handleClickDelete = async (folderId) => {
    console.log("handleClickDelete");

    await onClickDelete(folderId);
  };

  /**
   *
   * @param {Array} subs
   */
  const handleClickSelect = async (subs = null) => {
    console.log("handleClickSelect");

    await onClickSelect(subs);
  };

  /**
   *
   * @param {object} data
   */
  const handleSubmit = async (data) => {
    await onSubmit(data);
  };

  return (
    <div className={createStyleClass(styles, ["folders"], className)}>
      {mode === "read" ? (
        <Folder
          className={`${styles.folder} ${styles.small}`}
          folder={{ icon: addIcon, alt: "폴더 추가" }}
          onClick={setMode}
        />
      ) : (
        <FolderForm
          className={styles.folderForm}
          onClickCancel={setMode}
          onSubmit={handleSubmit}
        />
      )}
      <Folder
        className={`${styles.folder} ${styles.small}`}
        folder={{ icon: allIcon, alt: "전체 폴더" }}
        onClick={handleClickSelect}
      />

      {datas.folders.map((folder) => {
        const subs = datas.subs.filter((sub) => sub.folder_id === folder.id);

        return (
          <Folder
            key={folder.id}
            className={styles.folder}
            folder={folder}
            subs={subs}
            onClick={handleClickSelect}
            onClickDelete={handleClickDelete}
          />
        );
      })}
    </div>
  );
};

export default Folders;
