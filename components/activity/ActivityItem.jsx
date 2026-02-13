'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityItem({ activity }) {
  const timeAgo = activity.created_at 
    ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })
    : 'recently';

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#d9d9d9] flex-shrink-0">
        {activity.user?.avatar_url ? (
          <Image
            src={activity.user.avatar_url}
            alt={activity.user.display_name || activity.user.username}
            fill
            unoptimized={true}
            className="object-cover"
          />
        ) : (
          <Image
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a085cbf2-f549-40a1-b17e-619be3b1add6"
            alt="User"
            fill
            unoptimized={true}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[15px] font-semibold truncate">
          {activity.message}
        </p>
        <p className="text-white/60 text-[13px] truncate">{timeAgo}</p>
      </div>
    </div>
  );
}