import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function RegistroScreen({ navigation }) {
  const [i_uri, setIUri] = useState(null);
  const [n_usuario, setNUsuario] = useState("");
  const [c_correo, setCCorreo] = useState("");
  const [c_contrasena, setCContrasena] = useState("");
  const [c_confirmar, setCConfirmar] = useState("");
  const [b_contrasenaVisible, setBContrasenaVisible] = useState(false);
  const [b_confirmarVisible, setBConfirmarVisible] = useState(false);
  const [t_error, setTError] = useState("");
  const [s_valor] = useState(new Animated.Value(1));
  const [a_opacidad] = useState(new Animated.Value(0));
  const [a_desplazamiento] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.timing(a_opacidad, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(a_desplazamiento, {
      toValue: 0,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  const i_selecciona = async () => {
    const r_resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!r_resultado.canceled) {
      setIUri(r_resultado.assets[0].uri);
    }
  };

  const v_validaCampos = () => {
    if (!n_usuario.match(/^[a-zA-Z0-9_]+$/)) {
      setTError("El nombre de usuario solo debe contener letras, números y guiones bajos.");
      return false;
    }

    
    const r_correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!r_correo.test(c_correo)) {
      setTError("Por favor ingresa un correo válido.");
      return false;
    }

    
    if (c_contrasena !== c_confirmar) {
      setTError("Las contraseñas no coinciden.");
      return false;
    }

    
    if (c_contrasena.length < 6) {
      setTError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    setTError(""); 
    return true;
  };

  const b_registrar = () => {
    if (v_validaCampos()) {
      navigation.navigate("InicioS_Screen");
    }
  };

  const s_presiona = () => {
    Animated.spring(s_valor, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const s_libera = () => {
    Animated.spring(s_valor, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.v_contenedor,
        {
          opacity: a_opacidad,
          transform: [{ translateY: a_desplazamiento }],
        },
      ]}
    >
      <View style={styles.v_cabecera}>
        <Image source={require("../assets/icon.png")} style={styles.i_logo} />
        <Text style={styles.t_titulo}>PET-LY</Text>
        <Text style={styles.t_subtitulo}>SOCIAL MEDIA</Text>
      </View>

      <View style={styles.v_formulario}>
        <TouchableOpacity style={styles.t_imagen} onPress={i_selecciona}>
          {i_uri ? (
            <Image source={{ uri: i_uri }} style={styles.i_perfil} />
          ) : (
            <View style={styles.v_imagen}>
              <Text style={styles.t_imagenTexto}>Foto de perfil</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.ti_entrada}
          placeholder="Nombre de usuario"
          placeholderTextColor="#A4A4A4"
          value={n_usuario}
          onChangeText={setNUsuario}
        />
        <TextInput
          style={styles.ti_entrada}
          placeholder="Correo electrónico"
          placeholderTextColor="#A4A4A4"
          keyboardType="email-address"
          value={c_correo}
          onChangeText={setCCorreo}
        />
        <View style={styles.v_contrasena}>
          <TextInput
            style={styles.ti_entrada}
            placeholder="Contraseña"
            placeholderTextColor="#A4A4A4"
            secureTextEntry={!b_contrasenaVisible}
            value={c_contrasena}
            onChangeText={setCContrasena}
          />
          <TouchableOpacity
            onPress={() => setBContrasenaVisible(!b_contrasenaVisible)}
          >
            <Text style={styles.t_verTexto}>
              {b_contrasenaVisible ? "Ocultar" : "Mostrar"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.v_contrasena}>
          <TextInput
            style={styles.ti_entrada}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#A4A4A4"
            secureTextEntry={!b_confirmarVisible}
            value={c_confirmar}
            onChangeText={setCConfirmar}
          />
          <TouchableOpacity
            onPress={() => setBConfirmarVisible(!b_confirmarVisible)}
          >
            <Text style={styles.t_verTexto}>
              {b_confirmarVisible ? "Ocultar" : "Mostrar"}
            </Text>
          </TouchableOpacity>
        </View>

        {t_error ? <Text style={styles.t_error}>{t_error}</Text> : null}

        <Animated.View style={{ transform: [{ scale: s_valor }] }}>
          <TouchableOpacity
            style={styles.t_boton}
            onPressIn={s_presiona}
            onPressOut={s_libera}
            onPress={b_registrar}
          >
            <Text style={styles.t_botonTexto}>Registrarse</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.v_pie}>
        <Text style={styles.t_pieTexto}>
          ¿Ya tienes cuenta? <Text style={styles.t_pieEnlace}>Inicia sesión</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  v_contenedor: {
    flex: 1,
    backgroundColor: "#F4F8FB",
    justifyContent: "space-between",
    padding: 20,
  },
  v_cabecera: {
    alignItems: "center",
    marginTop: 40,
  },
  i_logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  t_titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#F39200",
  },
  t_subtitulo: {
    fontSize: 16,
    color: "#7B8C98",
  },
  v_formulario: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
  t_imagen: {
    alignItems: "center",
    marginBottom: 20,
  },
  v_imagen: {
    width: 100,
    height: 100,
    backgroundColor: "#D9E5F2",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  i_perfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  t_imagenTexto: {
    color: "#7B8C98",
    fontSize: 14,
  },
  ti_entrada: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  t_boton: {
    backgroundColor: "#F39200",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  t_botonTexto: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  v_pie: {
    alignItems: "center",
    marginBottom: 20,
  },
  t_pieTexto: {
    fontSize: 14,
    color: "#7B8C98",
  },
  t_pieEnlace: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  t_error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  v_contrasena: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  t_verTexto: {
    color: "#4A90E2",
    fontSize: 14,
    marginRight: 10,
  },
});