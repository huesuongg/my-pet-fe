// src/components/Feed.tsx
import React, { useMemo, useState } from 'react';
import Post, { PostData } from './Post';
import CommentModal from './CommentModal';
import profilePic from '../../../assets/profile-pic.jpg';

// Helper: đổi 1 số class Tailwind trong content -> class Bootstrap tương đương (đơn giản)
function toBootstrapContent(html: string) {
  if (!html) return html;
  return html
    .replace(/text-blue-500/g, 'text-primary')
    .replace(/font-semibold/g, 'fw-semibold')
    .replace(/ml-1/g, 'ms-1');
}

const rawPosts: PostData[] = [
  {
    id: 1,
    author: {
      name: 'Cristiano Ronaldo',
      profilePic: profilePic,
    },
    timestamp: 'June 24 2020, 13:40 PM',
    content: `Subscribe @Easy Tutorials Youtube channel to watch more videos on website development and UI designs.
      <a href="#" class="text-blue-500 font-semibold ml-1">#EasyTutorials</a>
      <a href="#" class="text-blue-500 font-semibold ml-1">#YouTubeChannel</a>`,
    image: 'https://i.ytimg.com/vi/Xg8TTKuSGbA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCL4hPFub58tYi3AWG56h5w_fuwRw',
    likes: 120,
    comments: 45,
    favorites: 20,
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnb31g3q3DWIT38S_8dhySGSDal22jvOmWvA&s',
    likes: 500,
    comments: 100,
    favorites: 80,
  },
];

const Feed: React.FC = () => {
  console.log('Feed render');

  // Chuẩn hoá content -> Bootstrap 1 lần
  const posts: PostData[] = useMemo(
    () =>
      rawPosts.map(p => ({
        ...p,
        content: toBootstrapContent(p.content),
      })),
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const handleOpenModal = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      console.log('Setting selected post:', post);
      setIsModalOpen(true);
    }
    console.log('Open modal for post ID:', postId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    // Đổi container Tailwind -> Bootstrap
    <div className="container py-3">
      {/* Nếu Post.tsx vẫn dùng Tailwind thì vẫn render được.
          Khi rảnh bạn có thể port Post.tsx sang Bootstrap cho đồng bộ UI. */}
      {posts.map(post => (
        <div key={post.id} className="mb-4">
          <Post post={post} onCommentClick={handleOpenModal} />
        </div>
      ))}

      {/* CommentModal bản Bootstrap cần prop show */}
      <CommentModal
        show={isModalOpen}
        onClose={handleCloseModal}
        post={selectedPost as PostData}
      />
    </div>
  );
};

export default Feed;
