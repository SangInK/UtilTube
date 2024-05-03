import { useUtil } from "../providers/UtilContext";

import styles from "./Folders.module.css";

import addIcon from "../assets/Folder/icons8-add-folder-30.png";
import allIcon from "../assets/Folder/icons8-select-all-30.png";
import deleteIcon from "../assets/Folder/icons8-delete-folder-30.png";

const Folder = ({ className, folder, subs }) => {
  return (
    <div
      className={className}
      title={folder.alt ? folder.alt : folder.folder_name}
    >
      {folder.folder_name ? (
        <p className={styles.folderName}>{folder.folder_name}</p>
      ) : (
        <img src={folder.icon} />
      )}
      {folder.folder_name ? (
        <p className={styles.folderInfo}>채널수: {subs.length}</p>
      ) : null}
    </div>
  );
};

const Folders = ({ className }) => {
  const { createStyleClass } = useUtil();

  const datas = {};
  datas.subs = [
    { folder_id: 1 },
    { folder_id: 1 },
    { folder_id: 1 },
    { folder_id: 2 },
    { folder_id: 2 },
  ];

  datas.folders = [
    {
      folder_name: "식사를 죽이어 8시",
      folder_id: 1,
    },
    {
      folder_name:
        "법치주의를 이른 줄넘기를 또 위가, 자다. 군제는 그것의 미치는 뭐는 들리라 담게 것 돌아온 그래 찾아요",

      folder_id: 2,
    },
  ];

  const handleClickCreate = async (e) => {
    e.preventDefault();
    console.log("handleClickCreate");
  };

  const handleClickDelete = async (e) => {
    e.preventDefault();
    console.log("handleClickDelete");
  };

  const handleClickModeChange = async (e) => {
    e.preventDefault();
    console.log("handleClickModeChange");
  };

  return (
    <div className={createStyleClass(styles, ["folders"], className)}>
      <Folder
        className={`${styles.folder} ${styles.small}`}
        folder={{ icon: addIcon, alt: "폴더 추가" }}
      />
      <Folder
        className={`${styles.folder} ${styles.small}`}
        folder={{ icon: allIcon, alt: "전체 폴더" }}
      />

      {datas.folders.map((folder) => {
        const subs = datas.subs.filter(
          (sub) => sub.folder_id === folder.folder_id
        );

        return (
          <Folder
            key={folder.folder_id}
            className={styles.folder}
            folder={folder}
            subs={subs}
          />
        );
      })}
    </div>
  );
};

export default Folders;
