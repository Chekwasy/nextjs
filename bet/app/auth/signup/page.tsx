"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';

function Page() {
  //Store firstname value
  const [firstname, setFirstname] = useState('');
  //Store lastname value
  const [lastname, setLastname] = useState('');
  //Store email value
  const [email, setEmail] = useState('');
  //store password value
  const [password, setPassword] = useState('');
  //Store confirmation password 
  const [confirmPassword, setConfirmPassword] = useState('');
  //to set message to display 
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  //Check password correct 
  const [cpwd, setCpwd] = useState(true);
  //Check email correct
  const [cemail, setCemail] = useState(true);
  //Check confirm password 
  const [cpwd2, setCpwd2] = useState('');
  //Check firstname 
  const [cfirstname, setCfirstname] = useState('');
  //Check lastname
  const [clastname, setClastname] = useState('');

  //handle close message popup
  const handleClose = () => {
      setIsOpen(false);
  };
  //Checks pwd and email characters
  const checkpwd = (strr) => {
	  const len = strr.length;
	  if (len > 50) {
		  return false;
	  }
	  const otherChx = `~!@#%&_{}[].;<>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`;
	  for (let i = 0; i < len; i++) {
		  if (!(otherChx.includes(strr[i]))) {
			  return false;
		  }
	  }
	  return true;
  };
  //Handle overlay click to close message popup
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      handleClose();
    }
  };
  //Sets and check what was typed for email
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setEmail(nwval);
    //validates email entered
    if (!(nwval.length > 5) || !checkpwd(nwval) || !nwval.includes('@') || !nwval.includes('.')) {
      setCemail(false);
    } else {
      setCemail(true);
    }
  };
  //Sets and check what was typed for password 
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setPassword(nwval);
    //Validates password entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setCpwd(false);
    } else {
        setCpwd(true);
    }
  };
  //Sets and check value for firstname
  const handleFirstnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setFirstname(nwval);
    //Validates firstname entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setCfirstname(false);
    } else {
        setCfirstname(true);
    }
  };
  const handleLastnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setLastname(nwval);
    //Validates lastname entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setClastname(false);
    } else {
        setClastname(true);
    }
  };
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setConfirmPassword(nwval);
    //Validates confirm password entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setCpwd2(false);
    } else {
        setCpwd2(true);
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password === confirmPassword && 
	cemail && cpwd && cpwd2 && cfirstname && 
	clastname && email !== '' && password !== '' && 
	confirmPassword !== '' && firstname !== '' &&
	lastname !== ''
       ) {
      const encodestr = btoa(email + ':' + password);
      axios.post('/api/puser', {
        emailpwd: `encoded ${encodestr}`,
        firstname: firstname, 
        lastname: lastname,
      })
      .then(async (response) => {
        setMsg(response.data);
        setIsOpen(true);
      })
      .catch(error => {
        setMsg(error.message);
        setIsOpen(true);
      });
    } else { setMsg('Submission error. Check input data'); setIsOpen(true);}
  };
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-screen flex justify-center items-center">
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 xs:w-full sm:w-1/2 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
          <h2 className="text-3xl font-bold text-green-500 mb-4">Signup to TryBet</h2>
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
                <h2 className="text-lg font-bold mb-4">{setMsg}</h2>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <span className="block text-gray-300 text-sm font-bold mb-2">{'Allowed symbols ~!@#%&_{}[].;<>'}</span>
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
		required 
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
		required 
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
		required 
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
		required 
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
		required 
		value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <Link href={'/auth/login'}>
                <div className='text-blue-500 hover:text-white flex items-center'>Login</div>
            </Link>
            <button
              className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
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
