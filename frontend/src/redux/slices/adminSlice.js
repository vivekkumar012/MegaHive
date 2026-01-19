import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Fetch All User (Admin Only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
    });
    return response.data;
})

//Add the create user actions
export const 