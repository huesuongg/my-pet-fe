// src/components/ProfileSidebar.tsx
import React from "react";

const ProfileSidebar: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Intro Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Intro</h2>
        <p className="text-gray-600 mb-4">
          Believe in yourself and you can do unbelievable things. 😊
        </p>
        <ul
          className="space-y-2 text-gray-700"
          style={{ listStyleType: "none", paddingLeft: 0 }}
        >
          <li className="flex items-center">
            <span className="mr-2">🏢Làm việc tại</span>
            <span className="font-medium"> 99media ltd</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">🎓Học tại</span>
            <span className="font-medium"> Amity University</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">🏫Đã học</span>
            <span className="font-medium"> DPS Delhi</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">🏡Sống tại</span>
            <span className="font-medium">Bangalore, India</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2">📍Từ</span>
            <span className="font-medium"> Bangalore, India</span>
          </li>
        </ul>
      </div>

      {/* Photos Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Ảnh</h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            Xem tất cả
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <img
            src="https://marketplace.canva.com/S_1yQ/MAGg__S_1yQ/1/tl/canva-cute-cat-playing-with-fish-toy-MAGg__S_1yQ.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://marketplace.canva.com/awaWU/MAGg_uawaWU/1/tl/canva-cute-cat-jumping%2C-pink-background-MAGg_uawaWU.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://marketplace.canva.com/LLvRg/MAGg_xLLvRg/1/tl/canva-cute-cat-eating-food-cartoon-MAGg_xLLvRg.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEaI0FBlhaYL2lgde96syq4OU8nM2lygqVAVa28UAkYW8e3-Y8H8XgEf2BlWmhcSWqJbg&usqp=CAU"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://i.pinimg.com/originals/14/59/da/1459da134849bf01544257c0fa15950b.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://khafa.org.vn/wp-content/uploads/2021/12/cute-pho-mai-que-1-8.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkynyngnCTxAba8nGNqPLV1ud6oZLhX1gLRvx_HMphTTQTJPiO3jKbCNvkikeCGPRO9Qg&usqp=CAU"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://i.pinimg.com/564x/45/78/53/457853d1e18f0b1a406f8a47aea19ba7.jpg"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
          <img
            src="https://i.ytimg.com/vi/Xg8TTKuSGbA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCL4hPFub58tYi3AWG56h5w_fuwRw"
            alt="photo"
            className="w-full h-24 object-cover rounded-md"
          />
        </div>
      </div>

      {/* Following Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Following </h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            Xem tất cả
          </a>
        </div>
        <p className="text-gray-500 text-sm mb-4">120 followings</p>
        <div className="grid grid-cols-3 gap-2">
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <img
              src="https://photo.znews.vn/w660/Uploaded/mzdgi/2025_01_02/472252469_1159559695540639_169517337750285153_n.jpg"
              alt="Bảo Minh"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Bảo Minh</p>
          </div>
          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <img
              src="https://image.anninhthudo.vn/h600/Uploaded/2025/77/2018_01_29/man-gat-tuyet-an-tuong.jpg"
              alt="Hải Đăng"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Hải Đăng</p>
          </div>
          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <img
              src="https://sport5.mediacdn.vn/2018/12/8/photo-6-1544242526276932361283.jpg"
              alt="Lê Nhật Trường"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Lê Nhật Trường</p>
          </div>
          {/* Item 4 */}
          <div className="flex flex-col items-center">
            <img
              src="https://anhdep.edu.vn/upload/2024/05/bo-anh-chibi-manchester-united-cute-nhat-cho-nguoi-ham-mo-18.webp"
              alt="Trường Tuấn"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Trường Tuấn</p>
          </div>
          {/* Item 5 */}
          <div className="flex flex-col items-center">
            <img
              src="https://anhdep.edu.vn/upload/2024/05/bo-anh-chibi-manchester-united-cute-nhat-cho-nguoi-ham-mo-6.webp"
              alt="Khang Lê"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Khang Lê</p>
          </div>
          {/* Item 6 */}
          <div className="flex flex-col items-center">
            <img
              src="https://anhdep.edu.vn/upload/2024/05/bo-anh-chibi-manchester-united-cute-nhat-cho-nguoi-ham-mo-7.webp"
              alt="Phan Nguyễn Huy Hoàng"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Phan Nguyễn Huy Hoàng</p>
          </div>
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <img
              src="https://photo.znews.vn/w660/Uploaded/mzdgi/2025_01_02/472252469_1159559695540639_169517337750285153_n.jpg"
              alt="Bảo Minh"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Bảo Minh</p>
          </div>
          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <img
              src="https://image.anninhthudo.vn/h600/Uploaded/2025/77/2018_01_29/man-gat-tuyet-an-tuong.jpg"
              alt="Hải Đăng"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Hải Đăng</p>
          </div>
          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <img
              src="https://sport5.mediacdn.vn/2018/12/8/photo-6-1544242526276932361283.jpg"
              alt="Lê Nhật Trường"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <p className="text-sm mt-1 text-center">Lê Nhật Trường</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
