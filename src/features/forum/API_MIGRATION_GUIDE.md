# Forum API Migration Guide

## Hiện tại: Sử dụng Mock Data

Forum package hiện đang sử dụng mock data vì backend API chưa được implement. Tất cả các thao tác được mô phỏng với dữ liệu giả.

## Cách chuyển sang Real API

### 1. Khi backend API đã sẵn sàng

Mở file `src/features/forum/services/forumAPI.ts` và:

1. **Uncomment code API thực** trong các function
2. **Comment hoặc xóa** phần mock data
3. **Cập nhật baseURL** nếu cần

### 2. Các endpoint API cần implement

Backend cần cung cấp các endpoint sau:

```
GET    /api/forum/posts              - Lấy danh sách posts
GET    /api/forum/posts/:id          - Lấy post theo ID
POST   /api/forum/posts              - Tạo post mới
PUT    /api/forum/posts/:id          - Cập nhật post
DELETE /api/forum/posts/:id          - Xóa post
POST   /api/forum/posts/:id/like     - Toggle like post
POST   /api/forum/posts/:id/favorite - Toggle favorite post
POST   /api/forum/posts/:id/comments - Thêm comment
PUT    /api/forum/posts/:id/comments/:commentId - Sửa comment
DELETE /api/forum/posts/:id/comments/:commentId - Xóa comment
POST   /api/forum/posts/:id/comments/:commentId/like - Toggle like comment
```

### 3. Format dữ liệu

#### PostData
```typescript
{
  id: number;
  author: {
    name: string;
    profilePic?: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  location?: string;
  emotion?: string;
  likes: number;
  comments: number;
  favorites: number;
  isLiked: boolean;
  isFavorited: boolean;
  commentsList: ForumComment[];
}
```

#### ForumComment
```typescript
{
  id: number;
  author: {
    name: string;
    profilePic?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: ForumComment[];
  parentId?: number | null;
}
```

### 4. Ví dụ chuyển đổi

**Trước (Mock):**
```typescript
getAllPosts: async (): Promise<PostData[]> => {
  console.log('forumAPI.getAllPosts: API not implemented, returning mock data');
  return mockPosts;
}
```

**Sau (Real API):**
```typescript
getAllPosts: async (): Promise<PostData[]> => {
  try {
    const res = await instance.get(`${FORUM_URL}/posts`);
    return res.data;
  } catch (error) {
    console.error('forumAPI.getAllPosts error:', error);
    throw error;
  }
}
```

### 5. Testing

Sau khi chuyển sang real API:

1. Xóa component `ForumTest` khỏi `NewFeeds.tsx`
2. Test tất cả các chức năng: tạo post, like, comment, etc.
3. Kiểm tra error handling
4. Verify data persistence

### 6. Lưu ý

- Mock data hiện tại sẽ bị mất khi refresh trang
- Real API cần implement authentication
- Cần thêm loading states và error handling
- Cần implement real-time updates nếu cần
