"use client"
import React, { useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';
import { StoreState, PlayeD } from '../tools/s_interface';
import { multiply } from '../tools/multiply';

export default function Main() {
  //usedispatch to be able to write to store
  const dispatch = useDispatch();
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  //control to sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  const [toggleInput, setToggleInput] = useState(false);
  const [betAmt, setBetAmt] = useState('');
  const [potWin, setPotWin] = useState('');
  const [odds, setOdds] = useState('');
  const [playedA, setPlayedA] = useState<PlayeD[]>([]);
  const [buttonStates, setButtonStates] = useState<Record<string, boolean>>({});
  //state to hold games from api
  const [games, setGames] = useState([{
	  id: '',
	  titleCountry: '',
	  subtitle: '',
	  events: [{
		  id: '',
		  hometeam: '',
		  awayteam: '',
		  homeodd: '',
		  awayodd: '',
		  drawodd: '',
		  Esd: '',
	  }]
  }]);
  //state to hold dates from api
  const [dateelist, setDateelist] = useState([
    { date: '', indent: 0 },
    { date: '', indent: 1 },
    { date: '', indent: 2 },
    { date: '', indent: 3 },
    { date: '', indent: 4 },
    { date: '', indent: 5 },
    { date: '', indent: 6 },
    { date: '', indent: 7 },
  ]);
  //date string
  const [datee, setDatee] = useState(dateelist[0].date);
  //date indent
  const [dateeIndent, setDateeIndent] = useState(0);
  //show list of dates
  const [showList, setShowList] = useState(false);
  //load the games data from backend
  const load = async () => {
	  axios.get(`api/getgames?date=${dateeIndent}`)
    .then(async (response) => {
      const dd = response.data;
      setGames(dd.games);
	    setDateelist(dd.datee);
	    setDatee(dd.datee[dateeIndent].date)
    })
    .catch(error => {
      setMsg(`Network or server error ${error.message}`);
      setIsOpen(true);
    });
  };
  //make changes if dateIndent has any change or initialization
  useEffect(() => {
    load();
  }, [dateeIndent]);

  const calculateOdd = async (itm: {
    id: string;
    gId: string;
    gSubtitle: string;
    gTCountry: string;
    mktT: string;
    mTime: string;
    hometeam: string;
    awayteam: string;
    odd: string;
    selection: string;
    mStatus: string;
    mResult: string;
    mOutcome: string;
    mScore: string;
  }[], btA: string) => {
    let od = '1';
    if (itm.length > 0) {
	    itm.forEach((item) => {
        const ln1 = item.odd.length;
        const ln2 = od.length;
        if (ln1 >= ln2) {
          od = multiply(item.odd, od);
        } else {
          od = multiply(od, item.odd);
        }
      });
      setOdds(od);
      if (btA !== '') {
        if (od.length >= btA.length) {
          const val = multiply(od, btA);
          setPotWin(val);
        } else {
          const val = multiply(btA, od);
          setPotWin(val);
        }
      } else {
        setPotWin('');
      }
    }
  };

  const handleButton = async (button: string) => {
    const beT = betAmt;
	  if (button === '1' ||
	      button === '2' ||
	      button === '3' ||
	      button === '4' ||
	      button === '5' ||
	      button === '6' ||
	      button === '7' ||
	      button === '8' ||
	      button === '9' ||
	      button === '0') {
		  if (beT === '' && button !== '0') {
			  setBetAmt(button);
        calculateOdd(playedA, button);
		  } else if (beT !== '' && !beT.includes('.')) {
			  setBetAmt(beT + button);
        calculateOdd(playedA, beT + button);
		  } else if (beT !== '' && beT.includes('.')) {
        if (beT.split('.')[1].length < 2) {
          setBetAmt(beT + button);
          calculateOdd(playedA, beT + button);
        }
		  }
    } else if (beT !== '' && button === '.' && !beT.includes('.')) {
					setBetAmt(beT + button);
		} else if (button === 'Del') {
		  const nwAmt = beT.slice(0, -1);
		  if (beT !== '') { setBetAmt(nwAmt); calculateOdd(playedA, nwAmt); }
	  } else if (button === 'Clear') {
		  setBetAmt('');
	  } else if (button === '10' || button === '100' || button === '1000') {
		  setBetAmt(button);
      calculateOdd(playedA, button);
	  }
  };

  //Handle overlay click to close message popup
  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
      handleClose();
    }
  };

  //handle close message popup
  const handleClose = () => {
    setIsOpen(false);
  };
  //handles date selected from list
  const handleDateSelect = (date: string, indent: number) => {
    setDatee(date);
    setDateeIndent(indent);
    setShowList(false);
  };
  //handles next date
  const handleNext = () => {
    const currentIndex = dateelist.findIndex((item) => item.date === datee);
    if (currentIndex < dateelist.length - 1) {
      setDatee(dateelist[currentIndex + 1].date);
      setDateeIndent(dateelist[currentIndex + 1].indent);
    }
  };
  //handles previous date
  const handlePrevious = () => {
    const currentIndex = dateelist.findIndex((item) => item.date === datee);
    if (currentIndex > 0) {
      setDatee(dateelist[currentIndex - 1].date);
      setDateeIndent(dateelist[currentIndex - 1].indent);
    }
  };
  //handle home draw and away odd selection
  const handleHDA = async (m: {id: string; hometeam: string; awayteam: string; homeodd: string; awayodd: string; drawodd: string; Esd: string}, sel: string, odd: string, gID: string, gS: string, gT: string) => {
    setButtonStates((prevStates) => ({
      ...prevStates,
      [m.hometeam + sel]: !prevStates[m.hometeam + sel],
    }));
    const pyd: {
      id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      odd: string;
      selection: string;
      mStatus: string;
      mResult: string;
      mOutcome: string;
      mScore: string;
    } = {
      id: '',
      gId: '',
      gSubtitle: '',
      gTCountry: '',
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
    };
    const spyd = [...storeItems.mainSlice.played];
    const index = spyd.findIndex((item) => item.id === m.hometeam + sel);
    if (index !== -1) {
      //handles when there is a match
      spyd.splice(index, 1);
      dispatch(mainStateReducer({logged: storeItems.mainSlice.logged, played: spyd, me: storeItems.mainSlice.me}));
	    calculateOdd(spyd, betAmt);
      setPlayedA(spyd);
      axios.post('/api/postsavedgames', {
        savedGames: spyd,
      })
      .then(async (response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
    } else {
      // Handle the case when no match is found
      pyd.id = m.hometeam + sel;
      pyd.gId = gID;
      pyd.gSubtitle = gS;
      pyd.gTCountry = gT;
      pyd.hometeam = m.hometeam;
      pyd.awayteam = m.awayteam;
      pyd.odd = odd;
      pyd.mktT = '1x2';
      pyd.mTime = m.Esd;
      pyd.selection = sel;
      pyd.mStatus = 'Not Started';
      pyd.mResult = 'NR';
      pyd.mOutcome = 'Pending';
      pyd.mScore = '- : -';
      spyd.push(pyd);
      dispatch(mainStateReducer({logged: storeItems.mainSlice.logged, played: spyd, me: storeItems.mainSlice.me}));
	    calculateOdd(spyd, betAmt);
      setPlayedA(spyd);
      axios.post('/api/postsavedgames', {
        savedGames: spyd,
      })
      .then(async (response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
    }
  };
  //handle remove played from sidebar
  const handleHDAR = async (itm: {
    id: string;
    gId: string;
    gSubtitle: string;
    gTCountry: string;
    mktT: string;
    mTime: string;
    hometeam: string;
    awayteam: string;
    odd: string;
    selection: string;
    mStatus: string;
    mResult: string;
    mOutcome: string;
    mScore: string;
  }) => {
    setButtonStates((prevStates) => ({
      ...prevStates,
      [itm.id]: !prevStates[itm.id],
    }));
    const spyd = [...storeItems.mainSlice.played];
    const index = spyd.findIndex((item) => item.id === itm.id);
    if (index !== -1) {
      //handles when there is a match
      spyd.splice(index, 1);
      dispatch(mainStateReducer({logged: storeItems.mainSlice.logged, played: spyd, me: storeItems.mainSlice.me}));
	    calculateOdd(spyd, betAmt);
      setPlayedA(spyd);
      axios.post('/api/postsavedgames', {
        savedGames: spyd,
      })
      .then(async (response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
    }
  };
  return (
    <div className="relative bg-white rounded-b-lg border-4 border-green-300 mt-16 lg:border-2 lg:w-4/5 mx-auto">
      <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="font-bold text-lg">1 X 2</h2>
        <div>
          <div className="flex justify-center">
            <button onClick={handlePrevious}><Image src="/icons/back.svg" alt="back" width={30} height={30} /></button>
            <div className="relative">
              <button onClick={() => setShowList(!showList)}>{datee}</button>
              {showList && (
                <ul className="absolute bg-white shadow-lg p-4 w-40 text-gray-800 rounded-lg left-0 ml-[-35px] mt-[10]">
                {dateelist.map((item) => (
                  <li key={item.date} onClick={() => handleDateSelect(item.date, item.indent)} className="py-2 px-4 bg-green-500 text-white text-center rounded-md hover:bg-green-700 mb-2">
                    {item.date}
                  </li>
                ))}
              </ul>
              )}
            </div>
            <button onClick={handleNext}><Image src="/icons/front.svg" alt="Next" width={30} height={30} /></button>
          </div>
        </div>
        <button aria-label="Open sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} className="flex flex-row items-center">
		{storeItems.mainSlice.played.length > 0 && (<div className="rounded-full w-5 h-5 text-sm mt-0 mb-0 bg-red-700 text-white">{storeItems.mainSlice.played.length === 0 ? '' : storeItems.mainSlice.played.length}</div>)}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 mt-12">
        <div className="grid gap-4">
          {games.map((game, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold mb-2">{game.subtitle}</h3>
              <p className="text-gray-600">{game.titleCountry}</p>
              <div className="mt-4">
                {game.events.map((match, idx) => (
                  <div key={idx} className="flex flex-col items-center mb-4 border-b border-gray-200 pb-4">
                    <div className="flex justify-between w-full">
                      <div className="w-1/2 flex flex-col items-center">
                        <div className="text-lg text-center">{match.hometeam}</div>
                        <div className="text-lg text-center">{match.awayteam}</div>
                      </div>
                      <div className="w-1/10 text-lg text-center">
                        {`${match.Esd.substring(8, 10)}:${match.Esd.substring(10, 12)}`}
                      </div>
                      <div className="w-2/5 flex justify-around">
                        <button onClick={() => handleHDA(match, 'home', match.homeodd, game.id, game.titleCountry, game.subtitle)} className={`${buttonStates[match.hometeam + 'home'] ? 'bg-gray-700 hover:bg-gray-300' : 'bg-green-500 hover:bg-green-200'} text-white font-bold py-2 px-4 rounded`}>
                          {match.homeodd}
                        </button>
                        <button onClick={() => handleHDA(match, 'draw', match.drawodd, game.id, game.titleCountry, game.subtitle)} className={`${buttonStates[match.hometeam + 'draw'] ? 'bg-gray-700 hover:bg-gray-300' : 'bg-blue-500 hover:bg-blue-200'} text-white font-bold py-2 px-4 rounded`}>
                          {match.drawodd}
                        </button>
                        <button onClick={() => handleHDA(match, 'away', match.awayodd, game.id, game.titleCountry, game.subtitle)} className={`${buttonStates[match.hometeam + 'away'] ? 'bg-gray-700 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-200'} text-white font-bold py-2 px-4 rounded`}>
                          {match.awayodd}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar */}
      <div className={`absolute items-center top-0 right-0 min-h-screen w-96 bg-white shadow-lg border-4 rounded-lg border-green-300 ${sidebarOpen ? 'block' : 'hidden'}`} id="sidebar" style={{ top: '65px' }}>
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="font-bold text-lg">Bookings</h2>
          <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 text-gray-700 mt-12">
          {storeItems.mainSlice.played && storeItems.mainSlice.played.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
              <div className='flex justify-between'>
                <h4 className='w-1/3'>{item.gSubtitle}</h4>
                <h4 className='w-1/3'>{item.mktT}</h4>
                <div className='flex items-center w-1/3'><Image onClick={() => handleHDAR(item)} src="/icons/close.svg"
                  alt="Close"
                  width={30}
                  height={30}
                /></div>
              </div>
              <h3 className="font-bold text-lg">{item.hometeam} vs {item.awayteam}</h3>
              <div className='flex justify-between'>
                <p className='w-1/3'>{`${item.mTime.substring(8, 10)}:${item.mTime.substring(10, 12)}`}</p>
                <p className='w-1/3'>{item.selection}</p>
                <h4 className='w-1/3 font-bold'>{item.odd}</h4>
              </div>
            </div>
          ))}
        </div>
	{ storeItems.mainSlice.played.length > 0 && (<div className="w-full flex flex-col text-white max-w-md mx-auto p-4 bg-gray-200 rounded-lg border border-white shadow-md">
  <div className="mb-1">
    <div className="w-85 h-10  cursor-text bg-blue-400 rounded-lg border border-white flex items-center justify-center" onClick={() => setToggleInput(!toggleInput)}>
	    {`Amt: N ${betAmt}`}
    </div>
  </div>
  <div className="w-85 h-10 bg-blue-600 rounded-lg border border-white flex items-center justify-center">
    {`Odds: ${odds}`}
  </div>
  <div className="w-85 h-10 bg-blue-600 rounded-lg border border-white flex items-center justify-center">
    {`Win: ${potWin}`}
  </div>
</div>)}
	{ storeItems.mainSlice.played.length > 0 && toggleInput && (<div className="p-4 grid grid-cols-4 gap-1">
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('1')}>1</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('2')}>2</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('3')}>3</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('4')}>4</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('5')}>5</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('6')}>6</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('7')}>7</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('8')}>8</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('9')}>9</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('.')}>.</button>
  <button className="h-10 w-20 bg-gray-200 text-gray-600 hover:bg-gray-400 hover:text-white rounded" onClick={() => handleButton('0')}>0</button>
  <button className="h-10 w-20 bg-red-500 text-white hover:bg-red-700 rounded" onClick={() => handleButton('Del')}>Del</button>
  <button className="h-10 w-20 bg-green-500 text-white hover:bg-green-700 rounded" onClick={() => handleButton('10')}>10</button>
  <button className="h-10 w-20 bg-green-500 text-white hover:bg-green-700 rounded" onClick={() => handleButton('100')}>100</button>
  <button className="h-10 w-20 bg-green-500 text-white hover:bg-green-700 rounded" onClick={() => handleButton('1000')}>1000</button>
  <button className="h-10 w-20 bg-red-500 text-white hover:bg-red-700 rounded" onClick={() => handleButton('Clear')}>Clear</button>
  <button className="h-10 w-60 col-span-2 bg-green-500 text-white hover:bg-green-700 rounded" onClick={() => setToggleInput(!toggleInput)}>Done</button>
</div>)}
      </div>
      {isOpen && (
        <div className="popup-overlay fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center" onClick={handleOverlayClick}>
          <div className="popup-content bg-gray-200 rounded-lg shadow-md p-8 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4" >
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
  );
}
