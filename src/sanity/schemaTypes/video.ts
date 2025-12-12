import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export default defineType({
  name: 'archiveVideo',
  title: 'Kho Video Gốc',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Tên Video / Mã Hồ Sơ',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Đường dẫn (Slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bunnyVideoId',
      title: 'Bunny Video ID',
      type: 'string',
      description: 'ID của video trên Bunny Stream (VD: xxxxx-xxxxx...)',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Ảnh Bìa (Thumbnail)',
      type: 'image',
      options: { hotspot: true },
      
    }),
    defineField({
      name: 'category',
      title: 'Phân loại',
      type: 'string',
      options: {
        list: [
          { title: 'Deale With Invasive Wild Boars', value: 'deale' },
          { title: 'Hunting Documentary', value: 'hunting' },
          { title: 'Wild Boar', value: 'wild' },
          { title: 'Farming Documentary', value: 'farmingDoc' },
          { title: 'Farming Technology', value: 'farmingTech' },
          { title: 'Automatic Machines That Are At Another Level', value: 'automatic' },
          { title: 'Modern Agriculture Machine', value: 'agriculture' },
          { title: 'Food Processing', value: 'food' },
          { title: 'Modern Animal Husbandry', value: 'animal' },
          { title: 'Agriculture Harvesting Technology', value: 'agricultureTech' },
        ],
      },
    }),
    defineField({
      name: 'recordedAt',
      title: 'Thời gian quay (Original Date)',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    }),
    defineField({
      name: 'description',
      title: 'Mô tả',
      type: 'string',
    }),
    // Phần này quan trọng để kháng cáo:
    defineField({
      name: 'technicalSpecs',
      title: 'Thông số kỹ thuật (Metadata)',
      type: 'object',
      fields: [
        { name: 'resolution', title: 'Resolution (VD: 4K, 1080p)', type: 'string' },
        { name: 'fps', title: 'Frame Rate (VD: 60fps)', type: 'string' },
        { name: 'camera', title: 'Thiết bị quay (VD: Pulsar Thermion)', type: 'string' },
        { name: 'location', title: 'Địa điểm (GPS/Khu vực)', type: 'string' },
      ]
    }),
    defineField({
      name: 'status',
      title: 'Trạng thái bản quyền',
      type: 'string',
      options: {
        list: [
          { title: 'Protected (Đã bảo vệ)', value: 'protected' },
          { title: 'Dispute Pending (Đang tranh chấp)', value: 'pending' },
          { title: 'Released (Đã công chiếu)', value: 'released' },
        ],
        layout: 'radio'
      },
      initialValue: 'protected'
    }),
    /* defineField({
      name: 'status',
      title: 'Trạng thái',
      type: 'string',
      options: {
        list: [
          { title: 'Protected (Đã bảo vệ)', value: 'protected' },
          { title: 'Dispute Pending (Đang tranh chấp)', value: 'pending' },
          { title: 'Released (Đã công chiếu)', value: 'released' },
        ],
        layout: 'radio'
      },
      initialValue: 'protected'
    }) */
  ],
})