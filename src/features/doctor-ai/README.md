# Doctor AI Feature

## Mô tả
Feature DoctorAI cho phép người dùng tải lên ảnh thú cưng, mô tả tình trạng bệnh và hỏi AI bác sĩ thú y để nhận tư vấn.

## Cấu trúc
```
doctor-ai/
├── components/
│   └── MessageBubble.tsx     # Component hiển thị tin nhắn chat
├── context/
│   └── DoctorAIContext.tsx   # Context & Provider quản lý state
├── pages/
│   └── DoctorAIPage.tsx      # UI chính của feature
├── services/
│   └── doctorAIAPI.ts        # API calls
├── utils/
│   └── doctorAI.utils.ts     # Utility functions
├── index.tsx                 # Entry point với Provider wrapper
└── README.md                 # Documentation
```

## Sử dụng

### 1. Import và sử dụng trong route
```tsx
import DoctorAIPage from "../features/doctor-ai";

// DoctorAIPage đã được wrap với DoctorAIProvider
<Route path="/doctor-ai" element={<DoctorAIPage />} />
```

### 2. Sử dụng hook trong component
```tsx
import { useDoctorAI } from "../context/DoctorAIContext";

function MyComponent() {
  const { state, sendMessage, setInput } = useDoctorAI();
  // ...
}
```

## API Integration

### Backend Endpoints (Cần implement)

#### 1. Upload Images
```
POST /api/upload
Content-Type: multipart/form-data

Request:
- images: File[] (FormData với key 'images')

Response:
{
  urls: string[]  // Mảng URL của các ảnh đã upload
}
```

#### 2. Chat với AI Doctor
```
POST /api/chat
Content-Type: application/json

Request:
{
  conversationId?: string | null,  // Null cho conversation mới
  userText: string,                // Tin nhắn từ user
  imageUrls: string[],            // URLs của ảnh đã upload
  createIfMissing?: boolean       // Tự động tạo conversation mới
}

Response:
{
  conversationId: string,  // ID của conversation (mới hoặc cũ)
  reply: string           // Câu trả lời từ AI
}
```

### Error Handling
API service đã có error handling cho các trường hợp:
- 401: Chưa đăng nhập
- 404: Service chưa được kích hoạt
- 429: Gửi quá nhiều request
- Network errors
- Generic errors

### State Management
State được quản lý bởi `DoctorAIContext` với:
- `conversationId`: ID của cuộc trò chuyện hiện tại
- `messages`: Lịch sử chat (user & assistant)
- `description`: Mô tả ca bệnh
- `input`: Tin nhắn hiện tại
- `files`: Danh sách file cần upload
- `loading`: Trạng thái loading
- `error`: Error message nếu có

### Local Storage
Context tự động persist state vào localStorage:
- Key: `doctorAI:state`
- Data: `{ conversationId, messages }`

## Features
- ✅ Upload multiple images (max 5)
- ✅ Preview images before sending
- ✅ Rich text input for description
- ✅ Chat interface with message history
- ✅ Persistent conversation across page reloads
- ✅ Error handling với user-friendly messages
- ✅ Loading states
- ✅ Clear history functionality

## TODO
- [ ] Kết nối với backend API thực tế
- [ ] Implement upload endpoint
- [ ] Implement chat endpoint với AI
- [ ] Add image compression trước khi upload
- [ ] Add typing indicator khi AI đang trả lời
- [ ] Add markdown support cho AI responses

