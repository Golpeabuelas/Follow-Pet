import "../../global.css";
import { Slot, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import Tabs from "../../components/tabsHome";
import { useEffect, useState } from "react";

const { height } = Dimensions.get("window");

const colorsTabs = {
    colorPrimaryIcon: "#788384",
    colorSecondaryIcon: "#D9D1C8",
};

export default function Layout() {
    const pathname = usePathname();
    const [token, setToken] = useState(true);

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

    const tabIndex =
        pathname === "/chats" ? 0 :
        pathname === "/reports" ? 1 :
        pathname === "/" ? 2 :
        pathname === "/health" ? 3 :
        pathname === "/profile" ? 4 : 2;

    const verticalPositions = [[-height * 0.066, 0, 0, 0, 0], [0, 0, -height * 0.067, 0, 0]] 

    return (
        <>
            <StatusBar backgroundColor="#FFF9F0" />
            <Slot />
            {pathname.startsWith("/home/chat/") ? null : (
                <Tabs
                    colors={colorsTabs}
                    position={tabIndex}
                    verticalPositions={pathname === '/chats' ? verticalPositions[0] : verticalPositions[1]}
                /> )
            }
        </>
    );
}                       