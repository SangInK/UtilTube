import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";
import { useUtil } from "./UtilContext";

const LOGIN_STATE = {
  nosign: 0,
  login: 1,
  logout: 2,
};

const UserContext = createContext({
  user: null,
  loginState: LOGIN_STATE.nosign,
  userLogin: () => {},
  userLogout: () => {},
  userRevoke: () => {},
  loginCheck: () => {},
});

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [loginState, setLoginState] = useState(LOGIN_STATE.nosign);

  const { setIsRunning, executeFetch } = useUtil();

  /**
   * userLogin(), userLogout(), userRevoke(), loginCheck()에서
   * 전달받은 변수를 사용하여 executeFetch() 호출
   * @param {object} options fetch를 사용하여 HTTP 통신을 시도할 때의 option들
   * @returns {object|null} user의 정보 또는 login 상태로 구성된 object 또는 null
   */
  const callExecuteFetch = useCallback(
    async (options) => {
      try {
        const result = await executeFetch(options);

        return result;
      } catch (error) {
        console.error(error.message);

        return null;
      }
    },
    [executeFetch]
  );

  /**
   * 화면 최초 로딩 시 Google 인증여부 및 로그인 여부 확인.
   * 로그인 상태이면 /main 으로 이동.
   * 로그인 상태가 아니면 /login 으로 이동.
   */
  const loginCheck = useCallback(async () => {
    const resultType = "loginState";

    const result = await callExecuteFetch({
      method: "GET",
      path: "auth/check/",
    });

    setLoginState(result[resultType] || LOGIN_STATE.nosign);

    if (result[resultType] === LOGIN_STATE.login) {
      setUser(result.user || undefined);

      return navigate("/main");
    } else {
      return navigate("/login");
    }
  }, [callExecuteFetch, navigate]);

  /**
   * 로그인 처리
   * Google 인증이 완료된 상태면 로그인 처리만,
   * Google 인증이 완료되지 않은 상태면 Google 인증을 위한 인증화면 팝업
   */
  const userLogin = useCallback(async () => {
    const resultType = "user";

    const result = await callExecuteFetch({
      method: "POST",
      path: "auth/",
    });

    if (loginState === LOGIN_STATE.nosign && !result[resultType]) {
      if (result.authorization_url) {
        // loginWindow에서 사용할 수 있도록 임시로 url을 저장
        localStorage.setItem("authorization_url", result.authorization_url);

        const width = 1300;
        const height = 800;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const loginWindow = window.open(
          `${window.location.origin}`,
          "_blank",
          `location=no, width=${width}, height=${height}, left=${left}, top=${top}`
        );

        const checking = setInterval(async () => {
          if (loginWindow && loginWindow.closed) {
            clearInterval(checking);

            const isOk = localStorage.getItem("isOk");
            localStorage.removeItem("isOk");

            if (isOk === "true") {
              await loginCheck();
            } else {
              setIsRunning(false);
              return;
            }
          }
        }, 500);
      }
    } else {
      setUser(result[resultType] || undefined);

      return navigate("/main");
    }
  }, [loginCheck, setIsRunning, callExecuteFetch, navigate]);

  /**
   * 로그아웃 처리
   */
  const userLogout = useCallback(async () => {
    setIsRunning(true);

    await callExecuteFetch({
      method: "POST",
      path: "auth/logout/",
    });

    setUser(undefined);
    setLoginState(LOGIN_STATE.logout);

    return navigate("/login");
  }, [setIsRunning, callExecuteFetch, navigate]);

  /**
   * Google 인증 취소
   */
  const userRevoke = useCallback(async () => {
    setIsRunning(true);

    await callExecuteFetch({
      method: "POST",
      path: "auth/revoke/",
    });

    setUser(undefined);
    setLoginState(LOGIN_STATE.nosign);

    return navigate("/login");
  }, [setIsRunning, callExecuteFetch, navigate]);

  useEffect(() => {
    const executeCheck = async () => {
      await loginCheck();
    };

    if (loginState !== LOGIN_STATE.login) {
      console.log("executeCheck");
      executeCheck();
    }
  }, [loginCheck]);

  const providerValue = useMemo(
    () => ({
      user,
      loginState,
      userLogin,
      userLogout,
      userRevoke,
      loginCheck,
    }),
    [user, loginState, userLogin, userLogout, userRevoke, loginCheck]
  );

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  try {
    const context = useContext(UserContext);

    return context;
  } catch (error) {
    console.error(`fialed useContext :: ${error}`);
  }
};
