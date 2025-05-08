"use client"
import Link from 'next/link';
import React from 'react';


export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      style={{
        backgroundImage: 'url(/images/landing-background.svg)'
      }}
      >
      <nav className='bg-gray-800 py-4 fixed top-0 left-0 w-full z-10'>
        <div className='container mx-auto px-4 flex justify-between'>
          <Link href={'/'} className='md:flex-shrink-0 flex items-top'>
            <div className='text-lg font-bold text-white'>CrudApp</div>
          </Link>
          <ul className='md:flex hidden items-center space-x-4'>
            <li>
              <Link href={'/create'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Create</div>
              </Link>
            </li>
            <li>
              <Link href={'/read'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Read</div>
              </Link>
            </li>
            <li>
              <Link href={'/update'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Update</div>
              </Link>
            </li>
            <li>
              <Link href={'/delete'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Delete</div>
              </Link>
            </li>
          </ul>
          {!menuOpen && (<button className='md:hidden text-gray-200 flex items-center justify center w-8 h-8 hover:text-white'
            onClick={() => setMenuOpen(!menuOpen)}>
            {'Menu'}
          </button>)}
          {menuOpen && (
            <ul className='md:hidden flex flex-col items-center justify-center bg-gray-400 text-gray-300 absolute top-full right-0 w-48 py-2 border border-gray-700 z-20'>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <button className='md:hidden flex items-center justify-center w-8 h-8 hover:text-white'
                  onClick={() => setMenuOpen(!menuOpen)}>
                  X
                </button>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/create'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>Create</div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/read'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>Read</div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/update'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>Update</div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/delete'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>Delete</div>
                </Link>
              </li>
            </ul>
          )}

        </div>
      </nav>
    </div>
  );
}
