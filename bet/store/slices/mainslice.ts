import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "mainState",
    initialState: { logged: false, played: [], me: {} },
    reducers: {
        mainStateReducer: (state) => state,
    }
});

export const { mainStateReducer } = mainSlice.actions;
export default mainSlice.reducer;