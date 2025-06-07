"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logged, setLogged] = useState(true);
  const [picUpdated, setPicUpdated] = useState(Date.now());
  const handleLogout = () => {
    axios.get('/api/disconnect', {
      headers: {
        tok: Cookies.get('tok'),
    }})
    .then(async (response) => {
      console.log(response.data);
      setLogged(false);
    })
    .catch(error => {
      console.log(error.message);
    });
  };


  //upload part
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setPicUpdated(Date.now());
  if (event.target.files !== null && event.target.files.length !== 0) {
    const imageFile = event.target.files[0];

    // Check if the selected file is an image
    if (!imageFile.type.startsWith('image/')) {
      return;
    }

    const name = 'profilepic';
    const tok = Cookies.get('tok') || '';
    const type = imageFile.type; // Get the image type from the file object

    // Read the file as a data URL
    const fileReader = new FileReader();
    fileReader.onload = async (e: ProgressEvent<FileReader>) => {
      let base64EncodedImage;
      if ((e.target as FileReader).result !== null) {
        const imageDataUrl = (e.target as FileReader).result as string;
        base64EncodedImage = imageDataUrl.split(',')[1];
      }

      // Send the image data to the backend
      await axios.post('/api/picpush', {
        image: base64EncodedImage,
        name,
        tok,
        type, // Send the image type to the backend
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.message);
      });
    };
    fileReader.readAsDataURL(imageFile);
  }
};
  return (
      <nav className='bg-green-700 py-4 fixed top-0 left-0 w-full z-10'>
        <div className='container mx-auto px-4 flex justify-between'>
          <Link href={'/'} className='md:flex-shrink-0 flex items-top'>
            <div className='text-lg font-bold text-white'>TryBet</div>
          </Link>
          <ul className='md:flex hidden items-center space-x-4'>
            <li>
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
            </li>
            {logged && (<li>
              <Link href={'/bal'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group text-gray-800 ">
                    {'N2000'}
                  </div>
                </div>
              </Link>
            </li>)}
            {logged && (<li>
              <Link href={'/reload'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/reload.svg" alt="Reload" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Reset </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>)}
            <li>
              <Link href={'/'}>
                <div className='bg-green-900 hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/home.svg" alt="Home" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Home </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/games'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/games.svg" alt="Games" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Games </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/profile'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/profile.svg" alt="Profile" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Profile </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <Link href={'/about'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/about.svg" alt="About" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Info </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            {logged && (<li>
              <Link href={'/logout'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/logout.svg" alt="Logout" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Logout </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>)}
          </ul>

          {!menuOpen && (
            <button
              className='md:hidden text-gray-200 flex items-center justify-center w-8 h-8 hover:text-white'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Image
                src="/icons/menu.svg"
                alt="Menu"
                width={30}
                height={30}
              />
            </button>
          )}
          {menuOpen && (
            <ul
              className='md:hidden flex flex-col items-center justify-center bg-green-200 text-gray-800 absolute top-full right-0 w-48 py-2 border border-gray-800 z-20'
            >
              <li className='px-4 py-2 hover:bg-green-500'>
                <button
                  className='md:hidden flex items-center justify-center w-8 h-8 hover:text-white'
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Image
                    src="/icons/close.svg"
                    alt="Close"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/games'}>
                  <div className='text-gray-900 hover:text-white flex items-center'>
                    <Image
                    src="/icons/games.svg"
                    alt="Games"
                    width={30}
                    height={30}
                  />
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/profile'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    <Image
                    src="/icons/profile.svg"
                    alt="Profile"
                    width={30}
                    height={30}
                  />
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/about'}>
                  <div className='text-gray-100 hover:text-white flex items-center'>
                    <Image
                    src="/icons/about.svg"
                    alt="About"
                    width={30}
                    height={30}
                  />
                  </div>
                </Link>
              </li>
              {logged && (<li>
                <div onClick={() => handleLogout()} className='text-gray-100 hover:text-red-700 cursor-pointer flex items-center'>
                  <Image
                    src="/icons/logout.svg"
                    alt="Logout"
                    width={30}
                    height={30}
                  />
                </div>
              </li>)}
            </ul>
          )}
        </div>
      </nav>
  );
}
