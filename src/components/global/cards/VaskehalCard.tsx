import Link from "next/link";
import Image from "next/image";
import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";

// Værdierne her skal senere hentes dynamisk fra car_wash_locations db tabel

const VaskehalCard = ({
  city,
  address,
  openingHours,
  status,
  image,
  href,
}: VaskehalCardProps) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <article className="col-span-2 relative flex gap-3 p-3 bg-(--gray-5) text-(--foreground-reverse) rounded-md">
      <Image
        src={image}
        alt={`WashWorld ${city}`}
        width={110}
        height={170}
        className="rounded-md object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start gap-4">
          <h3 className="extra-bold">{city}</h3>

          <div className="ml-auto flex items-center gap-2">
            <p>{status}</p>
            <span className="w-3 h-3 rounded-full bg-(--brand-green)"></span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p>{openingHours}</p>
          <p>{address}</p>
        </div>

        <div className="flex items-center gap-8">
          <Link href={href} className="underline">
            Læs mere
          </Link>

          <div className="ml-auto">
            <PrimaryButtonAnchorTag href={googleMapsUrl} target="_blank">
              Vis vej
            </PrimaryButtonAnchorTag>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VaskehalCard;
