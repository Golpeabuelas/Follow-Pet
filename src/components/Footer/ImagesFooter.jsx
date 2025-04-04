import Logo from '../../images/logo.png'
const Logos = Array(18).fill(Logo)
export default function ImagesFooter() {
    return(
        <div className="h-100px flex overflow-hidden justify-center items-center mx-[55px] my-0 border-solid border-black border-b-[3px]">
            {Logos.map(Logo => {
                return(
                    <img src={Logo} alt="Logo Follow Pet" className='w-[148px] h-[100px] grayscale opacity-[0.04]'/>
                )
            })}
        </div>
    )
}