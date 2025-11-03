import axiosInstance from '../../../services/axiosInstance';
import type { PostData, ForumComment } from '../types/forum.types';
import { AxiosError } from 'axios';

// Backend response types
interface BackendPostAuthor {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  avatar?: string;
  profilePic?: string;
  avatarUrl?: string;
}

interface BackendPost {
  _id?: string;
  id?: string;
  author?: BackendPostAuthor | { user?: BackendPostAuthor };
  userId?: string;
  createdAt?: string;
  content?: string;
  images?: string[];
  address?: string;
  location?: string;
  emotion?: string;
  tags?: string[];
  likeCount?: number;
  likes?: number;
  commentCount?: number;
  comments?: number | ForumComment[];
  commentsList?: ForumComment[];
  favoriteCount?: number;
  favorites?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  likeToggled?: boolean;
  favoriteToggled?: boolean;
}

interface BackendComment {
  id?: number;
  _id?: string;
  author?: BackendPostAuthor;
  content?: string;
  createdAt?: string;
  likeCount?: number;
  likes?: number | number[];
  isLiked?: boolean;
}

// Extended PostData for API operations
interface ExtendedPostData extends Partial<PostData> {
  address?: string;
  imageFiles?: File[];
  keepImages?: string[];
}

// Sử dụng axiosInstance chung có authentication
const instance = axiosInstance;

const FORUM_URL = '/api/forum';

// Mock data for testing when API is not available
const mockPosts: PostData[] = [
  {
    id: 1,
    author: {
      name: 'Test User 1',
      profilePic: 'https://via.placeholder.com/40x40?text=U1'
    },
    timestamp: new Date().toLocaleString('vi-VN'),
    content: 'Đây là bài viết test đầu tiên! 🎉',
    likes: 5,
    comments: 2,
    favorites: 1,
    isLiked: false,
    isFavorited: false,
    commentsList: []
  },
  {
    id: 2,
    author: {
      name: 'Test User 2',
      profilePic: 'https://via.placeholder.com/40x40?text=U2'
    },
    timestamp: new Date(Date.now() - 3600000).toLocaleString('vi-VN'),
    content: 'Bài viết thứ hai với nội dung dài hơn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'https://via.placeholder.com/400x300?text=Test+Image',
    likes: 12,
    comments: 5,
    favorites: 3,
    isLiked: true,
    isFavorited: false,
    commentsList: []
  }
];

export const forumAPI = {
  getAllPosts: async (): Promise<PostData[]> => {
    try {
      console.log('forumAPI.getAllPosts: Making request to:', `${instance.defaults.baseURL}${FORUM_URL}/posts`);
      const res = await instance.get(`${FORUM_URL}/posts`);
      console.log('forumAPI.getAllPosts: Full response:', res);
      console.log('forumAPI.getAllPosts: Response status:', res.status);
      console.log('forumAPI.getAllPosts: Response data:', res.data);
      console.log('forumAPI.getAllPosts: Response data type:', typeof res.data);
      console.log('forumAPI.getAllPosts: Response data isArray:', Array.isArray(res.data));
      
      // Ensure we return an array and map backend data to frontend format
      let postsData = [];
      
      if (Array.isArray(res.data)) {
        postsData = res.data;
        console.log('forumAPI.getAllPosts: Using direct array with length:', postsData.length);
      } else if (res.data && Array.isArray(res.data.data)) {
        postsData = res.data.data;
        console.log('forumAPI.getAllPosts: Using nested data array with length:', postsData.length);
      } else if (res.data && res.data.posts && Array.isArray(res.data.posts)) {
        postsData = res.data.posts;
        console.log('forumAPI.getAllPosts: Using posts array with length:', postsData.length);
      } else {
        console.warn('forumAPI.getAllPosts: unexpected response format:', res.data);
        console.warn('forumAPI.getAllPosts: Available keys:', res.data ? Object.keys(res.data) : 'no data');
        return [];
      }

      // Map backend data format to frontend format
      const mappedPosts = postsData.map((post: unknown) => {
        const backendPost = post as BackendPost | { user?: BackendPostAuthor };
        const author = 'author' in backendPost ? backendPost.author : undefined;
        const user = 'user' in backendPost ? backendPost.user : undefined;
        
        const resolvedName = (author as BackendPostAuthor | undefined)?.username || 
          (author as BackendPostAuthor | undefined)?.name || 
          user?.username || 
          'Unknown User';
        const resolvedAvatar =
          (author as BackendPostAuthor | undefined)?.avatar ||
          (author as BackendPostAuthor | undefined)?.profilePic ||
          (author as BackendPostAuthor | undefined)?.avatarUrl ||
          user?.avatar ||
          user?.profilePic ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';
        const resolvedAuthorId = (author as BackendPostAuthor | undefined)?._id || 
          (author as BackendPostAuthor | undefined)?.id || 
          user?._id || 
          user?.id || 
          ('userId' in backendPost ? backendPost.userId : undefined);

        const fullPost = backendPost as BackendPost;
        return ({
          id: fullPost._id || fullPost.id || '',
          author: {
            id: resolvedAuthorId, // Lưu author ID để check quyền edit/delete
            name: resolvedName,
            avatar: resolvedAvatar,
          },
          timestamp: fullPost.createdAt ? new Date(fullPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
          content: fullPost.content || '',
          image: fullPost.images && fullPost.images.length > 0 ? fullPost.images[0] : undefined, // Use first image
          images: fullPost.images || [], // Keep all images for future use
          location: fullPost.address || fullPost.location, // Backend trả về address
          emotion: fullPost.emotion,
          likes: fullPost.likeCount || 0,
          comments: fullPost.commentCount || 0,
          favorites: fullPost.favoriteCount || 0,
          isLiked: fullPost.isLiked || false,
          isFavorited: fullPost.isFavorited || false,
          commentsList: fullPost.comments || fullPost.commentsList || [],
          tags: fullPost.tags || []
        });
      });

      console.log('forumAPI.getAllPosts: Mapped posts with length:', mappedPosts.length);
      return mappedPosts;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }> & { code?: string };
      console.error('forumAPI.getAllPosts error:', error);
      console.error('forumAPI.getAllPosts error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data
      });
      
      // Check if it's a 404 or network error
      if (axiosError.response?.status === 404 || axiosError.code === 'ERR_NETWORK') {
        console.log('forumAPI.getAllPosts: API not available, returning mock data');
        return mockPosts;
      }
      
      // Return empty array on other errors
      return [];
    }
  },

  getPostById: async (postId: number | string): Promise<PostData> => {
    const res = await instance.get(`${FORUM_URL}/posts/${postId}`);
    const data = res.data;
    // Map single post to frontend format
    const mapped: PostData = {
      id: data._id || data.id,
      author: {
        id: data.author?._id || data.author?.id,
        name: data.author?.username || data.author?.name || 'Unknown',
        avatar: data.author?.avatar || data.author?.profilePic || '',
      },
      timestamp: data.createdAt ? new Date(data.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
      content: data.content || '',
      image: data.images && data.images.length > 0 ? data.images[0] : undefined,
      images: data.images || [],
      location: data.address || data.location,
      tags: data.tags || [],
      likes: data.likeCount || data.likes || 0,
      comments: data.commentCount || (Array.isArray(data.comments) ? data.comments.length : data.comments || 0),
      favorites: data.favoriteCount || data.favorites || 0,
      isLiked: !!(data.isLiked ?? false),
      isFavorited: !!(data.isFavorited ?? false),
      commentsList: Array.isArray(data.comments)
        ? data.comments.map((c: BackendComment) => ({
          id: c.id || c._id,
          author: {
            name: c.author?.username || c.author?.name || 'Unknown',
            profilePic: c.author?.avatar || c.author?.profilePic || '',
          },
          content: c.content,
          timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
          likes: c.likeCount || (Array.isArray(c.likes) ? c.likes.length : c.likes || 0),
          isLiked: !!c.isLiked,
          parentId: null,
        }))
        : [],
    } as PostData;
    return mapped;
  },

  createPost: async (payload: Partial<PostData>): Promise<PostData> => {
    try {
      console.log('forumAPI.createPost: Making request to:', `${instance.defaults.baseURL}${FORUM_URL}/posts`);
      console.log('forumAPI.createPost: Payload received:', payload);
      
      // Backend expects multipart/form-data with File objects
      const formData = new FormData();
      
      // Add content
      if (payload.content) {
        formData.append('content', payload.content);
      }
      
      // Add tags - thử JSON string để Express parse đúng
      if (payload.tags && Array.isArray(payload.tags) && payload.tags.length > 0) {
        // Option 1: Send as JSON string (recommended for Express)
        formData.append('tags', JSON.stringify(payload.tags));
        
        // Option 2: Send each tag separately (uncomment nếu backend dùng multer array parsing)
        // payload.tags.forEach(tag => {
        //   formData.append('tags[]', tag);
        // });
      }
      
      // Add address
      const extendedPayload = payload as ExtendedPostData;
      const address = extendedPayload.address || payload.location || '';
      if (address) {
        formData.append('address', address);
      }
      
      // Add image files (nếu có)
      const imageFiles = extendedPayload.imageFiles; // Expect File[] objects
      if (imageFiles && Array.isArray(imageFiles)) {
        imageFiles.forEach((file: File) => {
          formData.append('images', file); // Backend expects field name "images"
        });
      }
      
      console.log('forumAPI.createPost: Sending FormData with', 
        imageFiles?.length || 0, 'images');
      
      const res = await instance.post(`${FORUM_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('forumAPI.createPost: Response:', res.data);
      
      // Map response to frontend format
      const createdPost = res.data;
      return {
        id: createdPost._id || createdPost.id,
        author: {
          id: createdPost.author?._id || createdPost.author?.id,
          name: createdPost.author?.username || createdPost.author?.name || 'Unknown',
          avatar: createdPost.author?.avatar || createdPost.author?.profilePic || '',
        },
        timestamp: createdPost.createdAt ? new Date(createdPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: createdPost.content || '',
        image: createdPost.images && createdPost.images.length > 0 ? createdPost.images[0] : undefined,
        images: createdPost.images || [],
        location: createdPost.address || createdPost.location, // Map address to location
        tags: createdPost.tags || [],
        likes: createdPost.likeCount || 0,
        comments: createdPost.commentCount || 0,
        favorites: createdPost.favoriteCount || 0,
        isLiked: createdPost.isLiked || false,
        isFavorited: createdPost.isFavorited || false,
        commentsList: createdPost.comments || createdPost.commentsList || [],
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('forumAPI.createPost error:', error);
      console.error('forumAPI.createPost error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data
      });
      
      // Fallback to mock data on error
      console.log('forumAPI.createPost: API error, simulating post creation');
      const resolvedAuthorName = payload.author?.name || 'Unknown User';
      const author = payload.author || {};
      const resolvedAuthorAvatar: string =
        'avatar' in author && typeof author.avatar === 'string' ? author.avatar :'profilePic' in author && typeof author.profilePic === 'string' ? author.profilePic :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';

      const newPost: PostData = {
        id: Date.now(),
        author: payload.author ? {
          id: payload.author.id,
          name: resolvedAuthorName,
          avatar: resolvedAuthorAvatar,
        } : {
          name: 'Unknown User',
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU',
        },
        timestamp: payload.timestamp || new Date().toLocaleString('vi-VN'),
        content: payload.content || '',
        image: payload.image,
        location: payload.location, // UI lưu address vào location
        tags: payload.tags || [],
        likes: 0,
        comments: 0,
        favorites: 0,
        isLiked: false,
        isFavorited: false,
        commentsList: []
      };
      
      console.log('forumAPI.createPost: Created mock post:', newPost);
      mockPosts.unshift(newPost);
      return newPost;
    }
  },

  updatePost: async (postId: number | string, payload: Partial<PostData>): Promise<PostData> => {
    try {
      console.log('forumAPI.updatePost: Making request to:', `${FORUM_URL}/posts/${postId}`);
      console.log('forumAPI.updatePost: Payload received:', payload);
      
      // Check if we have new image files to upload
      const extendedPayload = payload as ExtendedPostData;
      const imageFiles = extendedPayload.imageFiles;
      
      if (imageFiles && Array.isArray(imageFiles) && imageFiles.length > 0) {
        // Use FormData for multipart upload (similar to createPost)
        console.log('====== forumAPI.updatePost (WITH new images) ======');
        console.log('✅ New images detected:', imageFiles.length);
        console.log('✅ Image files:', imageFiles.map((f: File) => ({ name: f.name, size: f.size, type: f.type })));
        
        const formData = new FormData();
        
        // Add content
        if (payload.content) {
          formData.append('content', payload.content);
          console.log('✅ Added content to FormData');
        }
        
        // Add tags
        if (payload.tags && Array.isArray(payload.tags) && payload.tags.length > 0) {
          formData.append('tags', JSON.stringify(payload.tags));
          console.log('✅ Added tags to FormData:', payload.tags);
        }
        
        // Add address
        const address = extendedPayload.address || payload.location || '';
        if (address) {
          formData.append('address', address);
          console.log('✅ Added address to FormData:', address);
        }
        
        // Add keepImages (existing image URLs to preserve)
        const keepImages = extendedPayload.keepImages;
        if (keepImages && Array.isArray(keepImages) && keepImages.length > 0) {
          formData.append('keepImages', JSON.stringify(keepImages));
          console.log('✅ Added keepImages to FormData:', keepImages);
          console.log('   keepImages array length:', keepImages.length);
          console.log('   keepImages JSON string:', JSON.stringify(keepImages));
        } else {
          console.warn('⚠️ No keepImages found in payload!');
          console.warn('   keepImages value:', keepImages);
          console.warn('   This means ALL old images will be deleted!');
        }
        
        // Add new image files
        imageFiles.forEach((file: File, index: number) => {
          formData.append('images', file);
          console.log(`✅ Added image ${index + 1}/${imageFiles.length} to FormData:`, file.name);
        });
        
        console.log('==========================================');
        console.log('⚠️ IMPORTANT: Backend route PUT /posts/:id MUST have multer middleware!');
        console.log('Expected route: router.put("/posts/:id", protect, uploadPostImage.array("images", 10), postController.updatePost)');
        console.log('FormData summary:');
        console.log('  - content: ✓');
        console.log('  - tags:', payload.tags?.length || 0);
        console.log('  - address:', address || '(none)');
        console.log('  - keepImages:', keepImages?.length || 0, 'URLs');
        console.log('  - images (new files):', imageFiles.length);
        console.log('==========================================');
        
        const res = await instance.put(`${FORUM_URL}/posts/${postId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('forumAPI.updatePost: Response:', res.data);
        console.log('forumAPI.updatePost: Response images:', res.data?.images);
        
        // Map response to frontend format (similar to getAllPosts)
        const updatedPost = res.data;
        return {
          id: updatedPost._id || updatedPost.id,
          author: {
            id: updatedPost.author?._id || updatedPost.author?.id,
            name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
            avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
          },
          timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
          content: updatedPost.content || '',
          image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
          images: updatedPost.images || [],
          location: updatedPost.address || updatedPost.location, // Map address to location
          tags: updatedPost.tags || [],
          likes: updatedPost.likeCount || 0,
          comments: updatedPost.commentCount || 0,
          favorites: updatedPost.favoriteCount || 0,
          isLiked: updatedPost.isLiked || false,
          isFavorited: updatedPost.isFavorited || false,
          commentsList: updatedPost.comments || updatedPost.commentsList || [],
        };
      } else {
        // No new images, send JSON body
        console.log('====== forumAPI.updatePost (NO new images) ======');
        
        const body: Record<string, unknown> = { ...payload };
        if (extendedPayload.address == null && payload.location) {
          body.address = payload.location;
        }
        
        // Check if we have keepImages (user may have deleted some old images)
        const keepImages = extendedPayload.keepImages;
        if (keepImages && Array.isArray(keepImages)) {
          body.keepImages = keepImages;
          console.log('✅ keepImages to preserve:', keepImages);
          console.log('   Number of images to keep:', keepImages.length);
        } else {
          console.warn('⚠️ No keepImages in payload (all images will be deleted)');
        }
        
        delete body.author;
        delete body.id;
        delete body.timestamp;
        delete body.imageFiles;
        delete body.images; // Don't send UI images array
        
        console.log('JSON body to send:', body);
        console.log('==========================================');
        
        const res = await instance.put(`${FORUM_URL}/posts/${postId}`, body);
        console.log('forumAPI.updatePost: Response:', res.data);
        console.log('forumAPI.updatePost: Response images:', res.data?.images);
        
        // Map response to frontend format
        const updatedPost = res.data;
        return {
          id: updatedPost._id || updatedPost.id,
          author: {
            id: updatedPost.author?._id || updatedPost.author?.id,
            name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
            avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
          },
          timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
          content: updatedPost.content || '',
          image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
          images: updatedPost.images || [],
          location: updatedPost.address || updatedPost.location, // Map address to location
          tags: updatedPost.tags || [],
          likes: updatedPost.likeCount || 0,
          comments: updatedPost.commentCount || 0,
          favorites: updatedPost.favoriteCount || 0,
          isLiked: updatedPost.isLiked || false,
          isFavorited: updatedPost.isFavorited || false,
          commentsList: updatedPost.comments || updatedPost.commentsList || [],
        };
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('forumAPI.updatePost error:', error);
      console.error('forumAPI.updatePost error details:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      });
      
      // Fallback to mock
      console.log('forumAPI.updatePost: Using mock fallback');
      const postIndex = mockPosts.findIndex(p => p.id === postId || p.id === String(postId));
      if (postIndex !== -1) {
        mockPosts[postIndex] = { ...mockPosts[postIndex], ...payload };
        return mockPosts[postIndex];
      }
      throw new Error('Post not found');
    }
  },

  deletePost: async (postId: number | string): Promise<void> => {
    try {
      console.log('forumAPI.deletePost: Making request to:', `${FORUM_URL}/posts/${postId}`);
      await instance.delete(`${FORUM_URL}/posts/${postId}`);
      console.log('forumAPI.deletePost: Success');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('forumAPI.deletePost error:', axiosError);
      // Fallback to mock
      console.log('forumAPI.deletePost: API not implemented, simulating post deletion');
      const postIndex = mockPosts.findIndex(p => p.id === postId || p.id === String(postId));
      if (postIndex !== -1) {
        mockPosts.splice(postIndex, 1);
      }
    }
  },

  toggleLike: async (postId: number | string): Promise<PostData> => {
    try {
      // Try real backend endpoint first
      const res = await instance.post(`${FORUM_URL}/posts/${postId}/like`);
      const updatedPost = res.data;
      return {
        id: updatedPost._id || updatedPost.id,
        author: {
          id: updatedPost.author?._id || updatedPost.author?.id,
          name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
          avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
        },
        timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: updatedPost.content || '',
        image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
        images: updatedPost.images || [],
        location: updatedPost.address || updatedPost.location,
        tags: updatedPost.tags || [],
        likes: updatedPost.likeCount || updatedPost.likes || 0,
        comments: updatedPost.commentCount || (Array.isArray(updatedPost.comments) ? updatedPost.comments.length : updatedPost.comments || 0),
        favorites: updatedPost.favoriteCount || updatedPost.favorites || 0,
        isLiked: !!(updatedPost.isLiked ?? (updatedPost.likeToggled ?? false)),
        isFavorited: !!(updatedPost.isFavorited ?? false),
        commentsList: Array.isArray(updatedPost.comments)
          ? updatedPost.comments.map((c: BackendComment) => ({
            id: c.id || c._id,
            author: {
              name: c.author?.username || c.author?.name || 'Unknown',
              profilePic: c.author?.avatar || c.author?.profilePic || '',
            },
            content: c.content,
            timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
            likes: c.likeCount || (Array.isArray(c.likes) ? c.likes.length : c.likes || 0),
            isLiked: !!c.isLiked,
            parentId: null,
          }))
          : (updatedPost.commentsList || []),
      };
    } catch (err) {
      // Fallback to mock toggle for local testing
      console.log('forumAPI.toggleLike: Fallback to mock toggle');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
        if (post.isLiked) post.isFavorited = false;
        return post;
      }
      throw err;
    }
  },

  toggleFavorite: async (postId: number | string): Promise<PostData> => {
    try {
      // Try real backend endpoint first
      const res = await instance.post(`${FORUM_URL}/posts/${postId}/favorite`);
      const updatedPost = res.data;
      return {
        id: updatedPost._id || updatedPost.id,
        author: {
          id: updatedPost.author?._id || updatedPost.author?.id,
          name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
          avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
        },
        timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: updatedPost.content || '',
        image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
        images: updatedPost.images || [],
        location: updatedPost.address || updatedPost.location,
        tags: updatedPost.tags || [],
        likes: updatedPost.likeCount || updatedPost.likes || 0,
        comments: updatedPost.commentCount || (Array.isArray(updatedPost.comments) ? updatedPost.comments.length : updatedPost.comments || 0),
        favorites: updatedPost.favoriteCount || updatedPost.favorites || 0,
        isLiked: !!(updatedPost.isLiked ?? false),
        isFavorited: !!(updatedPost.isFavorited ?? (updatedPost.favoriteToggled ?? false)),
        commentsList: Array.isArray(updatedPost.comments)
          ? updatedPost.comments.map((c: BackendComment) => ({
            id: c.id || c._id,
            author: {
              name: c.author?.username || c.author?.name || 'Unknown',
              profilePic: c.author?.avatar || c.author?.profilePic || '',
            },
            content: c.content,
            timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
            likes: c.likeCount || (Array.isArray(c.likes) ? c.likes.length : c.likes || 0),
            isLiked: !!c.isLiked,
            parentId: null,
          }))
          : (updatedPost.commentsList || []),
      };
    } catch (err) {
      // Fallback to mock toggle for local testing
      console.log('forumAPI.toggleFavorite: Fallback to mock toggle');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post) {
        post.isFavorited = !post.isFavorited;
        post.favorites = post.isFavorited ? (post.favorites || 0) + 1 : Math.max(0, (post.favorites || 0) - 1);
        if (post.isFavorited) post.isLiked = false;
        return post;
      }
      throw err;
    }
  },

  addComment: async (
    postId: number | string,
    body: { content: string; parentId?: number | string | null }
  ): Promise<PostData> => {
    try {
      const res = await instance.post(`${FORUM_URL}/posts/${postId}/comments`, body);
      const data = res.data;
      // Some backends only return minimal info on create (id, author, content,...)
      // If response doesn't include comments/images array, fetch the full post to update UI correctly
      const backendData = data as BackendPost;
      const minimal = !Array.isArray(backendData.comments) && !Array.isArray(backendData.images);
      if (minimal) {
        const fullRes = await instance.get(`${FORUM_URL}/posts/${postId}`);
        const full = fullRes.data;
        return {
          id: full._id || full.id,
          author: {
            id: full.author?._id || full.author?.id,
            name: full.author?.username || full.author?.name || 'Unknown',
            avatar: full.author?.avatar || full.author?.profilePic || '',
          },
          timestamp: full.createdAt ? new Date(full.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
          content: full.content || '',
          image: full.images && full.images.length > 0 ? full.images[0] : undefined,
          images: full.images || [],
          location: full.address || full.location,
          tags: full.tags || [],
          likes: full.likeCount || full.likes || 0,
          comments: full.commentCount || (Array.isArray(full.comments) ? full.comments.length : full.comments || 0),
          favorites: full.favoriteCount || full.favorites || 0,
          isLiked: !!(full.isLiked ?? false),
          isFavorited: !!(full.isFavorited ?? false),
          commentsList: Array.isArray(full.comments)
            ? full.comments.map((c: BackendComment) => ({
              id: c.id || c._id,
              author: {
                name: c.author?.username || c.author?.name || 'Unknown',
                profilePic: c.author?.avatar || c.author?.profilePic || '',
              },
              content: c.content,
              timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
              likes: Array.isArray(c.likes) ? c.likes.length : c.likeCount || 0,
              isLiked: !!c.isLiked,
              parentId: null,
            }))
            : [],
        };
      }

      // Otherwise, map directly
      const updatedPost = data;
      return {
        id: updatedPost._id || updatedPost.id,
        author: {
          id: updatedPost.author?._id || updatedPost.author?.id,
          name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
          avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
        },
        timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: updatedPost.content || '',
        image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
        images: updatedPost.images || [],
        location: updatedPost.address || updatedPost.location,
        tags: updatedPost.tags || [],
        likes: updatedPost.likeCount || updatedPost.likes || 0,
        comments: updatedPost.commentCount || (Array.isArray(updatedPost.comments) ? updatedPost.comments.length : updatedPost.comments || 0),
        favorites: updatedPost.favoriteCount || updatedPost.favorites || 0,
        isLiked: !!(updatedPost.isLiked ?? false),
        isFavorited: !!(updatedPost.isFavorited ?? false),
        commentsList: Array.isArray(updatedPost.comments)
          ? updatedPost.comments.map((c: BackendComment) => ({
            id: c.id || c._id,
            author: {
              name: c.author?.username || c.author?.name || 'Unknown',
              profilePic: c.author?.avatar || c.author?.profilePic || '',
            },
            content: c.content,
            timestamp: c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
            likes: Array.isArray(c.likes) ? c.likes.length : c.likeCount || 0,
            isLiked: !!c.isLiked,
            parentId: null,
          }))
          : (updatedPost.commentsList || []),
      };
    } catch {
      console.log('forumAPI.addComment: API not available, using mock');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post) {
        const newComment: ForumComment = {
          id: Date.now(),
          author: {
            name: 'Current User',
            profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU'
          },
          content: body.content,
          timestamp: new Date().toLocaleString('vi-VN'),
          likes: 0,
          isLiked: false,
          parentId: typeof body.parentId === 'number' ? body.parentId : null
        };
      
        if (!post.commentsList) {
          post.commentsList = [];
        }
      
        if (body.parentId) {
        // Add as reply
          const parentComment = post.commentsList.find(c => c.id === body.parentId);
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            parentComment.replies.push(newComment);
          }
        } else {
        // Add as main comment
          post.commentsList.push(newComment);
        }
      
        post.comments = (post.comments || 0) + 1;
        return post;
      }
      throw new Error('Post not found');
    }
  },

  editComment: async (
    postId: number | string,
    commentId: number | string,
    body: { content: string }
  ): Promise<PostData> => {
    try {
      const res = await instance.put(`${FORUM_URL}/posts/${postId}/comments/${commentId}`, body);
      const updatedPost = res.data;
      return {
        id: updatedPost._id || updatedPost.id,
        author: {
          id: updatedPost.author?._id || updatedPost.author?.id,
          name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
          avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
        },
        timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: updatedPost.content || '',
        image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
        images: updatedPost.images || [],
        location: updatedPost.address || updatedPost.location,
        tags: updatedPost.tags || [],
        likes: updatedPost.likeCount || updatedPost.likes || 0,
        comments: updatedPost.commentCount || updatedPost.comments || 0,
        favorites: updatedPost.favoriteCount || updatedPost.favorites || 0,
        isLiked: !!(updatedPost.isLiked ?? false),
        isFavorited: !!(updatedPost.isFavorited ?? false),
        commentsList: updatedPost.commentsList || [],
      };
    } catch (e) {
      console.log('forumAPI.editComment: API not available, using mock');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post && post.commentsList) {
        const comment = post.commentsList.find(c => String(c.id) === String(commentId));
        if (comment) {
          comment.content = body.content;
          return post;
        }
      }
      throw e;
    }
  },

  deleteComment: async (postId: number | string, commentId: number | string): Promise<void> => {
    try {
      await instance.delete(`${FORUM_URL}/posts/${postId}/comments/${commentId}`);
    } catch  {
      console.log('forumAPI.deleteComment: API not available, using mock');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post && post.commentsList) {
        const commentIndex = post.commentsList.findIndex(c => String(c.id) === String(commentId));
        if (commentIndex !== -1) {
          post.commentsList.splice(commentIndex, 1);
          post.comments = Math.max(0, (post.comments || 0) - 1);
        }
      }
    }
  },

  toggleCommentLike: async (postId: number | string, commentId: number | string): Promise<PostData> => {
    try {
      const res = await instance.post(`${FORUM_URL}/posts/${postId}/comments/${commentId}/like`);
      const updatedPost = res.data;
      return {
        id: updatedPost._id || updatedPost.id,
        author: {
          id: updatedPost.author?._id || updatedPost.author?.id,
          name: updatedPost.author?.username || updatedPost.author?.name || 'Unknown',
          avatar: updatedPost.author?.avatar || updatedPost.author?.profilePic || '',
        },
        timestamp: updatedPost.createdAt ? new Date(updatedPost.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN'),
        content: updatedPost.content || '',
        image: updatedPost.images && updatedPost.images.length > 0 ? updatedPost.images[0] : undefined,
        images: updatedPost.images || [],
        location: updatedPost.address || updatedPost.location,
        tags: updatedPost.tags || [],
        likes: updatedPost.likeCount || updatedPost.likes || 0,
        comments: updatedPost.commentCount || updatedPost.comments || 0,
        favorites: updatedPost.favoriteCount || updatedPost.favorites || 0,
        isLiked: !!(updatedPost.isLiked ?? false),
        isFavorited: !!(updatedPost.isFavorited ?? false),
        commentsList: updatedPost.commentsList || [],
      };
    } catch (e) {
      console.log('forumAPI.toggleCommentLike: API not available, using mock');
      const post = mockPosts.find(p => String(p.id) === String(postId));
      if (post && post.commentsList) {
        const comment = post.commentsList.find(c => String(c.id) === String(commentId));
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes = comment.isLiked ? (comment.likes || 0) + 1 : Math.max(0, (comment.likes || 0) - 1);
          return post;
        }
      }
      throw e;
    }
  },
};