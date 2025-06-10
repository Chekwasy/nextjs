"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';


export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [datee, setDatee] = useState(dateelist[0].date);
  const [dateeIndent, setDateeIndent] = useState(0);
  const [eg, setEg] = useState([{date: ''}]);
  const [showList, setShowList] = useState(false);
const load = async () => {
	axios.get(`api/getgames?date=${dateelist[0].indent}`)
    .then(async (response) => {
      const dd = response.data;
      setGames(dd.games);
	setEg(dd.datee);
	    setDateelist(dd.datee);
	    setDatee(dd.datee[dateeIndent].date)
    })
    .catch(error => {
      console.log(error.message);
    });
};
  useEffect(() => {
    load();
  }, [dateeIndent]);
  const handleDateSelect = (date: string, indent: number) => {
    setDatee(date);
    setDateeIndent(indent);
    setShowList(false);
  };

  const handleNext = () => {
    const currentIndex = dateelist.findIndex((item) => item.date === datee);
    if (currentIndex < dateelist.length - 1) {
      setDatee(dateelist[currentIndex + 1].date);
      setDateeIndent(dateelist[currentIndex + 1].indent);
    }
  };

  const handlePrevious = () => {
    const currentIndex = dateelist.findIndex((item) => item.date === datee);
    if (currentIndex > 0) {
      setDatee(dateelist[currentIndex - 1].date);
      setDateeIndent(dateelist[currentIndex - 1].indent);
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
            <ul className="absolute bg-white shadow-lg p-4 w-40 text-gray-800 rounded-lg left-0 ml-[-22px]">
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
	      <div className="hidden lg:block">
	      </div>
        <button className="lg:hidden" aria-label="Open sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 mt-12">
       <div>
        {games.map((game, index) => (
        <div key={index}><h3>{game.subtitle}</h3>{game.titleCountry}</div>
      ))}
    </div>
      </div>
      {/* Sidebar */}
      <div className={`absolute top-0 right-0 h-screen w-96 bg-white shadow-lg lg:block ${sidebarOpen ? 'block' : 'hidden'}`} id="sidebar" style={{ top: '65px' }}>
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="font-bold text-lg">Sidebar Heading</h2>
          <button className="lg:hidden" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
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
      <div className={`fixed top-16 left-0 h-screen w-screen bg-transparent lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} id="overlay" onClick={() => setSidebarOpen(false)}></div>
    </div>
  );
}
