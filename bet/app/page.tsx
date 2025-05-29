import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      >
      <nav className='bg-green-800 py-4 fixed top-0 left-0 w-full z-10'>
        <div className='container mx-auto px-4 flex justify-between'>
          <Link href={'/'} className='md:flex-shrink-0 flex items-top'>
            <div className='text-lg font-bold text-white'>TryBet</div>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { const imgUpload = document.getElementById('image-upload'); if (imgUpload) {imgUpload.click()}}}
              className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden"
            >
              <Image
                src="/api/getpic"
                alt="Upload Image"
                layout="fixed"
                width={40}
                height={40}
                objectFit="cover"
                className="rounded-full"
                key={picUpdated}
              />
            </button>
          </div>
          <input
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          { logged && (<div className='flex items-center space-x-4'>
            <div className='text-gray-300'>{userEmail}</div>
          </div>)}
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
            {logged && (<li>
              <div onClick={() => handleLogout()} className='text-gray-300 hover:text-red-700 cursor-pointer flex items-center'>Logout</div>
            </li>)}
          </ul>

          {!menuOpen && (
            <button
              className='md:hidden text-gray-200 flex items-center justify-center w-8 h-8 hover:text-white'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Menu
            </button>
          )}
          {menuOpen && (
            <ul
              className='md:hidden flex flex-col items-center justify-center bg-gray-400 text-gray-300 absolute top-full right-0 w-48 py-2 border border-gray-700 z-20'
            >
              <li className='px-4 py-2 hover:bg-gray-700'>
                <button
                  className='md:hidden flex items-center justify-center w-8 h-8 hover:text-white'
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  X
                </button>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/create'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    Create
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/read'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    Read
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/update'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    Update
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/delete'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    Delete
                  </div>
                </Link>
              </li>
              {logged && (<li>
                <div onClick={() => handleLogout()} className='text-gray-100 hover:text-red-700 cursor-pointer flex items-center'>Logout</div>
              </li>)}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
