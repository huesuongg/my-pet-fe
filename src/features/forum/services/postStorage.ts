import { PostData } from '../context/PostContext';

const POSTS_STORAGE_KEY = 'forum_posts';

export interface StoredPost extends Omit<PostData, 'id'> {
  id: number;
}

// Lấy posts từ localStorage
export const getStoredPosts = (): PostData[] => {
  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY);
    if (stored) {
      const posts = JSON.parse(stored);
      // Đảm bảo tất cả posts đều có commentsList
      return posts.map((post: PostData) => ({
        ...post,
        commentsList: (post.commentsList || []).map((comment: any) => ({
          ...comment,
          isLiked: comment.isLiked || false,
          replies: comment.replies || []
        })),
        isLiked: post.isLiked || false,
        isFavorited: post.isFavorited || false
      }));
    }
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
  }
  return [];
};

// Lưu posts vào localStorage
export const savePostsToStorage = (posts: PostData[]): void => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts to localStorage:', error);
  }
};

// Thêm post mới vào storage
export const addPostToStorage = (post: Omit<PostData, 'id' | 'likes' | 'comments' | 'favorites' | 'isLiked' | 'isFavorited' | 'commentsList'>): PostData => {
  const existingPosts = getStoredPosts();
  const newPost: PostData = {
    ...post,
    id: Math.max(...existingPosts.map(p => p.id), 0) + 1,
    likes: 0,
    comments: 0,
    favorites: 0,
    isLiked: false,
    isFavorited: false,
    commentsList: [],
  };
  
  const updatedPosts = [newPost, ...existingPosts];
  savePostsToStorage(updatedPosts);
  return newPost;
};

// Cập nhật post trong storage
export const updatePostInStorage = (id: number, updates: Partial<PostData>): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.map(post =>
    post.id === id ? { ...post, ...updates } : post
  );
  savePostsToStorage(updatedPosts);
};

// Xóa post khỏi storage
export const deletePostFromStorage = (id: number): void => {
  const posts = getStoredPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  savePostsToStorage(updatedPosts);
};

// Xóa tất cả posts trong storage
export const clearAllPosts = (): void => {
  try {
    localStorage.removeItem(POSTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing posts from localStorage:', error);
  }
};

// Khởi tạo posts mặc định nếu chưa có
export const initializeDefaultPosts = (): PostData[] => {
  const existingPosts = getStoredPosts();
  if (existingPosts.length === 0) {
    const defaultPosts: PostData[] = [
      {
        id: 1,
        author: {
          name: 'Quốc Huy',
          profilePic: '/src/assets/profile-pic.jpg'
        },
        timestamp: 'October 15 2025, 10:20 AM',
        content: 'Một ngày thăm khám tại Paws \n Hôm nay là cột mốc lớn: đưa bé Mây (Alaska lai, 4 tháng tuổi) đi tiêm mũi 5 trong 1 quan trọng. Thú thật là tôi đã thức trắng cả đêm vì lo, cứ sợ Mây hoảng sợ hoặc bị sốc. Nhưng tất cả sự lo lắng đã tan biến ngay khi chúng tôi bước vào Paws. Không gian sạch sẽ, thơm tho, lại còn có khu vực chờ riêng cho cún to và cún nhỏ, cực kỳ tinh tế.',
        image: '/post1.jpg',
        likes: 640,
        comments: 158,
        favorites: 89,
        isLiked: true,
        isFavorited: true,
        commentsList: []
      },
      {
        id: 2,
        author: {
          name: 'Lionel Messi',
          profilePic: 'https://cdnphoto.dantri.com.vn/3YVj3f-2GxZF2Dgu_0hz0Lv9FSw=/thumb_w/1020/2025/09/05/lionel-messi-tuyen-bo-gay-soc-ve-kha-nang-tham-du-world-cup-2026-1757076306248.jpg',
        },
        timestamp: 'June 25 2020, 10:00 AM',
        content: `Great things are done by a series of small things brought together.
          <a href="#" class="text-blue-500 font-semibold ml-1">#Motivation</a>
          <a href="#" class="text-blue-500 font-semibold ml-1">#Quotes</a>`,
        image: '/post2.jpg',
        likes: 500,
        comments: 100,
        favorites: 80,
        isLiked: false,
        isFavorited: false,
        commentsList: [],
      },
    ];
    savePostsToStorage(defaultPosts);
    return defaultPosts;
  }
  return existingPosts;
};
