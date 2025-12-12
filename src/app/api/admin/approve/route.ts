import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/src/sanity/env';
import { NextResponse } from 'next/server';
// Client có quyền GHI
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const DEFAULT_IMAGE_ID = "image-f43c771593c43eed98e604d82db1009999ddcc70-1900x928-png"
export async function POST(request: Request) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ message: "Thiếu ID bài viết" }, { status: 400 });
    }

    // 1. Lấy thông tin bài đóng góp
    const submission = await writeClient.fetch(`*[_type == "submission" && _id == $id][0]`, { id: submissionId });

    if (!submission) {
      return NextResponse.json({ message: "Không tìm thấy bài viết" }, { status: 404 });
    }

    if (submission.status === 'published') {
      return NextResponse.json({ message: "Bài này đã được duyệt rồi!" }, { status: 400 });
    }

    // 2. Tạo bản ghi mới trong ArchiveVideo (Kho video gốc)
    const newArchiveVideo = await writeClient.create({
      _type: 'archiveVideo',
      title: submission.title,
      // Tạo slug tự động
      slug: { 
        _type: 'slug', 
        current: submission.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 96) 
      },
      category: 'community', // Gán vào danh mục cộng đồng hoặc lấy từ submission nếu có
      description: submission.description,
      
      // --- SỬA ĐOẠN NÀY: LẤY BUNNY ID ---
      bunnyVideoId: submission.bunnyVideoId, 
      // ----------------------------------
      youtubeUrl: submission.youtubeUrl,
      thumbnail: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: DEFAULT_IMAGE_ID 
        }
      },
      recordedAt: new Date().toISOString(),
      status: 'Protected',
      technicalSpecs: {
        camera: `Submitted by ${submission.authorName}`,
        resolution: 'Unknown',
        fps: 'Unknown'
      }
    });

    // 3. Cập nhật trạng thái Submission -> Published
    await writeClient
      .patch(submissionId)
      .set({ status: 'published' })
      .commit();

    return NextResponse.json({ 
      message: "Duyệt thành công! Video đã lên trang chủ.", 
      newVideoId: newArchiveVideo._id 
    });

  } catch (error: any) {
    console.error("Approve Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}