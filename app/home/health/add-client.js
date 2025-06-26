import React, { useState } from "react"
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../../../consts"

export default function AddClientScreen() {
    const insets = useSafeAreaInsets()

    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../../assets/fonts/Montserrat-Regular.ttf"),
    })
    if (!fontsLoaded) return null

    const validarEmail = (email) => {
        const re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    const handleAgregarCliente = async () => {
        setError("")
        if (!nombre.trim() || !correo.trim()) {
            setError("Por favor completa todos los campos.")
            return
        }
        if (!validarEmail(correo)) {
            setError("Correo electrónico inválido.")
            return
        }

        setLoading(true)

        try {
            const token = await AsyncStorage.getItem("userToken")
            const res = await fetch(`${API_URL}/send-client-request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre_usuario: nombre, correo_usuario: correo, token }),
            })
            const data = await res.json()

            if (res.ok && data.status === 200) {
                setNombre("")
                setCorreo("")
            } else {
                setError(data.error || "No se pudo agregar el cliente.")
            }
        } catch (error) {
            setError("Error en la conexión.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#FFF9F0]" style={{ paddingTop: insets.top }} >
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-2xl font-bold mb-6 text-center text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>Agregar Cliente</Text>

                {error !== "" && (
                    <Text className="text-red-600 text-center mb-4">{error}</Text>
                )}

                <Text className="mb-1 text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>Nombre de usuario</Text>
                <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre completo" className="bg-white rounded-xl px-4 py-3 mb-6 border border-[#ccc] text-[#333]" style={{ fontFamily: "Montserrat" }} />

                <Text className="mb-1 text-[#5E5E5E]" style={{ fontFamily: "Montserrat" }}>Correo electrónico</Text>
                <TextInput value={correo} onChangeText={setCorreo} placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" className="bg-white rounded-xl px-4 py-3 mb-8 border border-[#ccc] text-[#333]" style={{ fontFamily: "Montserrat" }} />

                <Pressable onPress={handleAgregarCliente} disabled={loading} className={`bg-[#FFBD59] py-4 rounded-xl items-center ${loading ? "opacity-70" : "opacity-100"}`} >
                    <Text className="font-bold text-black text-lg" style={{ fontFamily: "Montserrat" }}>
                        {loading ? "Guardando..." : "Agregar Cliente"}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
