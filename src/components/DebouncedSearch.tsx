import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';



export const DebouncedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (prompt: string) => {
    if (!prompt) return null;
    const params = new URLSearchParams({
      prompt,
      type:'text_to_model',
      limit: '24'
    });
    const response = await fetch(`${import.meta.env.VITE_TRIVO_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TRIVO_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => fetchData(searchTerm),
    enabled: !!searchTerm,
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

 

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Type A Keyword..."
        onChange={handleInputChange}
        className="w-full rounded-lg border px-4 py-2 text-sm text-black placeholder:text-neutral-500 border-neutral-800 bg-transparent text-white placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
      />
      {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /> */}
      {isLoading && <p className="mt-2 text-gray-600">Loading...</p>}
      {error && <p className="mt-2 text-red-500">Error: {(error as Error).message}</p>}
      <div className="overflow-x-auto whitespace-nowrap mt-2">
      <div className="flex space-x-4">
      {/* @ts-ignore  */}
        {data?.payload.map((result) => (
          <img
            key={result.id}
            className="w-56 my-4 h-auto border border-neutral-900 hover:bg-neutral-950 rounded-xl"
            src={result.thumbnail_url}
            alt={`Thumbnail for task ${result.task_id}`}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default DebouncedSearch;