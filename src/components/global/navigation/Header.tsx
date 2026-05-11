import { PointProps } from "@/types/point";

const Header = ({ points }: PointProps) => {
    return ( 
        <header className="bg-transparent p-5 fixed top-0 left-0 right-0 z-100 flex justify-end">
            <p className="extra-bold bg-background/20 backdrop-blur-lg p-3 rounded-full text-(--brand-green)">{points} point</p>
        </header>
     );
}
 
export default Header;