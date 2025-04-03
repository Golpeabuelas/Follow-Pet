import ImagesFooter from "./ImagesFooter"
import Logo from "../images/logo.png"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <>
            <footer className="w-dvw h-fit bg-[#032B30]">
                <div className="h-100px flex overflow-hidden justify-center items-center mx-[55px] my-0 border-solid border-black border-b-3">
                    <ImagesFooter/>
                </div>
                <div className="w-[100%] grid grid-cols-[repeat(auto-fit, minmax(150px, 1fr))] justify-items-center items-center gap-[20px]">
                    <img src={Logo} alt="Logo Follow Pet" className="w-[width: clamp(2vw,12vw,15vw)] h-auto grayscale" />

                    <div className="mx-0 my-[50px] flex items-start">
                        
                    </div>
                </div>
            </footer>
        </>
    )
}



/*
<div class="footer__href">
    <ul class="footer__links">
        <li class="footer__links--itemtitle">Follow Pet</li>
        <li class="footer__links--item"><a href="/index#introduccion">-Introducción</a></li>
        <li class="footer__links--item"><a href="/index#caracteristicas">-Características</a></li>
        <li class="footer__links--item"><a href="/index#comofunciona">-¿Cómo funciona?</a></li>
        <li class="footer__links--item"><a href="/index#mobile">-Aplicación Mobile</a></li>
    </ul>
</div>

.footer__content > .footer__href{
    align-items: start;
}

.footer__href{
    margin: 50px 0;
    display: flex;
    align-items: start;
}

.footer__links--itemtitle {
    color: #A1EDB8;
    font-weight: 600;
    margin: 10px 0;
    list-style: none;
}

.footer__links--item > a{
    text-decoration: none;
    color: #fff;
    font-size: 0.9em;
    margin: 10px 2px;
    font-weight: 100;
}

.footer__links--item > a:hover{
    text-decoration: underline;
}


.footer__links--item{
    color: #fff;
    list-style: none;
    margin: 7px 0;
    text-wrap: pretty;
    font-weight: 100;
}

.footer__copyright{
    color: #fff;
    font-weight: 900;
    margin: 10px 0;
    width: 100%;
    height: 20dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 35px 0;
}

.footer__copyright span {
    color: #A1EDB8;
    margin: 0 3px;
}

.linkreporte {
    margin-left: 10px;
}

.linkreporte::before {
    content: '■';
    margin-left: 13px;
    font-size: 15px;
}

.wrapper__footerlinks {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    align-items: start;                  
    justify-items: center;               
    width: calc(75% - 116px);            
    gap: 20px; 
}
*/

/*
<footer>
    <div class="footer__content">
        <img src="/imagenes/logo.png" alt="" class="footer__icon--white"/>
            
            <div class="footer__href">
                <ul class="footer__links">
                    <li class="footer__links--itemtitle">Inicio</li>
                    <li class="footer__links--item"><a href="/pagprincipal">-Inicio</a></li>
                    <li class="footer__links--itemtitle">Hacer un registro de una mascota:</li>
                    <li class="footer__links--item linkreporte"><a href="/makereporte">Perdida</a></li>
                    <li class="footer__links--item linkreporte"><a href="/makereporte">Encontrada</a></li>
                </ul>
            </div>
            <div class="footer__href">
                <ul class="footer__links">
                    <li class="footer__links--itemtitle">Salud</li>
                    <li class="footer__links--item"><a href="/html/paginaprincipal.html">-Datos médicos</a></li>
                    <li class="footer__links--item"><a href="/html/paginaprincipal.html">-Próximas revisiones médicas.</a></li>
                </ul>
            </div>
            <div class="footer__href">
                <ul class="footer__links">
                    <li class="footer__links--itemtitle">Perfil</li>
                    <li class="footer__links--item"><a href="/html/verperfil.html">-Ver perfil</a></li>
                    <li class="footer__links--item"><a href="/html/verperfil.html">-Modificar perfil</a></li>
                    <li class="footer__links--item"><a href="/html/editarreportes.html">-Modificar reportes</a></li>
                </ul>
            </div>
    </div>
    <div class="footer__copyright">Copyright © 2024 <span class="footer__copyright--subrayado"> Traba Inc </span></div>
</footer>
*/