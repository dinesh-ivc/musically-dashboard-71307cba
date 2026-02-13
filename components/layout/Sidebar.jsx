'use client';

import { useState } from 'react';
import NavMenuItem from '@/components/navigation/NavMenuItem';
import UserProfileCard from '@/components/user/UserProfileCard';
import MusicPlayer from '@/components/music/MusicPlayer';
import Image from 'next/image';
import { Home, Music, Gamepad2, BookOpen, Atom, Play, Image as ImageIcon } from 'lucide-react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems = [
    { label: 'Home', icon: <Home size={20} />, path: '/' },
    { label: 'Music', icon: <Music size={20} />, path: '/music' },
    { label: 'Gaming', icon: <Gamepad2 size={20} />, path: '/gaming' },
    { label: 'Education', icon: <BookOpen size={20} />, path: '/education' },
    { label: 'Science & Tech', icon: <Atom size={20} />, path: '/science-tech' },
    { label: 'Entretainment', icon: <Play size={20} />, path: '/entertainment' },
    { label: 'Student Hubs', icon: <ImageIcon size={20} />, path: '/student-hubs' }
  ];

  return (
    <aside className="w-60 bg-[#654c68] h-screen flex flex-col overflow-y-auto">
      <div className="p-4">
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#bd0909]"></div>
          <div className="w-3 h-3 rounded-full bg-[#bc6332]"></div>
          <div className="w-3 h-3 rounded-full bg-[#7ac04f]"></div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a47d9c92-6d27-4ba8-bf9c-01f4079cb4e2"
              alt="Logo"
              width={48}
              height={48}
              unoptimized={true}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a47d9c92-6d27-4ba8-bf9c-01f4079cb4e2"
              alt="Server"
              width={48}
              height={48}
              unoptimized={true}
            />
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/216e4837-3c6a-41c8-863d-91660f41a515"
              alt="Channel"
              width={48}
              height={48}
              unoptimized={true}
            />
          </div>
        </div>

        <div className="bg-[rgba(9,9,9,0.04)] px-6 py-3 mb-6">
          <h1 className="text-white text-2xl font-extrabold">Explore</h1>
        </div>

        <UserProfileCard />

        <nav className="mt-8 space-y-1">
          {menuItems.map((item) => (
            <NavMenuItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              isActive={activeItem === item.label}
              onClick={() => setActiveItem(item.label)}
              path={item.path}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <MusicPlayer />
      </div>
    </aside>
  );
}