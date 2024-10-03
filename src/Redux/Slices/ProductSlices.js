import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:3000/api';

// Async thunks
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await axios.get(`${API_URL}/products`); // Adjusted API endpoint
    return response.data.data;
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData) => {
    const response = await axios.post(`${API_URL}/product`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data', // If sending files
        },
    });
    return response.data.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }) => {
    const response = await axios.put(`${API_URL}/product/${id}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data', // If sending files
        },
    });
    return response.data.data;
});

// Slice
const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearProducts: (state) => {
            state.products = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export actions and reducer
export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
