// src/components/EditProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export interface ProfileData {
  intro: string;
  workplace: string;
  education: string;
  studied: string;
  lives: string;
  from: string;
}

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
  initialData?: ProfileData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<ProfileData>({
    intro: '',
    workplace: '',
    education: '',
    studied: '',
    lives: '',
    from: ''
  });

  // Load initial data when modal opens
  useEffect(() => {
    if (show && initialData) {
      setFormData(initialData);
    }
  }, [show, initialData]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  console.log('EditProfileModal render, show:', show);

  if (!show) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Chỉnh sửa trang cá nhân
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Intro Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới thiệu bản thân
            </label>
            <textarea
              value={formData.intro}
              onChange={(e) => handleInputChange('intro', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Viết vài dòng về bản thân..."
            />
          </div>

          {/* Workplace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏢 Làm việc tại
            </label>
            <input
              type="text"
              value={formData.workplace}
              onChange={(e) => handleInputChange('workplace', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tên công ty, tổ chức..."
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎓 Học tại
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Trường đại học, cao đẳng..."
            />
          </div>

          {/* Studied */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏫 Đã học tại
            </label>
            <input
              type="text"
              value={formData.studied}
              onChange={(e) => handleInputChange('studied', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Trường cấp 3, cấp 2..."
            />
          </div>

          {/* Lives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏡 Sống tại
            </label>
            <input
              type="text"
              value={formData.lives}
              onChange={(e) => handleInputChange('lives', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Thành phố, quốc gia..."
            />
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Từ
            </label>
            <input
              type="text"
              value={formData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Quê quán, nơi sinh..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <SaveIcon className="text-sm" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
