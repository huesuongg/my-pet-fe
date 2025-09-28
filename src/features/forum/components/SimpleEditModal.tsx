// src/components/SimpleEditModal.tsx
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export interface ProfileData {
  intro: string;
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
  const [formData, setFormData] = useState<ProfileData>({
    intro: "Believe in yourself and you can do unbelievable things. 😊",
    workplace: "99media ltd",
    education: "Amity University",
    studied: "DPS Delhi",
    lives: "Bangalore, India",
    from: "Bangalore, India",
    avatar: "",
    background: ""
  });

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

  const handleSave = () => {
    onSave(formData);
    onClose();
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
                    onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
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
                    onClick={() => setFormData(prev => ({ ...prev, background: '' }))}
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
            value={formData.intro}
            onChange={(e) => handleInputChange('intro', e.target.value)}
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
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleEditModal;
