import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: "mainState",
    initialState: { logged: false, played: [], me: {} },
    reducers: {
        mainStateReducer: (state, action) => {
            state.logged = action.payload.logged;
            state.played = action.payload.played;
            state.me = action.payload.me;
        }
    }
});

export const { mainStateReducer } = mainSlice.actions;
export default mainSlice.reducer;