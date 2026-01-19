import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: []};
}

//Helper function to save Cart in localStorage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
}
