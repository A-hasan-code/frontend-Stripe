import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

const initialState = {
    wishlist: [],
};

const wishlistSlice = createSlice({
    name: 'wishlistSlice',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const existingItem = state.wishlist.find(item => item.id === action.payload.id);
            if (!existingItem) {
                state.wishlist.push(action.payload);
                toast.success("Item added to your wishlist");
            } else {
                toast.error("Item is already in your wishlist");
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
            toast.success("Item removed from your wishlist");
        },
        emptyWishlist: (state) => {
            state.wishlist = [];
            toast.success("Wishlist has been emptied");
        },
    },
});

export const { addToWishlist, removeFromWishlist, emptyWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
