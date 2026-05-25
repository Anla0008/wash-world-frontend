import NavArrowRight from "../global/icons/navigation/NavArrowRight";
import Link from "next/link";

const MyProfileCard = () => {
  return (
    <div className="bg-(--gray-10) flex flex-col gap-5 px-5 py-3 rounded-md text-(--foreground-reverse)">
      <h3 className="extra-bold">Min profil</h3>
      <div className="flex flex-col gap-2">
        <Link href={"/profile-information"} className="flex justify-between">
          <span>Profiloplysninger</span>
          <NavArrowRight size={30} />
        </Link>

        <Link href={"/wash-history"} className="flex justify-between">
          <span>Vaskehistorik</span>
          <NavArrowRight size={30} />
        </Link>
      </div>
    </div>
  );
};

export default MyProfileCard;
