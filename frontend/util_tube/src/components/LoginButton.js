import { useEffect } from "react";

import styles from "../components/LoginButton.module.css";

import { useUtil } from "../providers/UtilContext";
import { useUser } from "../providers/UserContext";

import googleLoginImg from "../assets/LoginButton/google_login.png";

const LoginButton = () => {
  const { setIsRunning } = useUtil();
  const { userLogin } = useUser();

  useEffect(() => {
    setIsRunning(false);
  }, [setIsRunning]);

  const handleClick = async () => {
    //setIsRunning(true);

    await userLogin();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.btnWrapper}>
        <img src={googleLoginImg} alt="google_button_img" />

        <button onClick={handleClick}>
          <p>Google 계정으로 로그인</p>
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
