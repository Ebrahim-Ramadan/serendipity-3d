import { GitFork } from "lucide-react";

interface CreditsProps {
    id: string;
    url: string;
    image_url: string;
}
const credits : CreditsProps[] = [
  {id: 'cool-jaon', url: 'https://cool-json-visualizer.vercel.app/', image_url: 'https://cool-json-visualizer.vercel.app/favicon.png'},
  {id: 'trivo', url: 'https://trivo.ai/', image_url: '/credits/trivo.svg'},
]
export const Credits = () => {
  return (
    <div className='flex flex-col md:flex-row gap-4 justify-center items-center w-full px-2 py-12'>
     
     <a className='max-w-md relative group cursor-pointer' href='https://github.com/Ebrahim-Ramadan/serendipity-3d'
      target='_blank'>
     <img
      src='/cover-chess.webp'
      className='w-full h-full rounded-xl object-cover -z-10 group-hover:opacity-80 transition duration-200'
      />
      <p 
      
      className='absolute bottom-4  text-3xl z-10 text-xl md:text-3xl   flex flex-row w-full  px-4 items-center justify-between'>
        <span className='alegreya-ass'>
        Serendipity 
        </span>
        <img
        src='/gh-star.png'
        className='w-6 group-hover:rotate-45 transition-all duration-300 group-hover:scale-105'
        />
      </p>
      <div className='absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-36 z-0 right-0'>

      </div>
     </a>
      
        <div className="relative flex flex-col justify-center items-center space-y-2 max-w-md bg-[#0A0A0A] px-4 py-3 rounded-xl w-full h-full">
          <p className="font-bold text-xl md:text-3xl alegreya-ass">Credits</p>
          <a 
          href='https://github.com/Ebrahim-Ramadan/serendipity-3d'
          target="_blank"
          className="absolute top-2 right-2 bg-neutral-900 rounded-lg p-2 group/fork hover:bg-neutral-800 transition-all duration-200">
            <GitFork size='16' color="#505050" className="group-hover/fork:scale-105 transition-all duration-200"/>
          </a>
        <div className='flex flex-wrap flex-row gap-4 p-4 w-full'>
        {credits.map((credit) => (
            <a 
            href={credit.url}
            className='flex flex-col justify-center  space-y-4 items-center hover:bg-[#1A1A1A] border border-[#1A1A1A] transition duration-300 p-4 rounded-xl md:w-1/4 w-fit' key={credit.id}>
                <img
                    src={credit.image_url}
                    alt={credit.id}
                    className='w-16 h-auto '
                />
            </a>
            ))}
        </div>

        <div className="absolute bottom-2 w-20 rounded-full right-2 bg-gradient-to-t from-blue-500 to-pink-500 blur-[100px] h-20 z-0 right-0">

        </div>
        </div>
        
    </div>
  )
}
