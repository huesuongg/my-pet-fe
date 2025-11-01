import { PostData } from './types/forum.types';
import { forumAPI } from './services/forumAPI';
import { AxiosError } from 'axios';

/**
 * This module provides:
 * - a reducer + initialState usable with React's useReducer
 * - plain async action helpers that accept a dispatch and call the API,
 *   dispatching pending/fulfilled/rejected actions so the reducer updates state.
 *
 * This lets PostContext use a "slice-like" implementation without Redux store.
 */

export interface ForumState {
  posts: PostData[];
  selectedPost: PostData | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ForumState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

/* Action type constants */
const FETCH_POSTS_PENDING = 'forum/fetchPosts/pending';
const FETCH_POSTS_FULFILLED = 'forum/fetchPosts/fulfilled';
const FETCH_POSTS_REJECTED = 'forum/fetchPosts/rejected';

const FETCH_POST_FULFILLED = 'forum/fetchPost/fulfilled';

const CREATE_POST_FULFILLED = 'forum/createPost/fulfilled';
const UPDATE_POST_FULFILLED = 'forum/updatePost/fulfilled';
const DELETE_POST_FULFILLED = 'forum/deletePost/fulfilled';

const TOGGLE_LIKE_FULFILLED = 'forum/toggleLike/fulfilled';
const TOGGLE_FAVORITE_FULFILLED = 'forum/toggleFavorite/fulfilled';

const ADD_COMMENT_FULFILLED = 'forum/addComment/fulfilled';

const SET_SELECTED_POST = 'forum/setSelectedPost';
const CLEAR_ERROR = 'forum/clearError';

/* Generic Action type */
type Action =
  | { type: typeof FETCH_POSTS_PENDING }
  | { type: typeof FETCH_POSTS_FULFILLED; payload: PostData[] }
  | { type: typeof FETCH_POSTS_REJECTED; payload: string }
  | { type: typeof FETCH_POST_FULFILLED; payload: PostData }
  | { type: typeof CREATE_POST_FULFILLED; payload: PostData }
  | { type: typeof UPDATE_POST_FULFILLED; payload: PostData }
  | { type: typeof DELETE_POST_FULFILLED; payload: number | string }
  | { type: typeof TOGGLE_LIKE_FULFILLED; payload: PostData }
  | { type: typeof TOGGLE_FAVORITE_FULFILLED; payload: PostData }
  | { type: typeof ADD_COMMENT_FULFILLED; payload: PostData }
  | { type: typeof SET_SELECTED_POST; payload: PostData | null }
  | { type: typeof CLEAR_ERROR };

/* Reducer used by PostContext (useReducer) */
export function forumReducer(state: ForumState, action: Action): ForumState {
  switch (action.type) {
  case FETCH_POSTS_PENDING:
    return { ...state, loading: true, error: null };
  case FETCH_POSTS_FULFILLED:
    return { ...state, loading: false, posts: action.payload };
  case FETCH_POSTS_REJECTED:
    return { ...state, loading: false, error: action.payload };
  case FETCH_POST_FULFILLED:
    return { ...state, selectedPost: action.payload };
  case CREATE_POST_FULFILLED:
    return { ...state, posts: [action.payload, ...state.posts] };
  case UPDATE_POST_FULFILLED: {
    const updated = action.payload;
    const posts = state.posts.map((p) => (p.id === updated.id ? updated : p));
    const selectedPost = state.selectedPost?.id === updated.id ? updated : state.selectedPost;
    return { ...state, posts, selectedPost };
  }
  case DELETE_POST_FULFILLED: {
    const deletedId = action.payload;
    const posts = state.posts.filter((p) => p.id !== deletedId);
    const selectedPost = state.selectedPost?.id === deletedId ? null : state.selectedPost;
    return { ...state, posts, selectedPost };
  }
  case TOGGLE_LIKE_FULFILLED: {
    const updated = action.payload;
    const posts = state.posts.map((p) => (p.id === updated.id ? updated : p));
    const selectedPost = state.selectedPost?.id === updated.id ? updated : state.selectedPost;
    return { ...state, posts, selectedPost };
  }
  case TOGGLE_FAVORITE_FULFILLED: {
    const updated = action.payload;
    const posts = state.posts.map((p) => (p.id === updated.id ? updated : p));
    const selectedPost = state.selectedPost?.id === updated.id ? updated : state.selectedPost;
    return { ...state, posts, selectedPost };
  }
  case ADD_COMMENT_FULFILLED: {
    const updated = action.payload;
    const posts = state.posts.map((p) => (p.id === updated.id ? updated : p));
    const selectedPost = state.selectedPost?.id === updated.id ? updated : state.selectedPost;
    return { ...state, posts, selectedPost };
  }
  case SET_SELECTED_POST:
    return { ...state, selectedPost: action.payload };
  case CLEAR_ERROR:
    return { ...state, error: null };
  default:
    return state;
  }
}

/* Async helpers - call these from PostContext, pass dispatch from useReducer */
export async function fetchPosts(dispatch: (a: Action) => void) {
  dispatch({ type: FETCH_POSTS_PENDING });
  try {
    const data = await forumAPI.getAllPosts();
    dispatch({ type: FETCH_POSTS_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Fetch posts failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export async function fetchPost(dispatch: (a: Action) => void, postId: number) {
  try {
    const data = await forumAPI.getPostById(postId);
    dispatch({ type: FETCH_POST_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Fetch post failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export async function createPost(dispatch: (a: Action) => void, payload: Partial<PostData>) {
  try {
    const data = await forumAPI.createPost(payload);
    dispatch({ type: CREATE_POST_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Create post failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export async function toggleLike(dispatch: (a: Action) => void, postId: number) {
  try {
    const data = await forumAPI.toggleLike(postId);
    dispatch({ type: TOGGLE_LIKE_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Toggle like failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export async function toggleFavorite(dispatch: (a: Action) => void, postId: number) {
  try {
    const data = await forumAPI.toggleFavorite(postId);
    dispatch({ type: TOGGLE_FAVORITE_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Toggle favorite failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export async function addComment(
  dispatch: (a: Action) => void,
  postId: number,
  content: string,
  parentId?: number | null
) {
  try {
    const data = await forumAPI.addComment(postId, { content, parentId });
    dispatch({ type: ADD_COMMENT_FULFILLED, payload: data });
    return data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message || 'Add comment failed';
    dispatch({ type: FETCH_POSTS_REJECTED, payload: msg });
    throw err;
  }
}

export function setSelectedPostAction(dispatch: (a: Action) => void, post: PostData | null) {
  dispatch({ type: SET_SELECTED_POST, payload: post });
}

export function clearErrorAction(dispatch: (a: Action) => void) {
  dispatch({ type: CLEAR_ERROR });
}


