import Logo from "../assets/images/logo.png"
import { FontAwesome5 } from "@expo/vector-icons";
import { Image, View } from "react-native";

export default function Tabs() {
    return(
        <View className="w-full h-[11%] bg-[#FFBD59] flex-row justify-between items-center px-[10%]">
            <FontAwesome5 name="user-alt" size={48} color="#D9D1C8" className="z-1"/>
            <Image source={Logo} className="w-24 h-24 mb-3 z-1"/>
            <FontAwesome5 name="user-plus" size={48} color="#D9D1C8" className="z-1"/>
            <View className="w-26 h-26 rounded-full bg-[#D9D9D9] z-0"></View>
        </View>
    )
}