// src/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:3000';

// Async thunks
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axios.get('/api/getuser', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` } // Get token from cookies
    });
    return response.data.user;
});

export const updateUser = createAsyncThunk('user/updateUser', async (userData) => {
    const response = await axios.put('/api/update-user-info', userData, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` } // Pass token in header
    });
    return response.data.user;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async () => {
    await axios.delete('/api/user', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` } // Get token from cookies
    });
    return null; // Return null to signify deletion
});

export const loginUser = createAsyncThunk('user/loginUser', async (credentials) => {
    const response = await axios.post('/api/login', credentials);
    Cookies.set('token', response.data.token, { expires: 7 }); // Store token in cookies for 7 days
    return response.data.user; // Return user info
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    await axios.get('/api/logout'); // Hit the logout API
    Cookies.remove('token'); // Remove token from cookies
    return null;
});

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        loading: false,
        error: null,
        isAuthenticated: false, // Tracks authentication status
    },
    reducers: {
        checkAuth: (state) => {
            const token = Cookies.get('token'); // Check if token exists in cookies
            state.isAuthenticated = !!token; // Update isAuthenticated based on token presence
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.isAuthenticated = true; // Set authentication to true when user is fetched
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false; // Set authentication to false on error
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.userInfo = null; // Reset user info after deletion
                state.isAuthenticated = false; // Set authentication to false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userInfo = action.payload;
                state.isAuthenticated = true; // Set authentication to true after login
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userInfo = null; // Clear user info after logout
                state.isAuthenticated = false; // Set authentication to false
            });
    },
});

// Export actions and reducer
export const { checkAuth } = userSlice.actions;
export default userSlice.reducer;
