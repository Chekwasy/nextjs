"use client"
import React, { useState, useEffect, MouseEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';

interface StoreState {
  logged: boolean;
  played: {
    id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      homeodd: string;
      selection: string;
      mStatus: string;
      mResult: string;
      mOutcome: string;
      mScore: string;
  }[];
  me: {
    uID: string;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    accbal: string;
    currency: string;
  }
}


export default function Main() {
  //usedispatch to be able to write to store
  const dispatch = useDispatch();
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state);
  //control to sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
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
  const [eg, setEg] = useState([{date: ''}]);
  //show list of dates
  const [showList, setShowList] = useState(false);
  //load the games data from backend
  const load = async () => {
	  axios.get(`api/getgames?date=${dateeIndent}`)
    .then(async (response) => {
      const dd = response.data;
      setGames(dd.games);
      setEg(dd.datee);
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
    const aa: { 
      logged: boolean; 
      played: number[]; 
      me: { email: string } 
    } = { 
      logged: true, 
      played: [88, 99], 
      me: { email: 'hhh' } 
    };
    dispatch(mainStateReducer(aa));
    console.log(storeItems);
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
  //handle home odd selection
  const handleHos = (m: {id: string; hometeam: string; awayteam: string; homeodd: string; awayodd: string; drawodd: string; Esd: string}, gID: string, gS: string, gT: string) => {
    const pyd: {
      id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      homeodd: string;
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
      homeodd: '',
      selection: '',
      mStatus: '',
      mResult: '',
      mOutcome: '',
      mScore: '',
    };
    let spyd = storeItems.played;
    spyd.push(pyd);
    dispatch(mainStateReducer({logged: storeItems.logged, played: spyd, me: storeItems.me}));
  };
  //handle home odd selection
  const handleDos = (m: {id: string; hometeam: string; awayteam: string; homeodd: string; awayodd: string; drawodd: string; Esd: string}, gID: string, gS: string, gT: string) => {
    const pyd: {
      id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      homeodd: string;
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
      homeodd: '',
      selection: '',
      mStatus: '',
      mResult: '',
      mOutcome: '',
      mScore: '',
    };
  };
  //handle home odd selection
  const handleAos = (m: {id: string; hometeam: string; awayteam: string; homeodd: string; awayodd: string; drawodd: string; Esd: string}, gID: string, gS: string, gT: string) => {
    const pyd: {
      id: string;
      gId: string;
      gSubtitle: string;
      gTCountry: string;
      mktT: string;
      mTime: string;
      hometeam: string;
      awayteam: string;
      homeodd: string;
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
      homeodd: '',
      selection: '',
      mStatus: '',
      mResult: '',
      mOutcome: '',
      mScore: '',
    };
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
        <button aria-label="Open sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
                {game.events.map((match) => (
                  <div key={match.id} className="flex flex-col items-center mb-4 border-b border-gray-200 pb-4">
                    <div className="flex justify-between w-full">
                      <div className="w-1/2 flex flex-col items-center">
                        <div className="text-lg text-center">{match.hometeam}</div>
                        <div className="text-lg text-center">{match.awayteam}</div>
                      </div>
                      <div className="w-1/10 text-lg text-center">
                        {`${match.Esd.substring(8, 10)}:${match.Esd.substring(10, 12)}`}
                      </div>
                      <div className="w-2/5 flex justify-around">
                        <button onClick={() => handleHos(match, game.id, game.titleCountry, game.subtitle)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                          {match.homeodd}
                        </button>
                        <button onClick={() => handleDos(match, game.id, game.titleCountry, game.subtitle)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          {match.drawodd}
                        </button>
                        <button onClick={() => handleAos(match, game.id, game.titleCountry, game.subtitle)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
      <div className={`absolute top-0 right-0 h-screen w-96 bg-white shadow-lg border-4 rounded-lg border-green-300 ${sidebarOpen ? 'block' : 'hidden'}`} id="sidebar" style={{ top: '65px' }}>
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="font-bold text-lg">Sidebar Heading</h2>
          <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 mt-12">
          {eg[0].date}
        </div>
      </div>
      {/* Overlay */}
      <div className={`fixed top-16 left-0 h-screen w-screen bg-transparent ${sidebarOpen ? 'block' : 'hidden'}`} id="overlay" onClick={() => setSidebarOpen(false)}></div>
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
  );
}
