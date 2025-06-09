"use client"
import React, { useEffect } from 'react';


export default function Main() {
  useEffect(() => {
  document.querySelector('button[aria-label="Open sidebar"]').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('translate-x-full');
    document.getElementById('overlay').classList.toggle('hidden');
  });
}, []);
  return (
    <div className="relative bg-white rounded-b-lg border-4 border-green-300">
      <div className="absolute top-0 left-0 w-full bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="font-bold text-lg">Heading</h2>
        <button className="lg:hidden" aria-label="Open sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="p-4 mt-12">
        
      </div>
          {/* Sidebar */}
      <div className="fixed top-0 right-0 h-screen w-80 bg-white shadow-lg transform translate-x-full transition duration-300 ease-in-out lg:hidden" id="sidebar">
        <div className="p-4">
          
        </div>
      </div>
      {/* Overlay */}
      <div className="fixed top-0 left-0 h-screen w-screen bg-transparent lg:hidden" id="overlay" onClick={() => document.getElementById('sidebar').classList.remove('translate-x-full')}></div>
    </div>
  );
}
