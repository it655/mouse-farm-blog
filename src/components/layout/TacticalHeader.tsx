import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-900 sticky top-0 z-50 bg-black/90 backdrop-blur-md" style={{backgroundColor:"#000"}}>
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="group">
          <h1 className="text-3xl font-black tracking-tighter leading-none uppercase text-white">
            {/* MOUSE<br/><span className="text-zinc-500 group-hover:text-white transition-colors">FARM</span> */}
            <Image
              src="/mouse farm.png"
              alt="Mouse Farm Archive"
              width={100}
              height={100}
              priority
            ></Image>
          </h1>
        </Link>

        {/* MENU */}
        {/* <nav className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Videos</Link>
          <Link href="#" className="hover:text-white transition-colors">Submit</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </nav> */}
      </div>
    </header>
  );
}