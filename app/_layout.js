import "../global.css";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import { ThemeProvider, useTheme } from "../context/themeContext";
import Tabs from "../components/tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const { height } = Dimensions.get("window");

const colorsNoIndex = {
  colorBackgroundTabs: "#FFBD59",
  colorBorderCompanions: "#E9E9E9",
  colorPrimaryIcon: "#788384",
  colorSecondaryIcon: "#D9D1C8",
};

function InnerLayout() {
    const pathname = usePathname();
    const router = useRouter();
    const { colorsTabs } = useTheme();
    const [token, setToken] = useState(null);

    const isInHome = pathname.startsWith("/home");

    useEffect(() => {
        const fetchToken = async () => {
            const checkToken = await AsyncStorage.getItem("userToken");
            setToken(checkToken);
        };

        fetchToken();
    }, []);


    useEffect(() => {
        if (token === null) return;

        if (!token && pathname.startsWith("/home")) {
            router.replace("/sign_in");
        } else if (token && !pathname.startsWith("/home")) {
            router.replace("/home");
        }
    }, [token, pathname]);


  const tabIndex = pathname === "/sign_in" ? 0 : pathname === "/sign_up" ? 2 : pathname.startsWith("/home") ? 1 : 0;

  const colors = pathname.startsWith("/home") ? colorsTabs : colorsNoIndex;

    return (
        <>
            <StatusBar backgroundColor="#E9E9E9" />
            <Slot />
            {!isInHome && (
                <Tabs
                    colors={pathname === "/" ? colorsTabs : colorsNoIndex}
                    position={1}
                    verticalPositions={[0, -height * 0.064, 0]}
                />
            )}
        </>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <InnerLayout />
        </ThemeProvider>
    );
}
