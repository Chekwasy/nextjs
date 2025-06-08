"use client"
import Nav from '@/app/components/nav';
import Main from '@/app/components/main';

export default function Home() {
  return (
    <div className="bg-cover bg-center h-screen w-screen"
      >
      <Nav/>
      <Main/>
    </div>
  );
}
