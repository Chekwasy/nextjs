"use client"
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


export default function Home() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [logged, setLogged] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [loggedMsg, setLoggedMsg] = React.useState('');
  const checkLogged = () => {
    axios.get('/api/getme', {
      headers: {
        tok: Cookies.get('tok'),
    }})
    .then(async (response: Response) => {
        setUserEmail(response.data.email);
        setLogged(true);
    })
    .catch(error => {
    });
  };
  async function delayedCode() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoggedMsg(false);
  };
  const handleLogout = () => {
    axios.get('/api/disconnect', {
      headers: {
        tok: Cookies.get('tok'),
    }})
    .then(async (response: Response) => {
        setUserEmail('');
        setLogged(false);
        setLoggedMsg(true);
    })
    .catch(error => {
    });
  };
  React.useEffect(() => {
    checkLogged();
  }, []);
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
          { logged && (<div className='flex items-center space-x-4'>
            <div className='text-gray-300'>{userEmail}</div>
            <div onClick={() => checkLogged()} className='w-10 h-10 rounded-full bg-gray-300 overflow-hidden'>
              <Image src={'/images/landing-background.svg'} alt='Profile Picture' layout='fill' objectFit='cover' />
            </div>
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
            <li>
              <div onClick={() => handleLogout()} className='text-gray-300 hover:text-white flex items-center'>Logout</div>
            </li>
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
              <li>
                <div onClick={() => handleLogout()} className='text-gray-300 hover:text-white flex items-center'>Logout</div>
              </li>
            </ul>
          )}
        </div>
      </nav>
      {loggedMsg && (<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg p-8 w-1/2 text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>Logged Out Successfully!</h1>
          <p className='text-gray-700 text-lg mb-4'>You have been logged out of the system.</p>
        </div>
      </div>
      )}
      <div className='flex flex-col justify-start h-screen'>
        <div className='bg-gray-100 rounded-lg shadow-lg p-8 w-1/2 ml-4 mt-30'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>Add Worker Details</h1>
          <p className='text-gray-700 text-lg mb-4'>
            {`Welcome to our worker management system. To get started, please click on the create button top right or via the menu.`}
          </p>
          <p className='text-gray-700 text-lg mb-4'>
            {`If you already have an account, please login to access our system. If not, please signup to create a new account.`}
          </p>
          <div className='mt-4'>
            <p className='text-gray-700 text-sm'>
              Already have an account?{' '}
              <Link className='text-blue-500 hover:text-blue-700' href='/auth/login'>
                Login
              </Link>
            </p>
            <p className='text-gray-700 text-sm'>
              Dont have an account?{' '}
              <Link className='text-blue-500 hover:text-blue-700' href='/auth/signup'>
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
