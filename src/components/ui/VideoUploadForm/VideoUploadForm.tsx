'use client';

import React, { useState } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaPaperPlane, FaCheckCircle, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Import SCSS Module
import styles from './videoUploadForm.module.scss';
import { useUpload } from '@/src/hooks/useUpload';

export default function VideoUploadForm() {
  // Tab chuyển đổi: 'upload' hoặc 'youtube'
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('upload');

  const [formData, setFormData] = useState({
    title: '', description: '', authorName: '', authorEmail: '',
    bunnyVideoId: '', 
    youtubeUrl: '' 
  });
  
  const { uploadVideoToBunny, uploading, progress } = useUpload();

  // Xử lý upload file (Bunny)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Gọi hook upload
      const videoTitle = formData.title || file.name;
      const videoId = await uploadVideoToBunny(file, videoTitle);
      
      if (videoId) {
        setFormData({ ...formData, bunnyVideoId: videoId, youtubeUrl: '' }); // Xóa youtube nếu có
        toast.success('Upload thành công!');
      }
    }
  };

  // Xử lý submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (activeTab === 'upload' && !formData.bunnyVideoId) return toast.error("Vui lòng upload video!");
    if (activeTab === 'youtube' && !formData.youtubeUrl) return toast.error("Vui lòng dán link YouTube!");

    const toastId = toast.loading("Sending...");

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed');

      toast.success("Gửi thành công!", { id: toastId });
      // Reset form
      setFormData({ title: '', description: '', bunnyVideoId: '', youtubeUrl: '', authorName: '', authorEmail: '' });

    } catch (error) {
      toast.error("Lỗi gửi form.", { id: toastId });
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h2>Submit Your <span>Footage</span></h2>
        <p>Share your impressive hunting videos.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* --- TABS CHUYỂN ĐỔI --- */}
        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.active : styles.inactive}`}
          >
            <FaCloudUploadAlt /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`${styles.tabBtn} ${activeTab === 'youtube' ? styles.youtubeActive : styles.inactive}`}
          >
            <FaYoutube /> YouTube Link
          </button>
        </div>

        {/* --- KHU VỰC NHẬP VIDEO --- */}
        <div className={styles.uploadArea}>
           {activeTab === 'upload' ? (
             // Giao diện Upload
             <>
               <input 
                 type="file" accept="video/*" onChange={handleFileChange} 
                 disabled={uploading || !!formData.bunnyVideoId} 
               />
               
               {uploading ? (
                 <div className={styles.loadingState}>
                   <FaSpinner className={styles.spinner} />
                   <span>Uploading {progress}%...</span>
                   <div className={styles.progressContainer}>
                      <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                   </div>
                 </div>
               ) : formData.bunnyVideoId ? (
                 <div className={styles.successState}>
                    <FaCheckCircle className={styles.checkIcon} />
                    <p className={styles.successText}>Video Uploaded!</p>
                    <p className={styles.fileName}>ID: {formData.bunnyVideoId}</p>
                    <button type="button" onClick={() => setFormData({ ...formData, bunnyVideoId: '' })} className={styles.deleteBtn}>
                       Xóa / Upload lại
                    </button>
                 </div>
               ) : (
                 <div className={styles.defaultState}>
                   <FaCloudUploadAlt className={styles.icon} />
                   <h3 className={styles.ctaText}>Drag & Drop Video</h3>
                   <p className={styles.subText}>Max 1GB</p>
                 </div>
               )}
             </>
           ) : (
             // Giao diện nhập Youtube
             <div className={styles.youtubeInputWrapper}>
                <FaYoutube className={styles.ytIcon} />
                <input 
                  type="text" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value, bunnyVideoId: '' })}
                />
             </div>
           )}
        </div>

        {/* --- CÁC Ô NHẬP LIỆU KHÁC --- */}
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Video Title</label>
            <input 
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className={styles.field}>
            <label>Your Name</label>
            <input 
              type="text" required
              value={formData.authorName}
              onChange={(e) => setFormData({...formData, authorName: e.target.value})}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className={styles.field}>
           <label>Your Email</label>
           <input 
             type="email" required
             value={formData.authorEmail}
             onChange={(e) => setFormData({...formData, authorEmail: e.target.value})}
             placeholder="john@example.com"
           />
        </div>
            <div className={styles.field}>
          <label>Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell us about the context..."
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          <FaPaperPlane /> SEND FOOTAGE
        </button>

      </form>
    </div>
  );
}