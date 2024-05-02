import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UtilProvider } from "./providers/UtilContext";
import { UserProvider } from "./providers/UserContext";

import styles from "./App.module.css";

import LoginButton from "./components/LoginButton";
import Navbar from "./components/Navbar";
import UtilView from "./components/UtilView";

const Provider = ({ children }) => {
  return (
    <UtilProvider>
      <UserProvider>{children}</UserProvider>
    </UtilProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Provider>
        <Routes>
          <Route path="/" element={<UtilView />} />
          <Route
            path="/main"
            element={<Navbar className={styles.navbar} />}
          ></Route>
          <Route path="/login" element={<LoginButton />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
