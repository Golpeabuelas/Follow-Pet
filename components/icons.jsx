import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons"

export function AddUserIcon({ size, color }) {
    return (
        <FontAwesome6 name="user-plus" color={ color } size={size}/>
    )
}

export function UserIcon({ size, color }) {
    return(
        <FontAwesome6 name="user-large" color={ color } size={size}/>
    )
}

export function UbiIcon({ size, color }) {
    return(
        <MaterialCommunityIcons name="map-marker-radius-outline" color={ color } size={size}/>
    )
}

export function CameraIcon({ size, color }) {   
    return(
        <MaterialCommunityIcons name="camera-plus-outline" color={ color } size={ size }/>
    )
}

export function MessageIcon({ size, color }) {
    return(
        <Feather name="message-circle" color={ color } size={ size }/>
    )
}

export function ReportIcon({ size, color }) {
    return(
        <Feather name="alert-triangle" color={ color } size={ size }/>
    )
}

export function HealthIcon({ size, color }) {
    return(
        <Feather name="heart" color={ color } size={ size }/>
    )
}

export function ProfileIcon({ size, color }) {
    return(
        <Feather name="user" color={ color } size={ size }/>
    )
}

export function NotisIcon({ size, color }) {
    return(
        <Feather name="bell" color={ color } size={ size }/>
    )
}