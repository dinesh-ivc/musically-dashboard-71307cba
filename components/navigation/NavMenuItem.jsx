'use client';

import { useRouter } from 'next/navigation';

export default function NavMenuItem({ label, icon, isActive, onClick, path }) {
  const router = useRouter();

  const handleClick = () => {
    onClick();
    if (path) {
      router.push(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-6 py-3 text-[15px] transition-all ${
        isActive
          ? 'bg-[rgba(9,9,9,0.5)] text-white'
          : 'text-white hover:bg-[rgba(9,9,9,0.3)]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}