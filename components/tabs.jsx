import Logo from "../assets/images/logo.png"
import { FontAwesome5 } from "@expo/vector-icons";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { AddUserIcon, UserIcon } from "./icons";
import { useState } from "react";

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default function Tabs() {
    const [colorIcon, setColorIcon] = useState(["#D9D1C8", "#D9D1C8"])
    const [movementIndicator, setMovementIndicator] = useState("60.5%")
    const [iconMovement, setIconMovement] = useState(["0%", "-83%", "0%"])

    function movementTabs( x, y, colors ) {
        setMovementIndicator(x)
        setIconMovement(y)
        setColorIcon(colors)
    }

    return(
        <View className="w-full h-[11%] bg-[#FFBD59] flex-row absolute bottom-0 justify-items-center">
            <View style={{ width: width*0.162, height: width*0.162, marginBottom: height*0.0187, marginTop: height*0.0176}} className=" mx-[8.4%] justify-center items-center z-[1]">
                <Pressable style={{ top: iconMovement[0] }} className="pb-auto relative top-[-83%]" onPress={() => movementTabs("92.88%", ["-83%", "0%", "0%"], ["#936791", "#D9D1C8"])}>
                    <UserIcon size={width*0.11} color={colorIcon[0]}/>
                </Pressable>
            </View>
            <View style={{ width: width*0.162, height: width*0.162, marginBottom: height*0.0187, marginTop: height*0.0176}} className="ml-[7.7%] mr-[9.1%] justify-center items-center z-[1]">
                <Pressable style={{ top: iconMovement[1] }} className="pb-auto relative" onPress={() => movementTabs("60.5%", ["0%", "-83%", "0%"], ["#D9D1C8", "#D9D1C8"])}>
                    <Image source={Logo} style={{ width: width*0.16, height: width*0.16}}></Image>
                </Pressable>
            </View>
            <View style={{ width: width*0.162, height: width*0.162, marginBottom: height*0.0187, marginTop: height*0.0176}} className="mx-[8.4%] justify-center items-center z-[1]">
                <Pressable style={{ top: iconMovement[2] }} className="pb-auto relative" onPress={() => movementTabs("27.76%", ["0%", "0%", "-83%"], ["#D9D1C8", "#936791"])}>
                    <AddUserIcon size={width*0.11} color={colorIcon[1]}/>
                </Pressable>
            </View>
            <View style={{ width: width*0.21, height: width*0.21, right: movementIndicator, borderWidth: height*0.0064}} className="bg-[#D9D9D9] border-[#E9E9E9] border-solid rounded-full relative top-[-50%] mx-auto z-[0]"></View>
        </View>
    )
}