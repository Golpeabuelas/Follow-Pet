import { Link } from "react-router-dom";

export default function LinkItem({ ruta, texto }) {
    return(
        <Link to={ruta}>
            {texto}
        </Link>
    )
}
