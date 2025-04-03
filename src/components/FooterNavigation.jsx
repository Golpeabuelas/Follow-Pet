import LinkItem from "./LinkItem"

export default function FooterNavigation({ titulo, textos }) {
    return(
        <div className="mx-0 my-[50px] flex items-start">
            <ul>
                <Tittle titulo={titulo}/>

                {textos.forEach(textoLink => {
                    <li className="text-white list-none no-underline mx-0 my-[7px] text-pretty font-thin"><LinkItem texto={textoLink}/></li>
                })}               
            </ul>
        </div>
    )
}

function Tittle({ titulo }) {
    return(
        <li className="text-[#A1EDB8] font-semibold mx-0 my-[10px] list-none">{titulo}</li>
    )
}