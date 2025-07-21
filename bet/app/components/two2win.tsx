"use client"
import { useState, useEffect, MouseEvent} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
//import { StoreState } from '../tools/s_interface';
import { monthL, weekL, getCalender} from '../tools/lists_dict';
//import { useDispatch, useSelector } from 'react-redux';
//import { mainStateReducer } from '@/store/slices/mainslice';


export default function Two2Win() {
  const [two2win, setTwo2win] = useState({
    commencement: '',
    Sbal: '',
    Tstake: '',
    Todd: '',
    Ebal: '',
    status: '',
    published: '',
    games: [
      {
        hometeam: '',
        awayteam: '',
        selection: '',
        odd: '',
      },
    ]
  });
  //usedispatch to be able to write to store
  //const dispatch = useDispatch();
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [sDay, setSDay] = useState('');
  const [sMonth, setSMonth] = useState('');
  const [sYear, setSYear] = useState('');
  const [toDay, setToDay] = useState('');
  //to set message to display 
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  const [calender, setCalender] = useState(getCalender(parseInt(sYear), parseInt(sMonth.slice(-2))));
  //const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const handleCalenderClose = () => {
        setCalenderOpen(false);
    };
  const handleCalender = (yr: string, mnt: string) => {
    setCalender(getCalender(parseInt(yr), parseInt(mnt)));
  };
  //handle close message popup
  const handleClose = () => {
      setIsOpen(false);
  };
  //Handle overlay click to close message popup
  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      handleClose();
    }
  };
  const handleDay = (dyy: string) => {
    if (dyy !== '') {
      setSDay(dyy.toString());
      axios.get('/api/gettwo2win', {
        headers: {
          tok: Cookies.get('trybet_tok'),
          date: `${sDay}${sMonth.substring(3, 5)}${sYear}`,
      }})
      .then((response) => {
        if (response.data.game) {
          setTwo2win(response.data.game);
          setSDay(dyy.toString());
          setCalenderOpen(false);
        } else {
          setMsg('No data on selected date');
          setIsOpen(true);
          setCalenderOpen(false);
        }
      })
      .catch(error => {
        setMsg('A problem occurred  ' + error.message);
        setIsOpen(true);
      });
    }
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
      const ddd = response.data.day.toString();
      const mmm = monthL[response.data.month];
      const yyy = response.data.year.toString();
      setSDay(ddd);
      setSMonth(mmm);
      setSYear(yyy);
      setToDay(`${ddd}${mmm}${yyy}`);
      setCalender(getCalender(response.data.year, response.data.month + 1));
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      <div className=" bg-gray-200 flex flex-col p-2 md:w-4/5 w-11/12 mx-auto">
        <div className='flex w-1/2 text-center font-bold p-4 font-bold rounded-lg shadow-md bg-green-500 text-white b-2 border-gray-400 mx-auto' onClick={() => setCalenderOpen(true)}>Date : {sDay} / {sMonth.slice(0, -2)} / {sYear}</div>
      </div>
      <div className="bg-gray-200 flex flex-col md:w-4/5 w-11/12 mx-auto">
        <div className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="rounded-lg p-1 flex gap-4">
              <div className={`w-1/3 font-bold p-2 text-center rounded-lg ${two2win.status === 'Won' ? 'bg-green-500 text-white' : (two2win.status === 'Lost' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white')}`}>{two2win.status}</div>
              <div className="w-2/3 bg-blue-200 p-2 text-center rounded-lg font-bold flex justify-end">{`${two2win.commencement.substring(0, 2)} ${two2win.commencement.substring(2, 5)} ${two2win.commencement.substring(7, 11)}`}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Starting Balance</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(two2win.Sbal))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">{`Today's Stake`}</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(two2win.Tstake))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">{`Today's Odd`}</div>
                <div className=" w-1/2 font-bold text-end">{two2win.Todd}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Expected Balance</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(two2win.Ebal))}</div>
              </div>

              <div className="bg-green-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Post On</div>
                <div className=" w-1/2 font-bold text-end">{`${two2win.published.substring(0, 2)} ${two2win.published.substring(2, 5)} ${two2win.published.substring(7, 11)}`}</div>
              </div>

            </div>
          </div>
          {two2win.games.map((item, index) => (
          <div key={index} className={`flex flex-col space-y-1 mb-6 border-b-4 border-gray-700 rounded-b-md`}>
            <div className="bg-blue-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Home Team</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.hometeam}</div>
            </div>
            <div className="bg-blue-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Away Team</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.awayteam}</div>
            </div>
            <div className="bg-blue-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Selection</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.selection}</div>
            </div>
            <div className="bg-blue-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Odd</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.odd}</div>
            </div>
          </div>
          ))}
          {isOpen && (
            <div className="popup-overlay fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center" onClick={handleOverlayClick}>
              <div className="popup-content bg-white rounded-lg shadow-md p-8 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" >
                <div className="flex justify-end">
                  <button className="text-gray-500 hover:text-gray-700" onClick={handleClose} >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-lg font-bold mb-4">{msg}</h2>
              </div>
            </div>
          )}
      </div>
    </div>

      {calenderOpen && (
      <div className=" fixed top-0 left-0 w-full h-full bg-transparent flex justify-center mt-40">
        <div className=" bg-white rounded-lg shadow-md p-4 w-3/4 md:w-1/4 lg:w-1/4 xl:w-1/4 h-1/4 overflow-y-auto" >
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
                <div key={idx} className={`text-center w-1/7 text-gray-700 ${sDay ===  day.toString() && (sDay.toString() + sMonth.toString() + sYear.toString()) === toDay ? 'bg-green-300' : ''}`} onClick={() => handleDay(day.toString())}>
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
