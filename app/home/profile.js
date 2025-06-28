import { View, Text, Image, ScrollView, FlatList, Pressable, Animated, Dimensions, SafeAreaView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState, useRef, useEffect } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useFonts } from "expo-font"

import DrawerMenu from "../../components/drawer"
import LoadingScreen from "../../components/loadingScreen.jsx"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"

const { width } = Dimensions.get("window")
import { API_URL } from "../../consts.js"

const linkOptions = [
    {
        label: "Editar perfil",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/profile-options/edit-profile")
        }
    },
    {
        label: "Información delicada",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/profile-options/code-verify-auth")
        }
    },
    {
        label: "Registrar nueva mascota",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/profile-options/register-pet")
        }
    },
    {
        label: "Historial de publicaciones",
        onPress: async () => {
            const token = await AsyncStorage.getItem("userToken")
            if (token) router.push("/home/reports")
        }
    }
]

export default function ProfileScreen() {
    const insets = useSafeAreaInsets()
    const slideAnim = useRef(new Animated.Value(-width * 0.75)).current

    const [menuVisible, setMenuVisible] = useState(false)
    const [profileData, setProfileData] = useState(null)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf"),
    })

    const openMenu = () => {
        setMenuVisible(true)
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: -width * 0.75,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMenuVisible(false))
    }

    const userData = async () => {
        const data = await fetchUserData()
        if (data) setProfileData(data)
    }

    useEffect(() => {
        userData()
    }, [])

    if (!fontsLoaded) return null
    if (!profileData) return <LoadingScreen />

    return (
        <SafeAreaView className="flex-1 bg-[#FFF9F0]">
            {menuVisible && (
                <DrawerMenu opciones={linkOptions} onCerrar={closeMenu} logoutOption={true} onLogout={logOut} />
            )}

            <ScrollView className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }} contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="absolute top-4 left-4 z-10 flex-row w-full justify-between px-6">
                    <Pressable onPress={openMenu}>
                        <Ionicons name="menu" size={28} color="#5E5E5E" />
                    </Pressable>
                    <Pressable className="mr-[15] mt-1" onPress={() => router.push("/home/profile-options/notifications")}>
                        <Ionicons name="notifications-outline" size={28} color="#5E5E5E" />
                    </Pressable>
                </View>

                <View className="items-center px-6 pt-14">
                    <Image source={{ uri: `${API_URL}${profileData.usuario.foto_usuario}` }} className="w-32 h-32 rounded-full border-4 border-[#FFBD59]" />
                    <Text className="text-2xl font-semibold text-[#5E5E5E] mt-4" style={{ fontFamily: "Montserrat" }}>
                        {profileData ? profileData.usuario.nombre_usuario : "Cargando..."}
                    </Text>
                </View>

                <View className="mt-8 px-6">
                    <Text className="text-xl font-semibold text-[#5E5E5E] mb-2" style={{ fontFamily: "Montserrat" }}>
                        Mis mascotas
                    </Text>

                    {profileData.usuario.mascotas.length > 0 ? (
                        <FlatList
                            data={profileData.usuario.mascotas}
                            keyExtractor={(item, index) => item.id_mascota || index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="gap-4"
                            renderItem={({ item }) => (
                                <View className="bg-white p-4 rounded-2xl mr-4 w-40 shadow-md">
                                    <Image
                                        source={
                                            item.foto
                                                ? { uri: `${API_URL}${item.foto}` }
                                                : require("../../assets/images/Michi.png")
                                        }
                                        className="w-full h-24 rounded-xl mb-2"
                                    />
                                    <Text className="text-base font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
                                        {item.nombre || "Sin nombre"}
                                    </Text>
                                    <Text className="text-sm text-[#777]" style={{ fontFamily: "MontserratLight" }}>
                                        {item.color || "Sin datos"}
                                    </Text>
                                </View>
                            )}
                        />
                    ) : (
                        <Text className="text-base text-[#999]" style={{ fontFamily: "MontserratLight" }}>
                            No tienes mascotas registradas.
                        </Text>
                    )}
                </View>

                <View className="mt-8 px-6 pb-10">
                    <Text
                        className="text-xl font-semibold text-[#5E5E5E] mb-2"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        Mis publicaciones
                    </Text>
                    {profileData.usuario.publicaciones.length > 0 ?
                        profileData.usuario.publicaciones.map((publicacion) => (
                            <View key={publicacion.id_publicacion} className="bg-white p-4 rounded-2xl mb-4 shadow-sm">
                                <Text
                                    className="text-base font-bold text-[#444]"
                                    style={{ fontFamily: "Montserrat" }}
                                >
                                    {publicacion.titulo}
                                </Text>
                                <Text
                                    className="text-sm text-[#999] mt-1"
                                    style={{ fontFamily: "MontserratLight" }}
                                >
                                    {publicacion.estatus}
                                </Text>
                            </View>
                        )) :
                        <Text className="text-base text-[#999]" style={{ fontFamily: "MontserratLight" }}>
                            No tienes publicaciones aún.
                        </Text>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

async function fetchUserData() {
    try {
        const token = await AsyncStorage.getItem("userToken")
        const response = await fetch(`${API_URL}/get-profile-details/${token}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching user data:", error)
        return null
    }
}

async function logOut() {
    await AsyncStorage.removeItem("userToken")
    router.push("/sign_in")
}

//F0ll0w_P3t_4dm1n1str4d0r