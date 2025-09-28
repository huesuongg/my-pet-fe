import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import profilePic from "../../../assets/profile-pic.jpg";
import { PostData } from "./Post";

interface EditPostModalProps {
  post: PostData;
  onClose: () => void;
  onSave: (updatedPost: PostData) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSave }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  
  // State for post content
  const [content, setContent] = useState(post.content);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post.image || "");
  const [selectedEmotion, setSelectedEmotion] = useState<string>(post.emotion || "");
  const [selectedLocation, setSelectedLocation] = useState<string>(post.location || "");
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Emotion options
  const emotions = [
    { emoji: "😊", name: "Hạnh phúc" },
    { emoji: "😢", name: "Buồn" },
    { emoji: "😡", name: "Tức giận" },
    { emoji: "😍", name: "Yêu thích" },
    { emoji: "🤔", name: "Suy nghĩ" },
    { emoji: "😴", name: "Buồn ngủ" },
    { emoji: "🎉", name: "Vui mừng" },
    { emoji: "❤️", name: "Yêu" },
  ];
  
  // Location options
  const locations = [
    "Hà Nội, Việt Nam",
    "TP. Hồ Chí Minh, Việt Nam",
    "Đà Nẵng, Việt Nam",
    "Hải Phòng, Việt Nam",
    "Cần Thơ, Việt Nam",
    "Nha Trang, Việt Nam",
    "Đà Lạt, Việt Nam",
    "Phú Quốc, Việt Nam",
  ];

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const { classList } = document.body;
    classList.add("overflow-hidden");
    return () => classList.remove("overflow-hidden");
  }, []);

  // Click outside to close
  const onOverlayMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle emotion selection
  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowEmotionPicker(false);
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  // Handle save
  const handleSave = () => {
    if (!content.trim() && !imagePreview) return;

    const updatedPost: PostData = {
      ...post,
      content: content.trim(),
      image: imagePreview,
      location: selectedLocation,
      emotion: selectedEmotion,
    };

    onSave(updatedPost);
    onClose();
  };

  // Check if post can be saved
  const canSave = content.trim() || imagePreview;

  const overlay = (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
      role="dialog"
      aria-modal="true"
      aria-label="Chỉnh sửa bài viết"
      onMouseDown={onOverlayMouseDown}
    >
      <div
        ref={panelRef}
        className="modal-dialog modal-dialog-centered"
        style={{ width: "500px", maxWidth: "90vw" }}
      >
        <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
          {/* Header */}
          <div className="modal-header border-0 pb-0" style={{ padding: "16px 20px 0" }}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <h5 className="modal-title mb-0 fw-bold">Chỉnh sửa bài viết</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                style={{ fontSize: "20px" }}
              >
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="modal-body" style={{ padding: "16px 20px" }}>
            {/* User info */}
            <div className="d-flex align-items-center mb-3">
              <img
                src={profilePic}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <span className="fw-semibold me-2">Cristiano Ronaldo</span>
                  {selectedEmotion && (
                    <span className="me-2" style={{ fontSize: "18px" }}>{selectedEmotion}</span>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-muted small me-2">đang</span>
                  {selectedEmotion ? (
                    <span className="text-muted small">
                      {selectedEmotion} cảm thấy {emotions.find(e => e.emoji === selectedEmotion)?.name.toLowerCase()}
                    </span>
                  ) : (
                    <span className="text-muted small">🔒 Chỉ mình tôi</span>
                  )}
                </div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="form-control mb-3"
              rows={3}
              placeholder="Huy ơi, bạn đang nghĩ gì thế?"
              style={{
                height: '120px',
                border: 'none',
                fontSize: '20px',
                resize: 'none',
                boxShadow: 'none',
                padding: '12px 0'
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 position-relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="img-fluid rounded"
                  style={{maxHeight: '200px', width: '100%', objectFit: 'cover'}}
                />
                <button 
                  type="button"
                  className="btn btn-sm btn-danger position-absolute"
                  style={{ top: '8px', right: '8px' }}
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview("");
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Selected emotion and location display */}
            {(selectedEmotion || selectedLocation) && (
              <div className="mb-3 d-flex gap-2">
                {selectedEmotion && (
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {selectedEmotion} Cảm xúc
                  </span>
                )}
                {selectedLocation && (
                  <span className="badge bg-secondary rounded-pill px-3 py-2">
                    📍 {selectedLocation}
                  </span>
                )}
              </div>
            )}

            {/* Add to post */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-semibold text-secondary">Thêm vào bài viết của bạn</span>
              </div>
              <div className="d-flex gap-2">
                <label 
                  className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill flex-grow-1" 
                  title="Thêm ảnh" 
                  aria-label="Thêm ảnh"
                  style={{ 
                    border: selectedImage ? '2px solid #007bff' : '1px solid #007bff',
                    backgroundColor: selectedImage ? '#e3f2fd' : 'transparent',
                    color: selectedImage ? '#007bff' : '#007bff',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedImage) {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.border = '2px solid #007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedImage) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #007bff';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📷</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>Ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <button 
                  className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill flex-grow-1"
                  title="Chọn cảm xúc" 
                  aria-label="Chọn cảm xúc"
                  onClick={() => setShowEmotionPicker(!showEmotionPicker)}
                  style={{ 
                    border: selectedEmotion ? '2px solid #28a745' : '1px solid #28a745',
                    backgroundColor: selectedEmotion ? '#d4edda' : 'transparent',
                    color: selectedEmotion ? '#28a745' : '#28a745',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedEmotion) {
                      e.currentTarget.style.backgroundColor = '#d4edda';
                      e.currentTarget.style.border = '2px solid #28a745';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedEmotion) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #28a745';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{selectedEmotion || '😊'}</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>Cảm xúc</span>
                </button>
                
                <button 
                  className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill flex-grow-1"
                  title="Chọn vị trí" 
                  aria-label="Chọn vị trí"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  style={{ 
                    border: selectedLocation ? '2px solid #17a2b8' : '1px solid #17a2b8',
                    backgroundColor: selectedLocation ? '#d1ecf1' : 'transparent',
                    color: selectedLocation ? '#17a2b8' : '#17a2b8',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedLocation) {
                      e.currentTarget.style.backgroundColor = '#d1ecf1';
                      e.currentTarget.style.border = '2px solid #17a2b8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedLocation) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #17a2b8';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📍</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>Vị trí</span>
                </button>
              </div>
            </div>

            {/* Emotion Picker */}
            {showEmotionPicker && (
              <div className="border rounded p-4 mb-3" style={{ backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="mb-0 fw-bold text-primary">🎭 Chọn cảm xúc của bạn</h6>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowEmotionPicker(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {emotions.map((emotion, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm px-3 py-2 rounded-pill ${
                        selectedEmotion === emotion.emoji 
                          ? 'btn-primary' 
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => handleEmotionSelect(emotion.emoji)}
                      title={emotion.name}
                      style={{ 
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        transform: selectedEmotion === emotion.emoji ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <span className="me-2" style={{ fontSize: '20px' }}>{emotion.emoji}</span>
                      {emotion.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Location Picker */}
            {showLocationPicker && (
              <div className="border rounded p-4 mb-3" style={{ backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="mb-0 fw-bold text-info">📍 Chọn vị trí của bạn</h6>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowLocationPicker(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {locations.map((location, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm text-start px-3 py-2 rounded ${
                        selectedLocation === location 
                          ? 'btn-info' 
                          : 'btn-outline-info'
                      }`}
                      onClick={() => handleLocationSelect(location)}
                      style={{ 
                        transition: 'all 0.2s ease',
                        transform: selectedLocation === location ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <span className="me-2">📍</span>
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0" style={{ padding: "0 20px 20px" }}>
            <div className="d-flex gap-2 w-100">
              <button 
                type="button" 
                className="btn btn-secondary flex-grow-1 py-2 fw-semibold"
                onClick={onClose}
                style={{ 
                  borderRadius: '8px',
                  fontSize: '16px',
                  height: '40px'
                }}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className={`btn flex-grow-1 py-2 fw-semibold ${canSave ? 'btn-primary' : 'btn-secondary disabled'}`}
                onClick={handleSave}
                disabled={!canSave}
                style={{ 
                  borderRadius: '8px',
                  fontSize: '16px',
                  height: '40px'
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default EditPostModal;
