"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Bet, StoreState } from '../tools/s_interface';
import { useDispatch, useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';

export default function Bets() {
  //usedispatch to be able to write to store
    const dispatch = useDispatch();
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const [bet, setBet] = useState<Bet[]>([{ 
    userID: '', 
    gameID: '', 
    returns: '', 
    result: '', 
    date: '', 
    time: '', 
    betamt: '', 
    status: '', 
    potwin: '', 
    odds: '', 
    bet: [{ 
      id: '', 
      gId: '', 
      gTCountry: '', 
      gSubtitle: '',  
      mktT: '', 
      mTime: '', 
      hometeam: '', 
      awayteam: '', 
      odd: '', 
      selection: '', 
      mStatus: '', 
      mResult: '', 
      mOutcome: '', 
      mScore: '',
    }]
}]);
  const [betTab, setBetTab] = useState('open');
  const handleOpenBet = () => {
    axios.get('/api/getopenbet', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then(async (response) => {
      const dd = response;
      if (dd.data.openbet.length > 0) {
        setBet(dd.data.openbet);
      }
      if (dd.data.me) {
        dispatch(mainStateReducer({logged: storeItems.mainSlice.logged, played: storeItems.mainSlice.played, me: dd.data.me, buttonState: storeItems.mainSlice.buttonState}));
      }
      setBetTab('open');
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  const handleCloseBet = () => {
    axios.get('/api/getclosebet', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then(async (response) => {
      const dd = response;
      if (dd.data.closebet.length > 0) {
        setBet(dd.data.closebet);
      }
      setBetTab('close');
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  useEffect(() => {
    handleOpenBet();
  }, []);
  return (
    <div className="flex-col justify-center items-center mt-16">
      <div className="md:w-4/5 w-11/12 items-center justify-center">
        <div className="bg-gray-400 rounded-lg p-4 flex gap-4">
          <div className={`${betTab === 'open' ? 'bg-green-200' : 'bg-white'} text-gray-700 text-center rounded-lg border-4 border-green-500 hover:border-green-200 p-4 w-1/2`} onClick={() => handleOpenBet()}>
            Open Bets
          </div>
          <div className={`${betTab === 'close' ? 'bg-green-200' : 'bg-white'} rounded-lg border-4 border-green-500 text-center hover:border-green-300 p-4 w-1/2`} onClick={() => handleCloseBet()}>
            Closed Bets
          </div>
        </div>
      </div>
      <div className="md:w-4/5 w-11/12">
        {(bet[0].status !== '') && bet.map((item: Bet, index: number) => (<div key={index} className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="">
              <div className={`w-3/10 p-4 font-bold rounded-lg ${item.status === 'close' ? (item.result === 'Won' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-yellow-200'}`}>{item.result}</div>
              <div className="w-6/10 bg-blue-200 p-4 rounded-lg font-bold flex justify-end">{`${item.date.substring(6, 8)} - ${item.date.substring(4, 6)} - ${item.date.substring(0, 4)}    ${item.time.substring(0, 2)} : ${item.time.substring(2, 4)}`}</div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-green-200 rounded-lg p-4 flex gap-4">
                {item.bet && `${item.bet[0].hometeam} vs ${item.bet[0].awayteam} ...`}
              </div>
              <div className="bg-green-200 rounded-lg p-4 flex gap-4">
                <div className="p-4 w-3/10">Amount Booked</div>
                <div className="p-4 w-6/10 font-bold">{item.betamt}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-4 flex gap-4">
                <div className="p-4 w-3/10">Odds</div>
                <div className="p-4 w-6/10 font-bold">{item.odds}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-4 flex gap-4">
                <div className="p-4 w-3/10">Expected Winnings</div>
                <div className="p-4 w-6/10 font-bold">{item.potwin}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-4 flex gap-4">
                <div className="p-4 w-3/10">Returns</div>
                <div className="p-4 w-6/10 font-bold">{item.returns}</div>
              </div>
            </div>
          </div>
        </div>))}
      </div>
    </div>
  );
}
