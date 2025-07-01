"use client"
import Nav from '@/app/components/nav';
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function Home() {
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      >
      <Provider store={store}>
        <Nav/>
      </Provider>
    </div>
  );
}
