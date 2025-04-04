import ImagesFooter from "./ImagesFooter"
import FooterNavigation from "./FooterNavigation"
import Logo from "../../images/logo.png"

export default function Footer() {
    return (
            <footer className="w-dvw h-fit bg-[#032B30]">
                <ImagesFooter/>
                <div className="w-full grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] justify-items-center items-center gap-[20px]">
                    <img src={Logo} alt="Logo Follow Pet" className="w-[clamp(2vw,12vw,15vw)] h-auto grayscale" />

                    <div className="my-[50px]">
                        <FooterNavigation titulo={'Follow Pet'} textos={['-Introducción', '-Características', '-¿Cómo funciona?', '-Aplicación Mobile']} estilos={"text-white list-none no-underline mx-0 my-[7px] text-pretty font-thin"}/>
                    </div>
                    
                    <div className="my-[50px]">
                        <FooterNavigation titulo={'Inicio'} textos={['-Inicio']} estilos={"text-white list-none no-underline mx-0 my-[7px] text-pretty font-thin"}/>
                        <FooterNavigation titulo={'Hacer un registro de una mascota:'} textos={['Perdida', 'Encontrada']} estilos={"text-white list-none no-underline my-[7px] text-pretty font-thin relative pl-[13px] ml-[10px] before:content-['■'] before:absolute before:left-[-2px] before:self-center before:text-[12px]"}/>
                    </div>

                    <div className="my-[50px]">
                        <FooterNavigation titulo={'Salud'} textos={['-Datos médicos', '-Próximas revisiones médicas']} estilos={"text-white list-none no-underline mx-0 my-[7px] text-pretty font-thin"}/>
                    </div>

                    <div className="my-[50px]">
                        <FooterNavigation titulo={'Perfil'} textos={['-Ver perfil', '-Modificar perfil', '-Modificar reportes']} estilos={"text-white list-none no-underline mx-0 my-[7px] text-pretty font-thin"}/>
                    </div>
                </div>

                <div className="text-[#FFFFFF] font-black my-[10px] mx-0 w-full height-[20dvh] flex justify-center items-center py-[53px] px-0">Copyright © 2024<span className="text-[#A1EDB8] my-0 mx-[3px]"> Traba Inc</span></div>
            </footer>
    )
}