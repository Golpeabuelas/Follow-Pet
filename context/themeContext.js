import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    const colorsTabs = {
        colorBackgroundTabs: darkMode ? "#FFBD59" : "#788384",
        colorBorderCompanions: darkMode ? "#E9E9E9" : "#032B30",
        colorPrimaryIcon: darkMode ? "#788384" : "#586364",
        colorSecondaryIcon: darkMode ? "#D9D1C8" : "#FFBD59",
    };

    function lightMode(value) {
        setDarkMode(value);
    }

    return (
        <ThemeContext.Provider value={{ darkMode, lightMode, colorsTabs }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
