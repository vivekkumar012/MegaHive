import React, { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
 
  const handleSearchToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      {isOpen ? (
        <form className="relative flex items-center justify-center w-full">
            <div className="relative w-1/2">
                <input type="text" />
            </div>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6 "/>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
