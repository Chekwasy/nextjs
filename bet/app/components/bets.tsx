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
  const [bet, setBet] = useState<Bet[]>([]);
  const [betTab, setBetTab] = useState('open');
  const handleOpenBet = () => {
    axios.get('/api/getopengames', {
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
    axios.get('/api/getclosegames', {
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
    <div className="flex justify-center items-center mt-16">
  <div className="md:w-4/5 w-11/12">
    <div className="bg-gray-400 rounded-lg p-4 flex gap-4">
      <div
        className={`${betTab === 'open' ? 'bg-green-200' : 'bg-white'} text-gray-700 text-center rounded-lg border-4 border-green-500 hover:border-green-200 p-4 w-1/2`}
        onClick={() => handleOpenBet()}
      >
        Open Bets
      </div>
      <div
        className={`${betTab === 'close' ? 'bg-green-200' : 'bg-white'} rounded-lg border-4 border-green-500 text-center hover:border-green-300 p-4 w-1/2`}
        onClick={() => handleCloseBet()}
      >
        Closed Bets
      </div>
    </div>
  </div>
  <div>
    {bet.length > 0 &&
      bet.map((item, index) => (
        <div key={index} className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex-row space-x-4">
              <div className="w-3/10 bg-yellow-100 p-4 rounded-lg">{item.status}</div>
              <div className="w-7/10 bg-blue-100 p-4 rounded-lg flex justify-end">{`${item.date} ${item.time}`}</div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-purple-100 p-4 rounded-lg">{item.betamt}</div>
              <div className="bg-purple-100 p-4 rounded-lg">{item.odds}</div>
              <div className="bg-purple-100 p-4 rounded-lg">{item.potwin}</div>
              <div className="bg-purple-100 p-4 rounded-lg">{item.returns}</div>
            </div>
          </div>
        </div>
      ))}
  </div>
</div>
    );
}
