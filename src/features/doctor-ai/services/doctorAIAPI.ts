import axiosInstance from '../../../services/axiosInstance';
import { AxiosError } from 'axios';

/** ===== Types ===== */
export interface ChatRequest {
  conversationId?: string | null;
  userText: string;
  imageUrls: string[];
  createIfMissing?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  reply: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

interface AxiosErrorWithResponse extends AxiosError<ErrorResponse> {
  code?: string;
  message: string;
  name: string;
}

/** ===== Endpoints (relative like forumAPI) ===== */
const UPLOAD_URL = '/api/doctor-ai/upload';
const CHAT_URL = '/api/doctor-ai/chat';

// Sử dụng instance chung (đã có baseURL + interceptors)
const instance = axiosInstance;

/** Upload nhiều ảnh -> trả mảng URL từ backend */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  
  const startTime = Date.now();
  
  try {
    console.log('[doctorAIAPI] 📤 Starting image upload...', {
      fileCount: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });
    
    const fd = new FormData();
    files.forEach((f, index) => {
      fd.append('images', f);
      console.log(`[doctorAIAPI] Added file ${index + 1}:`, {
        name: f.name,
        size: f.size,
        type: f.type,
      });
    });

    const res = await instance.post<{ urls?: string[] }>(UPLOAD_URL, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // 30 seconds for upload
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('[doctorAIAPI] 📤 Upload progress:', percentCompleted + '%');
        }
      },
    });

    const elapsedTime = Date.now() - startTime;
    const urls = Array.isArray(res.data?.urls) ? res.data.urls : [];
    console.log('[doctorAIAPI] ✅ Upload completed in', elapsedTime, 'ms');
    console.log('[doctorAIAPI] Received URLs:', urls);
    
    return urls;
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    const axiosError = error as AxiosErrorWithResponse;
    
    console.error('[doctorAIAPI] ❌ Upload error after', elapsedTime, 'ms');
    console.error('[doctorAIAPI] Upload error details:', {
      message: axiosError.message,
      code: axiosError.code,
      status: axiosError.response?.status,
      response: axiosError.response?.data,
    });
    
    throw new Error(
      axiosError.response?.data?.message || 
      'Không thể tải ảnh lên. Vui lòng thử lại sau.'
    );
  }
}

/** Gửi nội dung chat + ảnh -> nhận reply + conversationId */
export async function chat(body: ChatRequest): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    console.log('[doctorAIAPI] 🚀 Starting chat request...');
    console.log('[doctorAIAPI] Payload:', {
      conversationId: body.conversationId || 'new',
      userTextLength: body.userText?.length || 0,
      imageUrlsCount: body.imageUrls?.length || 0,
      createIfMissing: body.createIfMissing,
    });
    
    const res = await instance.post<ChatResponse>(CHAT_URL, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000, // 60 seconds timeout (AI có thể mất thời gian)
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('[doctorAIAPI] 📤 Upload progress:', percentCompleted + '%');
        }
      },
    });
    
    const elapsedTime = Date.now() - startTime;
    console.log('[doctorAIAPI] ✅ Chat response received in', elapsedTime, 'ms');
    console.log('[doctorAIAPI] Response data:', {
      conversationId: res.data.conversationId,
      replyLength: res.data.reply?.length || 0,
    });
    
    return res.data;
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    const axiosError = error as AxiosErrorWithResponse;
    
    console.error('[doctorAIAPI] ❌ Chat error after', elapsedTime, 'ms');
    console.error('[doctorAIAPI] Error details:', {
      message: axiosError.message,
      code: axiosError.code,
      name: axiosError.name,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
      timeout: axiosError.code === 'ECONNABORTED' ? 'Request timeout' : 'N/A',
    });
    
    // Handle timeout specifically
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      console.error('[doctorAIAPI] ⏱️ Request timed out. AI có thể đang xử lý lâu hơn dự kiến.');
      throw new Error('AI đang xử lý câu hỏi, có thể mất nhiều thời gian. Vui lòng thử lại sau 30 giây hoặc giảm số lượng ảnh.');
    }
    
    // Handle different error types
    if (axiosError.response) {
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.data?.error;
      
      if (status === 401) {
        throw new Error('Bạn cần đăng nhập để sử dụng DoctorAI');
      } else if (status === 404) {
        throw new Error('Dịch vụ DoctorAI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.');
      } else if (status === 429) {
        throw new Error('Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.');
      } else if (status === 500) {
        throw new Error('Lỗi server khi xử lý. Vui lòng thử lại sau.');
      } else if (status === 503) {
        throw new Error('Dịch vụ AI đang bận. Vui lòng thử lại sau vài phút.');
      } else if (message) {
        throw new Error(message);
      }
    } else if (axiosError.request) {
      // No response received (network error)
      console.error('[doctorAIAPI] 🌐 Network error - no response from server');
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.');
    }
    
    throw new Error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
  }
}
