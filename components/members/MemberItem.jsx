'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function MemberItem({ member }) {
  const timeAgo = member.joined_at 
    ? formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })
    : 'recently';

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#d9d9d9] flex-shrink-0">
        {member.avatar_url ? (
          <Image
            src={member.avatar_url}
            alt={member.display_name || member.username}
            fill
            unoptimized={true}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#d9d9d9]"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[15px] font-semibold truncate">
          {member.display_name || member.username}
        </p>
        <p className="text-white/60 text-[13px] truncate">{timeAgo}</p>
      </div>
    </div>
  );
}