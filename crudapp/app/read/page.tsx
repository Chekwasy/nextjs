"use client"
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const page = () => {

    const [pg, setPg] = React.useState(1);
    const [items, setItems] = React.useState([
      {
        id: 1,
        firstname: '',
        lastname: '',
        age: '',
        department: '',
        address: '',
        mobile: '',
        sex: '',
        nationality: '',
        email: '',
        dateadded: '',
        lastupdate: '',
      },
    ]);
    const read = () => {
        axios.get('/api/viewworkers', {
          headers: {
        tok: Cookies.get('tok'),
        pg: pg.toString(),
        }})
      .then(async (response: Response) => {
          const dd = response.data.workers;
          if (dd.length !== 0) {
          setItems();
          } else {
              if (pg > 1) {
              setPg(pg - 1);
              }
          }
      })
      .catch(error => {
      });
    };
    const handlePrevious = () => {
        if (pg !== 1) {
            setPg(pg - 1);
        }
    };
    const handleNext = () => {
        setPg(pg + 1);
    };
    React.useEffect(() => {
      read();
    }, [pg]);
    
    React.useEffect(() => {
      read();
    }, []);
    const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div>
        <nav className='bg-gray-800 py-4 fixed top-0 left-0 w-full z-10'>
            <div className='container mx-auto px-4 flex justify-between'>
            <Link href={'/'} className='md:flex-shrink-0 flex items-top'>
                <div className='text-lg font-bold text-white'>CrudApp</div>
            </Link>
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
            </ul>
            {!menuOpen && (<button className='md:hidden text-gray-300 flex items-center justify center w-8 h-8 hover:text-white'
                onClick={() => setMenuOpen(!menuOpen)}>
                {'Menu'}
            </button>)}
            {menuOpen && (
                <ul className='md:hidden flex flex-col items-center justify-center bg-gray-400 text-gray-300 absolute top-full right-0 w-48 py-2 border border-gray-700 z-20'>
                <li className='px-4 py-2 hover:bg-gray-700'>
                    <button className='md:hidden flex items-center text-gray-300 justify-center w-8 h-8 hover:text-white'
                    onClick={() => setMenuOpen(!menuOpen)}>
                    X
                    </button>
                </li>
                <li className='px-4 py-2 hover:bg-gray-700'>
                    <Link href={'/create'}>
                    <div className='text-gray-100 hover:text-white flex items-center'>Create</div>
                    </Link>
                </li>
                <li className='px-4 py-2 hover:bg-gray-700'>
                    <Link href={'/read'}>
                    <div className='text-gray-100 hover:text-white flex items-center'>Read</div>
                    </Link>
                </li>
                <li className='px-4 py-2 hover:bg-gray-700'>
                    <Link href={'/update'}>
                    <div className='text-gray-100 hover:text-white flex items-center'>Update</div>
                    </Link>
                </li>
                <li className='px-4 py-2 hover:bg-gray-700'>
                    <Link href={'/delete'}>
                    <div className='text-gray-100 hover:text-white flex items-center'>Delete</div>
                    </Link>
                </li>
                </ul>
            )}

            </div>
        </nav>
        {items.map((item) => (<div key={item.email} className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 mt-16">
            <h2 className="text-xl font-bold mb-4">{`${item.firstname} ${item.lastname} User Data`}</h2>
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">First Name:</span>
                            <span className="ml-2 text-black">{item.firstname}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Last Name:</span>
                            <span className="ml-2 text-black">{item.lastname}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Age:</span>
                            <span className="ml-2 text-black">{item.age}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Department:</span>
                            <span className="ml-2 text-black">{item.department}</span>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Address:</span>
                            <span className="ml-2 text-black">{item.address}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Mobile Number:</span>
                            <span className="ml-2 text-black">{item.mobile}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Sex:</span>
                            <span className="ml-2 text-black">{item.sex}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Nationality:</span>
                            <span className="ml-2 text-black">{item.nationality}</span>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Email:</span>
                            <span className="ml-2 text-black">{item.email}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Date Added:</span>
                            <span className="ml-2 text-black">{item.dateadded}</span>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mb-4">
                            <span className="font-bold text-black">Last Update:</span>
                            <span className="ml-2 text-black">{item.lastupdate}</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <div className="flex justify-center mb-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={() => handlePrevious()}>
            Previous
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={() => handleNext()}>
            Next
          </button>
        </div>
    </div>
  )
}

export default page
