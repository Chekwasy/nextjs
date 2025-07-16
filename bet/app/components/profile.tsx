"use client"
import { StoreState } from '../tools/s_interface';
import { useSelector } from 'react-redux';

export default function Profile() {
  //useSelector to extract what is in the store
  const storeItems: StoreState = useSelector((state) => state) as StoreState;
  return (
    <div className="flex-col w-full justify-center items-center mt-16">
      <div className=" bg-gray-200 flex flex-col md:w-4/5 w-11/12 mx-auto">
        <h2 className="text-2xl font-bold p-4">My Profile</h2>
    <div className="flex flex-col justify-between p-2">
      <div className="flex flex-col w-full p-1">
        <div className="text-lg font-bold p-2">Account Information</div>
        <div className="bg-blue-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Name</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.fname} {storeItems?.mainSlice.me.lname}</div>
        </div>
        <p className="text-md mb-2">Name: </p>
        <p className="text-md mb-2">Email: {storeItems?.mainSlice.me.email}</p>
        <p className="text-md mb-2">Mobile: {storeItems?.mainSlice.me.mobile}</p>
        <p className="text-md mb-2">Account Balance: {storeItems?.mainSlice.me.accbal} {storeItems?.mainSlice.me.currency}</p>
      </div>
      <div className="flex flex-col w-full">
        <p className="text-lg font-bold mb-2">Statistics</p>
        <p className="text-md mb-2">Nickname: {storeItems?.mainSlice.me.nickname}</p>
        <p className="text-md mb-2">Rating: {storeItems?.mainSlice.me.rating}%</p>
        <p className="text-md mb-2">Subscription: {storeItems?.mainSlice.me.sub}</p>
        <p className="text-md mb-2">Total Games: {storeItems?.mainSlice.me.TGames}</p>
        <p className="text-md mb-2">Total Won: {storeItems?.mainSlice.me.TWon}</p>
        <p className="text-md mb-2">Total Lost: {storeItems?.mainSlice.me.TLost}</p>
      </div>
    </div>
      </div>
    </div>
    );
}
