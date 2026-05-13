"use client";

import useEmblaCarousel from "embla-carousel-react";
import ArrowLeft from "../global/icons/navigation/ArrowLeft";
import ArrowRight from "../global/icons/navigation/ArrowRight";
import Validated from "../global/icons/validation/Validated";
import Error from "../global/icons/validation/Error";

const TravlhedGraf = ({ status }: { status: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start", // TODO: start ved aktuelle time
  });

  const getColor = () => {
    switch (status) {
      case "travl":
        return "var(--error-red)";
      case "moderat":
        return "yellow";
      case "rolig":
        return "var(--brand-green)";
      default:
        return "transparent";
    }
  };

  const color = getColor();

  const borderColor =
    color !== "transparent"
      ? `color-mix(in srgb, ${color} 70%, black)`
      : "var(--gray-60)";

  // TODO: vis det aktuelle tidspunkt ud fra localeDateTime + en math.random af både status og højde
  const bars = [
    { height: 10, time: "08:00" },
    { height: 70, time: "09:00" },
    { height: 100, status, time: "Nu" }, // den aktuelle time får en status og en "Nu" label
    { height: 30, time: "10:00" },
    { height: 50, time: "11:00" },
    { height: 80, time: "12:00" },
    { height: 20, time: "13:00" },
    { height: 90, time: "14:00" },
    { height: 50, time: "15:00" },
    { height: 80, time: "16:00" },
    { height: 20, time: "17:00" },
    { height: 90, time: "18:00" },
    { height: 50, time: "19:00" },
    { height: 80, time: "20:00" },
    { height: 20, time: "21:00" },
    { height: 90, time: "22:00" },
    { height: 50, time: "23:00" },
    { height: 80, time: "00:00" },
    { height: 20, time: "01:00" },
    { height: 90, time: "02:00" },
    { height: 50, time: "03:00" },
    { height: 80, time: "04:00" },
    { height: 20, time: "05:00" },
    { height: 90, time: "06:00" },
    { height: 50, time: "07:00" },
  ];

  return (
    <div className="flex items-center border-b-2 border-(--gray-60) gap-4 w-full">
      {/* VENSTRE */}
      <button onClick={() => emblaApi?.scrollPrev()}>
        <ArrowLeft size={30} color={"var(--gray-60)"} />
      </button>

      {/* KARRUSEL */}
      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex items-end gap-2 px-10">
          {bars.map((bar, index) => {
            const isStatusBar = !!bar.status;

            return (
              <div
                key={index}
                className="flex-[0_0_auto] flex flex-col items-center justify-end"
              >
                {isStatusBar && (
                  <div className="flex gap-1 pb-1 items-center">
                    <span style={{ color }}>{bar.status}</span>
                    {bar.status === "travl" ? (
                      <Error />
                    ) : bar.status === "rolig" ? (
                      <Validated />
                    ) : null}
                  </div>
                )}

                <div
                  className="w-10 border-t-5 border-l-5 border-r-5"
                  style={{
                    minHeight: `${bar.height}px`,
                    backgroundColor: isStatusBar ? color : "transparent",
                    borderColor: isStatusBar ? borderColor : "var(--gray-60)",
                  }}
                />
                <span className="text-sm py-2">{bar.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HØJRE */}
      <button onClick={() => emblaApi?.scrollNext()}>
        <ArrowRight size={30} color={"var(--gray-60)"} />
      </button>
    </div>
  );
};

export default TravlhedGraf;
