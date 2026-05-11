import NavArrowRight from "../global/icons/navigation/NavArrowRight";

const MinProfilCard = () => {
    return (
    <div className="bg-foreground flex flex-col gap-5 px-5 py-3 min-w-100 rounded-md text-background">
        <h3 className="extra-bold">Min profil</h3>
        <div className="flex flex-col gap-2">
            <a href="/profil" className="flex justify-between">
                <span>Profiloplysninger</span>
                <NavArrowRight size={30} />
            </a>
            <a href="/vaskehistorik" className="flex justify-between">
                <span>Vaskehistorik</span>
                <NavArrowRight size={30} />
            </a>
        </div>
    </div> );
}
 
export default MinProfilCard;