"use client"
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function delayedCode() {
  await new Promise(resolve => setTimeout(resolve, 20000));
    setErrorMessage('');
    setSuccessMessage('');
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };
  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === confirmPassword) {
      const encodestr = btoa(email + ':' + password);
      axios.post('/api/puser', {
        emailpwd: `encoded ${encodestr}`,
        firstname: firstname, 
        lastname: lastname,
      })
      .then(async (response) => {
        console.log(response.data);
        setSuccessMessage('Signup Successful');
        delayedCode();
      })
      .catch(error => {
        console.log(error.message);
        setErrorMessage('Login Unsuccessful');
        delayedCode();
      });
    } else { setErrorMessage('Password not match'); delayedCode();}
  };
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-screen flex justify-center items-center"
      style={{
        backgroundImage: 'url(/images/landing-background.svg)'
      }}>
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 w-1/3">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Signup</h2>
          <div>
            {errorMessage.length && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
          </div>
          {successMessage.length && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                Firstname
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="firstname"
                type="text"
                placeholder="Firstname"
                name="firstname"
                value={firstname}
                onChange={handleFirstnameChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                Lastname
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="lastname"
                type="text"
                placeholder="Lastname"
                name="lastname"
                value={lastname}
                onChange={handleLastnameChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <Link href={'/auth/login'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Login</div>
            </Link>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
              onClick={handleSubmit}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
