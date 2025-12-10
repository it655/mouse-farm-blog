'use client';

import React, { useState } from 'react';

import { FaCloudUploadAlt, FaSpinner, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Import CSS Module
import styles from './videoUploadForm.module.scss';
import { useUpload } from '@/src/hooks/useUpload';

export default function VideoUploadForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoAssetId: '',
    authorName: '',
    authorEmail: '',
    status:''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFileToSanity, uploading } = useUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gọi upload Sanity
    const assetId = await uploadFileToSanity(file);
    
    if (assetId) {
      setFormData({ ...formData, videoAssetId: assetId });
      toast.success('Video đã lên Sanity!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Toast Loading
    const toastId = toast.loading('Đang gửi thông tin...');

    try {
      // Gọi API Next.js (Server Action)
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Gửi thất bại');

      toast.success('Đã gửi thành công! Admin sẽ duyệt video của bạn.', { id: toastId });
      
      // Reset form
      setFormData({ title: '', description: '', videoAssetId: '', authorName: '', authorEmail: '',status:'pending' });

    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h2>
          Submit Your <span>Video</span>
        </h2>
        <p>Share your best hunting moments with our global community.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* --- KHU VỰC UPLOAD --- */}
        <div className={styles.uploadArea}>
           {/* Input file ẩn, luôn active trừ khi đang upload */}
           <input 
             type="file" 
             accept="video/*" 
             onChange={handleFileChange}
             disabled={uploading || !!formData.videoAssetId}
           />
           
           {uploading ? (
             <div className={styles.loadingState}>
               <FaSpinner className={styles.spinner} />
               <span>Uploading video...</span>
             </div>
           ) : formData.videoAssetId ? (
             <div className={styles.successState}>
                <FaCheckCircle className={styles.checkIcon} />
                <p className={styles.successText}>Video Ready!</p>
                <p className={styles.fileName}>{formData.videoAssetId}</p>
             </div>
           ) : (
             <div className={styles.defaultState}>
               <FaCloudUploadAlt className={styles.icon} />
               <h3 className={styles.ctaText}>Drag & Drop or Click to Upload</h3>
               <p className={styles.subText}>MP4, MOV (Max 500MB)</p>
             </div>
           )}
        </div>

        {/* --- CÁC TRƯỜNG THÔNG TIN --- */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Video Title</label>
            <input 
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="E.g. Epic Thermal Shot..."
            />
          </div>
          <div className={styles.field}>
            <label>Tên của bạn</label>
            <input 
              type="text" required
              value={formData.authorName}
              onChange={(e) => setFormData({...formData, authorName: e.target.value})}
              placeholder="E.g. John Doe"
            />
          </div>
        </div>

        <div className={styles.field}>
            <label>Description</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell us about the context..."
            />
        </div>

        {/* --- NÚT SUBMIT --- */}
        <button 
          type="submit"
          disabled={!formData.videoAssetId || isSubmitting}
          className={styles.submitBtn}
        >
          <FaPaperPlane /> SEND FOOTAGE
        </button>

      </form>
    </div>
  );
}