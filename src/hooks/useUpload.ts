import { useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '../sanity/lib/client';
export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Thêm progress bar cho xịn

  const uploadFileToSanity = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    // Validate
    if (!file.type.startsWith('video/')) {
      toast.error('Chỉ được upload video!');
      return null;
    }
    // Sanity giới hạn file size tùy gói (Free ~100MB, Plus ~2GB). Cẩn thận file quá lớn.
    if (file.size > 100 * 1024 * 1024) { 
      toast.error('File quá lớn (Max 100MB cho bản Demo)');
      return null;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Upload lên Sanity
      // Sanity client hỗ trợ Observable để theo dõi tiến độ, nhưng ở đây dùng promise cho đơn giản
      const assetDocument = await client.assets.upload('file', file, {
        filename: file.name,
        contentType: file.type
      });
      
      // Trả về ID của file (VD: file-123456...-mp4) để sau này liên kết
      return assetDocument._id; 

    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error('Lỗi upload lên Sanity');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFileToSanity, uploading, progress };
};