"use client"
import React, { useState } from 'react';


export default function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
}, []);
  return (
    <div className="relative bg-white rounded-b-lg border-4 border-green-300 mt-16 lg:border-2 lg:w-4/5 mx-auto">
      {/* Your code here */}
      <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="font-bold text-lg">Heading</h2>
        <button className="lg:hidden" aria-label="Open sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 mt-12">
        {/* Your content here */}
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
          {/* Sidebar content here */}
        </div>
      </div>
      {/* Overlay */}
      <div className={`fixed top-16 left-0 h-screen w-screen bg-transparent lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} id="overlay" onClick={() => setSidebarOpen(false)}></div>
    </div>
  );
}
