import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load cart from local storage
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Failed to load cart from local storage", error);
        return [];
    }
};

// Initial state
const initialState = {
    carts: loadCartFromLocalStorage(),
};

// Create cart slice
const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const itemIndex = state.carts.findIndex(item => item.id === action.payload.id);
            if (itemIndex >= 0) {
                // If item already exists, increase quantity
                state.carts[itemIndex].qnty += 1;
            } else {
                // If item doesn't exist, add it to the cart
                const newItem = { ...action.payload, qnty: 1 };
                state.carts.push(newItem);
            }
            // Update local storage
            try {
                localStorage.setItem('cart', JSON.stringify(state.carts));
                toast.success("Product added to cart successfully!");
            } catch (error) {
                console.error("Failed to update local storage", error);
                toast.error("Failed to add product to cart.");
            }
        },
        removeFromCart: (state, action) => {
            state.carts = state.carts.filter(item => item.id !== action.payload);
            try {
                localStorage.setItem('cart', JSON.stringify(state.carts));
                toast.success("Product removed from cart successfully!");
            } catch (error) {
                console.error("Failed to update local storage", error);
                toast.error("Failed to remove product from cart.");
            }
        },
        removeSingleItem: (state, action) => {
            const itemIndex = state.carts.findIndex(item => item.id === action.payload.id);
            if (itemIndex >= 0 && state.carts[itemIndex].qnty > 0) {
                if (state.carts[itemIndex].qnty === 1) {
                    state.carts.splice(itemIndex, 1);
                } else {
                    state.carts[itemIndex].qnty -= 1;
                }
            }
            try {
                localStorage.setItem('cart', JSON.stringify(state.carts));
                toast.success("Product quantity decreased successfully!");
            } catch (error) {
                console.error("Failed to update local storage", error);
                toast.error("Failed to update product quantity.");
            }
        },
        emptyCart: (state) => {
            state.carts = [];
            localStorage.removeItem('cart');
            toast.success("Cart has been emptied successfully!");
        },
    },
});

// Export actions and reducer
export const { addToCart, removeFromCart, removeSingleItem, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
