"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [logged, setLogged] = useState(false);
  const [loggedMsg, setLoggedMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [failMsg, setFailMsg] = useState(false);
  const [picUpdated, setPicUpdated] = useState(Date.now());
  const checkLogged = () => {
    axios.get('/api/getme', {
      headers: {
        tok: Cookies.get('tok'),
    }})
    .then(async (response) => {
        const dd = response;
        setUserEmail(dd.data.email);
        setLogged(true);
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  async function delayedCode() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoggedMsg(false);
    setSuccessMsg(false);
    setFailMsg(false);
  };
  const handleLogout = () => {
    axios.get('/api/disconnect', {
      headers: {
        tok: Cookies.get('tok'),
    }})
    .then(async (response) => {
      console.log(response.data);
      setUserEmail('');
      setLogged(false);
      setLoggedMsg(true);
      delayedCode();
    })
    .catch(error => {
      console.log(error.message);
    });
  };
  useEffect(() => {
    checkLogged();
  }, []);


  //upload part
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setPicUpdated(Date.now());
  if (event.target.files !== null && event.target.files.length !== 0) {
    const imageFile = event.target.files[0];

    // Check if the selected file is an image
    if (!imageFile.type.startsWith('image/')) {
      setFailMsg(true);
      delayedCode();
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
        setSuccessMsg(true);
        delayedCode();
      })
      .catch(error => {
        console.log(error.message);
        setFailMsg(true);
        delayedCode();
      });
    };
    fileReader.readAsDataURL(imageFile);
  }
};
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      >
      <nav className='bg-green-800 py-4 fixed top-0 left-0 w-full z-10'>
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
            <li>
              <Link href={'/create'}>
                <div className='text-gray-700 hover:text-white flex items-center'>
                <Image
                  src="/icons/games.png"
                  alt="Games"
                  width={40}
                  height={40}
                />
                </div>
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
