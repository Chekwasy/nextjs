"use client"
import Link from 'next/link';
import React from 'react';

const page = () => {
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
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 mt-16">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">First Name:</span>
                        <span className="ml-2 text-black">John</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Last Name:</span>
                        <span className="ml-2 text-black">Doe</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Age:</span>
                        <span className="ml-2 text-black">30</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Department:</span>
                        <span className="ml-2 text-black">IT</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Address:</span>
                        <span className="ml-2 text-black">123 Main St, Anytown, USA</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Mobile Number:</span>
                        <span className="ml-2 text-black">(123) 456-7890</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Sex:</span>
                        <span className="ml-2 text-black">Male</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Nationality:</span>
                        <span className="ml-2 text-black">American</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Email:</span>
                        <span className="ml-2 text-black">qw@gmail.com</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Date Added:</span>
                        <span className="ml-2 text-black">2022-01-01</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Last Update:</span>
                        <span className="ml-2 text-black">2022-01-15</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">First Name:</span>
                        <span className="ml-2 text-black">John</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Last Name:</span>
                        <span className="ml-2 text-black">Doe</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Age:</span>
                        <span className="ml-2 text-black">30</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Department:</span>
                        <span className="ml-2 text-black">IT</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Address:</span>
                        <span className="ml-2 text-black">123 Main St, Anytown, USA</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Mobile Number:</span>
                        <span className="ml-2 text-black">(123) 456-7890</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Sex:</span>
                        <span className="ml-2 text-black">Male</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Nationality:</span>
                        <span className="ml-2 text-black">American</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 xl:w-1/3 p-4">
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Email:</span>
                        <span className="ml-2 text-black">ch@gmail.com</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Date Added:</span>
                        <span className="ml-2 text-black">2022-01-01</span>
                    </div>
                    <div className="bg-gray-100 rounded p-4 mb-4">
                        <span className="font-bold text-black">Last Update:</span>
                        <span className="ml-2 text-black">2022-01-15</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page