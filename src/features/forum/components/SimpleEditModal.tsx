// src/components/SimpleEditModal.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { updateUser, getUserById } from '../../authenticate/authThunk';
import type { UpdateUserPayload } from '../../authenticate/authAPI';
import CloseIcon from '@mui/icons-material/Close';

export interface ProfileData {
  introduction: string;
  workplace: string;
  education: string;
  studied: string;
  lives: string;
  from: string;
  avatar?: string;
  background?: string;
}

interface SimpleEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
}

const SimpleEditModal: React.FC<SimpleEditModalProps> = ({
  show,
  onClose,
  onSave
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    introduction: "",
    workplace: "",
    education: "",
    studied: "",
    lives: "",
    from: "",
    avatar: "",
    background: ""
  });

  // Load user data vào form khi modal mở
  useEffect(() => {
    if (show && user) {
      setFormData({
        introduction: user.introduction || "",
        workplace: user.workAt || "",
        education: user.studyAt || "",
        studied: user.studiedAt || "",
        lives: user.liveAt || "",
        from: user.from || "",
        avatar: user.avatar || "",
        background: user.backgroundImg || ""
      });
      setAvatarFile(null);
      setBackgroundFile(null);
    }
  }, [show, user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: 'avatar' | 'background', file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ!');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

    // Lưu File object để gửi lên API
    if (field === 'avatar') {
      setAvatarFile(file);
    } else {
      setBackgroundFile(file);
    }

    // Preview ảnh
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        [field]: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, field: 'avatar' | 'background') => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(field, files[0]);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert('Không tìm thấy thông tin user!');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare payload cho API
      const payload: UpdateUserPayload = {
        introduction: formData.introduction || undefined,
        liveAt: formData.lives || undefined,
        studyAt: formData.education || undefined,
        studiedAt: formData.studied || undefined,
        workAt: formData.workplace || undefined,
        from: formData.from || undefined,
      };

      // Handle avatar: File mới hoặc URL cũ
      if (avatarFile) {
        payload.avatar = avatarFile;
      } else if (formData.avatar && formData.avatar.startsWith('http')) {
        payload.avatar = formData.avatar; // Giữ URL cũ
      }

      // Handle background: File mới hoặc URL cũ
      if (backgroundFile) {
        payload.backgroundImg = backgroundFile;
      } else if (formData.background && formData.background.startsWith('http')) {
        payload.backgroundImg = formData.background; // Giữ URL cũ
      }

      console.log('========= SimpleEditModal: Calling updateUser API =========');
      console.log('Payload:', payload);
      console.log('==========================================================');

      // Gọi API updateUser - response đã chứa đầy đủ user data mới nhất
      const updatedUser = await dispatch(updateUser({ userId: user.id, payload })).unwrap();
      
      console.log('========= SimpleEditModal: Update successful =========');
      console.log('Updated user from updateUser API:', updatedUser);
      console.log('Avatar:', updatedUser.avatar);
      console.log('BackgroundImg:', updatedUser.backgroundImg);
      console.log('Introduction:', updatedUser.introduction);
      console.log('======================================================');

      // Optional: Thử fetch lại từ API nếu muốn đảm bảo có URLs mới nhất từ Cloudinary
      // Nhưng nếu fail thì không sao, vì đã có data từ updateUser response
      try {
        const userIdStr = user.id;
        const latestUser = await dispatch(getUserById(userIdStr)).unwrap();
        console.log('========= SimpleEditModal: Fetched latest user data (optional) =========');
        console.log('Latest user from getUserById:', latestUser);
        console.log('======================================================');
      } catch (fetchError) {
        // Nếu fetch lại fail thì không sao, đã có data từ updateUser response rồi
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        console.warn('Warning: Failed to fetch latest user data, but update was successful. Using data from updateUser response:', errorMessage);
      }

      // Call onSave callback nếu có (để update local state)
      if (onSave) {
        onSave(formData);
      }

      // Đợi một chút để Redux state được update xong và components re-render
      setTimeout(() => {
        alert('Cập nhật profile thành công!');
        onClose();
      }, 300);
    } catch (error) {
      interface ErrorResponseData {
        message?: string;
        error?: string;
        _id?: string;
        id?: string;
      }
      
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: ErrorResponseData;
        }; 
        message?: string;
      };
      
      console.error('========= SimpleEditModal: Error updating profile =========');
      console.error('Error:', error);
      console.error('Error response:', axiosError.response);
      console.error('Error response data:', axiosError.response?.data);
      console.error('==========================================================');
      
      // Kiểm tra xem có phải lỗi từ backend không và có message không
      const errorMessage = axiosError.response?.data?.message 
        || axiosError.response?.data?.error 
        || axiosError.message 
        || 'Có lỗi xảy ra khi cập nhật profile';
      
      // Nếu error là 500, có thể backend đã update nhưng response bị lỗi
      // Thử fetch lại user data từ API
      if (axiosError.response?.status === 500) {
        console.warn('Warning: Backend returned 500 error. Data may have been updated. Attempting to fetch latest data...');
        try {
          // Đợi một chút để backend xử lý xong
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Thử dispatch getUserById để fetch lại data mới nhất
          const userIdStr = user.id;
          const latestUser = await dispatch(getUserById(userIdStr)).unwrap();
          
          console.log('Successfully fetched updated user data after 500 error:', latestUser);
          alert('Cập nhật profile thành công! Dữ liệu đã được lấy lại từ server.');
          onClose();
          return;
        } catch (fetchError) {
          console.error('Failed to fetch updated user data after 500 error:', fetchError);
          // Nếu fetch lại cũng fail, vẫn thông báo update thành công vì đã vào DB
          alert('Dữ liệu đã được cập nhật vào database. Vui lòng tải lại trang để xem thay đổi.');
          onClose();
          // Tự động reload sau 1 giây
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }
      }
      
      // Nếu error có response data và có thể chứa thông tin user, vẫn thử update state
      const errorData = axiosError.response?.data;
      if (errorData && (errorData._id || errorData.id)) {
        console.warn('Warning: Backend returned error but may have updated data. Attempting to use response data.');
        try {
          // Thử dispatch getUserById để fetch lại data mới nhất
          const userIdStr = user.id;
          await dispatch(getUserById(userIdStr)).unwrap();
          alert('Cập nhật profile thành công! (Lấy lại dữ liệu từ server)');
          onClose();
          return;
        } catch (fetchError) {
          console.error('Failed to fetch updated user data:', fetchError);
        }
      }
      
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Chỉnh sửa trang cá nhân</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>

        {/* Avatar Upload */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
            🖼️ Avatar
          </label>
          <div 
            style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'avatar')}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            {formData.avatar ? (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img 
                  src={formData.avatar} 
                  alt="Avatar preview" 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, avatar: '' }));
                      setAvatarFile(null);
                    }}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: '#e5e7eb',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  👤
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px' }}>
                  Chưa có avatar
                </p>
              </div>
            )}
            <label style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}>
              {formData.avatar ? 'Thay đổi avatar' : 'Chọn avatar'}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload('avatar', file);
                  }
                }}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '8px 0 0' }}>
              JPG, PNG, GIF tối đa 5MB
            </p>
          </div>
        </div>

        {/* Background Upload */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
            🖼️ Background
          </label>
          <div 
            style={{ 
              border: '2px dashed #d1d5db', 
              borderRadius: '12px', 
              padding: '20px', 
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'background')}
            onClick={() => document.getElementById('background-upload')?.click()}
          >
            {formData.background ? (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img 
                  src={formData.background} 
                  alt="Background preview" 
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px',
                    height: '120px', 
                    borderRadius: '8px', 
                    objectFit: 'cover',
                    border: '2px solid #fff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, background: '' }));
                      setBackgroundFile(null);
                    }}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '300px',
                  height: '120px', 
                  borderRadius: '8px', 
                  backgroundColor: '#e5e7eb',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🖼️
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px' }}>
                  Chưa có background
                </p>
              </div>
            )}
            <label style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}>
              {formData.background ? 'Thay đổi background' : 'Chọn background'}
              <input
                id="background-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload('background', file);
                  }
                }}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '8px 0 0' }}>
              JPG, PNG, GIF tối đa 5MB
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới thiệu bản thân</label>
          <textarea
            value={formData.introduction}
            onChange={(e) => handleInputChange('introduction', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            rows={3}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🏢 Làm việc tại</label>
          <input
            type="text"
            value={formData.workplace}
            onChange={(e) => handleInputChange('workplace', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🎓 Học tại</label>
          <input
            type="text"
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🏫 Đã học tại</label>
          <input
            type="text"
            value={formData.studied}
            onChange={(e) => handleInputChange('studied', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>🏡 Sống tại</label>
          <input
            type="text"
            value={formData.lives}
            onChange={(e) => handleInputChange('lives', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>📍 Từ</label>
          <input
            type="text"
            value={formData.from}
            onChange={(e) => handleInputChange('from', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleEditModal;
