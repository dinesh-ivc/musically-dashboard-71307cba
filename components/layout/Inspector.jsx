'use client';

import { useState, useEffect } from 'react';
import MemberItem from '@/components/members/MemberItem';
import ActivityItem from '@/components/activity/ActivityItem';
import SectionHeader from '@/components/communities/SectionHeader';
import Image from 'next/image';
import { MessageSquare, Bell, MessageCircle } from 'lucide-react';

export default function Inspector() {
  const [newMembers, setNewMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [membersRes, activityRes] = await Promise.all([
          fetch('/api/members/new', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/activities/recent', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setNewMembers(membersData.data || []);
        }

        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setRecentActivity(activityData.data || []);
        }
      } catch (error) {
        console.error('Error fetching inspector data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <aside className="w-[300px] bg-[rgba(111,2,54,0.92)] h-screen overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <MessageSquare size={24} className="text-white" />
        <Bell size={24} className="text-white" />
        <MessageCircle size={24} className="text-white" />
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[#c8c8c8]"></div>
          <div className="w-1 h-1 rounded-full bg-[#c8c8c8]"></div>
          <div className="w-1 h-1 rounded-full bg-[#c8c8c8]"></div>
        </div>
      </div>

      <div className="text-center mb-10">
        <div className="relative w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden">
          <Image
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e7a60e1c-6953-4d7c-a787-d5a401e927f0"
            alt="User"
            fill
            unoptimized={true}
            className="object-cover"
          />
        </div>
        <h3 className="text-white text-[17px] font-semibold mb-1">Lorraine Tchanal</h3>
        <p className="text-[rgba(191,191,191,0.72)] text-sm">@lorrainetchanal</p>
      </div>

      <div className="mb-10">
        <SectionHeader
          title="New Members"
          actionLabel="See all"
          onActionClick={() => {}}
        />
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="text-white/60 text-sm">Loading...</div>
          ) : newMembers.length > 0 ? (
            newMembers.slice(0, 5).map((member) => (
              <MemberItem key={member.id} member={member} />
            ))
          ) : (
            <div className="text-white/60 text-sm">No new members</div>
          )}
        </div>
      </div>

      <div>
        <SectionHeader
          title="Recent activity"
          actionLabel="See all"
          onActionClick={() => {}}
        />
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="text-white/60 text-sm">Loading...</div>
          ) : recentActivity.length > 0 ? (
            recentActivity.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-white/60 text-sm">No recent activity</div>
          )}
        </div>
      </div>
    </aside>
  );
}