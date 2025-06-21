export interface StoreState { mainSlice: {
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
      odd: string;
      selection: string;
      mStatus: string;
      mResult: string;
      mOutcome: string;
      mScore: string;
  }[];
  me: {
    userID: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    accbal: string;
    currency: string;
  }
}}

export interface PlayeD {
  id: string;
  gId: string;
  gSubtitle: string;
  gTCountry: string;
  mktT: string;
  mTime: string;
  hometeam: string;
  awayteam: string;
  odd: string;
  selection: string;
  mStatus: string;
  mResult: string;
  mOutcome: string;
  mScore: string;
}