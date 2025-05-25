"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Page() {
  // For switching to home after authentication
  const router = useRouter();
  //Store email value
  const [email, setEmail] = useState('');
  //store password value
  const [password, setPassword] = useState('');
  //to set message to display 
  const [setMsg, setSetMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  //Check password correct 
  const [cpwd, setCpwd] = useState(false);
  //Check email correct
  const [cemail, setCemail] = useState(false);

  //Sets and check what was typed for email
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  //Sets and check what was typed for password 
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  //Handles submission of Login form
  const handleLSubmit = (e: FormEvent<HTMLFormElement>) => {
    //prevent form default submission 
    e.preventDefault();
    
    //Change password and email to a base64 string
    const encodestr = btoa(email + ':' + password);
    //Api call to connect 
    axios.post('/api/connect', {
      auth_header: `encoded ${encodestr}`,
    })
    .then(async (response) => {
      await Cookies.set('tok', response.data.token, { expires: 7, path: '/', });
      setSuccessMessage("Login Successful");
      delayedCode1();
      router.push("/");
    })
    .catch(error => {
      console.log(error.message);
      setErrorMessage("Login Unsuccessful");
      delayedCode();
    });
  };
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-screen flex justify-center items-center"
      style={{
        backgroundImage: 'url(/images/landing-background.svg)'
      }}>
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 w-1/3">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Admin Login</h2>
          {(errorMessage.length !== 0) && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{errorMessage}</span>
              </div>
          )}
          {(successMessage.length !== 0) && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <form onSubmit={handleLSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="email"
                type="text"
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
            <Link href={'/auth/signup'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Signup</div>
            </Link>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
