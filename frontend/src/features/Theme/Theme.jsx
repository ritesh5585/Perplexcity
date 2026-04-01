import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDark } from "../auth/auth.slice";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.auth.isDark);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const toggleTheme = () => {
    dispatch(setIsDark(!isDark));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const applyTheme = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export default applyTheme;
