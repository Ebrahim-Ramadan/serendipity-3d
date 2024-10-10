import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DebouncedSearch from './components/DebouncedSearch';
import { Credits } from './components/Credits';


const queryClient = new QueryClient();

function App() {
 

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
       
        <DebouncedSearch  />

      </div>
      <Credits/>
    </QueryClientProvider>
  );
}

export default App;
