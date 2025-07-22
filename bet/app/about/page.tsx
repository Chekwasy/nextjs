"use client"
import Nav from '@/app/components/nav';
import About from '@/app/components/about';
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function Home() {
  return (
    <div className="bg-cover bg-gray-200 text-sm text-gray-900 bg-center h-screen w-screen"
      >
      <Provider store={store}>
        <Nav/>
        <About/>
      </Provider>
    </div>
  );
}
