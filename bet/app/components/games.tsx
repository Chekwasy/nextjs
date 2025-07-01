"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';
import { StoreState } from '../tools/s_interface';

export default function Games() {
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const [games, setGames] = useState({});
  useEffect(() => {
    axios.get('/api/getopengames', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then(async (response) => {
        const dd = response;
      setGames(dd.data.games);
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);
  return (
    <div className="flex justify-center items-center">
      <div className="md:w-4/5 w-11/12">
        <div className="bg-gray-200 p-4 flex gap-4">
          <div className="bg-white text-gray-700 rounded-lg border-4 border-green-500 hover:border-green-300 p-4 w-1/2">
            Open Bet
          </div>
          <div className="bg-white rounded-lg border-4 border-green-500 hover:border-green-300 p-4 w-1/2">
            Closed Bet
          </div>
        </div>
      </div>
    </div>
    );
}
