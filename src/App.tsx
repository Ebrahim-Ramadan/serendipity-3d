import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DebouncedSearch from './components/DebouncedSearch';

interface PayloadItem {
  id: number;
  task_id: string;
  thumbnail_url: string;
  glb_url: string | null;
  draft_model_id: string | null;
  prompt: string;
  type: string;
}

interface TrivaloResponse {
  message: string;
  code: number;
  payload: PayloadItem[];
}

const queryClient = new QueryClient();

function App() {
  // Initialize searchResult as null since we don't have data initially
  const [searchResult, setSearchResult] = useState<TrivaloResponse | null>(null);

  const handleSearchResult = useCallback((result: TrivaloResponse) => {
    console.log('API result:', result);
    setSearchResult(result);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full flex flex-col justify-center h-full">
          <DebouncedSearch onSearchResult={handleSearchResult} />
          {/* Check if searchResult is not null, has a valid payload, and success message */}
          {/* @ts-ignore */}
          {searchResult?.payload.length > 0 && searchResult.message === 'success' &&
          // @ts-ignore 
            searchResult.payload.map((result) => (
              <img
                key={result.id}
                className="w-full border"
                src={result.thumbnail_url}
                alt={`Thumbnail for task ${result.task_id}`}
              />
            ))
          }
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
