import {configureStore} from '@reduxjs/toolkit';
import AlertReducer from './AlertSlice';
const store = configureStore({
    reducer:{
        alert:AlertReducer
    }
    
});
export default store;