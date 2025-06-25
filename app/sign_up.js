import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import RoleSelection from "../components/signUp/roleSelection";
import Form from "../components/signUp/form";
import ModalMaps from "../components/signUp/modalMaps";
import MapView from "react-native-maps";
export default function SignUp() {  
    const [rolePicked, setRolePicked] = useState(null)

    return (
        <SafeAreaView>
            {rolePicked ? 
                <Form role={rolePicked}/> : <RoleSelection funchon={setRolePicked}/>
            }
        </SafeAreaView>
    )
}