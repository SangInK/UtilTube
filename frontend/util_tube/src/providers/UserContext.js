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

  const { executeFetch } = useUtil();

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
              return;
            }
          }
        }, 500);
      }
    } else {
      setUser(result[resultType] || undefined);

      return navigate("/main");
    }
  }, [callExecuteFetch, navigate]);

  const userLogout = useCallback(async () => {
    await callExecuteFetch({
      method: "POST",
      path: "auth/logout/",
    });

    setUser(undefined);
    setLoginState(LOGIN_STATE.logout);

    return navigate("/login");
  }, [callExecuteFetch, navigate]);

  const userRevoke = useCallback(async () => {
    await callExecuteFetch({
      method: "POST",
      path: "auth/revoke/",
    });

    setUser(undefined);
    setLoginState(LOGIN_STATE.nosign);

    return navigate("/login");
  }, [callExecuteFetch, navigate]);

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
    [user, loginState]
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
