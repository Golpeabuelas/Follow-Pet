import Logo from "../assets/images/logo.png";
import { Dimensions, Image, Pressable, View, Animated } from "react-native";
import { MessageIcon, ReportIcon, HealthIcon, ProfileIcon } from "./icons";
import { useState, useRef, useEffect } from "react";
import { Link } from "expo-router";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const positions = [ width * 0.94, 
                    width * 0.745, 
                    width * 0.549, 
                    width * 0.36, 
                    width * 0.1665];

const companions = [width * 1.2585, 
                    width * 1.0635, 
                    width * 0.8675, 
                    width * 0.6785, 
                    width * 0.485];

const links = [ "/chats", "/reports", "/", "/health", "/profile" ];

export default function Tabs({ colors, position, verticalPositions }) {
    const [colorIcon, setColorIcon] = useState([
        colors.colorPrimaryIcon,
        colors.colorPrimaryIcon,
        colors.colorPrimaryIcon,
        colors.colorPrimaryIcon,
        colors.colorPrimaryIcon
    ]);

    const indicatorPosition = useRef(new Animated.Value(positions[position])).current;
    const companionsPosition = useRef(new Animated.Value(companions[position])).current;
    const iconPositions = Array.from({ length: 5 }, () => useRef(new Animated.Value(0)).current);

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

        if (colores) {
            setColorIcon(colores);
        }
    }

    useEffect(() => {
        movementTabs(positions[2], companions[2], verticalPositions, colorIcon);
    }, []);

    return (
        <View className="w-full h-[11%] bg-black absolute bottom-0 justify-items-center">
            <View className={"w-full h-full bg-[#FFBD59] flex-row justify-between rounded-b-[15]"}>
                {[0, 1, 2, 3, 4].map((i) => {
                    const isEnd = i === 4;
                    const marginH = isEnd ? { marginLeft: width * 0.02166 } : { marginHorizontal: width * 0.02166 };
                    const yPos = Array(5).fill(0);
                    const colores = [
                        i === 0 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon,
                        i === 1 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon,
                        i === 3 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon,
                        i === 4 ? colors.colorPrimaryIcon : colors.colorSecondaryIcon
                    ];

                    return (
                        <View key={i} style={{width: width * 0.15, height: width * 0.15, marginBottom: height * 0.0187, marginTop: height * 0.0176, ...marginH }} className={"justify-center items-center z-[3]"}>
                            <Link href={`/home${links[i]}`} asChild>
                                <Pressable onPress={() => movementTabs(positions[i], companions[i], yPos.map((val, idx) => idx === i ? i === 2 ? -height * 0.067 : i === 3 ? -height * 0.064 : -height * 0.066 : 0), colores)}>
                                    <Animated.View style={{ transform: [{ translateY: iconPositions[i] }] }}>
                                        {i === 0 && <MessageIcon size={width * 0.1} color={colorIcon[0]} />}
                                        {i === 1 && <ReportIcon size={width * 0.1} color={colorIcon[1]} />}
                                        {i === 2 && <Image source={Logo} style={{ width: width * 0.14, height: width * 0.14, marginHorizontal: width * 0.05 }} />}
                                        {i === 3 && <HealthIcon size={width * 0.1} color={colorIcon[2]} />}
                                        {i === 4 && <ProfileIcon size={width * 0.1} color={colorIcon[3]} />}
                                    </Animated.View>
                                </Pressable>
                            </Link>
                        </View>
                    );
                })}

                <Animated.View style={{ width: width * 0.18, height: width * 0.18, borderWidth: height * 0.0064, right: indicatorPosition, position: 'relative', top: -height * 0.055 }} className="bg-[#D9D9D9] z-[2] rounded-full border-[#FFF9F0]" />
                
                <Animated.View style={{ width: width * 0.457, height: width * 0.18, right: companionsPosition, position: 'relative', top: -height * 0.055 }} className="bg-[#transparent] z-[1] justify-between flex-row">
                    <View style={{ width: width * 0.10, height: width * 0.056, left: width * 0.089, top: height * 0.0485, borderWidth: height * 0.006 }} className={`bg-[#FFBD59] rounded-tr-[100%] border-b-0 border-l-0 border-[#FFF9F0]`} />
                    <View style={{ width: width * 0.10, height: width * 0.056, right: width * 0.089, top: height * 0.0485, borderWidth: height * 0.006 }} className={`bg-[#FFBD59}] rounded-tl-[100%] border-b-0 border-r-0 border-[#FFF9F0]`} />
                </Animated.View>
            </View>
        </View>
    );
}
