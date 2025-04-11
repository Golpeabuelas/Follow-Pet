import Logo from "../assets/images/logo.png";
import { Dimensions, Image, Pressable, View, Animated } from "react-native";
import { AddUserIcon, UserIcon } from "./icons";
import { useState, useRef, useEffect } from "react";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function Tabs() {
    const [colorIcon, setColorIcon] = useState(["#D9D1C8", "#D9D1C8"]);
    const indicatorPosition = useRef(new Animated.Value(width * 0.605)).current;
    const iconPositions = [ useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current ];

    function movementTabs(targetX, yArray, colors) {
        Animated.timing(indicatorPosition, {
            toValue: targetX,
            duration: 300,
            useNativeDriver: false
        }).start();

        iconPositions.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: yArray[index],
                duration: 300,
                useNativeDriver: true
            }).start();
        });

        setColorIcon(colors);
    }

    useEffect(() => {
        movementTabs(width * 0.605, [0, -height * 0.064, 0], [])
    }, [])

    return (
        <View className="w-full h-[11%] bg-[#FFBD59] flex-row absolute bottom-0 justify-items-center">
            {[0, 1, 2].map((i) => {
                const isMiddle = i === 1;
                const marginH = isMiddle ? "ml-[7.7%] mr-[9.1%]" : "mx-[8.4%]";
                const yPos = [ -83, 0, -83 ];
                const positions = [width * 0.9288, width * 0.605, width * 0.2776];
                const colors = [
                    i === 0 ? "#788384" : "#D9D1C8",
                    i === 2 ? "#788384" : "#D9D1C8"
                ];

                return (
                    <View key={i} style={{ width: width * 0.162, height: width * 0.162, marginBottom: height * 0.0187, marginTop: height * 0.0176}} className={`${marginH} justify-center items-center z-[3]`}>
                        <Pressable onPress={() => movementTabs(positions[i], yPos.map((val, idx) => idx === i ? -height * 0.064 : 0), colors)} >
                            <Animated.View style={{ transform: [{ translateY: iconPositions[i] }] }}>
                                {i === 0 && <UserIcon size={width * 0.11} color={colorIcon[0]} />}
                                {i === 1 && <Image source={Logo} style={{ width: width * 0.16, height: width * 0.16 }} />}
                                {i === 2 && <AddUserIcon size={width * 0.11} color={colorIcon[1]} />}
                            </Animated.View>
                        </Pressable>
                    </View>
                );
            })}
            
            <Animated.View style={{ width: width * 0.21, height: width * 0.21, borderWidth: height * 0.0064, right: indicatorPosition, position: 'relative', top: -height * 0.055, }} className="bg-[#D9D9D9] z-[2] rounded-full border-[#E9E9E9]">
                <View style={{ width: width * 0.05, height: width * 0.05, left: "-14%", bottom: "-58%"}} className="bg-[transparent] relative rounded-tr-full border z-[0]"/>
            </Animated.View>
        </View>
    );
}
