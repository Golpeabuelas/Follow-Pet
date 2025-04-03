import { Link } from "react-router-dom";

export default function LinkFooter({ ruta, texto }) {
    return(
        <Link to={ruta} className="">
            {texto}
        </Link>
    )
}
