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
  const [clickbet, setClickBet] = useState<Bet>({ 
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
});
  const [isOpen, setIsOpen] = useState(false);
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
  const handleClose = () => {
      setIsOpen(false);
  };
  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      handleClose();
    }
  };
  useEffect(() => {
    handleOpenBet();
  }, []);
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      <div className="md:w-4/5 w-11/12 mx-auto">
        <div className="bg-gray-400 rounded-lg p-4 flex gap-4">
          <div className={`${betTab === 'open' ? 'bg-green-200' : 'bg-white'} text-gray-700 text-center rounded-lg border-4 border-green-500 hover:border-green-200 p-4 w-1/2`} onClick={() => handleOpenBet()}>
            Open Bets
          </div>
          <div className={`${betTab === 'close' ? 'bg-green-200' : 'bg-white'} rounded-lg border-4 border-green-500 text-center hover:border-green-300 p-4 w-1/2`} onClick={() => handleCloseBet()}>
            Closed Bets
          </div>
        </div>
      </div>
      <div className="md:w-4/5 w-11/12 mx-auto">
        {(bet[0].status !== '') && bet.map((item: Bet, index: number) => (<div key={index} className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4" onClick={() => {setIsOpen(true); setClickBet(item);}}>
          <div className="flex flex-col space-y-4">
            <div className="rounded-lg p-1 flex gap-4">
              <div className={`w-1/3 font-bold p-1 rounded-lg ${item.status === 'close' ? (item.result === 'Won' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-yellow-200'}`}>{item.result}</div>
              <div className="w-2/3 bg-blue-200 p-1 rounded-lg font-bold flex justify-end">{`Date: ${item.date.substring(6, 8)} - ${item.date.substring(4, 6)} - ${item.date.substring(0, 4)}    Time: ${item.time.substring(0, 2)} : ${item.time.substring(2, 4)}`}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="bg-green-200 rounded-lg p-1 text-center font-bold flex gap-4">
                {item.bet && `${item.bet[0].hometeam} vs ${item.bet[0].awayteam} ...`}
              </div>
              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Amount Booked</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(item.betamt))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Odds</div>
                <div className=" w-1/2 font-bold text-end">{item.odds}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Expected Winnings</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(item.potwin))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Returns</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(item.returns))}</div>
              </div>
            </div>
          </div>
        </div>))}
      </div>
      {isOpen && (
            <div className="popup-overlay fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center" onClick={(event) => { if (event.target === event.currentTarget) { handleOverlayClick(); }}}>
              <div className="popup-content bg-white rounded-lg shadow-md p-8 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" >
                <div className="flex justify-end">
                  <button className="text-gray-500 hover:text-gray-700" onClick={handleClose} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="rounded-lg p-1 flex gap-4">
              <div className={`w-1/3 font-bold p-1 rounded-lg ${clickBet.status === 'close' ? (clickBet.result === 'Won' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-yellow-200'}`}>{clickBet.result}</div>
              <div className="w-2/3 bg-blue-200 p-1 rounded-lg font-bold flex justify-end">{`Date: ${clickBet.date.substring(6, 8)} - ${clickBet.date.substring(4, 6)} - ${clickBet.date.substring(0, 4)}    Time: ${clickBet.time.substring(0, 2)} : ${clickBet.time.substring(2, 4)}`}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Amount Booked</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(clickBet.betamt))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Odds</div>
                <div className=" w-1/2 font-bold text-end">{clickBet.odds}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Expected Winnings</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(clickBet.potwin))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Returns</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(clickBet.returns))}</div>
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
          )}
    </div>
  );
}
