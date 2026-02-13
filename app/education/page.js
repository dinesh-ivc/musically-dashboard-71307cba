'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Inspector from '@/components/layout/Inspector';
import CommunityCard from '@/components/communities/CommunityCard';
import SectionHeader from '@/components/communities/SectionHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EducationPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/communities/category/Education', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch education communities');
        }

        const data = await response.json();
        setCommunities(data.data || []);
      } catch (error) {
        console.error('Error fetching education communities:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#470224]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Education Communities</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div>
            <SectionHeader 
              title="Education Communities" 
              actionLabel="See all"
              onActionClick={() => {}}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {communities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Inspector />
    </div>
  );
}