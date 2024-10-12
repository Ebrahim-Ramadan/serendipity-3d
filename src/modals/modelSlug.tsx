import { lazy, useState, startTransition, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingDots from '../components/Loader';
import { XIcon } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const GLBViewer = lazy(() => import('../components/viewer/GLBViewer'));

// Function to validate task_id structure
const validateTaskId = (taskId : string) => {
  const regex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return regex.test(taskId);
};

// Fetch function for React Query
const fetchModelData = async (taskId : string) => {
  const response = await fetch(`https://api.tripo3d.ai/v2/web/task/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_TRIVO_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const ModelSlug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const task_id = searchParams.get('task_id');
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleClick = () => {
    const params = new URLSearchParams(location.search);
    params.delete('task_id'); // Delete the 'task_id' parameter

    navigate({
      pathname: location.pathname,
      search: params.toString(), // Update the query params in the URL
    });
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['modelData', task_id],
    queryFn: () => fetchModelData(task_id as string),
    enabled: validateTaskId(task_id as string),
  });

  if (isLoading) {
    return <LoadingDots />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center w-full'>
      {task_id ? (
        validateTaskId(task_id) ? (
          <div className={`fixed inset-0 flex justify-center items-center z-50 px-2 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
            <div
              className={`fixed inset-0 bg-gradient-to-b from-black/50 to-black ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}
              aria-hidden="true"
              onClick={() => startTransition(() => setIsOpen(false))}
            />

            <div className={`relative overflow-y-auto h-auto md:max-h-[90vh] max-h-[80vh] w-full md:max-w-3xl bg-blue-100/20 backdrop-blur-3xl grid gap-8 max-w-7xl mx-auto rounded-3xl border-2 border-neutral-500 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
              <button onClick={handleClick} className='z-20 absolute top-4 right-4 rounded-full bg-neutral-200/20 hover:bg-neutral-200/30 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center'>
                <XIcon className="w-4 md:w-6 h-4 md:h-6" />
              </button>
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {data ? (
                <Suspense fallback={
                  <div className='min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-400 items-center justify-center w-full'>
                  <LoadingDots/>
                                  </div>
                    }>
                  <GLBViewer modelUrl={data.data.model} /> {/* Render your component with fetched data */}
                </Suspense>
              ) : null}
            </div>
          </div>
        ) : (
          'Invalid task_id format'
        )
      ) : null}
    </div>
  );
};

export default ModelSlug;
