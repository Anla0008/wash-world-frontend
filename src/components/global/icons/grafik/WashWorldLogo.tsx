import Image from "next/image";

const WashWorldLogo = () => {
  return (
    <div className="flex justify-center">
      <Image
        src="/brand/logo_white.svg"
        alt="WashWorld logo"
        width={200}
        height={200}
      />
    </div>
  );
};

export default WashWorldLogo;
