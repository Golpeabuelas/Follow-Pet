import React, { useEffect, useState } from "react"
import { View, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import VetHealthScreen from "../../components/health/healthVet"
import UserHealthScreen from "../../components/health/healthUser"
import LoadingScreen from "../../components/loadingScreen"
import { API_URL } from "../../consts"

export default function HealthScreen() {
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState(null)

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken")
                if (!token) {
                    setRole(null)
                    setLoading(false)
                    return
                }

                const response = await fetch(`${API_URL}/get-user-detail/${token}`)
                const data = await response.json()

                if (data.status === 200) {
                    setRole(data.usuario.rol)
                } else {
                    setRole(null)
                }
            } catch (error) {
                console.error("Error fetching user detail:", error)
                setRole(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUserRole()
    }, [])

    if (loading) {
        return (
            <LoadingScreen/>
        )
    }

    if (role === "Veterinario") {
        return <VetHealthScreen />
    }

    return <UserHealthScreen />
}
