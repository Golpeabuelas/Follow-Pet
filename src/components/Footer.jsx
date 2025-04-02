export default function Footer() {
    return (
        <>
            <footer className="w-">

            </footer>
        </>
    )
}


/*
footer {
    width: 100dvw;
    height: fit-content;
    background-color: var(--verde);
}

.footer__icons{
    height: 100px;
    display: flex;
    overflow-y: hidden;
    overflow-x: hidden;
    justify-content: space-between;
    align-items: center;
    margin: 0 55px;
    border-bottom: 3px solid black;
}

.footer__icons img{
    height: 71px;
    width: 100px;
    filter: grayscale(100%) opacity(0.04);
}

.footer__icon--white {
    width: clamp(2vw,12vw,15vw);  
    height: auto;       
    filter: grayscale(100%);
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

.footer__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
    justify-items: center;                                       
    align-items: center;                                         
    width: 100%;                                                 
    gap: 20px;                                                     
}

.footer__content > .footer__href{
    align-items: start;
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
    <div class="footer__icons">
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
        <img src="/imagenes/logo.png" alt="" class="footer__icon"/>
    </div>
    <div class="footer__content">
        <img src="/imagenes/logo.png" alt="" class="footer__icon--white"/>
            <div class="footer__href">
                <ul class="footer__links">
                    <li class="footer__links--itemtitle">Follow Pet</li>
                    <li class="footer__links--item"><a href="/index#introduccion">-Introducción</a></li>
                    <li class="footer__links--item"><a href="/index#caracteristicas">-Características</a></li>
                    <li class="footer__links--item"><a href="/index#comofunciona">-¿Cómo funciona?</a></li>
                    <li class="footer__links--item"><a href="/index#mobile">-Aplicación Mobile</a></li>
                </ul>
            </div>
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