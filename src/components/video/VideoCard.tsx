import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { urlForImage } from "@/src/sanity/lib/image";

interface VideoCardProps {
  video: any;
}

export default function VideoCard({ video }: VideoCardProps) {
  // Hàm format date an toàn
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    // Format ngắn gọn: DD/MM/YYYY
    return date.toLocaleDateString("en-GB");
  };

  const dateDisplay = formatDate(video.recordedAt);

  const imageUrl = video.thumbnail 
    ? urlForImage(video.thumbnail).width(800).url() 
    : null;

  return (
    <Link href={`/video/${video.slug.current}`} className="group block h-full">
      {/* Bỏ nền trắng, viền để hợp với dark mode */}
      <article className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 group-hover:-translate-y-1">
        
        {/* --- 1. THUMBNAIL CONTAINER --- */}
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 rounded-xl shadow-sm group-hover:shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-shadow">
          
          {/* ẢNH THUẦN */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800 text-sm font-black uppercase tracking-widest">
              No Signal
            </div>
          )}
          
          {/* Overlay tối nhẹ chân ảnh để làm nổi text */}
          <div className="absolute w-full h-full" style={{top:0,backgroundColor:"#000",opacity:".6"}}></div>

          {/* NÚT PLAY (LUÔN HIỆN) */}
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 scale-95 group-hover:scale-105" style={{top:"50%",border:"none",transform:"translateY(-50%)",left:"50%"}}>
            {/* Bình thường mờ, hover sáng màu cam */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-black/40 text-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-500 shadow-lg">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
          </div>

          {/* Nhãn Category (Góc trái trên) */}
          {video.category && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-sm shadow-sm">
                {video.category}
              </span>
            </div>
          )}

          {/* --- MỚI THÊM: NHÃN CHẤT LƯỢNG & THỜI GIAN (Góc phải dưới) --- */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10" style={{bottom:3,right:3,flexDirection:"row",gap:"2px"}}>
            {/* Ngày tháng (nếu có) */}
            {dateDisplay && (
               <div className="flex items-center gap-1 bg-black/60 backdrop-blur text-zinc-300 text-[9px] font-bold px-2 py-1 rounded-sm border border-white/10" style={{border:10}}>
                 <Clock className="w-3 h-3" />
                 <span>{dateDisplay}</span>
               </div>
            )}
            {/* Nhãn chất lượng tĩnh (Demo) */}
            <span style={{backgroundColor:"transparent",color:"white", padding:"2px 6px", fontSize:"9px", fontWeight:"800", textTransform:"uppercase", letterSpacing:"0.05em",borderRadius:"4px", border:"1px solid"}}>
              4K RAW
            </span>
          </div>
        </div>

        {/* --- 2. THÔNG TIN VIDEO (Chữ trắng) --- */}
        <div className="pt-4 flex flex-col flex-grow relative px-1">
          {/* Tiêu đề */}
          <h3 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-orange-500 line-clamp-2">
            {video.title}
          </h3>
        </div>

      </article>
    </Link>
  );
};