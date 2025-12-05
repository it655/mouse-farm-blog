
import Link from "next/link";

// Import file SCSS vừa tạo
import styles from './home.module.scss';
import { client } from "../sanity/lib/client";
import VideoCard from "../components/video/VideoCard";
import { Play } from "lucide-react";
import { urlForImage } from "../sanity/lib/image";
const CATEGORY_TITLES: Record<string, string> = {
  'deale': 'Deale With Invasive Wild Boars',
  'hunting': 'Hunting Documentary',
  'wild': 'Wild Boar',
  'farmingDoc': 'Farming Documentary',
  'farmingTech': 'Farming Technology',
  'automatic': 'Automatic Machines That Are At Another Level',
  'agriculture': 'Modern Agriculture Machine',
  'food': 'Food Processing',
  'animal': 'Modern Animal Husbandry',
  'agricultureTech': 'Agriculture Harvesting Technology',
  'latest': 'Latest Footage' // Mặc định cho mục mới nhất
};


// 1. Hàm lấy danh sách tất cả các Category đang có video
async function getAllCategories() {
  // Query này lấy tất cả category unique
  const query = `*[_type == "archiveVideo" && defined(category)].category`;
  const categories = await client.fetch(query, {}, { cache: 'no-store' });
  
  // Lọc trùng lặp (Set) và loại bỏ null
  const uniqueCategories = [...new Set(categories)].filter(Boolean) as string[];
  return uniqueCategories.sort(); // Sắp xếp A-Z
}

// 2. Hàm lấy video theo category (Giữ nguyên)
async function getVideosByCategory(category: string) {
  const query = `*[_type == "archiveVideo" && category == "${category}"] | order(recordedAt desc) [0...4] {
    _id, title, slug, category, thumbnail, recordedAt,
    "videoUrl": videoFile.asset->url
  }`;
  try { return await client.fetch(query, {}, { cache: 'no-store' }); } catch (error) { return []; }
}

// 3. Hàm lấy Latest Footage (Giữ nguyên)
async function getLatestVideos() {
  const query = `*[_type == "archiveVideo"] | order(recordedAt desc) [0...8] {
    _id, title, slug, category, thumbnail, recordedAt,
    "videoUrl": videoFile.asset->url
  }`;
  try { return await client.fetch(query, {}, { cache: 'no-store' }); } catch (error) { return []; }
}

// 4. Component hiển thị 1 Section (Tự động lấy dữ liệu bên trong)
// Chúng ta biến nó thành Async Component để tự fetch dữ liệu của chính nó
const DynamicVideoSection = async ({ category }: { category: string }) => {
  const videos = await getVideosByCategory(category);
 const displayTitle = CATEGORY_TITLES[category] || category.toUpperCase();  
  console.log(displayTitle);
  
  if (!videos || videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <Link href={`/category/${category}`} className={styles.viewAll}>
          View All
        </Link>
      </div>

      <div className={styles.grid}>
        {videos.map((video: any) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
};

const LatestSection = ({ videos }: { videos: any[] }) => {
  if (!videos.length) return null;
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.title}>Latest Footage</h3>
        <Link href="/category/latest" className={styles.viewAll}>View All</Link>
      </div>
      <div className={styles.grid}>
        {videos.map((video: any) => <VideoCard key={video._id} video={video} />)}
      </div>
    </section>
  )
}

export default async function Home() {
  // Fetch dữ liệu song song
  
  
  // 1. Lấy video mới nhất
  const latestVideos = await getLatestVideos();
  const heroVideo = latestVideos[0];
  
  // 2. Lấy danh sách các danh mục tự động
  const categories = await getAllCategories();
  console.log("categories",categories);
  
  return (
    <main className={styles.main}>
      
      {/* --- 1. HERO SECTION (ẢNH BÌA) --- */}
     <section className={styles.hero}>
        
        {/* Ảnh Nền Hero */}
        {heroVideo?.thumbnail ? (
          <img 
            src={urlForImage(heroVideo.thumbnail).width(1920).url()} 
            alt="Hero Background" 
            className={styles.heroBg}
          />
        ) : (
          // Fallback nếu không có video
          <div className={`${styles.heroBg} bg-zinc-900`}></div>
        )}
        
        {/* Lớp phủ gradient */}
        <div className={styles.heroOverlay}></div>

        {/* Nội dung Hero */}
        <div className={styles.heroContent}>
          
          <span className={styles.featuredLabel}>Featured Premiere</span>
          
          <h1 className={styles.heroTitle}>
            {heroVideo?.title || "Welcome to Mouse Farm Archive"}
          </h1>

          <div className={styles.heroMeta}>
            <span>{heroVideo ? new Date(heroVideo.recordedAt).toLocaleDateString('en-GB') : "2024"}</span>
            <span className={styles.dot}></span>
            <span>{heroVideo?.category || "Original"}</span>
            <span className={styles.dot}></span>
            <span>4K RAW</span>
          </div>

          <div className={styles.heroActions}>
            {heroVideo && (
              <Link href={`/video/${heroVideo.slug.current}`} className={styles.watchBtn}>
                <div className={styles.playIcon}>
                  <Play size={16} fill="currentColor" />
                </div>
                Watch Now
              </Link>
            )}
            <Link href="/category/latest" className={styles.browseBtn}>
              Browse Library
            </Link>
          </div>

        </div>
      </section>

      <div className={styles.container}>
        
        {/* LATEST FOOTAGE (Luôn hiện đầu tiên) */}
        <LatestSection videos={latestVideos} />

        {/* CÁC DANH MỤC TỰ ĐỘNG (Dynamic Categories) */}
        {categories.map((category) => (
          // Gọi component async để nó tự fetch video của category đó
          <DynamicVideoSection key={category} category={category} />
        ))}

      </div>
    </main>
  );
}