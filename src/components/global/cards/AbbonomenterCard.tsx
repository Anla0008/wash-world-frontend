import { div } from "framer-motion/client";
import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";

const AbbonomenterCard = () => {
  return (
    <section className="max-w-lg w-full flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar">
      {/* 1. card */}
      <article className="bg-(--gray-60) w-52 h-52 rounded-md flex flex-col items-center justify-center shrink-0">
        <p className="extra-bold mt-2">Guld</p>
        <div className="flex items-center gap-2">
          <h1 className="extra-bold">139</h1>
          <p>kr./md.</p>
        </div>
        <p className="pb-2">God og effektiv</p>
        <PrimaryButtonAnchorTag href="/">Læs mere</PrimaryButtonAnchorTag>
      </article>

      {/* 2. card */}
      <div className="relative shrink-0 overflow-visible">
        {/* Badge */}
        <div className="absolute -top-6 right-1 bg-(--splash) px-2 py-1 z-50">Populær!</div>

        <article className="relative bg-(--gray-60) w-52 h-52 rounded-md flex flex-col items-center justify-center shrink-0">
          <p className="extra-bold mt-2">Premium</p>
          <div className="flex items-center gap-2">
            <h1 className="extra-bold">169</h1>
            <p>kr./md.</p>
          </div>
          <p className="pb-2">Ekstra grundig</p>
          <PrimaryButtonAnchorTag href="/">Læs mere</PrimaryButtonAnchorTag>
        </article>
      </div>

      {/* 3. card */}
      <article className="bg-(--gray-60) w-52 h-52 rounded-md flex flex-col items-center justify-center shrink-0">
        <p className="extra-bold mt-2">Brilliant</p>
        <div className="flex items-center gap-2">
          <h1 className="extra-bold">199</h1>
          <p>kr./md.</p>
        </div>
        <p className="pb-2">Bedste vask året rundt</p>
        <PrimaryButtonAnchorTag href="/">Læs mere</PrimaryButtonAnchorTag>
      </article>
    </section>
  );
};

export default AbbonomenterCard;
