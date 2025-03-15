import { createContext, useState, useContext } from "react";

const ThemeContext = createContext(); // ✅ Create ThemeContext

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Export ThemeContext for direct usage
export const useTheme = () => useContext(ThemeContext);
export default ThemeContext; // ✅ Fix: Ensure ThemeContext is the default export
