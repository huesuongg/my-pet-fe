// src/components/MainContent.tsx
import React from 'react';
import PostCreator from './PostCreator';
import Feed from './Feed';

const MainContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <PostCreator />
      <Feed />
    </div>
  );
};

export default MainContent;