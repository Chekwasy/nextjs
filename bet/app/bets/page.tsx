"use client"
import Nav from '@/app/components/nav';
import Bets from '@/app/components/bets';
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function Home() {
  return (
    <div className="bg-cover bg-white text-sm text-gray-900 bg-center h-screen w-screen"
      >
      <Provider store={store}>
        <Nav/>
        <Bets/>
      </Provider>
    </div>
  );
}
