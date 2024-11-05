
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DebouncedSearch from './components/DebouncedSearch';
import { Credits } from './components/Credits';
import React from 'react';
const ModelSlug = React.lazy(() => import('./modals/modelSlug'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="z-50 opacity-10 fixed  w-[250px] h-[250px] bg-neutral-100/50 z-[-1] blur-[150px] top-0 bottom-0 left-0 right-0 m-auto rounded-full"></div>
        <div
          style={{
            backgroundImage: 'url("/favicon-removebg-preview.png")', 
      
          }}
          className="bg-center bg-no-repeat h-screen inset-0 absolute fixed blur-[50px] w-full">

        </div>
      <div className="min-h-screen flex flex-col items-center justify-start p-4 w-full">
        <DebouncedSearch  />
        <ModelSlug/>
      </div>
      <div className="flex flex-row justify-center w-full text-center">
        <div className="bg-gradient-to-r from-black via-[#B7B7B7]/50 to-transparent w-3/4 md:w-1/2  h-[2px] opacity-40"></div>
      </div>
      <Credits/>
    </QueryClientProvider>
  );
}

export default App;
