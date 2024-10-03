import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './Slices/cartSlices';
import wishlistReducer from './Slices/WishlistSlice';
import productReducer from './Slices/ProductSlices';
import userReducer from './Slices/UserSlices/UserSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        product: productReducer,
        user: userReducer,
    },
});

export default store;
