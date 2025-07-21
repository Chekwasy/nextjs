"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { mainStateReducer } from '@/store/slices/mainslice';
import { StoreState } from '../tools/s_interface';

export default function Nav() {
  //usedispatch to be able to write to store
  const dispatch = useDispatch();
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  const [menuOpen, setMenuOpen] = useState(false);
  //to set message to display 
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  const [picUpdated, setPicUpdated] = useState(Date.now());
  
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
  const handleLogout = () => {
    axios.get('/api/disconnect', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then((response) => {
      dispatch(mainStateReducer({logged: false, played: storeItems.mainSlice.played, me: storeItems.mainSlice.me, buttonState: storeItems.mainSlice.buttonState }));
      setMsg(response.data.message);
      setIsOpen(true);
    })
    .catch(error => {
      setMsg(error.message);
      setIsOpen(true);
    });
  };
  useEffect(() => {
    axios.get('/api/getme', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then(async (response) => {
        const dd = response;
        axios.get('/api/getsavedgames', {
        headers: {
          tok: Cookies.get('trybet_tok'),
        }})
          .then(async (res) => {
            dispatch(mainStateReducer({logged: dd.data.logged, played: res.data.savedgames, me: dd.data.me, buttonState: res.data.savedbuttons}));
          })
          .catch(error => {
            console.log(error.message);
            dispatch(mainStateReducer({logged: dd.data.logged, played: storeItems.mainSlice.played, me: dd.data.me, buttonState: storeItems.mainSlice.buttonState}));
          });
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);



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
    const tok = Cookies.get('trybet_tok') || '';
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
        console.log(response.data.message);
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
          <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
              <div className=" md:hidden font-bold text-white ">
                { `${storeItems ? storeItems.mainSlice.me.currency : ''} ${storeItems ? new Intl.NumberFormat().format(parseFloat(storeItems.mainSlice.me.accbal === '' ? '0' : storeItems.mainSlice.me.accbal)) : ''}` }
              </div>
          </div>
          <div className='hover:bg-green-200 md:hidden rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/reload.svg" alt="Reload" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Reset </span>
                    </div>
                  </div>
          </div>
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
            {storeItems && storeItems.mainSlice.logged && (<li>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group font-bold text-white  ">
                    { `${storeItems ? storeItems.mainSlice.me.currency : ''} ${storeItems ? new Intl.NumberFormat().format(parseFloat(storeItems.mainSlice.me.accbal === '' ? '0' : storeItems.mainSlice.me.accbal)) : ''}` }
                  </div>
                </div>
            </li>)}
            {storeItems && storeItems.mainSlice.logged && (<li>
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
            {storeItems.mainSlice && storeItems.mainSlice.logged && (<li>
              <Link href={'/bets'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/games.svg" alt="Bets" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Bets </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>)}
            {storeItems.mainSlice && !storeItems.mainSlice.logged && (<li>
              <Link href={'/auth/signup'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/signup.svg" alt="Signup" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Signup </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>)}
            {storeItems.mainSlice && !storeItems.mainSlice.logged && (<li>
              <Link href={'/auth/login'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/login.svg" alt="Login" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Login </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>)}
            {storeItems.mainSlice && storeItems.mainSlice.logged && (<li>
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
            </li>)}
            <li>
              <Link href={'/two2win'}>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group">
                    <Image src="/icons/2odds.svg" alt="Two2Win" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Two2Win </span>
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
            {storeItems && storeItems.mainSlice.logged && (<li>
                <div className='hover:bg-green-200 rounded text-gray-700 hover:text-white flex items-center relative'>
                  <div className="group" onClick={() => handleLogout()}>
                    <Image src="/icons/logout.svg" alt="Logout" width={35} height={35} />
                    <div className="absolute invisible group-hover:visible transition-opacity duration-200 -mt-1 ml-6">
                      <span className="bg-gray-800 text-gray-100 text-sm px-2 py-1 rounded"> Logout </span>
                    </div>
                  </div>
                </div>
            </li>)}
          </ul>

          
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
          
          {menuOpen && (
            <ul
              className='md:hidden flex flex-col items-center justify-center bg-green-200 text-gray-800 absolute top-full right-0 w-48 py-2 border border-gray-800 z-20'
            >
              <li className='px-4 py-2 hover:bg-green-500'>
                <button
                  className='md:hidden flex flex-row items-center justify-center w-8 h-8 hover:text-white'
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Image
                    src="/icons/close.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm'>Close</div>
                </button>
              </li>
             <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/'}>
                  <div className='text-gray-700 flex-row hover:text-white flex items-center'>
                    <Image
                    src="/icons/home.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Home</div>
                  </div>
                </Link>
              </li>
              {storeItems.mainSlice && !storeItems.mainSlice.logged && (<li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/auth/signup'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/signup.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Signup</div>
                  </div>
                </Link>
              </li>)}
              {storeItems.mainSlice && !storeItems.mainSlice.logged && (<li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/auth/login'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/login.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Login</div>
                  </div>
                </Link>
              </li>)}
              {storeItems.mainSlice && storeItems.mainSlice.logged && (<li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/bets'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/games.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Bets</div>
                  </div>
                </Link>
              </li>)}
              {storeItems.mainSlice && storeItems.mainSlice.logged && (<li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/profile'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/profile.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Profile</div>
                  </div>
                </Link>
              </li>)}
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/two2win'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/2odds.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700'>Two2Win</div>
                  </div>
                </Link>
              </li>
              <li className='px-4 py-2 hover:bg-gray-700'>
                <Link href={'/about'}>
                  <div className='text-gray-700 hover:text-white flex flex-row items-center'>
                    <Image
                    src="/icons/about.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-gray-700 w-4/5'>About</div>
                  </div>
                </Link>
              </li>
              {storeItems && storeItems.mainSlice.logged && (<li>
                <div onClick={() => handleLogout()} className='text-gray-700 hover:text-red-700 cursor-pointer flex flex-row items-center'>
                  <Image
                    src="/icons/logout.svg"
                    alt=""
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <div className='text-sm text-red-500 w-4/5'>Logout</div>
                </div>
              </li>)}
            </ul>
          )}
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
      </nav>
  );
}
