import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
name: 'alert',
initialState: { message: '', variant: '', show: false },
reducers: {
showAlert: (state, action) => {
    
    const { message = "", variant = 'success', show = true } = action.payload || {};
    
    state.message = message;
    state.variant = variant;
    state.show = show;
},
hideAlert: (state) => {
    state.show = false;
},

}
});
export const {hideAlert, showAlert} = alertSlice.actions;
export default alertSlice.reducer;