"use client"
import { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';

function Page() {
  //Store email value
  const [email, setEmail] = useState('');
  //Store token value
  const [token, setToken] = useState('');
  //store new password value
  const [newPassword, setNewPassword] = useState('');
  //Store confirmation password 
  const [confirmPassword, setConfirmPassword] = useState('');
  //to set message to display 
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  //Check new password correct 
  const [cnewpwd, setCnewpwd] = useState(true);
  //Check email correct
  const [cemail, setCemail] = useState(true);
  //Check confirm password 
  const [cpwd2, setCpwd2] = useState(true);
  //Check confirm token 
  const [ctoken, setCtoken] = useState(true);
  //Tells the process that is currently running
  const [proCess, setProCess] = useState('enterEmail');

  //handle close message popup
  const handleClose = () => {
      setIsOpen(false);
  };
  //Checks pwd and email characters
  const checkpwd = (strr : string) => {
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
  const handleOverlayClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('popup-overlay')) {
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
  //Sets and check what was typed for token
  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setToken(nwval);
    //validates email entered
    if (!(nwval.length === 6) || !checkpwd(nwval)) {
      setCtoken(false);
    } else {
      setCtoken(true);
    }
  };
  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nwval = e.target.value;
    setNewPassword(nwval);
    //Validates password entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setCnewpwd(false);
    } else {
        setCnewpwd(true);
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
    
    if (proCess === 'enterEmail' && cemail && email !== '') {
      axios.post('/api/sendtok', {
        email: email,
      })
      .then(async (response) => {
        setMsg(response.data);
        setIsOpen(true);
        setProCess('enterToken')
      })
      .catch(error => {
        setMsg(error.message);
        setIsOpen(true);
      });
    }
    if (proCess === 'enterToken' && ctoken && token !== '' && cemail && email !== '') {
        axios.post('/api/checktok', {
            token: token,
            email: email
          })
          .then(async (response) => {
            setMsg(response.data);
            setIsOpen(true);
            setProCess('resetPwd')
          })
          .catch(error => {
            setMsg(error.message);
            setIsOpen(true);
          });
    }
    if ((newPassword === confirmPassword) && proCess === 'resetPwd' && cemail && email !== '' && 
        ctoken && token !== '' &&
        cnewpwd && cpwd2 && 
        newPassword !== '' && confirmPassword !== '') {
        const encodestr = btoa(email + ':' + newPassword);
        axios.post('/api/pwdreset', {
            token: token,
            emailpwd: encodestr,
          })
          .then(async (response) => {
            setMsg(response.data);
            setIsOpen(true);
            setProCess('enterEmail');
            setEmail('');
            setToken('');
            setNewPassword('');
            setConfirmPassword('');
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
          <h2 className="text-3xl font-bold text-green-500 mb-4">Reset Password</h2>
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
          <form onSubmit={handleSubmit}>
            {(proCess === 'enterEmail') && (<div className="mb-4">
                <span className="block text-gray-300 text-sm font-bold mb-2">{'Allowed symbols ~!@#%&_{}[].;<>'}</span>
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
            </div>)}
            {(proCess === 'enterToken') && (<div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="token">
                Enter Email Token
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="token"
                type="text"
                placeholder="Enter Email Token"
                name="token"
		        required 
		        value={token}
                onChange={handleTokenChange}
              />
            </div>)}
            {(proCess === 'resetPwd') && (<div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="newPassword"
                type="password"
                placeholder="New Password"
                name="newPassword"
		        required 
		        value={newPassword}
                onChange={handleNewPasswordChange}
              />
            </div>)}
            {(proCess === 'resetPwd') && (<div className="mb-4">
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
            </div>)}
            <Link href={'/auth/login'}>
                <div className='text-blue-500 hover:text-white flex items-center'>Login</div>
            </Link>
            <button
              className="bg-green-500 hover:bg-green-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Page
