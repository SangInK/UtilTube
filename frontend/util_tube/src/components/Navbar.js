import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useUtil } from "../providers/UtilContext";
import { useUser } from "../providers/UserContext";

import styles from "./Navbar.module.css";

const Navbar = ({ className }) => {
  const { createStyleClass } = useUtil();
  const { user, userLogout, userRevoke } = useUser();

  const handleClickLogout = async () => {
    await userLogout();
  };

  const handleClickRevoke = async () => {
    await userRevoke();
  };

  return (
    <>
      <div className={createStyleClass(styles, ["navbar"], className)}>
        <div id="start">
          <button onClick={handleClickLogout}>logout</button>
          <button onClick={handleClickRevoke}>revoke</button>
        </div>
        <div id="center"></div>
        <div id="end">
          <button className={styles.thumb_button}>
            {user ? <img src={user.thumb_url} alt="유저 썸네일" /> : null}
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
