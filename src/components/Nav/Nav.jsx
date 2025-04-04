export default function Nav() {
    return(
        <nav>

        </nav>
    )
}

/* 
    <nav class="navbar">
        <input type="checkbox" id="toggle-navbar" class="navbar__checkbox">
        <label for="toggle-navbar" class="navbar__image">
            <img src="/imagenes/logo.png" alt="Logo">
        </label>
        <div class="navbar__menu">
            <div class="navbar__buscador">
                <input type="text" class="navbar__buscador--input" placeholder="Buscar...">
            </div>
            <div class="navbar__link"><a href="/html/paginaprincipal.html">Inicio</a></div>
            <div class="navbar__link"><a href="/html/hacerReporte.html">Crear un reporte</a></div>
            <div class="navbar__link"><a href="/html/index.html">Salud</a></div>
            <div class="nabvar__link--img">
                <a href="/verperfil"><img src="/imagenes/AxelPendejo.jpg" alt="Perfil"></a>
            </div>
        </div>
    </nav>
    
.navbar {
    width: 100dvw;
    height: 13dvh;
    background-color: var(--naranja);
    display: flex;
    justify-content: space-around;
    align-items: center;
    filter: drop-shadow(0 4px 10px #0005);
    position: sticky;
    top: 0;
    z-index: 30;
    animation: aparecer 0.4s ease-in-out forwards;
}

.navbar__image img {
    width: 6dvw;        
    height: auto;        
    filter: drop-shadow(0 4px 10px #0005);
    cursor: pointer;
    position: relative;
}

.navbar__buscador {
    width: 42dvw;
}

.navbar__buscador > input {
    width: 100%;
    margin: 2px;
    border-radius: 20px;
    padding: 5px 10px;
    font-family: 'Montserrat';
    height: 4.8dvh;
}

.navbar__link > a {
    text-decoration: none;
    color: #000;
    font-weight: 600;
    font-size: clamp(0.8rem,1vw,2vw);
}

.navbar__link:hover {
    text-decoration: underline; 
}

.nabvar__link--img {
    background-color: white;
    width: 4vw;
    height: 4vw;
    clip-path: circle(50% at 50% 50%);
    outline: 5px solid #FD9800;
    cursor: pointer;
}

.nabvar__link--img img {
    width: 4vw;
    height: 4vw;
    cursor: pointer;
    border-radius: 50%;    
    object-fit: cover;    
    z-index: 1;
    object-fit: cover; 
}

.nabvar__link--img:hover {
    opacity: 0.8;
}

.navbar__checkbox {
    display: none; 
}

.navbar__menu{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 90%;
}
*/