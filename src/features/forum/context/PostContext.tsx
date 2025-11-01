import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import { forumAPI } from '../services/forumAPI';
import { forumReducer, initialState } from '../forumSlice';
import type { PostData, ForumComment } from '../types/forum.types';

/**
 * Implementation detail:
 * - Dispatches plain action objects with the same string types used in forumSlice constants.
 * - Uses forumAPI for network calls so NewFeeds -> PostProvider -> fetchPosts() will actually call backend.
 * - Logs added for quick debugging.
 */

type PostContextValue = {
  state: typeof initialState;
  fetchPosts: () => Promise<PostData[] | void>;
  fetchPost: (postId: number | string) => Promise<PostData | void>;
  createPost: (payload: Partial<PostData>) => Promise<PostData | void>;
  addPost: (payload: Partial<PostData>) => Promise<PostData | void>; // Alias for createPost
  updatePost: (postId: number | string, payload: Partial<PostData>) => Promise<PostData | void>;
  deletePost: (postId: number | string) => Promise<void>;
  toggleLike: (postId: number | string) => Promise<PostData | void>;
  toggleFavorite: (postId: number | string) => Promise<PostData | void>;
  addComment: (postId: number | string, content: string, parentId?: number | null) => Promise<PostData | void>;
  toggleCommentLike: (postId: number | string, commentId: number | string) => Promise<PostData | void>;
  addReply: (postId: number | string, commentId: number | string, reply: Partial<ForumComment>) => Promise<PostData | void>;
  editComment: (postId: number | string, commentId: number | string, content: string) => Promise<PostData | void>;
  deleteCommentHard: (postId: number | string, commentId: number | string) => Promise<PostData | void>;
  setSelectedPost: (post: PostData | null) => void;
  clearError: () => void;
};

const PostContext = createContext<PostContextValue | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(forumReducer, initialState);

  const fetchPosts = useCallback(async () => {
    dispatch({ type: 'forum/fetchPosts/pending' });
    try {
      const posts = await forumAPI.getAllPosts();
      console.log('[PostContext] fetchPosts success', posts);

      const postsArray = Array.isArray(posts) ? posts : [];
      dispatch({ type: 'forum/fetchPosts/fulfilled', payload: postsArray });
      return postsArray;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Fetch posts failed');
      console.error('[PostContext] fetchPosts error', msg);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      dispatch({ type: 'forum/fetchPosts/fulfilled', payload: [] });
    }
  }, []);

  const fetchPost = useCallback(async (postId: number | string) => {
    try {
      const post = await forumAPI.getPostById(postId);
      console.log('[PostContext] fetchPost success', postId);
      dispatch({ type: 'forum/fetchPost/fulfilled', payload: post });
      return post;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fetch post failed';
      console.error('[PostContext] fetchPost error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  const createPost = useCallback(async (payload: Partial<PostData>) => {
    try {
      const created = await forumAPI.createPost(payload);
      console.log('[PostContext] createPost success', created);
      dispatch({ type: 'forum/createPost/fulfilled', payload: created });
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Create post failed';
      console.error('[PostContext] createPost error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  type ExtraUpdateFields = {
    keepImages?: boolean;
    imageFiles?: File[];
    address?: string | null;
  };

  const updatePost = useCallback(
    async (postId: number | string, payload: Partial<PostData>) => {
      try {
        const ext = payload as Partial<PostData> & ExtraUpdateFields;
        console.log('====== PostContext.updatePost ======');
        console.log('Post ID:', postId);
        console.log('Payload received:', {
          content: payload.content,
          keepImages: ext.keepImages,
          imageFiles: ext.imageFiles ? ext.imageFiles.map((f: File) => f.name) : [],
          tags: payload.tags,
          address: ext.address ?? payload.location,
        });
        console.log('==================================');

        const updated = await forumAPI.updatePost(postId, payload);
        console.log('[PostContext] updatePost success', postId);
        dispatch({ type: 'forum/updatePost/fulfilled', payload: updated });
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Update post failed';
        console.error('[PostContext] updatePost error', err);
        dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      }
    },
    []
  );

  const deletePost = useCallback(async (postId: number | string) => {
    try {
      await forumAPI.deletePost(postId);
      console.log('[PostContext] deletePost success', postId);
      dispatch({ type: 'forum/deletePost/fulfilled', payload: postId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete post failed';
      console.error('[PostContext] deletePost error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  const toggleLike = useCallback(
    async (postId: number | string) => {
      try {
        const targetId = String(postId);
        const target = state.posts.find((p) => String(p.id) === targetId);
        if (target) {
          const updated = {
            ...target,
            isLiked: !target.isLiked,
            likes: !target.isLiked ? (target.likes || 0) + 1 : Math.max(0, (target.likes || 0) - 1),
            isFavorited: target.isLiked ? target.isFavorited : false,
          };
          dispatch({ type: 'forum/toggleLike/fulfilled', payload: updated });
        }

        try {
          const apiUpdated = await forumAPI.toggleLike(postId);
          if (apiUpdated) {
            dispatch({ type: 'forum/toggleLike/fulfilled', payload: apiUpdated });
          }
        } catch {
          // swallow; optimistic UI remains
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Toggle like failed';
        console.error('[PostContext] toggleLike error', err);
        dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      }
    },
    [state.posts]
  );

  const toggleFavorite = useCallback(
    async (postId: number | string) => {
      try {
        const targetId = String(postId);
        const target = state.posts.find((p) => String(p.id) === targetId);
        if (target) {
          const updated = {
            ...target,
            isFavorited: !target.isFavorited,
            favorites: !target.isFavorited ? (target.favorites || 0) + 1 : Math.max(0, (target.favorites || 0) - 1),
            isLiked: target.isFavorited ? target.isLiked : false,
          };
          dispatch({ type: 'forum/toggleFavorite/fulfilled', payload: updated });
        }

        try {
          const apiUpdated = await forumAPI.toggleFavorite(postId);
          if (apiUpdated) {
            dispatch({ type: 'forum/toggleFavorite/fulfilled', payload: apiUpdated });
          }
        } catch {
          // ignore; optimistic UI remains
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Toggle favorite failed';
        console.error('[PostContext] toggleFavorite error', err);
        dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      }
    },
    [state.posts]
  );

  const addComment = useCallback(
    async (postId: number | string, content: string, parentId?: number | null) => {
      try {
        const updated = await forumAPI.addComment(postId, { content, parentId });
        console.log('[PostContext] addComment success', postId);
        dispatch({ type: 'forum/addComment/fulfilled', payload: updated });
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Add comment failed';
        console.error('[PostContext] addComment error', err);
        dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      }
    },
    []
  );

  const toggleCommentLike = useCallback(async (postId: number | string, commentId: number | string) => {
    try {
      const updated = await forumAPI.toggleCommentLike(postId, commentId);
      console.log('[PostContext] toggleCommentLike success', postId, commentId);
      dispatch({ type: 'forum/addComment/fulfilled', payload: updated });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Toggle comment like failed';
      console.error('[PostContext] toggleCommentLike error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  const addReply = useCallback(
    async (postId: number | string, commentId: number | string, reply: Partial<ForumComment>) => {
      try {
        const updated = await forumAPI.addComment(postId, {
          content: reply.content || '',
          parentId: commentId,
        });
        console.log('[PostContext] addReply success', postId, commentId);
        dispatch({ type: 'forum/addComment/fulfilled', payload: updated });
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Add reply failed';
        console.error('[PostContext] addReply error', err);
        dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
      }
    },
    []
  );

  const editComment = useCallback(async (postId: number | string, commentId: number | string, content: string) => {
    try {
      const updated = await forumAPI.editComment(postId, commentId, { content });
      console.log('[PostContext] editComment success', postId, commentId);
      dispatch({ type: 'forum/addComment/fulfilled', payload: updated });
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Edit comment failed';
      console.error('[PostContext] editComment error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  const deleteCommentHard = useCallback(async (postId: number | string, commentId: number | string) => {
    try {
      await forumAPI.deleteComment(postId, commentId);
      const post = await forumAPI.getPostById(postId);
      dispatch({ type: 'forum/addComment/fulfilled', payload: post });
      console.log('[PostContext] deleteComment success', postId, commentId);
      return post;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete comment failed';
      console.error('[PostContext] deleteComment error', err);
      dispatch({ type: 'forum/fetchPosts/rejected', payload: msg });
    }
  }, []);

  const setSelectedPost = useCallback((post: PostData | null) => {
    dispatch({ type: 'forum/setSelectedPost', payload: post });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'forum/clearError' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      fetchPosts,
      fetchPost,
      createPost,
      addPost: createPost,
      updatePost,
      deletePost,
      toggleLike,
      toggleFavorite,
      addComment,
      toggleCommentLike,
      addReply,
      editComment,
      deleteCommentHard,
      setSelectedPost,
      clearError,
    }),
    [
      state,
      fetchPosts,
      fetchPost,
      createPost,
      updatePost,
      deletePost,
      toggleLike,
      toggleFavorite,
      addComment,
      toggleCommentLike,
      addReply,
      editComment,
      deleteCommentHard,
      setSelectedPost,
      clearError,
    ]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function usePostContext(): PostContextValue {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePostContext must be used within PostProvider');
  return ctx;
}
