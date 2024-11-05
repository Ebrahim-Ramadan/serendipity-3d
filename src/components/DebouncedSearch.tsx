import React, { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { Copy, Search, Upload, X } from 'lucide-react'
import { copyToClipboard } from '@utils/utils'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingDots from './Loader'

interface ImageResult {
  id: number
  thumbnail_url: string
  task_id: string
}

const DEFAULT_DATA = {
  payload: [
    { id: 1, thumbnail_url: '/default-examples/a.webp', task_id: 'c504afa1-9629-45ee-a80c-7c128b80ce92' },
    { id: 2, thumbnail_url: '/default-examples/b.webp', task_id: '06e23bcb-b79c-44f6-92fa-10a0b7ebd188' },
    { id: 3, thumbnail_url: '/default-examples/c.webp', task_id: 'df9e290d-77e1-42d0-8b2d-44b7da500396' },
    { id: 4, thumbnail_url: '/default-examples/e.webp', task_id: '4326c1ad-bae1-4179-8597-66a00f3c6ff0' },
    { id: 5, thumbnail_url: '/default-examples/f.webp', task_id: '9e919a9e-b9ad-476d-8eb1-45ea1f8eb410' },
    { id: 6, thumbnail_url: '/default-examples/d.webp', task_id: 'dec8538c-a78a-4c96-8bdd-2dcf03f21947' },
  ]
}

const ImageSkeleton: React.FC = () => (
  <div className="w-full aspect-square bg-neutral-900 animate-pulse rounded-xl" />
)

export default function DebouncedSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [draggedState, setDraggedState] = React.useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    if (queryParam) {
      setSearchTerm(queryParam);
      setDebouncedSearchTerm(queryParam);
    }
  }, [location.search]);

  const handleClick = ({task_id}: {task_id: string}) => {
    const params = new URLSearchParams(location.search);
    params.set('task_id', task_id);

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const fetchData = async (prompt: string) => {
    if (!prompt) return DEFAULT_DATA
    const params = new URLSearchParams({
      prompt,
      type: 'text_to_model',
      limit: '24'
    })
    const response = await fetch(`${import.meta.env.VITE_TRIVO_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TRIVO_TOKEN}`,
        'Accept': 'application/json'
      }
    })

    return response.json()
  }
// the normal text-to-objs
  const { data, isLoading, error, refetch } = useQuery<{ payload: ImageResult[] }>({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => fetchData(debouncedSearchTerm),
    enabled: false,
    initialData: DEFAULT_DATA
  })

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
    } else if (debouncedSearchTerm) {
      refetch()
    }
  }, [debouncedSearchTerm, isInitialLoad, refetch])

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term)
      // Update URL with search term
      const params = new URLSearchParams(location.search);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      navigate({
        pathname: location.pathname,
        search: params.toString(),
      });
    }, 200),
    [navigate, location.pathname, location.search]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    // Clear search param from URL
    const params = new URLSearchParams(location.search);
    params.delete('q');
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  }


  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // @ts-ignore
      handleImagesUpload(file);
    }
  };
  const handleImagesUpload = (event: { file: File }) => {
    console.log('event', event);
    
    if (event) {
      // @ts-ignore
      if (!event.type.startsWith('image/')) {
        toast.info('Please select an image event.');
        return;
      }
  
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      // @ts-ignore
      if (event.size > maxSizeInBytes) {
        toast.info('File size exceeds 2MB. Please upload a smaller file.');
        return;
      }
  
      console.log('Selected image file:', event);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggedState(false); // Reset dragging state
  
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      if (files.length > 1) {
        toast.info('Only one image file is being processed.');
      }
      
      const file = files[0];
      handleImagesUpload({ file });
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    setDraggedState(true); 
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setDraggedState(false); 
    event.preventDefault();
    event.stopPropagation();
  };

  const renderContent = () => {
    if (!debouncedSearchTerm && isInitialLoad) {
      return DEFAULT_DATA.payload.map((result) => (
        <img
          key={result.id}
          className="w-full aspect-square object-cover border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 rounded-xl transition-colors"
          src={result.thumbnail_url}
          alt={`Thumbnail for task ${result.task_id}`}
        />
      ))
    }

    if (isLoading) {
      return Array(8).fill(null).map((_, index) => (
        <ImageSkeleton key={`skeleton-${index}`} />
      ))
    }

    return (data?.payload || []).map((result) => (
      <div className='flex relative w-full h-full border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 rounded-xl backdrop-blur-3xl' key={result.id}>
        <img
          onClick={() => {
            handleClick({task_id: result.task_id})
          }}
          className="w-full aspect-square object-cover hover:cursor-pointer hover:scale-105  transition-all duration-200"
          src={result.thumbnail_url}
          alt={`Thumbnail for task ${result.task_id}`}
        />
        <button className='flex p-2 absolute right-1 top-1 text-neutral-500 hover:text-neutral-400 bg-neutral-900 rounded-xl hover:bg-neutral-800'
          onClick={() => {
            copyToClipboard(result.thumbnail_url)
            toast.success('Image Copied to clipboard!')
          }}>
          <Copy
            className=""
            size={16}
          />
        </button>
      </div>
    ))
  }

  return (
    <div className="w-full max-w-7xl mx-auto  md:py-24 py-12 sm:px-6 lg:px-8 z-0">
      <div className='flex flex-col items-center justify-center text-center gap-2 md:gap-4 bg-backdrop-blur-3xl bg-neutral-95/10 rounded-xl py-4 px-4'>
        <p className='text-2xl md:text-5xl font-bold text-neutral-300'>Good Night</p>
        <p className='text-lg md:text-3xl font-medium leading-5 text-neutral-200'>This is Serendipity, The Dumpest genAI ever exists</p>
      </div>
      <div className={`sticky top-14 fixed z-50 rounded-lg  mt-6 backdrop-blur-3xl ${draggedState ? 'bg-neutral-900' : 'bg-neutral-950 '}`}>
        <div className={`relative mb-4 `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}>
          <input
            type="text"
            autoFocus
            placeholder="Start Typing a keyword..."
            value={searchTerm}
            onChange={handleInputChange}
            className={`w-full rounded-lg border-2 px-10 py-2 text-sm text-white placeholder:text-neutral-500 border-neutral-800 focus:border-neutral-500 focus:outline-none bg-transparent ${draggedState && ' border-blue-500 transition-all duration-300 '}`}
          />
          {searchTerm.trim().length > 0 &&
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-300 p-2 bg-neutral-950"
            >
              <X size={16} />
            </button>
          }
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-neutral-300 w-0.5 h-6 bg-neutral-800" /
          >
          {/* the vertical spacer */}

          <label
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-neutral-200 cursor-pointer"
          >
            {isLoading?
<LoadingDots/>
:
<>
<Upload size={20} className={`${draggedState&& 'scale-110 transition-all duration-300 '}`}/>
            <input
              type="file"
              onChange={handleInputFileChange}
              accept="image/*"
              className='hidden'
            />
            </>
}
            
        </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-300" size={20} />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {(error as Error).message}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {renderContent()}
      </div>
    </div>
  )
}