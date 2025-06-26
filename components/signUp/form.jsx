import { Dimensions, Image, Modal, Pressable, Text, TextInput, View, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { UserIcon, CameraIcon, UbiIcon } from "../icons";
import Logo from "../../assets/images/logo.png";
import ModalMaps from "./modalMaps";

import { API_URL, uploadImages } from "../../consts.js";
import TermsScreen from "../../app/terms.js";

const width = Dimensions.get("window").width;

export default function Form({ role }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [termsVisible, setTermsVisible] = useState(false);
    const [modalTermsVisible, setModalTermsVisible] = useState(false)

    const [modalVerificationVisible, setModalVerificationVisible] = useState(false);
    const [verificationCode, setVerificationCode] = useState(null);
    const [inputCode, setInputCode] = useState(0);

    const [location, setLocation] = useState(null);

    const [fontsLoaded] = useFonts({
        Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
        MontserratLight: require("../../assets/fonts/Montserrat-Light.ttf"),
    });

    const handleVisModal = () => {
        setModalTermsVisible(false)
    }

    const handleLocationSelected = (coords) => {
        setLocation(coords);
        setModalVisible(false);
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = async () => {
        if (!email.trim() || !validateEmail(email)) {
            setErrorMessage("Introduce un correo electrónico válido.");
            return;
        }

        if (!username.trim()) {
            setErrorMessage("Introduce un nombre de usuario.");
            return;
        }

        if (!password || password.length < 6) {
            setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("La confirmación no coincide con la contraseña.");
            return;
        }

        if ( !location ) {
            setErrorMessage("Es necesario seleccionar una ubicación.");
            return;
        }

        if (!selectedImage) {
            setErrorMessage("Es necesario seleccionar una imagen de perfil.");
            return;
        }

        const emailResponse = await fetch(`${API_URL}/verify-email-already-used/${email}`);
        const emailData = await emailResponse.json();
        if (emailData.status === 403) {
            setErrorMessage("El correo ya está en uso.");
            return;
        }

        const usernameResponse = await fetch(`${API_URL}/verify-user-already-used/${username}`);
        const usernameData = await usernameResponse.json();
        if (usernameData.status === 403) {
            setErrorMessage("El nombre de usuario ya está en uso.");
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/send-authentication-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.status === 200) {
                setVerificationCode(data.code);
                setTermsVisible(true);
            } else {
                setErrorMessage("Error enviando el código de verificación.");
            }
        } catch (error) {
            setErrorMessage("Error de conexión.");
        }
    };

    const acceptTerms = () => {
        setTermsVisible(false);
        setModalVerificationVisible(true);
    };

    const handleVerifyCodeAndRegister = async () => {
        if (parseInt(inputCode, 10) !== verificationCode) {
            setErrorMessage("El código de verificación no es correcto.");
            return;
        }

        if (verificationCode === null) {
            setErrorMessage("Error con el código de verificación.");
            return;
        }
        try {
            const imagePath = await uploadImages(selectedImage); 

            if (!imagePath) {
                setErrorMessage("No se pudo subir la imagen.");
                return;
            }

            const registerResponse = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_usuario: username,
                    correo_usuario: email,
                    contraseña_usuario: password,
                    foto_usuario: imagePath,
                    latitud: location.latitude,
                    longitud: location.longitude,
                    id_rol: role
                }),
            });

            const registerData = await registerResponse.json();

            if (registerData.status === 201) {
                setErrorMessage("");
                alert("Registro exitoso");
            } else {
                setErrorMessage(registerData.error || "Error en el registro.");
            }
        } catch (error) {
            setErrorMessage("Error de conexión o del servidor.");
        }
    };

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            setErrorMessage("Permiso denegado para acceder a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets?.[0]?.uri || result.uri);
        }
    };

    if (!fontsLoaded) return null;

    return (
        <View className="w-full h-full bg-[#E9E9E9] flex">
            <Image source={Logo} className="w-[40%] h-[14.3%] object-cover mb-[18%]" resizeMode="contain" />

            <View className="w-full flex-row items-center">
                <View className="w-[54.44%]">
                    <TextInput
                        value={email}
                        onChangeText={(text) => { setEmail(text); setErrorMessage(""); }}
                        style={{ width: width * 0.4427, marginLeft: width * 0.1017, fontFamily: "MontserratLight", fontSize: 16 }}
                        className="bg-[#D9D9D9] rounded-[5px] pl-4 mb-7 border-[#8C8888] border-[0.5px]"
                        placeholder="Correo electrónico"
                        placeholderTextColor="#788384"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={username}
                        onChangeText={(text) => { setUsername(text); setErrorMessage(""); }}
                        style={{ width: width * 0.4427, marginLeft: width * 0.1017, fontFamily: "MontserratLight", fontSize: 16 }}
                        className="bg-[#D9D9D9] rounded-[5px] pl-4 mb-7 border-[#8C8888] border-[0.5px]"
                        placeholder="Usuario"
                        placeholderTextColor="#788384"
                    />
                </View>

                <View className="w-[45.56%] pb-5 flex items-center justify-center">
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: 108, height: 108, borderRadius: 54 }}
                        />
                    ) : (
                        <UserIcon size={108} color="#AAAAAA" />
                    )}
                </View>
            </View>

            <TextInput
                value={password}
                onChangeText={(text) => { setPassword(text); setErrorMessage(""); }}
                style={{ fontFamily: "MontserratLight", fontSize: 16 }}
                className="w-[80%] h-[5%] bg-[#D9D9D9] rounded-[5px] ml-[10.17%] pl-4 mb-7 border-[#8C8888] border-[0.5px]"
                placeholder="Contraseña"
                placeholderTextColor="#788384"
                secureTextEntry={true}
            />
            <TextInput
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); setErrorMessage(""); }}
                style={{ fontFamily: "MontserratLight", fontSize: 16 }}
                className="w-[80%] h-[5%] bg-[#D9D9D9] rounded-[5px] ml-[10.17%] pl-4 mb-10 border-[#8C8888] border-[0.5px]"
                placeholder="Confirmar contraseña"
                placeholderTextColor="#788384"
                secureTextEntry={true}
            />

            <View className="flex-row w-full justify-between items-center px-[25%]">
                <Pressable className="items-center justify-center mb-4" onPress={() => setModalVisible(true)}>
                    <UbiIcon size={64} color="#AAAAAA" />
                </Pressable>
                <Pressable className="items-center justify-center mb-4" onPress={openImagePicker}>
                    <CameraIcon size={64} color="#AAAAAA" />
                </Pressable>
            </View>

            {errorMessage !== "" && (
                <View className="w-full items-center mb-4">
                    <Text style={{ fontFamily: "MontserratLight" }} className="text-[#C0392B] text-[14px] text-center">
                        {errorMessage}
                    </Text>
                </View>
            )}

            <Pressable
                className="w-[80%] h-[5%] bg-[#788384] rounded-[5px] ml-[10.17%] items-center justify-center mt-4"
                onPress={handleRegister}
            >
                <Text style={{ fontFamily: "MontserratLight" }} className="text-[#E9E9E9] text-[22px]">Correo de confirmación</Text>
            </Pressable>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <ModalMaps onLocationSelected={handleLocationSelected} />
                </View>
            </Modal>

            <Modal visible={termsVisible} transparent={true} animationType="slide">
                <View className="flex-1 bg-black/40 justify-center items-center px-6">
                    <View className="bg-white rounded-lg p-6 w-full max-w-md">
                        <Text style={{ fontFamily: "Montserrat" }} className="text-lg mb-4 text-center">
                            ¿Aceptas los términos y condiciones de uso?
                        </Text>
                         <Pressable
                            onPress={() => setModalTermsVisible(true)}
                            className="bg-[#AAAAAA] rounded-[5px] py-2 mb-3"
                        >
                            <Text style={{ fontFamily: "MontserratLight", color: "#fff", textAlign: "center", fontSize: 16 }}>
                                Ver términos y condiciones
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={acceptTerms}
                            className="bg-[#788384] rounded-[5px] py-3 mb-2"
                        >
                            <Text style={{ fontFamily: "Montserrat", color: "#E9E9E9", textAlign: "center", fontSize: 16 }}>
                                Aceptar
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setTermsVisible(false)}
                        >
                            <Text style={{ fontFamily: "MontserratLight", color: "#788384", textAlign: "center", fontSize: 16 }}>
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalTermsVisible} transparent={true} animationType="slide">
                <TermsScreen onPress={handleVisModal}/>
            </Modal>

            <Modal visible={modalVerificationVisible} transparent={true} animationType="slide">
                <View className="flex-1 bg-black/40 justify-center items-center px-6">
                    <View className="bg-white rounded-lg p-6 w-full max-w-md">
                        <Text style={{ fontFamily: "Montserrat" }} className="text-lg mb-4 text-center">
                            Ingresa el código enviado a tu correo
                        </Text>
                        <TextInput
                            value={verificationCode}
                            style={{ fontFamily: "MontserratLight", fontSize: 16, borderColor: '#ccc', borderWidth: 1, padding: 8, borderRadius: 4, marginBottom: 12 }}
                            onChangeText={(text) => setInputCode(text)}
                            placeholder="Código de verificación"
                            keyboardType="numeric"
                            maxLength={6}
                        />
                        <Pressable
                            onPress={handleVerifyCodeAndRegister}
                            className="bg-[#788384] rounded-[5px] py-3"
                        >
                            <Text style={{ fontFamily: "Montserrat", color: "#E9E9E9", textAlign: "center", fontSize: 16 }}>
                                Verificar y Registrar
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setModalVerificationVisible(false)}
                            className="mt-3"
                        >
                            <Text style={{ fontFamily: "MontserratLight", color: "#788384", textAlign: "center", fontSize: 16 }}>
                                Cancelar
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
