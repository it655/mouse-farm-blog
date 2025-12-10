'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  // 1. Lấy dữ liệu từ Form
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const interest = formData.get('interest') as string;
  const message = formData.get('message') as string;

  // Validate sơ bộ
  if (!name || !email || !message) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' };
  }

  try {
    // 2. Gửi Email qua Resend
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Email mặc định của Resend (Dùng được ngay)
      to: 'tuandat2514.work@gmail.com', // <--- THAY EMAIL CỦA BẠN VÀO ĐÂY ĐỂ NHẬN THƯ
      replyTo: email, // Để bấm Reply là trả lời người gửi luôn
      subject: `[MouseFarm] New Contact: ${interest} from ${name}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (data.error) {
        return { success: false, error: data.error.message };
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: 'Lỗi server khi gửi mail' };
  }
}