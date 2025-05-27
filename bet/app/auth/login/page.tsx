"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

//function to check ASCII value usage

function Page() {
  // For switching to home after authentication
  const router = useRouter();
  //Store email value
  const [email, setEmail] = useState('');
  //store password value
  const [password, setPassword] = useState('');
  //to set message to display 
  const [msg, setMsg] = useState('This for popup message!');
  //control message open or close
  const [isOpen, setIsOpen] = useState(false);
  //Check password correct 
  const [cpwd, setCpwd] = useState(true);
  //Check email correct
  const [cemail, setCemail] = useState(true);

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
    const otherChx = `~!@#%&_{}[].;<>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`;
    setPassword(nwval);
    //Validates password entered
    if (!(nwval.length > 5) || 
        !checkpwd(nwval)) {
        setCpwd(false);
    } else {
        setCpwd(true);
    }
  };
  //Handles submission of Login form
  const handleLSubmit = (e: FormEvent<HTMLFormElement>) => {
    //prevent form default submission 
    e.preventDefault();
    if (cemail && cpwd && email !== '' && password!== '') {
	//Change password and email to a base64 string
    	const encodestr = btoa(email + ':' + password);
    	//Api call to connect 
    	axios.post('/api/connect', {
    	  auth_header: `encoded ${encodestr}`,
   	 })
   	 .then(async (response) => {
    	  await Cookies.set('tok', response.data.token, { expires: 7, path: '/', });
    	  setMsg("Login Successful");
   	   setIsOpen(true);
   	   router.push("/");
  	  })
   	 .catch(error => {
   	   console.log(error.message);
   	   setMsg("Login Unsuccessful");
     	 setIsOpen(true);
   	 });
    }
};
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-screen flex justify-center items-center"
      >
        <div className="bg-gray-500 rounded-lg shadow-lg p-8 xs:w-full sm:w-1/2 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
          <h2 className="text-3xl font-bold text-green-500 mb-4">Login</h2>
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
          <form onSubmit={handleLSubmit}>
            <div className="mb-4">
              <span className="block text-gray-300 text-sm font-bold mb-2">{'Allowed symbols ~!@#%&_{}[].;<>'}</span>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none ${cemail ? 'border-gray-200' : 'border-red-500'}`}
                id="email"
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                required
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none ${cpwd ? 'border-gray-200' : 'border-red-500'}`}
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                required
                onChange={handlePasswordChange}
              />
            </div>
            <Link href={'/auth/signup'}>
                <div className='text-gray-300 hover:text-white flex items-center'>Signup</div>
            </Link>
            <button
              className="bg-green-500 hover:bg-green-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
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
