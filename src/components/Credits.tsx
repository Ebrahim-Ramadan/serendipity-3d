interface CreditsProps {
    id: string;
    name: string;
    url: string;
    image_url: string;
}
const credits : CreditsProps[] = [
  {id: '1', name: 'cool json', url: 'https://cool-json-visualizer.vercel.app/', image_url: 'https://cool-json-visualizer.vercel.app/favicon.svg'},
  {id: '2', name: 'Trivo', url: 'https://trivo.ai/', image_url: 'https://trivo.ai/images/trivo_logo.png'},
]
export const Credits = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full px-2'>
     <div className='max-w-md relative group'>
     <img
      src='/cover-chess.webp'
      className='w-full h-full rounded-xl object-cover -z-10 group-hover:opacity-80 transition duration-200'
      />
      <a 
      href='https://github.com/Ebrahim-Ramadan/serendipity-3d'
      target='_blank'
      className='absolute bottom-4  text-3xl z-10 text-xl md:text-3xl   flex flex-row w-full  px-4 items-center justify-between'>
        <span className='alegreya-ass'>
        Serendipity 
        </span>
        <img
        src='/gh-star.png'
        className='w-6 '
        />
      </a>
      <div className='absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent h-28 z-0 right-0'>

      </div>
     </div>
      
        <div className='flex flex-wrap flex-row gap-2 max-w-md bg-[#0A0A0A] p-4 rounded-xl w-full'>
        {credits.map((credit) => (
            <div className='flex flex-col justify-center items-center hover:bg-[#1A1A1A] border border-[#1A1A1A] transition duration-300 p-2 rounded-xl' key={credit.id}>
            <a href={credit.url} className='space-y-2'>
                <img
                    src={credit.image_url}
                    alt={credit.name}
                    className='w-24 h-24 '
                />
                <p className='self-center text-center'>{credit.name}</p>
            </a>
            </div>
            ))}
        </div>
        
    </div>
  )
}
