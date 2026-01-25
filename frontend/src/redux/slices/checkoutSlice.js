import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to create a checkout session
export const createCheckout = createAsyncThunk(
    "checkout/createCheckout",
    async (checkoutdata, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");

            // Validate token exists
            if (!token || token === 'null' || token === 'undefined') {
                return rejectWithValue({
                    message: "Not Authorized, please login"
                });
            }

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error("Checkout error:", error);

            // Handle different error cases
            if (error.response) {
                // Server responded with error
                return rejectWithValue({
                    message: error.response.data?.message || "Checkout failed"
                });
            } else if (error.request) {
                // Request made but no response
                return rejectWithValue({
                    message: "No response from server"
                });
            } else {
                // Something else happened
                return rejectWithValue({
                    message: error.message || "Checkout failed"
                });
            }
        }
    }
);

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCheckoutError: (state) => {
            state.error = null;
        },
        resetCheckout: (state) => {
            state.checkout = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
                state.error = null;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create checkout";
                state.checkout = null;
            })
    }
});

export const { clearCheckoutError, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;