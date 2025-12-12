import { client } from "@/src/sanity/lib/client";
import { urlForImage } from "@/src/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import {
    ThumbsUp, Share2, Download, MoreHorizontal,
    CheckCircle, FileVideo, HardDrive, Calendar
} from "lucide-react";
import { notFound } from "next/navigation";

// Import file SCSS module
import styles from './video-detail.module.scss';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: true });


// ... (Các hàm getVideo, getRelatedVideos giữ nguyên) ...
async function getVideo(slug: string) {
    const query = `*[_type == "archiveVideo" && slug.current == "${slug}"][0] {
    _id, title, category, recordedAt, thumbnail,bunnyVideoId,youtubeUrl,
    technicalSpecs,
    "videoUrl": videoFile.asset->url,
    "size": videoFile.asset->size
  }`;
    return await client.fetch(query, {}, { cache: 'no-store' });
}
async function getRelatedVideos(category: string, currentId: string) {
    const query = `*[_type == "archiveVideo" && category == "${category}" && _id != "${currentId}"] | order(recordedAt desc) [0...10] {
    _id, title, slug, thumbnail, recordedAt, category
  }`;
    return await client.fetch(query, {}, { cache: 'no-store' });
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const video = await getVideo(slug);

    if (!video) return notFound();

    const relatedVideos = await getRelatedVideos(video.category, video._id);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>

            <div className={styles.mainLayout}>

                {/* --- CỘT TRÁI --- */}
                <div className={styles.leftColumn}>
                    {/* VIDEO PLAYER */}
                    <div className={styles.videoWrapper}>
                        {video.bunnyVideoId ? (
                            <iframe
                                src={`https://iframe.mediadelivery.net/embed/.../${video.bunnyVideoId}...`}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allow="autoplay; encrypted-media;"
                                allowFullScreen
                            ></iframe>

                        ) : video.youtubeUrl ? (
                            // CASE 2: YOUTUBE (Nếu không có file gốc)
                            <ReactPlayer
                                src={video.youtubeUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={true}
                                config={{ youtube: { playerVars: { showinfo: 0, modestbranding: 1 } } }}
                            />
                        ) : (
                            <div className="text-white">Video not found</div>
                        )}
                    </div>

                    {/* TIÊU ĐỀ */}
                    <h1 className={styles.videoTitle}>{video.title}</h1>

                    {/* META BAR (Channel + Actions) */}
                    <div className={styles.metaBar}>

                        <div className={styles.channelInfo}>
                            <div className={styles.avatar}>M</div>
                            <div>
                                <div className={styles.channelName}>
                                    Mouse Farm Archive
                                    <CheckCircle size={14} color="#606060" fill="transparent" />
                                </div>
                                <p className={styles.subText}>Official Source • Protected</p>
                            </div>
                            {/* <button className={styles.subscribeBtn}>Subscribe</button> */}
                        </div>

                        {/* <div className={styles.actions}>
                            <button className={styles.btn}>
                                <ThumbsUp size={20} /> Like
                            </button>
                            <button className={styles.btn}>
                                <Share2 size={20} /> Share
                            </button>
                            <a
                                href={video.videoUrl}
                                target="_blank"
                                download
                                className={styles.btn}
                            >
                                <Download size={20} /> Download
                            </a>
                            <button className={styles.iconBtn}>
                                <MoreHorizontal size={20} />
                            </button>
                        </div> */}
                    </div>

                    {/* DESCRIPTION BOX */}
                    <div className={styles.descriptionBox}>
                        <div className={styles.statsLine}>
                            <span>{formatDate(video.recordedAt)}</span>
                            <span className={styles.hashtag}>#{video.category?.replace(/\s+/g, '') || 'Archive'}</span>
                        </div>

                        <p className={styles.descText}>
                            Video gốc lưu trữ phục vụ mục đích kháng cáo bản quyền (Content ID Verification).
                            Vui lòng không reup khi chưa có sự cho phép.
                        </p>

                        <div className={styles.techSpecs}>
                            <div className={styles.specItem}>
                                <span className={styles.label}><FileVideo size={14} /> Res</span>
                                <span className={styles.value}>{video.technicalSpecs?.resolution || 'Original'}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.label}><HardDrive size={14} /> FPS</span>
                                <span className={styles.value}>{video.technicalSpecs?.fps || '60'}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.label}><Calendar size={14} /> Date</span>
                                <span className={styles.value}>{formatDate(video.recordedAt)}</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.label}><CheckCircle size={14} /> Status</span>
                                <span className={`${styles.value} ${styles.secured}`}>Secured</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- CỘT PHẢI: RELATED --- */}
                <div className={styles.rightColumn}>
                    <h3>Related Footage</h3>

                    {relatedVideos.map((rel: any) => (
                        <Link href={`/video/${rel.slug.current}`} key={rel._id} className={styles.relatedItem}>
                            <div className={styles.thumbWrapper}>
                                {rel.thumbnail && (
                                    <Image
                                        src={urlForImage(rel.thumbnail).width(300).url()}
                                        alt={rel.title}
                                        fill
                                    />
                                )}
                                <div className={styles.badge}>RAW</div>
                            </div>

                            <div className={styles.info}>
                                <h4>{rel.title}</h4>
                                <p className={styles.channel}>Mouse Farm Archive</p>
                                <div className={styles.meta}>
                                    <span>{rel.category || 'Archive'}</span>
                                    <span>•</span>
                                    <span>{formatDate(rel.recordedAt)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {relatedVideos.length === 0 && (
                        <div className={styles.emptyState}>No related videos found.</div>
                    )}
                </div>

            </div>
        </div>
    );
}