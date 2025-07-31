import { v4 } from 'uuid';


//function to make id
export const makeID = () => {
	return v4();
};

//Checks pwd and email characters
export const checkpwd = (strr : string) => {
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