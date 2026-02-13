'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Share2 } from 'lucide-react';

export default function FeaturedCard({ community }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/communities/${community.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative h-[320px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:brightness-110"
    >
      <Image
        src={community.banner_url || 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0abfdaf6-3318-4375-ac86-99c389c84c04'}
        alt={community.name}
        fill
        unoptimized={true}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(9,9,9,0.5)]"></div>
      
      <div className="absolute inset-0 p-6 flex flex-col">
        <div className="flex items-start justify-between mb-auto">
          <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-[rgba(255,255,255,0.4)]">
            {community.avatar_url ? (
              <Image
                src={community.avatar_url}
                alt={community.name}
                width={64}
                height={64}
                unoptimized={true}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#d9d9d9]"></div>
            )}
          </div>
          <Share2 size={24} className="text-[#28303f]" />
        </div>

        <div>
          <h3 className="text-white text-xl font-bold mb-2">{community.name}</h3>
          <p className="text-[rgba(255,255,255,0.75)] text-base mb-3 line-height-1.5">
            {community.description}
          </p>
          <div className="inline-block px-3 py-1.5 bg-[rgba(255,254,254,0.4)] rounded-2xl">
            <span className="text-[rgba(255,255,255,0.4)] text-[13px]">
              {community.member_count?.toLocaleString()} Members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}