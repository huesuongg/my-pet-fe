// src/components/MainContent.tsx
import React from 'react';
import PostCreator from './PostCreator';
import Post from './Post';

const MainContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <PostCreator />
      <Post />
      {/* You can add more <Post /> components here for other posts */}
    </div>
  );
};

export default MainContent;