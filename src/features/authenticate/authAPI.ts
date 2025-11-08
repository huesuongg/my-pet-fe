import axiosInstance from "../../services/axiosInstance";
import { LoginPayload, RegisterPayload, User, RegisterRequestPayload, VerifyRegisterPayload, LoginRequestPayload, LoginResponse } from "./types";

export const loginAPI = async (data: LoginPayload): Promise<LoginResponse> => {
  const payload: LoginRequestPayload = {
    usernameOrEmail: data.username,
    password: data.password
  };
  
  const response = await axiosInstance.post('/api/auth/login', payload);
  
  // Log raw response để debug
  console.log('========= loginAPI Raw Response =========');
  console.log('Full response.data:', response.data);
  console.log('response.data.user:', response.data.user);
  console.log('All keys in user:', response.data.user ? Object.keys(response.data.user) : 'user is null');
  console.log('========================================');
  
  // Map user data với đầy đủ các trường, bao gồm backgroundImg
  const userData = response.data.user || {};
  const mappedUser: User = {
    id: userData._id || userData.id || '',
    username: userData.username || '',
    email: userData.email || '',
    fullName: userData.fullName || userData.fullname,
    phone: userData.phone,
    role: userData.role || 'user',
    avatar: userData.avatar || userData.avatarUrl || userData.profilePic,
    isActive: userData.isActive,
    createdAt: userData.createdAt,
    backgroundImg: userData.backgroundImg || userData.backgroundImage || userData.coverPhoto || userData.coverImage,
    introduction: userData.introduction,
    liveAt: userData.liveAt,
    studyAt: userData.studyAt,
    studiedAt: userData.studiedAt,
    workAt: userData.workAt,
    from: userData.from,
  };
  
  // Log mapped user để debug
  console.log('========= Mapped User Object (login) =========');
  console.log('Mapped user:', mappedUser);
  console.log('Undefined fields:', Object.keys(mappedUser).filter(key => mappedUser[key as keyof User] === undefined));
  console.log('==============================================');
  
  return {
    user: mappedUser,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  };
};

export const registerAPI = async (data: RegisterPayload): Promise<void> => {
  // Send register request to get OTP
  const registerPayload: RegisterRequestPayload = {
    fullname: data.fullName,
    username: data.username,
    email: data.email,
    password: data.password
  };
  
  await axiosInstance.post('/api/auth/register-request', registerPayload);
};

export const verifyRegisterAPI = async (data: VerifyRegisterPayload): Promise<LoginResponse> => {
  const payload: VerifyRegisterPayload = {
    email: data.email,
    otp: data.otp
  };
  
  const response = await axiosInstance.post('/api/auth/verify-register', payload);
  
  // Log raw response để debug
  console.log('========= verifyRegisterAPI Raw Response =========');
  console.log('Full response.data:', response.data);
  console.log('response.data.user:', response.data.user);
  console.log('All keys in user:', response.data.user ? Object.keys(response.data.user) : 'user is null');
  console.log('==================================================');
  
  // Map user data với đầy đủ các trường, bao gồm backgroundImg
  const userData = response.data.user || {};
  const mappedUser: User = {
    id: userData._id || userData.id || '',
    username: userData.username || '',
    email: userData.email || '',
    fullName: userData.fullName || userData.fullname,
    phone: userData.phone,
    role: userData.role || 'user',
    avatar: userData.avatar || userData.avatarUrl || userData.profilePic,
    isActive: userData.isActive,
    createdAt: userData.createdAt,
    backgroundImg: userData.backgroundImg || userData.backgroundImage || userData.coverPhoto || userData.coverImage,
    introduction: userData.introduction,
    liveAt: userData.liveAt,
    studyAt: userData.studyAt,
    studiedAt: userData.studiedAt,
    workAt: userData.workAt,
    from: userData.from,
  };
  
  // Log mapped user để debug
  console.log('========= Mapped User Object (verifyRegister) =========');
  console.log('Mapped user:', mappedUser);
  console.log('Undefined fields:', Object.keys(mappedUser).filter(key => mappedUser[key as keyof User] === undefined));
  console.log('=======================================================');
  
  return {
    user: mappedUser,
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken
  };
};

export const logoutAPI = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout');
};

export const getUserByIdAPI = async (userId: number | string): Promise<{ data: User }> => {
  // Convert userId sang string nếu là number
  const userIdStr = typeof userId === 'number' ? userId.toString() : userId;
  const response = await axiosInstance.get(`/api/users/${userIdStr}`);
  
  if (!response.data) {
    throw new Error('User not found');
  }

  // Log raw response để debug
  console.log('========= getUserByIdAPI Raw Response =========');
  console.log('Full response.data:', response.data);
  console.log('All keys in user:', Object.keys(response.data));
  console.log('==============================================');
  
  // Map user data với đầy đủ các trường, bao gồm backgroundImg
  const userData = response.data;
  const mappedUser: User = {
    id: userData._id || userData.id || '',
    username: userData.username || '',
    email: userData.email || '',
    fullName: userData.fullName || userData.fullname,
    phone: userData.phone,
    role: userData.role || 'user',
    avatar: userData.avatar || userData.avatarUrl || userData.profilePic,
    isActive: userData.isActive,
    createdAt: userData.createdAt,
    backgroundImg: userData.backgroundImg || userData.backgroundImage || userData.coverPhoto || userData.coverImage,
    introduction: userData.introduction,
    liveAt: userData.liveAt,
    studyAt: userData.studyAt,
    studiedAt: userData.studiedAt,
    workAt: userData.workAt,
    from: userData.from,
  };
  
  // Log mapped user để debug
  console.log('========= Mapped User Object (getUserById) =========');
  console.log('Mapped user:', mappedUser);
  console.log('Undefined fields:', Object.keys(mappedUser).filter(key => mappedUser[key as keyof User] === undefined));
  console.log('====================================================');

  return { data: mappedUser };
};

export interface UpdateUserPayload {
  introduction?: string;
  liveAt?: string;
  studyAt?: string;
  studiedAt?: string;
  workAt?: string;
  from?: string;
  avatar?: File | string; // File object nếu upload mới, hoặc string URL nếu giữ nguyên
  backgroundImg?: File | string; // File object nếu upload mới, hoặc string URL nếu giữ nguyên
}

export const updateUserAPI = async (userId: string, payload: UpdateUserPayload): Promise<User> => {
  // Kiểm tra xem có file mới cần upload không
  const hasNewAvatar = payload.avatar instanceof File;
  const hasNewBackground = payload.backgroundImg instanceof File;
  const hasFiles = hasNewAvatar || hasNewBackground;

  let response;

  try {
    if (hasFiles) {
    // Nếu có file, dùng FormData
      const formData = new FormData();
    
      if (hasNewAvatar) {
        formData.append('avatar', payload.avatar as File);
      } else if (typeof payload.avatar === 'string' && payload.avatar) {
        formData.append('keepAvatar', payload.avatar); // URL của avatar cũ muốn giữ
      }
    
      if (hasNewBackground) {
        formData.append('backgroundImg', payload.backgroundImg as File);
      } else if (typeof payload.backgroundImg === 'string' && payload.backgroundImg) {
        formData.append('keepBackgroundImg', payload.backgroundImg); // URL của background cũ muốn giữ
      }

      // Append text fields
      if (payload.introduction !== undefined) {
        formData.append('introduction', payload.introduction);
      }
      if (payload.liveAt !== undefined) {
        formData.append('liveAt', payload.liveAt);
      }
      if (payload.studyAt !== undefined) {
        formData.append('studyAt', payload.studyAt);
      }
      if (payload.studiedAt !== undefined) {
        formData.append('studiedAt', payload.studiedAt);
      }
      if (payload.workAt !== undefined) {
        formData.append('workAt', payload.workAt);
      }
      if (payload.from !== undefined) {
        formData.append('from', payload.from);
      }

      response = await axiosInstance.put(`/api/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
    // Nếu không có file, dùng JSON
      const jsonPayload: Record<string, unknown> = {};
      if (payload.introduction !== undefined) jsonPayload.introduction = payload.introduction;
      if (payload.liveAt !== undefined) jsonPayload.liveAt = payload.liveAt;
      if (payload.studyAt !== undefined) jsonPayload.studyAt = payload.studyAt;
      if (payload.studiedAt !== undefined) jsonPayload.studiedAt = payload.studiedAt;
      if (payload.workAt !== undefined) jsonPayload.workAt = payload.workAt;
      if (payload.from !== undefined) jsonPayload.from = payload.from;
      if (typeof payload.avatar === 'string' && payload.avatar) {
        jsonPayload.avatar = payload.avatar;
      }
      if (typeof payload.backgroundImg === 'string' && payload.backgroundImg) {
        jsonPayload.backgroundImg = payload.backgroundImg;
      }

      response = await axiosInstance.put(`/api/users/${userId}`, jsonPayload);
    }

    // Log raw response để debug
    console.log('========= updateUserAPI: Raw Response =========');
    console.log('Full response.data:', response.data);
    console.log('All keys in response.data:', Object.keys(response.data || {}));
    console.log('response.data.avatar:', response.data?.avatar);
    console.log('response.data.backgroundImg:', response.data?.backgroundImg);
    console.log('==============================================');
  } catch (error: unknown) {
    // Nếu backend trả về error nhưng có thể data đã được update
    // Hãy kiểm tra xem error response có chứa data không
    const axiosError = error && typeof error === 'object' && 'response' in error
      ? error as { response?: { data?: unknown } }
      : null;
    console.error('========= updateUserAPI: Error occurred =========');
    console.error('Error:', error);
    console.error('Error response:', axiosError?.response);
    console.error('Error response data:', axiosError?.response?.data);
    console.error('===============================================');
    
    // Nếu error response có data, có thể backend đã update thành công nhưng trả về error
    if (axiosError?.response?.data && typeof axiosError.response.data === 'object') {
      const errorData = axiosError.response.data;
      // Kiểm tra xem có phải là user object không
      if (errorData._id || errorData.id || errorData.username) {
        console.warn('Warning: Backend returned error but data may have been updated. Using error response data.');
        response = { data: errorData };
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
  
  const userData = response.data;
  const mappedUser: User = {
    id: userData._id || userData.id || '',
    username: userData.username || '',
    email: userData.email || '',
    fullName: userData.fullName || userData.fullname,
    phone: userData.phone,
    role: userData.role || 'user',
    avatar: userData.avatar || userData.avatarUrl || userData.profilePic || userData.avatarPath,
    isActive: userData.isActive,
    createdAt: userData.createdAt,
    backgroundImg: userData.backgroundImg || userData.backgroundImage || userData.coverPhoto || userData.coverImage,
    introduction: userData.introduction,
    liveAt: userData.liveAt,
    studyAt: userData.studyAt,
    studiedAt: userData.studiedAt,
    workAt: userData.workAt,
    from: userData.from,
  };

  console.log('========= updateUserAPI: Mapped user =========');
  console.log('Mapped user:', mappedUser);
  console.log('Avatar:', mappedUser.avatar);
  console.log('BackgroundImg:', mappedUser.backgroundImg);
  console.log('==============================================');

  return mappedUser;
};
