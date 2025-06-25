import { Dimensions, Image, ImageBackground, ImageBackgroundBase, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Logo from "../../assets/images/logo.png";
import Pata from "../../assets/svg/paw-print.svg";
import Estetoscopio from "../../assets/svg/stethoscope.svg";    
import { useEffect, useState } from "react";
import { Link } from "expo-router";

const width = Dimensions.get("window").width;

export default function RoleSelection({ funchon }) {  
    const [fontsLoaded] = useFonts({ Montserrat: require("../../assets/fonts/Montserrat-Black.ttf") });
    const [scale, setScale] = useState([1,1]);

    function selectRole(role) {
        funchon(role);
    }

    return (
        <View className="w-full h-full bg-[#E9E9E9] flex">
            <View className="w-full h-[40%] justify-center items-center mt-[10%] mb-[5%]">
                <Image source={Logo} className="w-[70%] h-[70%] object-cover"/>
                <Text style={{fontFamily: "Montserrat"}} className="text-center text-[#788384] text-[20px]">¿Qué rol tendrás en Follow Pet? </Text>
            </View>
            
            <View className="w-full flex-row justify-between items-center px-[10%] mb-10">
                <Pressable style={{width: width*0.35, height: width*0.35, transform:[{scale: scale[0]}]}} onPress={() => {selectRole(1)}} onPressIn={() => {setScale([1.1,0])}} onPressOut={() => {setScale([0,1.1])}} className="justify-center items-center rounded-[15] border border-[#032B30]">
                    <Pata width={width*0.2} height={width*0.2} stroke="#777777"/> 
                    <Text style={{fontFamily: "Montserrat"}} className="text-center text-[#333333] text-[20px] mt-3">Dueño </Text>
                </Pressable>

                <Pressable style={{width: width*0.35, height: width*0.35, transform:[{scale: scale[1]}]}} onPress={() => {selectRole(2)}} onPressIn={() => {setScale([0,1.1])}} onPressOut={() => {setScale([1.1,0])}} className="justify-center items-center rounded-[15] border border-[#032B30]">
                    <Estetoscopio width={width*0.2} height={width*0.2} stroke="#777777"/>
                    <Text style={{fontFamily: "Montserrat"}} className="text-center text-[#333333] text-[20px] mt-3">Veterinario </Text>
                </Pressable>
            </View>
        </View>
    )
}