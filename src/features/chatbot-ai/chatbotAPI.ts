import axiosInstance from "../../services/axiosInstance";
import { AxiosError } from "axios";

export interface ChatbotMessage {
  role: "user" | "bot" | "system";
  text: string;
}

export interface ChatbotRequest {
  prompt: string; // Backend expect 'prompt' field
}

export interface ChatbotResponse {
  answer?: string; // Backend returns 'answer' field with HTML formatted text
  error?: string;
}

/**
 * Gửi tin nhắn tới chatbot API
 * @param prompt - Câu hỏi từ người dùng
 * @returns Phản hồi từ chatbot (HTML formatted)
 */
export const sendChatbotMessage = async (
  prompt: string
): Promise<string> => {
  try {
    const payload: ChatbotRequest = {
      prompt, // Backend expect 'prompt' field
    };

    const response = await axiosInstance.post<ChatbotResponse>(
      "/api/chatbot",
      payload
    );

    // Backend trả về { answer: string } với HTML formatted text
    const data = response.data;
    
    if (data.answer && typeof data.answer === "string") {
      return data.answer;
    }

    // Nếu không có answer, có thể có lỗi
    if (data.error) {
      throw new Error(data.error);
    }

    // Fallback: trả về toàn bộ response dưới dạng string
    return JSON.stringify(data);
  } catch (error) {
    console.error("[chatbotAPI] Error sending message:", error);
    
    // Type guard để check xem có phải AxiosError không
    if (error instanceof AxiosError) {
      // Handle các loại lỗi khác nhau
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data as { message?: string; error?: string };
        const message = errorData?.message || errorData?.error;
        
        if (status === 401) {
          throw new Error("Bạn cần đăng nhập để sử dụng chatbot");
        } else if (status === 429) {
          throw new Error("Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau");
        } else if (message) {
          throw new Error(message);
        }
      } else if (error.request) {
        // Request was made but no response
        throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet");
      }
    }
    
    // Nếu không phải AxiosError, throw generic error
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại");
  }
};

