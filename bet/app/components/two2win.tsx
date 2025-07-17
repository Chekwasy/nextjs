"use client"
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
  const [sDay, setSDay] = useState(0);
  const [sMonth, setSMonth] = useState('');
  const [sYear, setSYear] = useState('');
  const [calender, setCalender] = useState(getCalender(parseInt(sYear), parseInt(sMonth.slice(-2))));
  //const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const handleCalenderClose = () => {
        setCalenderOpen(false);
    };
  const handleCalender = (yr: string, mnt: string) => {
    setCalender(getCalender(parseInt(yr), parseInt(mnt)));
  };
  useEffect(() => {
    handleCalender(sYear, sMonth.slice(-2));
  }, [sYear, sMonth]);
                          
  useEffect(() => {
    axios.get('/api/getdate', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then((response) => {
      setSDay(response.data.day);
      setSMonth(monthL[response.data.month]);
      setSYear(response.data.year.toString());
      setCalender(getCalender(response.data.year, response.data.month + 1));
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
      <div className=" fixed top-0 left-0 w-full h-full bg-transparent flex items-center">
        <div className=" bg-white rounded-lg shadow-md p-4 w-3/4 md:w-1/4 lg:w-1/4 xl:w-1/4" >
          <div className="flex justify-end">
            <button className="text-gray-500 hover:text-gray-700" onClick={handleCalenderClose} >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col b-2 w-full border-gray-700 bg-white p-1">
            <div className="flex flex-row w-full">
              <div className="flex w-1/2">
                <select
                  value={sMonth}
                  onChange={(e) => setSMonth(e.target.value)}
                  className="text-gray-700 font-bold text-center mr-4"
                >
                  {monthL.map((month, index) => (
                  <option key={index} value={month}>
                    {month.slice(0, -2)}
                  </option>
                  ))}
                </select>

              </div>
              <div className="flex w-1/2">
                <select
                  value={sYear}
                  onChange={(e) => setSYear(e.target.value.toString())}
                  className="text-gray-700 font-bold text-center mr-4"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>
            <div className="flex flex-row w-full text-sm text-gray-700">
              {weekL.map((item, index) => (
              <div key={index} className={`text-center w-1/7 ${item === 'Sun' ? 'text-red-500' : ''}`}>
                {item}
              </div>
              ))}
            </div>
            {calender.map((week, index) => (
  <div key={index} className="flex flex-row w-full gap-2">
    {week.map((day, idx) => (
      <div key={idx} className={`text-center w-1/7 text-gray-700 ${sDay ===  day ? 'bg-green-300' : ''}`} onClick={() => day && setSDay(day)}>
        {day === '' ? '' : day}
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
