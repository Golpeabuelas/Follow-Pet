import { View, Animated, Easing, Text } from "react-native"
import LottieView from "lottie-react-native"
import { useEffect, useRef } from "react"
import { useFonts } from "expo-font"

export default function LoadingScreen() {
    const dotsitoU = useRef(new Animated.Value(0.5)).current
    const dotsitoD = useRef(new Animated.Value(0.5)).current
    const dotsitoT = useRef(new Animated.Value(0.5)).current

    const animateDot = (dot, delay) => {
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 200,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0.5,
                        duration: 200,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        }, delay)
    }

    useEffect(() => {
        animateDot(dotsitoU, 0)
        animateDot(dotsitoD, 200)
        animateDot(dotsitoT, 400)
    }, [])

    const [fontsLoaded] = useFonts({
            MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf")
    })

    return (
        <View className="flex-1 justify-center items-center bg-[#FFF9F0]">
            <LottieView
                source={require("../assets/animations/dog-walk.json")}
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
            />

            <View className="flex-row mt-2">
                {[dotsitoU, dotsitoD, dotsitoT].map((dot, index) => (
                    <Animated.View
                        key={index}
                        style={{
                            width: 18,
                            height: 18,
                            borderRadius: 12,
                            backgroundColor: "#FFBD59",
                            opacity: dot,
                            marginHorizontal: 12,
                        }}
                    />
                ))}
            </View>
        </View>
    )
}
