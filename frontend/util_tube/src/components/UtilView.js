import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useUtil } from "../providers/UtilContext";

import styles from "./UtillView.module.css";

const UtilView = ({ classArray }) => {
  const [queryString] = useSearchParams();
  const { createStyleClass } = useUtil();

  useEffect(() => {
    const authorizationUrl = localStorage.getItem("authorization_url");
    localStorage.removeItem("authorization_url");

    if (authorizationUrl != null) {
      // google oauth2의 로그인/계정선택 화면으로 전환
      return (window.location.href = authorizationUrl);
    } else if (queryString.size !== 0) {
      const isOk = queryString.get("isOk");

      if (isOk === null || (isOk !== "true" && isOk !== "false")) {
        console.log("fail");
      }

      localStorage.setItem("isOk", isOk);
      window.close();
    }
  }, [queryString]);

  return (
    <>
      {classArray && (
        <div className={createStyleClass(styles, classArray)}></div>
      )}
    </>
  );
};

export default UtilView;
