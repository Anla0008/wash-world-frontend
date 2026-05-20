import { useEffect, useState } from "react";

export default function useWashHistory(license_fk: string) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:80/car-wash-history/${license_fk}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.car_wash_history))
      .catch((err) => console.error("Fetch fejl:", err));
  }, [license_fk]);

  return history;
}
