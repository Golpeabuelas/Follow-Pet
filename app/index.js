import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Tabs from "../components/tabs";

export default function Index() {
    return(
        <View className="w-full h-full bg-[#E9E9E9] flex items-center justify-center">
            <StatusBar backgroundColor="#E9E9E9"/>
            <View className="w-full h-[80%] border border-solid border-[#000]">
               <Text>dsd</Text>
            </View>
            <Tabs/>
        </View>
    )
}