import Image from "next/image";

const WashWorldLogo = () => {
  return (
    <div className="flex justify-center">
      <Image src="/brand/logo_white.svg" alt="WashWorld logo" width={200} height={100} style={{ width: 200, height: 100 }} className="hidden dark:block" loading="eager" />
      <Image src="/brand/logo_black.png" alt="WashWorld logo" width={200} height={100} style={{ width: 200, height: 100 }} className="dark:hidden" loading="eager" />
    </div>
  );
};

export default WashWorldLogo;
