import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import { useFonts } from "expo-font"
import { API_URL } from "../../../consts"
import AsyncStorage from "@react-native-async-storage/async-storage"

const mensajesMock = [
  { id: "1", texto: "Hola, ¿viste a mi perro?", propio: false },
  { id: "2", texto: "Sí, creo que lo vi en el parque.", propio: true },
  { id: "3", texto: "¿A qué hora fue?", propio: false }
]


async function perro() {
  AsyncStorage.removeItem("userToken")
  const token = await AsyncStorage.getItem("userToken")
  if (token) console.log("Token:", token)
    else console.log("No hay token")
}

export default function ChatDetailScreen() {
  const { id_chat } = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [mensaje, setMensaje] = useState("")

  const [fontsLoaded] = useFonts({
    Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf")
  })

  if (!fontsLoaded) return null

  return (
    <KeyboardAvoidingView className="flex-1 bg-[#FFF9F0]" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View className="pt-4 px-4 pb-2 flex-row items-center bg-[#FFF9F0]" style={{ paddingTop: insets.top + 10 }}>
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#5E5E5E" />
        </Pressable>
        <Image source={{ uri: `${API_URL}/images/Thomas.jpg` }} className="w-10 h-10 rounded-full mr-3" />
        <Text className="text-lg font-semibold text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>
          Usuario {id_chat}
        </Text>
      </View>

      <FlatList
        data={mensajesMock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View className={`mb-3 max-w-[70%] rounded-xl px-4 py-2 ${item.propio ? "self-end bg-[#D1E7FF]" : "self-start bg-white"}`}>
            <Text className="text-[#333]" style={{ fontFamily: "Montserrat" }}>{item.texto}</Text>
          </View>
        )}
      />

      <View className="flex-row items-center px-4 py-3 border-t border-[#DDD] bg-white">
        <TextInput
          placeholder="Escribe un mensaje..."
          value={mensaje}
          onChangeText={setMensaje}
          className="flex-1 bg-[#F4F4F4] rounded-full px-4 py-2 text-[#333]"
          style={{ fontFamily: "Montserrat" }}
        />
        <Pressable className="ml-3" onPress={() => perro()}>
          <Ionicons name="send" size={24} color="#FFBD59" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}
