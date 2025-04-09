import Logo from "../assets/images/logo.png"
import { FontAwesome5 } from "@expo/vector-icons";
import { Dimensions, Image, Text, View } from "react-native";

const height = Dimensions.get('window').height

export default function Tabs() {
    return(
        <View style={{ paddingInline: height*0.043}} className="w-full h-[11%] bg-[#FFBD59] flex-row absolute bottom-0 rounded-b-[25] border-solid border-[#000] border-b-[25]">
            <View className="w-[90%] flex-row">
                <View></View>
                <View style={{ width: height*0.075, height: height*0.075, marginBottom: height*0.0187, marginTop: height*0.0176}} className="border-[#000] border-solid border"></View>
                <View style={{ width: height*0.075, height: height*0.075, marginBottom: height*0.0187, marginTop: height*0.0176}} className="border-[#000] border-solid border"></View>
                <View style={{ width: height*0.075, height: height*0.075, marginBottom: height*0.0187, marginTop: height*0.0176}} className="border-[#000] border-solid border"></View>
            </View>
            
            <View style={{ width: height*0.0927, height: height*0.0927, borderWidth: height*0.0064}} className="bg-[#D9D9D9] border-[#E9E9E9] border-solid rounded-full relative top-[-50%] z-1"></View>
        </View>
    )
}