import { View, Text, Image, ScrollView, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"

import { API_URL } from "../../consts"

const publicacionesMock = [
  { id: "1", nombre: "Toby", status: 1, imagen: `${API_URL}/images/Thomas.jpg` },
  { id: "2", nombre: "Milo", status: 2, imagen: `${API_URL}/images/Michi.png` },
  { id: "3", nombre: "Promo clínica", status: 3, imagen: "https://placekitten.com/200/200" }
]

const filtrosDisponibles = ["Sin filtros", "Reportes", "Perdidos", "Encontrados", "Veterinarios", "Antiguos", "Recientes"]

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf")
  })
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("Sin filtros")

  if (!fontsLoaded) return null

  const publicacionesFiltradas = publicacionesMock.filter((p) => {
    if (filtroSeleccionado === "Sin filtros") return p.status !== 0
    if (filtroSeleccionado === "Perdidos") return p.status === 1
    if (filtroSeleccionado === "Encontrados") return p.status === 2
    if (filtroSeleccionado === "Veterinarios") return p.status === 3
    if (filtroSeleccionado === "Reportes") return p.status === 1 || p.status === 2
    return true
  })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }}>
      <View className="flex-row justify-between items-center px-6 pt-4">
        <Image source={require("../../assets/images/logo.png")} className="w-28 h-28" resizeMode="contain" />
        <Image source={{ uri: `${API_URL}/images/Thomas.jpg` }} className="w-20 h-20 rounded-full" />
      </View>

      <View className="px-6 mt-4">
        <TextInput placeholder="Buscar..." className="border-2 border-black rounded-xl px-4 py-2 bg-white text-[#444]" style={{ fontFamily: "Montserrat" }} />
      </View>

      <View className="mt-6 px-6">
        <FlatList
          data={filtrosDisponibles}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item }) => {
            const activo = filtroSeleccionado === item
            return (
              <Pressable
                onPress={() => setFiltroSeleccionado(item)}
                className={`h-8 px-3 py-1 rounded-full justify-center ${activo ? "bg-[#FFBD59]" : "bg-[#444]"}`}
              >
                <Text className={`text-s ${activo ? "text-black" : "text-white"}`} style={{ fontFamily: "Montserrat" }}>
                  {item}
                </Text>
              </Pressable>
            )
          }}
        />
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {publicacionesFiltradas.map((pub) => (
          <View key={pub.id} className="bg-white p-4 rounded-2xl mb-4 shadow-md">
            <Image source={{ uri: pub.imagen }} className="w-full h-40 rounded-xl mb-3 content" />
            <Text className="text-base font-bold text-[#444]" style={{ fontFamily: "Montserrat" }}>
              {pub.titulo}
            </Text>
            <Text className="text-sm text-[#999]" style={{ fontFamily: "Montserrat" }}>
              Tipo: {pub.tipo}
            </Text>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
