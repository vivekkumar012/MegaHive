import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Helper function to calculate total price
const calculateTotalPrice = (products) => {
    if (!products || products.length === 0) return 0;
    return products.reduce((total, product) => {
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 1;
        return total + (price * quantity);
    }, 0);
};

//Helper function to load cart from localStorage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        const cart = JSON.parse(storedCart);
        // Recalculate totalPrice when loading from storage
        cart.totalPrice = calculateTotalPrice(cart.products);
        return cart;
    }
    return { products: [], totalPrice: 0 };
}

//Helper function to save Cart in localStorage
const saveCartToStorage = (cart) => {
    // Ensure totalPrice is calculated before saving
    const cartToSave = {
        ...cart,
        totalPrice: calculateTotalPrice(cart.products)
    };
    localStorage.setItem("cart", JSON.stringify(cartToSave));
    return cartToSave;
}

//Fetch Cart for a user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            params: { userId, guestId }
        })
        return response.data;

    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response.data)
    }
})

//Add an item to a cart for user or guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId, quantity, size, color, guestId, userId
        });
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response.data)
    }
});

export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            guestId,
            userId,
            size,
            color
        });
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response.data)
    }
})

//Remove an item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
        const response = await axios({
            method: "DELETE",
            url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: { productId, guestId, userId, size, color, },
        });

        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response.data)
    }
})

//merge guestCart into userCart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, { guestId, userId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response.data)
    }
})

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [], totalPrice: 0 };
            localStorage.removeItem("cart")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                const cartData = action.payload;
                // Calculate totalPrice if not provided by backend
                cartData.totalPrice = calculateTotalPrice(cartData.products);
                state.cart = cartData;
                saveCartToStorage(cartData)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                const cartData = action.payload;
                cartData.totalPrice = calculateTotalPrice(cartData.products);
                state.cart = cartData;
                saveCartToStorage(cartData)
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to add to cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                const cartData = action.payload;
                cartData.totalPrice = calculateTotalPrice(cartData.products);
                state.cart = cartData;
                saveCartToStorage(cartData)
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                const cartData = action.payload;
                cartData.totalPrice = calculateTotalPrice(cartData.products);
                state.cart = cartData;
                saveCartToStorage(cartData)
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item from cart";
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                const cartData = action.payload;
                cartData.totalPrice = calculateTotalPrice(cartData.products);
                state.cart = cartData;
                saveCartToStorage(cartData)
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            })
    }
})

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;