"use client"
import React, { useState, useEffect } from 'react';
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
 				 Esd: ''
   }]
  }]);
  const [dateelist, setDateelist] = useState([
    { date: '2024-03-01', indent: 0 },
    { date: '2024-03-02', indent: 1 },
    { date: '2024-03-03', indent: 2 },
    { date: '2024-03-04', indent: 3 },
    { date: '2024-03-05', indent: 4 },
    { date: '2024-03-06', indent: 5 },
    { date: '2024-03-07', indent: 6 },
    { date: '2024-03-08', indent: 7 },
  ]);

  const [datee, setDatee] = useState(dateelist[0].date);
  const [dateeIndent, setDateeIndent] = useState(dateelist[0].indent);
  const [showList, setShowList] = useState(false);
  useEffect(() => {
    axios.get(`api/getgames?date=${dateeIndent.toString()}`)
    .then(async (response) => {
        const dd = response;
        setGames(dd.data.games);
	setDateelist(dd.data.dates);
    })
    .catch(error => {
      console.log(error.message);
    });
  }, [datee, dateeIndent]);
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
        <button onClick={handlePrevious}>Previous</button>
        <div className="relative">
          <button onClick={() => setShowList(!showList)}>{datee}</button>
          {showList && (
            <div className="absolute bg-white shadow-lg p-4 w-28">
              {dateelist.map((item) => (
                <div key={item.date} onClick={() => handleDateSelect(item.date, item.indent)}>
                  {item.date}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleNext}>Next</button>
      </div>
      <div>Selected Date: {datee}</div>
      <div>Selected Indent: {dateeIndent}</div>
    </div>
        <button className="lg:hidden" aria-label="Open sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 mt-12">
       
      </div>
      {/* Sidebar */}
      <div className={`fixed top-16 right-0 h-screen w-96 bg-white shadow-lg transform transition duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`} id="sidebar">
        <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="font-bold text-lg">Sidebar Heading</h2>
          <button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 mt-12">
          {games}
        </div>
      </div>
      {/* Overlay */}
      <div className={`fixed top-16 left-0 h-screen w-screen bg-transparent lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} id="overlay" onClick={() => setSidebarOpen(false)}></div>
    </div>
  );
}
