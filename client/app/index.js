
import "../global.css"
import { Text, View } from "react-native";
import Loading from "../components/loading";

export default function indexScreen () {
    return (
        <View className="w-100 h-full bg-red-500">
            <Loading/>
        </View>
    )
}
