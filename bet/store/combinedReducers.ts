import { combineReducers } from "@reduxjs/toolkit";
import mainSlice from "./slices/mainslice";

const combinedReducers = combineReducers({
    mainSlice,
});
export default combinedReducers;