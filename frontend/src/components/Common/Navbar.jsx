import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrower from "../Layout/CartDrower";

const Navbar = () => {
  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-3">
          <img
            src="https://imgs.search.brave.com/o1WwjdoIaMfmSypJrY0ysnC_AaLxmtILOzpMnSwOSC8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8wOS8zNC9z/aG9wcGluZy1iYWct/bGV0dGVyLXctbG9n/by12ZWN0b3ItMjkw/MzA5MzQuanBn"
            alt="logo"
            className="h-10 w-10 rounded-xl"
          />
          <Link to={"/"} className="text-2xl font-medium">
            MegaHive
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to={"#"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            MEN
          </Link>
          <Link
            to={"#"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            WOMEN
          </Link>
          <Link
            to={"#"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to={"#"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to={"/profile"} className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-[#ea2e02] text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>

          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700 " />
          </button>
        </div>
      </nav>
      <CartDrower />
    </>
  );
};

export default Navbar;
