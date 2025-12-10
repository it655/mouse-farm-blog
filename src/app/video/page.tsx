import Link from "next/link";
import VideoCard from "@/src/components/video/VideoCard";
import { client } from "@/src/sanity/lib/client";
import styles from './video.module.scss';


async function getAllCategories() {
    const query = `*[_type == "archiveVideo" && defined(category)].category`;
    const categories = await client.fetch(query, {}, { cache: 'no-store' });
    const uniqueCategories = [...new Set(categories)].filter(Boolean) as string[];
    return uniqueCategories.sort();
}

async function getVideosByCategory(category: string) {
    const query = `*[_type == "archiveVideo" && category == "${category}"] | order(recordedAt desc) [0...4] {
    _id, title, slug, category, thumbnail, recordedAt,description,
    "videoUrl": videoFile.asset->url
  }`;
    try { return await client.fetch(query, {}, { cache: 'no-store' }); } catch (error) { return []; }
}


const SectionGrid = ({ title, videos, linkUrl }: { title: string, videos: any[], linkUrl: string }) => {
    if (!videos || videos.length === 0) return null;
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <Link href={linkUrl} className={styles.viewAll}>
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
const DynamicCategorySection = async ({ category }: { category: string }) => {
    const videos = await getVideosByCategory(category);
    // Format tên đẹp (viết hoa chữ đầu)
    console.log(videos);
    
    const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);
    return <SectionGrid title={displayTitle} videos={videos} linkUrl={`/category/${category}`} />;
};

export default async function Videos() {

    const categories = await getAllCategories()

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {categories.map((cat) => (
                    <DynamicCategorySection key={cat} category={cat} />
                ))}
            </div>
        </main>

    );
}