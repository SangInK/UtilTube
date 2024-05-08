import { memo, useEffect } from "react";

import { useMain } from "./Main";
import { useUtil } from "../providers/UtilContext";

import styles from "./Subs.module.css";

const Sub = ({ sub }) => {
  const handleClickSub = (e) => {
    e.preventDefault();

    window.open(`https://youtube.com/channel/${sub.subs_id}`, "_blank");
  };

  const createescription = () => {
    let description = sub.description;

    const firstIndex = description.indexOf("\n");

    description = description.substring(
      0,
      firstIndex >= 0 ? firstIndex : description.length
    );

    return description;
  };

  return (
    <div className={styles.subDiv}>
      <div className={styles.sub} onClick={handleClickSub}>
        <div className={styles.imgDiv}>
          <img src={sub.thumbnails} />
        </div>
        <div className={styles.contentDiv}>
          <div className={styles.title} title={sub.title}>
            {sub.title}
          </div>
          <div className={styles.content} title={sub.description}>
            <span>{createescription()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Subs = memo(({ className }) => {
  const { datas } = useMain();
  const { createStyleClass, setIsRunning } = useUtil();

  useEffect(() => {
    setIsRunning(false);
  }, []);

  return (
    <div className={createStyleClass(styles, ["subs"], className)}>
      {datas.currentSubs.map((item, index) => {
        return <Sub key={index} sub={item} />;
      })}
      <div className={styles.buttonDiv}>
        <div className={styles.button}>더보기</div>
      </div>
    </div>
  );
});

export default Subs;
