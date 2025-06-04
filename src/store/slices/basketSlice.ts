import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const saveToLocalStorage = (cart) => {
    localStorage.setItem('product', JSON.stringify(cart));
};

const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addToCart(state, action) {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ ...product, quantity });
            }
            saveToLocalStorage(state.items);
        },

        updateQuantity(state, action) {
            const { productId, newQuantity } = action.payload;
            if (newQuantity < 1) return;
            const item = state.items.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                saveToLocalStorage(state.items);
            }
        },

        removeToCart(state, action) {
            const { productId } = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
            saveToLocalStorage(state.items);
        },

        setCartItems(state, action) {
            state.items = action.payload;
        }
    }
});

export const { addToCart, updateQuantity, removeToCart, setCartItems } = basketSlice.actions;
export default basketSlice.reducer;
