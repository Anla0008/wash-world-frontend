import ProfileInfoCard from "./ProfileInfoCard";
import PrimaryButton from "../global/buttons/onClick/PrimaryButton";

const ProfileInfoWrapper = () => {
  return (
    <section className="bg-(--gray-80) px-4 py-4 flex flex-col gap-5 rounded-md">
      <h3 className="extra-bold">Opdater oplysninger</h3>

      <ProfileInfoCard section={"profile"} />

      <div className="border-t-2 border-(--gray-60) pt-2">
        <h4 className="extra-bold pb-3">Kortoplysninger</h4>

        <ProfileInfoCard section={"payment"} />

        <button
          // TODO: sørg for onclick mapper dette card under sig selv
          className="text-sm py-2 flex justify-center text-foreground/70 light"
        >
          + Tilføj kort
        </button>
      </div>
      {/* TODO: gør denne knap disabled indtil der er foretaget en ændring i et af inputfelterne */}
      <PrimaryButton>Gem opdatering</PrimaryButton>
    </section>
  );
};

export default ProfileInfoWrapper;
