
import { View, Text, Pressable, Animated, Dimensions } from "react-native"
import { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

export default function DrawerMenu({ opciones = [], onCerrar, logoutOption, onLogout }) {
    const insets = useSafeAreaInsets()
    const slideAnim = useRef(new Animated.Value(-width * 0.75)).current

    const cerrar = () => {
        Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true
        }).start(() => onCerrar?.())
    }

    Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
    }).start()

    return (
        <Pressable className="absolute inset-0 z-20 bg-black/30" onPress={cerrar}>
            <Animated.View className="absolute top-0 left-0 h-full bg-[#FFF9F0] p-6 z-30" style={{ width: width * 0.75, paddingTop: insets.top + 20, transform: [{ translateX: slideAnim }] }}>
                <Text className="text-xl font-semibold mb-4 text-[#444]" style={{ fontFamily: "Montserrat" }}>
                    Menú
                </Text>

                {opciones.map(({ label, onPress }, idx) => (
                    <Pressable key={idx} className="items-start mb-3 mt-3" onPress={onPress}>
                        <View className="w-[80%] border-b border-[#E5E5E5] pb-2">
                            <Text className="text-base text-[#5E5E5E]" style={{ fontFamily: "MontserratLight" }}>
                                {label}
                            </Text>
                        </View>
                    </Pressable>
                ))}

                {!logoutOption ? null : 
                    (<LogOutButton onPress={onLogout}/>)
                }
            </Animated.View>
        </Pressable>
    )
}

function LogOutButton ({onPress}) {
    return (
        <Pressable className="mt-auto" onPress={onPress}> 
            <Text className="text-base font-bold text-red-500" style={{ fontFamily: "Montserrat" }}>
                Cerrar sesión
            </Text>
        </Pressable>
    )
}
