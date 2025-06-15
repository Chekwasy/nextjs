import { createSlice } from "@reduxjs/toolkit";

interface StoreState {
  logged: boolean;
  played: {
    id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      homeodd: string;
      selection: string;
      mStatus: string;
      mResult: string;
      mOutcome: string;
      mScore: string;
  }[];
  me: {
    uID: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    accbal: string;
    currency: string;
  }
}

const storeS: StoreState = {
  logged: false,
  played: [],
  me: {
    uID: '',
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    accbal: '',
    currency: '',
  }
}


const mainSlice = createSlice({
    name: "mainState",
    initialState: storeS,
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