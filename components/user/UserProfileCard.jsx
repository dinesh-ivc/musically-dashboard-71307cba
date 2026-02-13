'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function UserProfileCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#470224] rounded-lg p-3 flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#d9d9d9] flex-shrink-0">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.display_name || user.username}
            fill
            unoptimized={true}
            className="object-cover"
          />
        ) : (
          <Image
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ea8e24aa-23af-4da3-802d-c6918c6a070c"
            alt="User"
            fill
            unoptimized={true}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[17px] font-semibold truncate">
          {user.display_name || user.username}
        </p>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="w-4 h-0.5 bg-white"></div>
        <div className="w-4 h-0.5 bg-white"></div>
        <div className="w-4 h-0.5 bg-white"></div>
      </div>
    </div>
  );
}