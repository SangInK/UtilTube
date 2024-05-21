import { Outlet } from "react-router-dom";

import { useUtil } from "../providers/UtilContext";
import { useUser } from "../providers/UserContext";

import styles from "./Navbar.module.css";

import revokeIcon from "../assets/Navber/icons8-cancel-subscription-30.png";
import logoutIcon from "../assets/Navber/icons8-logout-30.png";
import { useState } from "react";

const ButtonDiv = () => {
  const { userLogout, userRevoke } = useUser();

  const handleClickLogout = async () => {
    await userLogout();
  };

  const handleClickRevoke = async () => {
    //await userRevoke();
  };

  return (
    <div className={styles.buttonDiv}>
      <Button
        className={`${styles.button} ${styles.borderBottom}`}
        buttonText={"로그아웃"}
        icon={logoutIcon}
        onClick={handleClickLogout}
      />
      <Button
        className={`${styles.button}`}
        buttonText={"탈퇴"}
        icon={revokeIcon}
        onClick={handleClickRevoke}
      />
    </div>
  );
};

const Button = ({ className, buttonText, icon, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <img src={icon} art={buttonText} />
      <div>{buttonText}</div>
    </div>
  );
};

const Navbar = ({ className }) => {
  const { createStyleClass } = useUtil();
  const { user } = useUser();

  const [visible, setVisible] = useState(false);

  const handleClickIcon = () => {
    setVisible((current) => !current);
  };

  return (
    <>
      <div className={createStyleClass(styles, ["navbar"], className)}>
        <div className={styles.start}></div>

        <div className={styles.end}>
          <button className={styles.thumb_button} onClick={handleClickIcon}>
            {user ? <img src={user.thumb_url} alt="유저 썸네일" /> : null}
          </button>

          {visible && <ButtonDiv />}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
