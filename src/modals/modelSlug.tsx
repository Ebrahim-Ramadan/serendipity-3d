import { lazy, useState, Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingDots from '../components/Loader';
import { Download, XIcon } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const GLBViewer = lazy(() => import('../components/viewer/GLBViewer'));

const validateTaskId = (taskId: string) => {
  const regex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return regex.test(taskId);
};

const fetchModelData = async (taskId: string) => {
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
  const [isOpen, setIsOpen] = useState(true);
  const [DownloadStarted, setDownloadStarted] = useState(false);
  const [searchParams] = useSearchParams();
  const task_id = searchParams.get('task_id');
  const q = searchParams.get('q') as string;
  const location = useLocation();
  const navigate = useNavigate();

  console.log('Task ID:', task_id);  // Debugging task_id

  const handleClick = () => {
    const params = new URLSearchParams(location.search);
    params.delete('task_id');
    setIsOpen(false);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['modelData', task_id],
    queryFn: () => fetchModelData(task_id as string),
    enabled: !!task_id && validateTaskId(task_id),
  });

  const handleDownload = useCallback(() => {
    if (data?.data?.model) {
      setDownloadStarted(true);
      fetch(data.data.model)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          let filename = new URL(data.data.model).pathname.split('/').pop()?.split('?')[0] || 'model.glb';
          if (!filename.endsWith('.glb')) filename += '.glb';
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        })
        .catch(error => {
          console.error('Download failed:', error);
          toast.error('Download failed');
        })
        .finally(() => setDownloadStarted(false));
    }
  }, [data]);

  if (!task_id || !validateTaskId(task_id)) {
    return null;
  }
  return (
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
        {data?.data?.model && (
          !DownloadStarted ? (
            <button 
              onClick={handleDownload} 
              disabled={DownloadStarted}
              className='z-20 absolute bottom-2.5 right-4 rounded-full bg-neutral-200/20 hover:bg-neutral-200/30 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center'
            >
              <Download className="w-5 h-5 " />
            </button>
          ) : (
            <div className='z-20 absolute bottom-2.5 right-4 rounded-full bg-neutral-200/20 hover:bg-neutral-200/30 w-6 md:w-8 h-6 md:h-8 flex items-center justify-center'>
            <LoadingDots/>
              </div>
          )
        )}
        {q?.length > 0 && (
          <p className='z-20 absolute top-4 left-4 rounded-lg bg-neutral-200/20 hover:bg-neutral-200/30 px-2 py-1 justify-center text-xs flex items-center justify-center  truncate ellipsis'>
            {q}
          </p>
        )}
        {isLoading && (
          <div className='min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-400 items-center justify-center w-full'>
            <LoadingDots />
          </div>
        )}
        {error && <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>}
        {data?.data?.model ? (
          <Suspense fallback={
            <div className='min-h-screen flex flex-col bg-gradient-to-b from-blue-600 to-blue-400 items-center justify-center w-full'>
              <LoadingDots />
            </div>
          }>
            <GLBViewer modelUrl={data.data.model} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default ModelSlug;