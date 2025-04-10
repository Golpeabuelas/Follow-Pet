import { FontAwesome6 } from "@expo/vector-icons"

export function AddUserIcon({ size, color }) {
    return (
        <FontAwesome6 name="user-plus" color={ color == null ? "#D9D1C8" : color } size={size}/>
    )
}

export function UserIcon({ size, color }) {
    return(
        <FontAwesome6 name="user-large" color={ color == null ? "#D9D1C8" : color } size={size}/>
    )
}