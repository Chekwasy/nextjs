"use client"
import Image from 'next/image';
import { useState, useEffect, } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
//import { StoreState } from '../tools/s_interface';
import { monthL, weekL, getCalender} from '../tools/lists_dict';
//import { useDispatch, useSelector } from 'react-redux';
//import { mainStateReducer } from '@/store/slices/mainslice';


export default function Two2Win() {
  //usedispatch to be able to write to store
  //const dispatch = useDispatch();
  const [calenderOpen, setCalenderOpen] = useState(true);
  const [sMonth, setSMonth] = useState('');
  const [sYear, setSYear] = useState('');
  const [calender, setcalender] = useState(getCalender(parseInt(sYear), parseInt(sMonth.slice(-2))));
  //const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const handleCalenderClose = () => {
        setCalenderOpen(false);
    };
  useEffect(() => {
    axios.get('/api/getdate', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then((response) => {
      setSMonth(monthL[response.data.month]);
      setSYear(response.data.year.toString());
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      <div className=" bg-gray-200 flex flex-col md:w-4/5 w-11/12 mx-auto">
      
      </div>
      {calenderOpen && (
      <div className=" fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center">
        <div className=" bg-white rounded-lg shadow-md p-8 w-3/4 md:w-1/2 lg:w-1/4 xl:w-1/4" >
          <div className="flex justify-end">
            <button className="text-gray-500 hover:text-gray-700" onClick={handleCalenderClose} >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col b-2 w-full border-gray-700 bg-white p-1">
            <div className="flex flex-row w-full">
              <div className="flex flex-row">
                <Image src="/icons/left.svg" alt="<" width={30} height={30} />
                <div className="text-gray-700 font-bold text-center">{sMonth.slice(0, -2)}</div>
                <Image src="/icons/right.svg" alt=">" width={30} height={30} />
              </div>
              <div className="flex flex-row">
                <Image src="/icons/left.svg" alt="<" width={30} height={30} />
                <div className="text-gray-700 font-bold text-center">{sYear}</div>
                <Image src="/icons/right.svg" alt=">" width={30} height={30} />
              </div>
            </div>
            <div className="flex flex-row w-full text-sm text-gray-700">
              {weekL.map((item, index) => (
              <div key={index} className={`text-center w-1/7 ${item === 'Sun' ? 'text-red-500' : ''}`}>
                {item}
              </div>
              ))}
            </div>
            {calender.map((wk, index) => (
            <div key={index} className='flex flex-col gap-2'>
              {wk.map((dy, idx) => (
              <div key={idx} className="flex flex-row w-full text-sm text-gray-700">
                {dy}
              </div>
              ))}
            </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
    );
}
