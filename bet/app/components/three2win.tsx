"use client"
import { useState, useEffect, MouseEvent} from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { StoreState } from '../tools/s_interface';
import Cookies from 'js-cookie';
import { isDateInPast } from '../tools/dateitems';
//import { StoreState } from '../tools/s_interface';
import { monthL, weekL, getCalender} from '../tools/lists_dict';
//import { useDispatch, useSelector } from 'react-redux';
//import { mainStateReducer } from '@/store/slices/mainslice';


export default function Three2Win() {
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const [three2win, setThree2win] = useState({
    commencement: '-----------',
    Sbal: '0',
    Tstake: '0',
    Todd: '0',
    Ebal: '0',
    status: '',
    published: '-----------',
    games: [
      {
        hometeam: '',
        awayteam: '',
        selection: '',
        odd: '0',
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
  const [showGuide, setShowGuide] = useState(false);
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
  const handleDay = (dyy: string, myy: string, yyy: string) => {
    if (dyy !== '') {
      setSDay(dyy.toString());
      axios.get(`/api/getthree2win?date=${dyy.toString().padStart(2, '0')}${myy}${yyy}`, {
      headers: {
        tok: Cookies.get('trybet_tok'),
      }})
      .then((response) => {
        if (response.data.game) {
          setThree2win(response.data.game);
          setSDay(dyy.toString());
          setCalenderOpen(false);
        } else {
          setMsg('No data on selected date');
          setIsOpen(true);
          setCalenderOpen(false);
        }
      })
      .catch(error => {
        console.log(error.message);
        setMsg('Game of the day not ready');
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
      handleDay(ddd.toString(), mmm, yyy);
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      {!showGuide && isDateInPast(storeItems.mainSlice?.me.sub.slice(-8)) && (<button className="flex items-center mt-6 p-4 md:w-4/5 w-11/12 mx-auto">
        <Link href="/sub">
          <a className="text-white bg-blue-700 rounded-lg font-bold text-sm p-4 hover:text-gray-200">Activate Your Subscription</a>
        </Link>
      </button>)}

      {!showGuide && (<div className=" bg-gray-200 flex flex-col p-2 md:w-4/5 w-11/12 mx-auto">
        <div className='flex w-1/2 text-center cursor-pointer font-bold p-4 font-bold rounded-lg shadow-md bg-blue-500 text-white b-2 border-gray-400 mx-auto' onClick={() => setCalenderOpen(true)}>Date : {sDay} / {sMonth.slice(0, -2)} / {sYear}</div>
      </div>)}
      {!showGuide && (<div className="bg-gray-200 flex flex-col md:w-4/5 w-11/12 mx-auto">
        <div className="bg-gray-200 rounded-lg w-full md:w-4/5 lg:w-7/10 xl:w-7/10 mx-auto p-4">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="rounded-lg p-1 flex gap-4">
              <div className={`w-1/3 font-bold p-2 text-center rounded-lg ${three2win.status === 'Won' ? 'bg-green-500 text-white' : (three2win.status === 'Lost' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white')}`}>{three2win.status}</div>
              <div className="w-2/3 bg-purple-200 p-2 text-center rounded-lg font-bold flex justify-end">{`${three2win.commencement.substring(0, 2)} ${three2win.commencement.substring(2, 5)} ${three2win.commencement.substring(7, 11)}`}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Principal / Starting Capital</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(8000)}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Opening Balance</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(three2win.Sbal))}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">{`Today's Stake`}</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(three2win.Tstake))}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">{`Today's Odd`}</div>
                <div className=" w-1/2 font-bold text-end">{three2win.Todd}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Expected Balance</div>
                <div className=" w-1/2 font-bold text-end">{new Intl.NumberFormat().format(parseFloat(three2win.Ebal))}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Post On</div>
                <div className=" w-1/2 font-bold text-end">{`${three2win.published.substring(0, 2)} ${three2win.published.substring(2, 5)} ${three2win.published.substring(7, 11)}`}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Closing Balance</div>
                <div className=" w-1/2 font-bold text-end">{
                three2win.status === 'Pending' ? '' : (
                  three2win.status === 'Won' ? (
                    new Intl.NumberFormat().format(
                      parseFloat(three2win.Sbal) + (parseFloat(three2win.Tstake) * parseFloat(three2win.Todd))
                    )) : (
                      new Intl.NumberFormat().format(
                        parseFloat(three2win.Sbal) - (parseFloat(three2win.Tstake))
                      ))
                    )}</div>
              </div>

              <div className="bg-lime-200 rounded-lg p-1 flex gap-4">
                <div className=" w-1/2">Current ROI</div>
                <div className=" w-1/2 font-bold text-lg text-end">{(((parseFloat(three2win.Sbal) / 10000) * 100) - 100).toFixed(2)} %</div>
              </div>

            </div>
          </div>
          {three2win.games.map((item, index) => (
          <div key={index} className={`flex flex-col space-y-1 mb-6 border-b-4 border-gray-700 rounded-b-md`}>
            <div className="bg-purple-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Home Team</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.hometeam}</div>
            </div>
            <div className="bg-purple-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Away Team</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.awayteam}</div>
            </div>
            <div className="bg-purple-200 rounded-lg p-2 flex gap-4">
              <div className=" w-1/2 font-bold">Selection</div>
              <div className=" w-1/2 font-bold text-lg text-end">{item.selection}</div>
            </div>
            <div className="bg-purple-200 rounded-lg p-2 flex gap-4">
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
        <div
          className="fixed bottom-0 right-0 mb-4 mr-4 cursor-pointer"
          onClick={() => setShowGuide(true)}
        >
          <div
            className="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Guide
          </div>
        </div>
      </div>)}
      {showGuide && (
        <div className="bg-gray-800 mt-3 mb-3 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Guide on how to use this platform.</h2>
            <p className="text-lg md:text-xl text-gray-600">
              <b>Introduction to Our Betting System</b><br/>
              We initiate our betting system with a Principal amount (Starting Capital) of  N8,000 and a minimum daily stake of N20. This foundational amount can be adjusted proportionally to achieve varying returns.
              
              <b>Key Terms and Definitions</b>
              <ul>
                <li><b>Opening Balance</b>: The account balance as the start of the day</li>
                <li><b>{`Today's`} Stake</b>: The amount allocated for staking on a particular day.</li>
                <li><b>{`Today's`} Odd</b>: The total odd for the day, reflected accurately from the betting platform at the time of update.</li>
                <li><b>Expected Balance</b>: The anticipated amount if the prediction results in a win.</li>
                <li><b>Post Date</b>: The date when the game was updated on our site.</li>
                <li><b>Closing Balance</b>: The account balance after all games have ended for the day</li>
                <li><b>Current ROI</b>: The percentage return on investment {`(ROI)`} from the principal amount to date</li>
              </ul>
              
              <b>Match Structure and Odds</b><br/>
              A {`day's`} schedule may comprise 2, 3, 4, 5 or 6 matches, with a minimum total odd of 3. Each match involves:
              <ul>
                <li>Home Team and Away Team: Competing teams.</li>
                <li>Selection: Our predicted outcome for the match.</li>
                <li>Odd: The confirmed odd from the betting platform.</li>
              </ul>
              
              <b>Recommendations for Getting Started</b><br/>
              For optimal results, we advise commencing with a modest investment:
              <ul>
                <li>N4,000 with a N10 minimum stake</li>
                <li>N8,000 with a N20 minimum stake</li>
                <li>N40,000 with a N100 minimum stake</li>
                <li>N400,000 with a N1,000 minimum stake</li>
              </ul>
              
              <b>Performance Expectations and Risk Management</b><br/>
              Our strategy aims to deliver a minimum monthly percentage return of 30%. However, please note that this comes with a 80% risk ratio, meaning that losses can be substantial. To mitigate this risk, we strongly advise starting with an amount you can comfortably afford to lose.
            </p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 cursor-pointer rounded-lg" onClick={() => setShowGuide(false)} > Close </button>
          </div>
        </div>
      )}
      {calenderOpen && (
      <div className=" fixed top-0 left-0 w-full h-full bg-transparent flex justify-center mt-40">
        <div className=" bg-white rounded-lg shadow-md p-4 w-3/4 md:w-1/4 lg:w-1/4 xl:w-1/4 h-1/4 md:h:3/10 overflow-y-auto" >
          <div className="flex justify-end">
            <button className="text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleCalenderClose} >
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
                  className="text-gray-700 cursor-pointer font-bold text-center mr-4"
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
                  className="text-gray-700 font-bold cursor-pointer text-center mr-4"
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
                <button key={idx} className={`text-center w-1/7 p-1 cursor-pointer text-gray-700 ${sDay ===  day.toString() && (sDay.toString() + sMonth.toString() + sYear.toString()) === toDay ? 'bg-green-300' : ''}`} onClick={() => handleDay(day.toString(), sMonth, sYear)}>
                  {day === '' ? '' : day}
                </button>
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
