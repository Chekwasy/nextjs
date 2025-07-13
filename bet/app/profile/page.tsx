"use client"
import Nav from '@/app/components/nav';
import Profile from '@/app/components/profile';
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function Home() {
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      >
      <Provider store={store}>
        <Nav/>
        <Profile/>
      </Provider>
    </div>
  );
}
