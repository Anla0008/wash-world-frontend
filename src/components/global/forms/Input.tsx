import Validated from "../icons/Validated";
import Error from "../icons/Error";


const Input = ({ label, error, validated, type, placeholder }) => {

    return ( 
        <div className="relative w-screen px-15 mt-10">

            <input className="border-3 border-foreground w-full py-2 px-6" type={type} placeholder={placeholder}/>

            <p className={`${error ? "text-(--error-red)" : validated ? "text-(--brand-green)" : ""} px-7 light`}></p>

                        {/* // styling for at give input 60 graders snit */}
            <div
                className="absolute bg-background -top-3 left-18 w-fit px-4"
                style={{
                    clipPath: "polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                }}
                > 
                
            <p className="light">{label}</p>
        </div>

        <div className="absolute top-2.5 right-18">
            {validated ? (<Validated />) : null}
            {error ? (<Error/>) : null}
        </div>

    </div>
    );
}
 
export default Input;