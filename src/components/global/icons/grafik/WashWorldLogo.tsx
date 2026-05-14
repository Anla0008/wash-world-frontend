import Image from "next/image";

const WashWorldLogo = () => {
  return (
    <div className="flex justify-center">
      <Image
        src="/brand/logo_white.svg"
        alt="WashWorld logo"
        width={200}
        height={100}
        style={{ width: 200, height: 100 }}
        loading="eager"
      />
    </div>
  );
};

export default WashWorldLogo;
