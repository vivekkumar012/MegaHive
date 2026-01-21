import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

//Fetch All User (Admin Only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
    const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
    });
    return response.data;
})

//Add the create user actions
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/users`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

//Update User Info
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/api/admin/users/${id}`, {
            name,
            email,
            role
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: error.message });
    }
})

//Delete a User
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: error.message });
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add User
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add user";
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload.user;
                const userIndex = state.users.findIndex((user) => user._id === updatedUser._id);
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update user";
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to delete user";
            })
    }

})

export default adminSlice.reducer;