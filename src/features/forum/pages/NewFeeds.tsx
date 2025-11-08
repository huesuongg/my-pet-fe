import MainContent from "../components/MainContent";
import NewsFeedLeftSideBar from "../components/NewsFeedLeftSideBar";
import NewsFeedRightSideBar from "../components/NewsFeedRightSideBar";

import { PostProvider } from "../context/PostContext";

const NewFeeds: React.FC = () => {
  return (
    <PostProvider>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col md:flex-row mt-4 gap-4">
            <div className="w-full md:w-1/3">
              <NewsFeedLeftSideBar />
            </div>
            <div className="w-full md:w-2/3">
              <MainContent />
            </div>
            <div className="w-full md:w-1/3">
              <NewsFeedRightSideBar />
            </div>
          </div>
        </div>
      </div>
    </PostProvider>
  );
};

export default NewFeeds;
