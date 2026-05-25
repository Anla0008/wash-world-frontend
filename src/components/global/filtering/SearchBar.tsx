// "use client";
// import { useState } from "react";
// import Search from "../icons/grafik/Search";

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div className="flex gap-2 m-auto items-center border-2 w-fit px-5 py-2 border-foreground">
//       <Search />
//       <input
//         type="text"
//         placeholder="Søg efter vaskehaller..."
//         value={searchTerm}
//         onChange={handleChange}
//       />
//     </div>
//   );
// };

// export default SearchBar;

"use client";

import Search from "../icons/grafik/Search";
import { useLocationFilterStore } from "@/stores/useLocationFilterStore";

const SearchBar = () => {
  const searchTerm = useLocationFilterStore((state) => state.searchTerm);
  const setSearchTerm = useLocationFilterStore((state) => state.setSearchTerm);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex gap-2 items-center border-2 px-5 py-2 border-foreground mx-4">
      <Search />

      <input type="text" placeholder="Søg efter vaskehaller..." value={searchTerm} onChange={handleChange} className="bg-transparent outline-none" />
    </div>
  );
};

export default SearchBar;
