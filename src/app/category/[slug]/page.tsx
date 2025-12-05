
import { FolderOpen } from "lucide-react";
import { notFound } from "next/navigation";

// Import SCSS Module
import styles from './category.module.scss';
import { client } from "@/src/sanity/lib/client";
import VideoCard from "@/src/components/video/VideoCard";

// 1. Hàm lấy video theo category (Lấy không giới hạn số lượng)
async function getCategoryVideos(categorySlug: string) {
  let query;
  // Nếu là 'latest' -> Lấy TẤT CẢ video (bỏ điều kiện lọc category)
  if (categorySlug === 'latest') {
    query = `*[_type == "archiveVideo"] | order(recordedAt desc) {
      _id, title, slug, category, thumbnail, recordedAt,
      "videoUrl": videoFile.asset->url
    }`;
  } 
  // Nếu là danh mục khác -> Lọc theo category
  else {
    query = `*[_type == "archiveVideo" && category == "${categorySlug}"] | order(recordedAt desc) {
      _id, title, slug, category, thumbnail, recordedAt,
      "videoUrl": videoFile.asset->url
    }`;
  }
  
  return await client.fetch(query, {}, { cache: 'no-store' });
}

// 2. Hàm helper để format tiêu đề cho đẹp (thermal -> Thermal Hunting)
const formatTitle = (slug: string) => {
  const titles: Record<string, string> = {
    thermal: "Thermal Hunting",
    helicopter: "Helicopter Operations",
    trapping: "Trapping Techniques",
    pest_control: "Pest Control",
  };
  return titles[slug] || slug.toUpperCase();
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Gọi dữ liệu
  const videos = await getCategoryVideos(slug);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* --- HEADER --- */}
        <div className={styles.header}>
          {/* <div className={styles.breadcrumbs}>
            Home / Categories / <span>{slug}</span>
          </div> */}
          <h1 className={styles.title}>
            {formatTitle(slug)}
          </h1>
          <p className={styles.subtitle}>
            Browse our complete collection of {formatTitle(slug)} footage. 
            Original source files available for verification.
          </p>
        </div>

        {/* --- VIDEO GRID --- */}
        {videos.length > 0 ? (
          <div className={styles.videoGrid}>
            {videos.map((video: any) => (
              // Tái sử dụng VideoCard (đã style đẹp sẵn rồi)
              // Bọc trong div để Grid layout xử lý khoảng cách
              <div key={video._id} className="h-full">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FolderOpen size={48} strokeWidth={1} />
            <p>No videos found in this category yet.</p>
          </div>
        )}

      </div>
    </div>
  );
}