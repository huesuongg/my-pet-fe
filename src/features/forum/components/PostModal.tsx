// src/components/PostModal.tsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { usePostContext } from "../context/PostContext";

interface PostModalProps {
  onClose: () => void;
}

// Type for creating new post
interface NewPostData {
  author: {
    id?: string;
    name: string;
    avatar?: string;
    profilePic?: string;
  };
  timestamp: string;
  content: string;
  tags?: string[];
  location?: string;
  address?: string;
  imageFiles?: File[];
}

const PostModal: React.FC<PostModalProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { addPost } = usePostContext();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const userAvatar = user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';
  const userName = user?.fullName || user?.username || 'User';
  
  // State for post content
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]); // Multiple images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Multiple previews
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
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

  // Handle multiple image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images
    const newFiles = [...selectedImages, ...files].slice(0, 5);
    setSelectedImages(newFiles);

    // Generate previews for all images
    const newPreviews: string[] = [];
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === newFiles.length) {
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle tag add
  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) return;
    setTags(prev => [...prev, value]);
    setTagInput("");
  };

  const handleRemoveTag = (value: string) => {
    setTags(prev => prev.filter(t => t !== value));
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) return;

    setIsUploading(true);
    try {
      const now = new Date();
      const timestamp = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Backend sẽ tự upload images lên Cloudinary qua multer
      // Chỉ cần gửi File objects trong imageFiles
      const newPost: NewPostData = {
        author: {
          id: user?.id, // Lưu user ID để check quyền edit/delete
          name: userName,
          avatar: userAvatar,
          profilePic: userAvatar,
        },
        timestamp,
        content: content.trim(),
        tags,
        location: selectedLocation, // UI hiển thị
        address: selectedLocation,  // Backend nhận
        imageFiles: selectedImages, // Truyền File objects cho API
      };

      console.log('PostModal: Submitting with', selectedImages.length, 'images');
      await addPost(newPost);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsUploading(false);
    }
  };

  // Check if post can be submitted
  const canSubmit = content.trim() || selectedImages.length > 0;

  const overlay = (
    <div
      className="modal fade show d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "block" }}
      role="dialog"
      aria-modal="true"
      aria-label="Tạo bài viết"
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
              <h5 className="modal-title mb-0 fw-bold">Tạo bài viết</h5>
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
                src={userAvatar}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <span className="fw-semibold me-2">{userName}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-muted small">🔒 Chỉ mình tôi</span>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="form-control mb-3"
              rows={3}
              placeholder={`${userName} ơi, bạn đang nghĩ gì thế?`}
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

            {/* Multiple Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button 
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: '4px', right: '4px', padding: '2px 6px', fontSize: '12px' }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <small className="text-muted">
                  {selectedImages.length}/5 ảnh {selectedImages.length < 5 && '- Bạn có thể thêm tối đa 5 ảnh'}
                </small>
              </div>
            )}

            {/* Selected tags and location display */}
            {(tags.length > 0 || selectedLocation) && (
              <div className="mb-3 d-flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="badge bg-primary rounded-pill px-3 py-2 d-flex align-items-center gap-1">
                    #{t}
                    <button type="button" className="btn btn-sm btn-link text-white p-0 ms-1" onClick={() => handleRemoveTag(t)} style={{ fontSize: '14px', lineHeight: '1' }}>✕</button>
                  </span>
                ))}
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
                  title={selectedImages.length < 5 ? "Thêm ảnh (tối đa 5)" : "Đã đạt giới hạn 5 ảnh"}
                  aria-label="Thêm ảnh"
                  style={{ 
                    border: selectedImages.length > 0 ? '2px solid #007bff' : '1px solid #007bff',
                    backgroundColor: selectedImages.length > 0 ? '#e3f2fd' : 'transparent',
                    color: selectedImages.length > 0 ? '#007bff' : '#007bff',
                    transition: 'all 0.3s ease',
                    cursor: selectedImages.length >= 5 ? 'not-allowed' : 'pointer',
                    opacity: selectedImages.length >= 5 ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImages.length === 0) {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.border = '2px solid #007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImages.length === 0) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #007bff';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📷</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>
                    Ảnh {selectedImages.length > 0 && `(${selectedImages.length})`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={selectedImages.length >= 5}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <button 
                  className="btn d-flex align-items-center gap-2 px-3 py-2 rounded-pill flex-grow-1"
                  title="Thêm tags" 
                  aria-label="Thêm tags"
                  onClick={() => setShowTagInput(!showTagInput)}
                  style={{ 
                    border: tags.length > 0 ? '2px solid #28a745' : '1px solid #28a745',
                    backgroundColor: tags.length > 0 ? '#d4edda' : 'transparent',
                    color: tags.length > 0 ? '#28a745' : '#28a745',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (tags.length === 0) {
                      e.currentTarget.style.backgroundColor = '#d4edda';
                      e.currentTarget.style.border = '2px solid #28a745';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tags.length === 0) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #28a745';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>#</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>Tags</span>
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

            {/* Tag Input */}
            {showTagInput && (
              <div className="border rounded p-4 mb-3" style={{ backgroundColor: '#f8f9fa', border: '2px solid #e9ecef' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="mb-0 fw-bold text-success"># Thêm Tags</h6>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowTagInput(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tag (VD: pets, veterinary)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button 
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    Thêm
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {tags.map(t => (
                      <span key={t} className="badge bg-light text-dark border d-flex align-items-center gap-1">
                        #{t}
                        <button type="button" className="btn btn-sm btn-link p-0" onClick={() => handleRemoveTag(t)} style={{ fontSize: '12px' }}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
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
            <button 
              type="button" 
              className={`btn w-100 py-2 fw-semibold ${canSubmit && !isUploading ? 'btn-primary' : 'btn-secondary disabled'}`}
              onClick={handleSubmit}
              disabled={!canSubmit || isUploading}
              style={{ 
                borderRadius: '8px',
                fontSize: '16px',
                height: '40px'
              }}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang đăng...
                </>
              ) : (
                'Đăng'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
};

export default PostModal;
