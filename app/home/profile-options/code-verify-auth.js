import { useEffect, useRef, useState } from "react"
import { View, Text, TextInput, Pressable } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../../consts"
import { useRouter } from "expo-router"
import LottieView from "lottie-react-native"

export default function SensitiveAccessScreen() {
    const [code, setCode] = useState("")
    const [codeSent, setCodeSent] = useState('100000000')
    const [error, setError] = useState("")
    const [focusedIndex, setFocusedIndex] = useState(null)
    const [lottieVisible, setLottieVisible] = useState(false)
    const router = useRouter()
    const inputsRef = useRef([])

    useEffect(() => {
        const sendCode = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");

                const res = await fetch(`${API_URL}/auth-sensitive`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                console.log("Respuesta del servidor:", data);
                if (data.status !== 200) {
                    setError("No se pudo enviar el código de verificación.");
                    setCodeSent(100000000); 
                } else if (data.status === 200) {
                    setCodeSent(data.codigo); 
                }
            } catch (error) {
                setError("Error al enviar el código.");
                console.error("Error en fetch:", error);
            }
        };

        sendCode();
    }, []);

    const handleInputChange = (text, index) => {
        const newCode = code.split("")
        newCode[index] = text.toUpperCase()
        const updated = newCode.join("").slice(0, 8)
        setCode(updated)

        if (text && index < 7) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleVerify = async () => {
        setLottieVisible(true)

        if (code === codeSent) {
            setTimeout(() => {
                setLottieVisible(false)
                router.push("/home/profile-options/sensitive-info")
            }, 2000)
        } else {
            setLottieVisible(false)
            setError("Código incorrecto. Se invalidará este código, solicita uno nuevo.")
            setCode("")
            setCodeSent(100000000)
            inputsRef.current[0]?.focus()
            setTimeout(() => {
                router.push("/home/profile")
            }, 1500)
            
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-[#FFF9F0] px-6" style={{ paddingTop: lottieVisible ? 150 : 0 }}>
            <Text className="text-2xl font-bold text-[#444] text-center mb-2">
                Estás accediendo a información delicada
            </Text>

            <Text className="text-base text-[#777] text-center mb-6">
                Para continuar, ingresa el código que fue enviado a tu correo.
            </Text>
                
            <View className="flex-row justify-between w-full mb-4 px-4">
                {[...Array(8)].map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        value={code[index] || ""}
                        onChangeText={(text) => handleInputChange(text, index)}
                        maxLength={1}
                        keyboardType="default"
                        autoCapitalize="characters"
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        className={`w-10 h-12 text-center justify-center dalign-items-center rounded-xl text-[#444] text-lg ${
                            focusedIndex === index
                                ? "border-2 border-[#FFBD59] bg-white"
                                : "border border-[#ccc] bg-white"
                        }`}
                    />
                ))}
            </View>

            {error && <Text className="text-red-500 mb-3">{error}</Text>}


            <Pressable
                onPress={handleVerify}
                className="bg-[#FFBD59] py-3 px-6 rounded-xl w-full items-center"
                >
                <Text className="text-white font-semibold text-base">Verificar</Text>
            </Pressable>
            
            {lottieVisible && <LottieView
                source={require("../../../assets/animations/gato-hide.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150, marginBottom: 20, opacity: 1, transform: [{ rotate: "180deg" }] }}
            />}
        </View>
    )
}
