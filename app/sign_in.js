import { Dimensions, Image, Pressable, Text, TextInput, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { useRouter } from "expo-router";
import Logo from "../assets/images/logo.png";
import { API_URL } from "../consts.js";

const { height } = Dimensions.get("window");

export default function SignIn() {
    const router = useRouter();

    const [fontsLoaded] = useFonts({ 
        Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),  
        MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Debes ingresar correo y contraseña");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo_usuario: email, contraseña_usuario: password }),
            });

            const data = await response.json();

            if (data.status === 200 && data.token) {
                await AsyncStorage.setItem("userToken", data.token);
                const token = await AsyncStorage.getItem("userToken");

                router.replace("/home/");
            } else {
                Alert.alert("Error", data.error || "Error al iniciar sesión");
            }
            } catch (error) {
                console.error("Error de conexión:", error);
                Alert.alert("Error", "No se pudo conectar al servidor");
        }
    };

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView>
            <View className="w-full h-full bg-[#E9E9E9] flex">
                <View className="w-full justify-center items-center mt-[10%] mb-[5%]">
                    <Image source={Logo} className="w-[70%] object-cover" resizeMode="contain" />
                </View>

                <TextInput style={{ fontFamily: "MontserratLight", fontSize: 16 }} className="w-[80%] h-[5%] bg-[#D9D9D9] rounded-[5px] ml-[10.17%] pl-4 mb-7 border-[#8C8888] border-[0.5px]" placeholder="Correo electrónico" placeholderTextColor="#788384" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={{ fontFamily: "MontserratLight", fontSize: 16 }} className="w-[80%] h-[5%] bg-[#D9D9D9] rounded-[5px] ml-[10.17%] pl-4 mb-10 border-[#8C8888] border-[0.5px]" placeholder="Contraseña" placeholderTextColor="#788384" secureTextEntry={true} value={password} onChangeText={setPassword} />

                <Pressable
                className="w-[80%] h-[5%] bg-[#788384] rounded-[5px] ml-[10.17%] items-center justify-center mt-10"
                onPress={handleLogin}
                >
                    <Text style={{ fontFamily: "Montserrat" }} className="text-[#E9E9E9] text-[20px]">
                        INICIAR SESIÓN
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
