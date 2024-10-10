import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';

interface DebouncedSearchProps {
  onSearchResult: (result: string) => void;
}

export const DebouncedSearch: React.FC<DebouncedSearchProps> = ({ onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (term: string) => {
    if (!term) return null;
    const response = await fetch(`https://www.tripo3d.ai/app?search=${encodeURIComponent(term)}`);
    
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

  React.useEffect(() => {
    if (data) {
      console.log('data', data);
      
      onSearchResult(JSON.stringify(data));
    }
  }, [data, onSearchResult]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search Tripo3D..."
        onChange={handleInputChange}
        className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      {isLoading && <p className="mt-2 text-gray-600">Loading...</p>}
      {error && <p className="mt-2 text-red-500">Error: {(error as Error).message}</p>}
    </div>
  );
};

export default DebouncedSearch;