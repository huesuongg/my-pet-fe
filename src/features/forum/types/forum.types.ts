export interface ForumComment {
  id: number;
  author: {
    id?: string;
    name: string;
    profilePic?: string;
  };
  content: string;
  timestamp?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: ForumComment[];
  parentId?: number | null;
}

export interface PostData {
  id: string | number;
  author: {
    id?: string;
    name: string;
    avatar?: string;
    profilePic?: string; // đồng bộ với các component dùng profilePic
  };
  timestamp?: string;
  content: string;
  image?: string;
  images?: string[]; // Support multiple images
  location?: string;
  emotion?: string;
  likes?: number;
  comments?: number;
  favorites?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  commentsList?: ForumComment[];
  tags?: string[]; // Support tags
}