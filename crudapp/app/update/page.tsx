"use client"
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';

const page = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [userData, setUserData] = React.useState({
        age: '',
        department: '',
        address: '',
        email: '',
        mobile: '',
        tok: Cookies.get('tok'),
      });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [logged, setLogged] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
      const [loggedMsg, setLoggedMsg] = React.useState(false);
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
      async function delayedCode2() {
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
            delayedCode2();
        })
        .catch(error => {
        });
      };
      React.useEffect(() => {
        checkLogged();
      }, []);
    async function delayedCode() {
      await new Promise(resolve => setTimeout(resolve, 10000));
      setErrorMessage(null);
      setSuccessMessage(null);
    };
      const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('/api/updateworker', userData)
      .then(async (response) => {
        setSuccessMessage('Worker Successfully Updated');
        setUserData({
        age: '',
        department: '',
        address: '',
        mobile: '',
        email: '',
        tok: Cookies.get('tok'),
        });
        delayedCode();
      })
      .catch(error => {
        setErrorMessage('Update Unsuccessful');
        delayedCode();
      });
      };
  return (
    <div>
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
        {loggedMsg && (<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
          <div className='bg-gray-300 rounded-lg shadow-lg p-8 w-1/2 text-center'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>Logged Out Successfully!</h1>
            <p className='text-gray-700 text-lg mb-4'>You have been logged out of the system.</p>
          </div>
        </div>
        )}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4 mt-16">
            <h2 className="text-lg font-bold mb-4">Update User Data</h2>
            {errorMessage && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="email"
                        >
                        Email
                        </label>
                        <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="email"
                        type="text"
                        name="email"
                        value={userData.email}
                        placeholder='Enter email to apply update'
                        onChange={handleChange}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="age"
                        >
                        Age
                        </label>
                        <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="age"
                        type="number"
                        name="age"
                        value={userData.age}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="department"
                        >
                        Department
                        </label>
                        <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="department"
                        type="text"
                        name="department"
                        value={userData.department}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="address"
                        >
                        Address
                        </label>
                        <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="address"
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="mobile"
                        >
                        Mobile
                        </label>
                        <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="mobile"
                        type="text"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                >
                Submit
                </button>
            </form>
        </div>
    </div>
  )
}

export default page
