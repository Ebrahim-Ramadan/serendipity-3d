import  { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import DebouncedSearch from './components/DebouncedSearch';

const queryClient = new QueryClient();

function App() {
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearchResult = useCallback((result: string) => {
    setSearchResult(result);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">Tripo3D Search</h1>
        <div className="w-full max-w-md">
          <DebouncedSearch onSearchResult={handleSearchResult} />
          {searchResult && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Search Result:</h2>
              <p>{searchResult}</p>
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;