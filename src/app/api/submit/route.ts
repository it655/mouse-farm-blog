import { apiVersion, dataset, projectId } from '@/src/sanity/env';
import { createClient } from 'next-sanity';

import { NextResponse } from 'next/server';

// Tạo client riêng có quyền GHI (Write)
/* const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // Lấy token từ biến môi trường
  useCdn: false, // Không cache khi ghi
});
 */
export async function POST(request: Request) {
  const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // Lấy token từ biến môi trường
  useCdn: false, // Không cache khi ghi
});
  try {
    const body = await request.json();
    const { title, description, youtubeUrl,bunnyVideoId, authorName, authorEmail } = body;

    // Validate cơ bản
    if (!title || !bunnyVideoId || !authorName) {
      return NextResponse.json({ message: 'Missing required information' }, { status: 400 });
    }

    // Ghi vào Sanity
    const result = await writeClient.create({
      _type: 'submission', // Tên schema bạn vừa tạo
      title,
      description,
      bunnyVideoId,
      authorName,
      authorEmail,
      youtubeUrl
    });

    return NextResponse.json({ message: 'Success', id: result._id }, { status: 201 });

  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json({ message: 'Submission Error' }, { status: 500 });
  }
}