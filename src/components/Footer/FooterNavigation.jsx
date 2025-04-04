import LinkItem from "./LinkItem"

export default function FooterNavigation({ titulo, textos, estilos }) {
    return(
        <div className="mx-0 my-[50px] flex items-start">
            <ul>
                <Tittle titulo={titulo}/>

                {textos.map(textoLink => {
                    return(<li className={estilos}><LinkItem texto={textoLink}/></li>)
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