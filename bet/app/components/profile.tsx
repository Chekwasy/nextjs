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
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Name</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.fname} {storeItems?.mainSlice.me.lname}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Email</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.email}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Mobile</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.mobile}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Account Balance</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.currency} {storeItems?.mainSlice.me.accbal}</div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="text-lg font-bold p-2">Statistics</div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Nickname</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.nickname}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Rating</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.rating}%</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Sub. Category</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.sub}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Total Games</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.TGames}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Total Won</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.TWon}</div>
        </div>
        <div className="bg-gray-200 rounded-lg p-1 flex gap-4">
          <div className=" w-1/2">Total Lost</div>
          <div className=" w-1/2 font-bold text-end">{storeItems?.mainSlice.me.TLost}</div>
        </div>
      </div>
    </div>
      </div>
    </div>
    );
}
