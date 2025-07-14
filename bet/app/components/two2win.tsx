"use client"
import { useState, useEffect, } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { StoreState } from '../tools/s_interface';
import { useDispatch, useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';

export default function Two2Win() {
  //usedispatch to be able to write to store
    const dispatch = useDispatch();
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      </div>
    );
}
