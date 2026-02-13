'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CommunityCard({ community }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/communities/${community.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative h-[280px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:brightness-110"
    >
      <Image
        src={community.banner_url || 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/a4a643f4-5543-4582-a4d9-952b34cb3232'}
        alt={community.name}
        fill
        unoptimized={true}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(117,7,60,0.7)]"></div>
      
      <div className="absolute inset-0 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-auto">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#d9d9d9]">
            {community.avatar_url && (
              <Image
                src={community.avatar_url}
                alt={community.name}
                width={56}
                height={56}
                unoptimized={true}
                className="object-cover"
              />
            )}
          </div>
          <Image
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5a06f5b0-6e52-4f78-a8e9-8fe4121a95cf"
            alt="Icon"
            width={20}
            height={20}
            unoptimized={true}
          />
        </div>

        <div>
          <h3 className="text-white text-[17px] font-bold mb-2">{community.name}</h3>
          <div className="inline-block px-3 py-1.5 bg-[rgba(255,255,255,0.4)] rounded-2xl mb-3">
            <span className="text-[rgba(255,255,255,0.4)] text-[13px]">
              {community.member_count?.toLocaleString()} Members
            </span>
          </div>
          <p className="text-white/75 text-sm line-clamp-2">{community.description}</p>
        </div>
      </div>
    </div>
  );
}