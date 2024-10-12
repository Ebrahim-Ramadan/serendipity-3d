import React, { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { Copy, Search, X } from 'lucide-react'
import { copyToClipboard } from '~/utils'
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom';
interface ImageResult {
  id: number
  thumbnail_url: string
  task_id: string
}

const DEFAULT_DATA = {
  payload: [
    { id: 1, thumbnail_url: '/default-examples/a.webp', task_id: 'default1' },
    { id: 2, thumbnail_url: '/default-examples/b.webp', task_id: 'default2' },
    { id: 3, thumbnail_url: '/default-examples/c.webp', task_id: 'default3' },
    { id: 4, thumbnail_url: '/default-examples/e.webp', task_id: 'default4' },
    { id: 5, thumbnail_url: '/default-examples/f.webp', task_id: 'default5' },
    { id: 6, thumbnail_url: '/default-examples/d.webp', task_id: 'default6' },
  ]
}

const ImageSkeleton: React.FC = () => (
  <div className="w-full aspect-square bg-neutral-900 animate-pulse rounded-xl" />
)

export default function DebouncedSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = ({task_id}: {task_id: string}) => {
    const params = new URLSearchParams(location.search);
    params.set('task_id', task_id); // Set the 'q' parameter

    navigate({
      pathname: location.pathname,
      search: params.toString(), // Update the query params in the URL
    });
  };


  const [searchTerm, setSearchTerm] = useState('') 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('') 
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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
    }, 200),
    []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)     
    debouncedSearch(e.target.value)   
  }

  const handleClearSearch = () => {
    setSearchTerm('')           
    setDebouncedSearchTerm('')   
  }

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
        onClick={()=>{
          handleClick({task_id: result.task_id})
        }}
          className="w-full aspect-square object-cover hover:cursor-pointer hover:scale-105  transition-all duration-200"
          src={result.thumbnail_url}
          alt={`Thumbnail for task ${result.task_id}`}
        />
        <button>
          <Copy
            className="absolute right-2 top-2 text-neutral-500 hover:text-neutral-400"
            size={16}
            onClick={() => {
              copyToClipboard(result.thumbnail_url)
              toast.success('Image Copied to clipboard!')
            }}
          />
        </button>
      </div>
    ))
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:py-24 py-12 sm:px-6 lg:px-8 z-0">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Type a keyword..."
          value={searchTerm}  
          onChange={handleInputChange}
          className="w-full rounded-lg border px-10 py-2 text-sm text-white placeholder:text-neutral-500 border-neutral-800 bg-transparent focus:border-neutral-400 focus:outline-none"
        />
{searchTerm.trim().length>0 &&
        <X
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-400"
        size={16}
        onClick={handleClearSearch} 
      />
}

        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={20} />
      </div>

      {error && <p className="text-red-500 mb-4">Error: {(error as Error).message}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {renderContent()}
      </div>
    </div>
  )
}
