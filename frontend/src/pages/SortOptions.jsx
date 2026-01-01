import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  }
  return (
    <div className="flex items-center justify-end mb-4">
      <select
        name="sortoption"
        id="sort"
        className="border p-2 rounded-md focus:outline-none"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
      >
        <option value="">Default</option>
        <option value="PriceAsc">Price: Low to High</option>
        <option value="PriceDsc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
