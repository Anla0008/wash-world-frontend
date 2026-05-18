"use client";
import { useWash } from "@/hooks/useWash";
import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import { useRouter } from "next/navigation";

export default function SingleWash() {
  const { useSingleWash } = useWash();
  const { postAvailableWashHall } = useWash();
  const { data } = useSingleWash();
  const router = useRouter();

  if (!data) {
    return <p>Loading...</p>;
  }

  const handleClick = () => {
    postAvailableWashHall(data.types[0].name);
    router.push("/waitingLine");
  }

  return (
    <ul className="flex flex-col gap-5">
      {data.types.map((wash) => (
        <li className="flex flex-col gap-5 bg-(--gray-80) rounded-lg p-4" key={wash.name}>

        <div className="flex justify-between items-center">
        <div>
          <h2 className="extra-bold">{wash.name}</h2>
            <p>{wash.description}</p>
        </div>

          <div className="div flex gap-2 items-baseline extra-bold">
            <h1>{wash.price}</h1>
            <span>kr.</span>
          </div>
        </div>
     
        <div className="flex w-full items-center justify-end gap-5">
            <a className="underline" href="/">Læs mere</a>
            <PrimaryButton onClick={() => handleClick()}>Vælg</PrimaryButton>
        </div>

        </li>
      ))}
    </ul>
  );
}