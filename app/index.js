import { StatusBar } from "expo-status-bar";
import { Dimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IndexSlider from "../components/indexSlider";
import { useTheme } from "../context/themeContext";

export default function Index() {
    const { darkMode, lightMode } = useTheme();

    return (
        <SafeAreaView>
        <View className="w-full h-full bg-[#E9E9E9] flex items-center justify-center">
            <StatusBar backgroundColor={darkMode ? "#E9E9E9" : "#032B30"} />

            <View className="w-full h-[89%] absolute top-0">
                <IndexSlider lightMode={lightMode} />
            </View>
        </View>
        </SafeAreaView>
    );
}
