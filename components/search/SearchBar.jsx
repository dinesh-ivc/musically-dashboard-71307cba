'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#470224]" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Explore"
          className="w-full h-12 pl-12 pr-4 bg-white text-[#470224] placeholder:text-[#470224]/50 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>
    </form>
  );
}