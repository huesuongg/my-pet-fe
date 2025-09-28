import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  addPostToStorage,
  updatePostInStorage,
  deletePostFromStorage,
  initializeDefaultPosts,
  clearAllPosts,
} from "../services/postStorage";

export interface ForumComment {
  id: number;
  author: {
    name: string;
    profilePic: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: ForumComment[];
}

export interface PostData {
  id: number;
  author: {
    name: string;
    profilePic: string;
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

interface PostState {
  posts: PostData[];
}

type PostAction =
  | {
      type: "ADD_POST";
      payload: Omit<
        PostData,
        | "id"
        | "likes"
        | "comments"
        | "favorites"
        | "isLiked"
        | "isFavorited"
        | "commentsList"
      >;
    }
  | { type: "UPDATE_POST"; payload: { id: number; updates: Partial<PostData> } }
  | { type: "DELETE_POST"; payload: number }
  | { type: "TOGGLE_LIKE"; payload: number }
  | { type: "TOGGLE_FAVORITE"; payload: number }
  | {
      type: "ADD_COMMENT";
      payload: { postId: number; comment: Omit<ForumComment, "id"> };
    }
  | { type: "DELETE_COMMENT"; payload: { postId: number; commentId: number } }
  | {
      type: "TOGGLE_COMMENT_LIKE";
      payload: { postId: number; commentId: number };
    }
  | {
      type: "ADD_REPLY";
      payload: {
        postId: number;
        commentId: number;
        reply: Omit<ForumComment, "id">;
      };
    }
  | { type: "REFRESH_POSTS" }
  | { type: "CLEAR_AND_RELOAD_POSTS" };

const initialState: PostState = {
  posts: initializeDefaultPosts(),
};

function postReducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
  case "ADD_POST": {
    const newPost = addPostToStorage(action.payload);
    return {
      ...state,
      posts: [newPost, ...state.posts],
    };
  }
  case "UPDATE_POST": {
    updatePostInStorage(action.payload.id, action.payload.updates);
    return {
      ...state,
      posts: state.posts.map((post) =>
        post.id === action.payload.id
          ? { ...post, ...action.payload.updates }
          : post
      ),
    };
  }
  case "DELETE_POST": {
    deletePostFromStorage(action.payload);
    return {
      ...state,
      posts: state.posts.filter((post) => post.id !== action.payload),
    };
  }
  case "TOGGLE_LIKE": {
    const updatedPostsLike = state.posts.map((post) =>
      post.id === action.payload
        ? {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        }
        : post
    );
    updatePostInStorage(action.payload, {
      isLiked: !state.posts.find((p) => p.id === action.payload)?.isLiked,
      likes: state.posts.find((p) => p.id === action.payload)?.isLiked
        ? (state.posts.find((p) => p.id === action.payload)?.likes || 0) - 1
        : (state.posts.find((p) => p.id === action.payload)?.likes || 0) + 1,
    });
    return {
      ...state,
      posts: updatedPostsLike,
    };
  }
  case "TOGGLE_FAVORITE": {
    const updatedPostsFavorite = state.posts.map((post) =>
      post.id === action.payload
        ? {
          ...post,
          isFavorited: !post.isFavorited,
          favorites: post.isFavorited
            ? post.favorites - 1
            : post.favorites + 1,
        }
        : post
    );
    updatePostInStorage(action.payload, {
      isFavorited: !state.posts.find((p) => p.id === action.payload)
        ?.isFavorited,
      favorites: state.posts.find((p) => p.id === action.payload)?.isFavorited
        ? (state.posts.find((p) => p.id === action.payload)?.favorites || 0) -
            1
        : (state.posts.find((p) => p.id === action.payload)?.favorites || 0) +
            1,
    });
    return {
      ...state,
      posts: updatedPostsFavorite,
    };
  }
  case "ADD_COMMENT": {
    const updatedPostsComment = state.posts.map((post) =>
      post.id === action.payload.postId
        ? {
          ...post,
          comments: post.comments + 1,
          commentsList: [
            ...(post.commentsList || []),
            {
              ...(action.payload.comment as ForumComment),
              id:
                    Math.max(...(post.commentsList || []).map((c) => c.id), 0) +
                    1,
            },
          ],
        }
        : post
    );
    const targetPost = state.posts.find(
      (p) => p.id === action.payload.postId
    );
    if (targetPost) {
      updatePostInStorage(action.payload.postId, {
        comments: targetPost.comments + 1,
        commentsList: [
          ...(targetPost.commentsList || []),
          {
            ...action.payload.comment,
            id:
                Math.max(
                  ...(targetPost.commentsList || []).map((c) => c.id),
                  0
                ) + 1,
          },
        ],
      });
    }
    return {
      ...state,
      posts: updatedPostsComment,
    };
  }
  case "DELETE_COMMENT": {
    const updatedPostsDeleteComment = state.posts.map((post) =>
      post.id === action.payload.postId
        ? {
          ...post,
          comments: post.comments - 1,
          commentsList: (post.commentsList || []).filter(
            (c) => c.id !== action.payload.commentId
          ),
        }
        : post
    );
    const targetPostForDelete = state.posts.find(
      (p) => p.id === action.payload.postId
    );
    if (targetPostForDelete) {
      updatePostInStorage(action.payload.postId, {
        comments: targetPostForDelete.comments - 1,
        commentsList: (targetPostForDelete.commentsList || []).filter(
          (c) => c.id !== action.payload.commentId
        ),
      });
    }
    return {
      ...state,
      posts: updatedPostsDeleteComment,
    };
  }
  case "TOGGLE_COMMENT_LIKE": {
    const updatedPostsCommentLike = state.posts.map((post) =>
      post.id === action.payload.postId
        ? {
          ...post,
          commentsList: post.commentsList.map((comment) =>
            comment.id === action.payload.commentId
              ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked
                  ? comment.likes - 1
                  : comment.likes + 1,
              }
              : comment
          ),
        }
        : post
    );
    return {
      ...state,
      posts: updatedPostsCommentLike,
    };
  }
  case "ADD_REPLY": {
    const updatedPostsReply = state.posts.map((post) =>
      post.id === action.payload.postId
        ? {
          ...post,
          comments: post.comments + 1,
          commentsList: post.commentsList.map((comment) =>
            comment.id === action.payload.commentId
              ? {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  {
                    ...(action.payload.reply as ForumComment),
                    id:
                            Math.max(
                              ...(comment.replies || []).map((r) => r.id),
                              0
                            ) + 1,
                    isLiked: false,
                    replies: [],
                  },
                ],
              }
              : comment
          ),
        }
        : post
    );
    return {
      ...state,
      posts: updatedPostsReply,
    };
  }
  case "REFRESH_POSTS": {
    return {
      ...state,
      posts: initializeDefaultPosts(),
    };
  }
  case "CLEAR_AND_RELOAD_POSTS": {
    clearAllPosts();
    return {
      ...state,
      posts: initializeDefaultPosts(),
    };
  }
  default:
    return state;
  }
}

interface PostContextType {
  state: PostState;
  addPost: (
    post: Omit<
      PostData,
      | "id"
      | "likes"
      | "comments"
      | "favorites"
      | "isLiked"
      | "isFavorited"
      | "commentsList"
    >
  ) => void;
  updatePost: (id: number, updates: Partial<PostData>) => void;
  deletePost: (id: number) => void;
  toggleLike: (id: number) => void;
  toggleFavorite: (id: number) => void;
  addComment: (postId: number, comment: Omit<ForumComment, "id">) => void;
  deleteComment: (postId: number, commentId: number) => void;
  toggleCommentLike: (postId: number, commentId: number) => void;
  addReply: (
    postId: number,
    commentId: number,
    reply: Omit<ForumComment, "id">
  ) => void;
  refreshPosts: () => void;
  clearAndReloadPosts: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const addPost = (
    post: Omit<
      PostData,
      | "id"
      | "likes"
      | "comments"
      | "favorites"
      | "isLiked"
      | "isFavorited"
      | "commentsList"
    >
  ) => {
    dispatch({ type: "ADD_POST", payload: post });
  };

  const updatePost = (id: number, updates: Partial<PostData>) => {
    dispatch({ type: "UPDATE_POST", payload: { id, updates } });
  };

  const deletePost = (id: number) => {
    dispatch({ type: "DELETE_POST", payload: id });
  };

  const toggleLike = (id: number) => {
    dispatch({ type: "TOGGLE_LIKE", payload: id });
  };

  const toggleFavorite = (id: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  };

  const addComment = (postId: number, comment: Omit<ForumComment, "id">) => {
    dispatch({ type: "ADD_COMMENT", payload: { postId, comment } });
  };

  const deleteComment = (postId: number, commentId: number) => {
    dispatch({ type: "DELETE_COMMENT", payload: { postId, commentId } });
  };

  const toggleCommentLike = (postId: number, commentId: number) => {
    dispatch({ type: "TOGGLE_COMMENT_LIKE", payload: { postId, commentId } });
  };

  const addReply = (
    postId: number,
    commentId: number,
    reply: Omit<ForumComment, "id">
  ) => {
    dispatch({ type: "ADD_REPLY", payload: { postId, commentId, reply } });
  };

  const refreshPosts = () => {
    dispatch({ type: "REFRESH_POSTS" });
  };

  const clearAndReloadPosts = () => {
    dispatch({ type: "CLEAR_AND_RELOAD_POSTS" });
  };

  return (
    <PostContext.Provider
      value={{
        state,
        addPost,
        updatePost,
        deletePost,
        toggleLike,
        toggleFavorite,
        addComment,
        deleteComment,
        toggleCommentLike,
        addReply,
        refreshPosts,
        clearAndReloadPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
