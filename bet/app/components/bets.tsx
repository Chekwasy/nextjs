"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Bet } from '../tools/s_interface';

export default function Bets() {
  const [bet, setBet] = useState<Bet[]>([]);
  const handleOpenBet = () => {
    axios.get('/api/getopengames', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then(async (response) => {
        const dd = response;
      setBet(dd.data.games);
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
      setBet(dd.data.games);
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
          <div className="bg-white text-gray-700 justify-center items-center rounded-lg border-4 border-green-500 hover:border-green-300 p-4 w-1/2" onClick={() => handleOpenBet()}>
            Open Bet
          </div>
          <div className="bg-white rounded-lg border-4 border-green-500 justify-center items-center hover:border-green-300 p-4 w-1/2" onClick={() => handleCloseBet()} >
            Closed Bet
          </div>
        </div>
      </div>
      <div>
        {bet.length > 0 && bet.map((item) => (
          item.status
        ))}
      </div>
    </div>
    );
}
