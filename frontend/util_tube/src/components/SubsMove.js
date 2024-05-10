import { useUtil } from "../providers/UtilContext";
import { useMain } from "./Main";

import styles from "./SubsMove.module.css";

import addIcon from "../assets/SubsMove/icons8-right-arrow-80.png";
import deleteIcon from "../assets/SubsMove/icons8-left-arrow-80.png";
import openIcon from "../assets/SubsMove/icons8-external-link-30.png";
import { useState } from "react";

const Sub = ({ sub, onClickSubs, selectedSubs }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

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
        className={`${styles.sub} ${
          selectedSubs.findIndex((item) => item.subs_id === sub.subs_id) >= 0
            ? styles.selected
            : ""
        }`}
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

const Subs = ({ className, subs, onClickSubs, selectedSubs }) => {
  return (
    <div className={className}>
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
  );
};

const SubsMove = ({ className }) => {
  const { createStyleClass } = useUtil();
  const { datas, setDatas } = useMain();

  const [selectedSubs, setSelectedSubs] = useState({ add: [], delete: [] });

  const handleClickAddSubs = (sub) => {
    debugger;
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
    setDatas((current) => ({
      ...current,
      currentSubs: [...current.currentSubs, ...selectedSubs.add],
    }));
  };

  const handleClickDelete = async () => {
    debugger;
    setDatas((current) => ({
      ...current,
      currentSubs: [
        ...current.currentSubs.filter((item) => {
          return !selectedSubs.delete.some(
            (selectedSub) => item.subs_id === selectedSub.subs_id
          );
        }),
      ],
    }));
  };

  return (
    <div className={createStyleClass(styles, ["subsMove"], className)}>
      <Subs
        className={styles.subsWrapper}
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
        subs={datas.currentSubs}
        onClickSubs={handleClickDeleteSubs}
        selectedSubs={selectedSubs.delete}
      />
    </div>
  );
};

export default SubsMove;
