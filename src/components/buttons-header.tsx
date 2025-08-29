'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";


const ButtonsHeader = () => {
  const pathname = usePathname();

  return (
  
    <div className="flex items-center w-full justify-start gap-4">
      {pathname !== '/' && 
      <Link href="/" 
          className="rounded-md bg-white py-2 px-4 border border-transparent text-center font-bold text-sm text-slate-800 transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 hover:text-white active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
        Card
      </Link> }  
      { pathname !== '/chat' && 
      <Link href="chat" 
        className="rounded-md bg-white py-2 px-4 border border-transparent text-center font-bold text-sm text-slate-800 transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 hover:text-white active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
         Discuter avec le Chat Bot
      </Link> }
    </div>

  )
}

export default ButtonsHeader;