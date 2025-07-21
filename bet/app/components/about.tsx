"use client"
import { useState, useEffect,} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


export default function About() {
  const [about, setAbout] = useState(
    [
      {
        title: 'Goal',
        body: 'jdsjdsj skjsjsjk jsjjsjk ksskjjsjks lsksjjkj jkskdskj kskjhhsh kdhfkhdsfkh kdshfhkshfkhs kdhdfkhdsflsjd kdshhshd kfksdhfl lllflsdl llhdflhlshh lsldllshdf nlflsdlfl hsdlhflhsdlhls kkscsjcsjc kkhjj',
      }
    ]
  );
  useEffect(() => {
    axios.get('/api/getabout', {
      headers: {
        tok: Cookies.get('trybet_tok'),
    }})
    .then((response) => {
      setAbout(response.data.about);
    })
    .catch(error => {
      console.log(error.message);
    });
  }, []);
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      <div className=" bg-gray-200 flex flex-col p-2 md:w-4/5 w-11/12 mx-auto">
        <div className='flex w-1/2 text-center font-bold p-4 font-bold rounded-lg shadow-md bg-blue-500 text-white b-2 border-gray-400 text-2xl mx-auto'>About Us</div>
      </div>
      <div className="bg-gray-200 flex flex-col md:w-4/5 w-11/12 mx-auto">
        {about.map((item, index) => (
          <div key={index}>
            <div className='flex font-bold p-4 rounded-lg shadow-md text-white text-lg bg-gray-500'>{item.title}</div>
            <p className='flex p-4 bg-green-200 rounded-lg text-gray-800'>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
    );
}
