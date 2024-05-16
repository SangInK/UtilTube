import { useUtil } from "../providers/UtilContext";
import { useMain } from "./Main";

import styles from "./SubsMove.module.css";

import addIcon from "../assets/SubsMove/icons8-right-arrow-80.png";
import deleteIcon from "../assets/SubsMove/icons8-left-arrow-80.png";
import openIcon from "../assets/SubsMove/icons8-external-link-30.png";
import { useState } from "react";

const Sub = ({ sub, onClickSubs, selectedSubs }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const selectedCheck =
    selectedSubs.findIndex((item) => item.subs_id === sub.subs_id) >= 0;

  const handleMouseEvent = (e) => {
    setIsMouseOver(e.type === "mouseover" ? true : false);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    window.open(`https://youtube.com/channel/${sub.subs_id}`, "_blank");
  };

  const handleClickSubs = (e) => {
    e.preventDefault();
    if (isMouseOver) return;

    onClickSubs(sub);
  };

  return (
    <div className={styles.subDiv} onClick={handleClickSubs}>
      <div
        className={`${styles.sub} ${selectedCheck ? styles.selected : ""}`}
        title={sub.description}
      >
        <button
          className={styles.openLink}
          onClick={handleClickOpen}
          onMouseOver={handleMouseEvent}
          onMouseLeave={handleMouseEvent}
        >
          <img src={openIcon} alt={sub.title} />
        </button>
        <div className={styles.imgDiv}>
          <img src={sub.thumbnails} alt={sub.title} />
        </div>
        <div className={styles.contentDiv} title={sub.title}>
          {sub.title}
        </div>
      </div>
    </div>
  );
};

const Subs = ({ className, type, subs, onClickSubs, selectedSubs }) => {
  return (
    <div className={className}>
      <div>
        {subs.map((item, index) => {
          return (
            <Sub
              key={index}
              sub={item}
              onClickSubs={onClickSubs}
              selectedSubs={selectedSubs}
            />
          );
        })}
      </div>
      {type === "unmoved" ? <div className={styles.button}>더보기</div> : null}
    </div>
  );
};

const SubsMove = ({ className }) => {
  const { createStyleClass, setIsRunning } = useUtil();
  const { datas, setDatas, insertSubs, deleteSubs } = useMain();

  const [selectedSubs, setSelectedSubs] = useState({ add: [], delete: [] });

  const handleClickAddSubs = (sub) => {
    setSelectedSubs((current) => {
      if (current.add.findIndex((item) => item.subs_id === sub.subs_id) >= 0) {
        return {
          ...current,
          add: [...current.add.filter((item) => item.subs_id !== sub.subs_id)],
        };
      } else {
        return { ...current, add: [...current.add, sub] };
      }
    });
  };

  const handleClickDeleteSubs = (sub) => {
    setSelectedSubs((current) => {
      if (
        current.delete.findIndex((item) => item.subs_id === sub.subs_id) >= 0
      ) {
        return {
          ...current,
          delete: [
            ...current.delete.filter((item) => item.subs_id !== sub.subs_id),
          ],
        };
      } else {
        return { ...current, delete: [...current.delete, sub] };
      }
    });
  };

  const handleClickAdd = async () => {
    setIsRunning(true);
    const result = await insertSubs(datas.currentFolder, selectedSubs.add);

    if (result.isOk) {
      setDatas((current) => ({
        ...current,
        subs: {
          ...current.subs,
          items: [
            ...current.subs.items.filter((item) => {
              return !result.subs.some((subs) => item.subs_id === subs.subs_id);
            }),
            ...result.subs,
          ],
        },
        currentSubs: [...current.currentSubs, ...selectedSubs.add],
      }));
    }

    setSelectedSubs((current) => ({ ...current, add: [] }));
    setIsRunning(false);
  };

  const handleClickDelete = async () => {
    setIsRunning(true);
    const result = await deleteSubs(datas.currentFolder, selectedSubs.delete);

    if (result.isOk) {
      setDatas((current) => ({
        ...current,
        subs: {
          ...current.subs,
          items: [
            ...current.subs.items.filter((item) => {
              return !selectedSubs.delete.some(
                (sub) => item.subs_id === sub.subs_id
              );
            }),
            ...selectedSubs.delete.map((item) => {
              return {
                subs_id: item.subs_id,
                title: item.title,
                description: item.description,
                thumbnails: item.thumbnails,
              };
            }),
          ],
        },
        currentSubs: [
          ...current.currentSubs.filter((item) => {
            return !selectedSubs.delete.some(
              (sub) => item.subs_id === sub.subs_id
            );
          }),
        ],
      }));
    }

    setSelectedSubs((current) => ({ ...current, delete: [] }));
    setIsRunning(false);
  };

  return (
    <div className={createStyleClass(styles, ["subsMove"], className)}>
      <Subs
        className={styles.subsWrapper}
        type="unmoved"
        subs={datas.subs.items.filter((item) => item.folder === undefined)}
        onClickSubs={handleClickAddSubs}
        selectedSubs={selectedSubs.add}
      />
      <div className={styles.buttonWrapper}>
        <div className={styles.buttonDiv} title="추가">
          <img src={addIcon} onClick={handleClickAdd} />
        </div>
        <div className={styles.buttonDiv} title="제거">
          <img src={deleteIcon} onClick={handleClickDelete} />
        </div>
      </div>
      <Subs
        className={styles.subsWrapper}
        type="moved"
        subs={datas.currentSubs}
        onClickSubs={handleClickDeleteSubs}
        selectedSubs={selectedSubs.delete}
      />
    </div>
  );
};

export default SubsMove;
