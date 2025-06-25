import Logo from "../assets/images/logo.png";
import { Dimensions, Image, Pressable, View, Animated } from "react-native";
import { AddUserIcon, UserIcon } from "./icons";
import { useState, useRef, useEffect } from "react";
import { Link } from "expo-router";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const positions = [width * 0.9288, width * 0.605, width * 0.2776];
const companions = [width * 1.2888, width * 0.965, width * 0.6376]

export default function Tabs({ colors, position, verticalPositions }) {
    const [colorIcon, setColorIcon] = useState([colors.colorPrimaryIcon, colors.colorPrimaryIcon]);
    const indicatorPosition = useRef(new Animated.Value(width * 0.605)).current;
    const companionsPosition = useRef(new Animated.Value(width * 0.965)).current
    const iconPositions = [ useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current ];

    function movementTabs(targetX, companionTarget, yArray, colores) {
        Animated.timing(indicatorPosition, {
            toValue: targetX,
            duration: 300,
            useNativeDriver: false
        }).start();

        Animated.timing(companionsPosition, {
            toValue: companionTarget,
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

        if(colores) {
            setColorIcon([colores[0], colores[1]]);
        }
    }

    useEffect(() => {
        movementTabs(positions[position], companions[position], verticalPositions, [colors.colorPrimaryIcon, colors.colorPrimaryIcon]);
    }, [])

    useEffect(() => {
        setColorIcon([colors.colorSecondaryIcon, colors.colorSecondaryIcon]);
    }, [colors]);    

        return (
        <View className="w-full h-[11%] bg-black absolute bottom-0 justify-items-center">
            <View className={`w-full h-full bg-[${colors.colorBackgroundTabs}] flex-row justify-items-center rounded-b-[15]`}>
                {[0, 1, 2].map((i) => {
                    const isMiddle = i === 1;
                    const marginH = isMiddle ? "ml-[7.7%] mr-[9.1%]" : "mx-[8.4%]";
                    const yPos = [ 0,0,0 ];
                    const colores = [
                        i === 0 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon,
                        i === 2 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon
                    ];

                    return (
                        <View key={i} style={{ width: width * 0.162, height: width * 0.162, marginBottom: height * 0.0187, marginTop: height * 0.0176}} className={`${marginH} justify-center items-center z-[3]`}>
                            <Link href={i === 0 ? "/sign_in" : i === 1 ? "/" : "/sign_up"} asChild>
                                <Pressable onPress={() => movementTabs(positions[i], companions[i], yPos.map((val, idx) => idx === i ? -height * 0.064 : 0), colores)} >
                                    <Animated.View style={{ transform: [{ translateY: iconPositions[i] }] }}>
                                        {i === 0 && <UserIcon size={width * 0.11} color={colorIcon[0]} />}
                                        {i === 1 && <Image source={Logo} style={{ width: width * 0.16, height: width * 0.16 }} />}  
                                        {i === 2 && <AddUserIcon size={width * 0.11} color={colorIcon[1]} />}
                                    </Animated.View>
                                </Pressable>
                            </Link>    
                        </View>
                    );
                })}
                
                <Animated.View style={{ width: width * 0.21, height: width * 0.21, borderWidth: height * 0.0064, right: indicatorPosition, position: 'relative', top: -height * 0.055, }} className="bg-[#D9D9D9] z-[2] rounded-full border-[#E9E9E9]"/>
                <Animated.View style={{ width: width * 0.51, height: width * 0.21, right: companionsPosition, position: 'relative', top: -height * 0.055, }} className="bg-[#transparent] z-[1] justify-between flex-row">
                    <View style={{ width: width * 0.10, height: width * 0.07, left: width * 0.089, top: height * 0.0485, borderWidth: height * 0.0064}} className={`bg-[${colors.colorBackgroundTabs}] rounded-tr-[100%] border-b-0 border-l-0 border-[${colors.colorBorderCompanions}]`}/>
                    <View style={{ width: width * 0.10, height: width * 0.07, right: width * 0.089,top: height * 0.0485, borderWidth: height * 0.0064}} className={`bg-[${colors.colorBackgroundTabs}] rounded-tl-[100%] border-b-0 border-r-0 border-[${colors.colorBorderCompanions}]`}/>
                </Animated.View>
            </View>
        </View>
    );
}
