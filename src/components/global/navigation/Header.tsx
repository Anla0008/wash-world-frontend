import { PointProps } from "@/types/point";

const Header = ({ points }: PointProps) => {
  return (
    <header className="bg-transparent p-5 flex justify-end sticky top-0 z-100">
      <p className="extra-bold bg-background/20 backdrop-blur-lg p-3 rounded-full text-(--brand-green)">
        {points} point
      </p>
    </header>
  );
};

export default Header;
