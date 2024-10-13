import { lazy, useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingDots from '../components/Loader';
import { XIcon } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const GLBViewer = lazy(() => import('../components/viewer/GLBViewer'));

/**
 * Validate whether a given string is a valid task ID (in the Trivo sense of the task id)
 * 
 * @param {string} taskId The task ID to validate
 * @returns {boolean} Whether the given task ID is valid
 */
const validateTaskId = (taskId : string) => {
  const regex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return regex.test(taskId);
};

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
  const q = searchParams.get('q') as string;
  const location = useLocation();
  const navigate = useNavigate(); 

  /**
   * Handles the closing of the modal, by removing the task_id query string and
   * navigating to the same path without it.
   * 
   * @remarks
   * This function is called when the X button in the top right corner of the
   * modal is clicked.
   */
  const handleClick = () => {
    const params = new URLSearchParams(location.search);
    params.delete('task_id'); 
    setIsOpen(false)
    navigate({
      pathname: location.pathname,
      search: params.toString(), 
    });
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['modelData', task_id],
    queryFn: () => fetchModelData(task_id as string),
    enabled: validateTaskId(task_id as string),
  });

  if (isLoading) {
    return <div className='min-h-screen inset-0 absolute fixed sticky top-0 left-0 flex flex-col bg-black/50 items-center justify-center w-full'>
    <LoadingDots/>
      </div>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      {task_id ? (
        validateTaskId(task_id) ? (
          <div className={`fixed inset-0 flex justify-center items-center z-50 px-2 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
            <div
              className={`fixed inset-0 bg-gradient-to-b from-black/50 to-black ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}
              aria-hidden="true"
              onClick={handleClick}
            />

            <div className={`relative overflow-y-auto h-auto md:max-h-[90vh] max-h-[80vh] w-full md:max-w-3xl bg-blue-100/20 backdrop-blur-3xl grid gap-8 max-w-7xl mx-auto rounded-3xl border-2 border-neutral-500 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
              <button onClick={handleClick} className='z-20 absolute top-4 right-4 rounded-full bg-neutral-200/20 hover:bg-neutral-200/30 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center'>
                <XIcon className="w-4 md:w-6 h-4 md:h-6" />
              </button>
              {q?.length>0 &&
              <p className='z-20 absolute top-4 left-4 rounded-lg bg-neutral-200/20 hover:bg-neutral-200/30 px-2 py-1 justify-center text-xs  flex items-center justify-center w-3/4 truncate ellipsis'>
              {q}
            </p>
            }
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {data ? (
                <Suspense fallback={
                  <div className='min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-400 items-center justify-center w-full'>
                  <LoadingDots/>
                                  </div>
                    }>
                  <GLBViewer modelUrl={data.data.model} /> 
                </Suspense>
              ) : null}
            </div>
          </div>
        ) : (
          'Invalid task_id format'
        )
      ) : null}
    </>
  );
};

export default ModelSlug;
