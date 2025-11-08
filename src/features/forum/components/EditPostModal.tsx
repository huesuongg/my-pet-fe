import React, { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import profilePic from "../../../assets/profile-pic.jpg";
import type { PostData } from "../types/forum.types";

interface EditPostModalProps {
  post: PostData;
  onClose: () => void;
  onSave: (updatedPost: PostData) => void;
}

// Image item với metadata
interface ImageItem {
  preview: string;      // URL hoặc base64
  isExisting: boolean;  // true = ảnh cũ (URL), false = ảnh mới (File)
  file?: File;          // Chỉ có khi isExisting = false
}

// Extended PostData for edit operation
interface UpdatedPostData extends PostData {
  imageFiles?: File[];   // New files to upload
  keepImages?: string[]; // Existing URLs to keep
  address?: string;      // Location address for backend
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSave }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  
  // State for post content
  const [content, setContent] = useState(post.content);
  
  // New: Unified image state với metadata
  const [imageItems, setImageItems] = useState<ImageItem[]>(() => {
    const existingImages = post.images && post.images.length > 0 
      ? post.images 
      : post.image 
        ? [post.image] 
        : [];
    
    return existingImages.map(url => ({
      preview: url,
      isExisting: true,
    }));
  });
  
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [tagInput, setTagInput] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>(post.location || "");
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

  // Handle multiple image upload (max 5 images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images total
    const remainingSlots = 5 - imageItems.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(`Chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa (giới hạn 5 ảnh)`);
    }

    // Generate previews and add to imageItems
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setImageItems(prev => [...prev, {
          preview,
          isExisting: false,
          file,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle remove specific image
  const handleRemoveImage = (index: number) => {
    setImageItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      console.log('====== EditPostModal.handleRemoveImage ======');
      console.log('Removed image at index:', index);
      console.log('Previous imageItems:', prev);
      console.log('New imageItems after removal:', newItems);
      console.log('Remaining images count:', newItems.length);
      console.log('  - Existing (old):', newItems.filter(item => item.isExisting).length);
      console.log('  - New (files):', newItems.filter(item => !item.isExisting).length);
      console.log('==========================================');
      return newItems;
    });
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

  // Handle save
  const handleSave = async () => {
    if (!content.trim() && imageItems.length === 0) return;

    setIsUploading(true);
    try {
      // Tách ảnh cũ (URLs để giữ) và ảnh mới (Files để upload)
      const keepImages = imageItems
        .filter(item => item.isExisting)
        .map(item => item.preview);
      
      const imageFiles = imageItems
        .filter(item => !item.isExisting && item.file)
        .map(item => item.file!);
      
      const allPreviews = imageItems.map(item => item.preview);
      
      console.log('====== EditPostModal.handleSave ======');
      console.log('✅ Current imageItems state:', imageItems);
      console.log('✅ keepImages (existing URLs to keep):', keepImages);
      console.log('✅ imageFiles (new files to upload):', imageFiles.map(f => ({ name: f.name, size: f.size })));
      console.log('Total items:', imageItems.length, '= Existing:', keepImages.length, '+ New:', imageFiles.length);
      console.log('====================================');

      // Backend sẽ tự upload images mới lên Cloudinary qua multer
      const updatedPost: UpdatedPostData = {
        ...post,
        content: content.trim(),
        images: allPreviews, // Keep for UI display only
        location: selectedLocation, // UI hiển thị
        address: selectedLocation,  // Backend nhận
        tags,
        imageFiles, // File objects mới cần upload
        keepImages, // URLs của ảnh cũ muốn giữ lại
      };

      console.log('EditPostModal: Calling onSave with payload:', {
        postId: post.id,
        content: updatedPost.content,
        keepImages: updatedPost.keepImages,
        imageFiles: updatedPost.imageFiles?.map((f: File) => f.name) || [],
        tags: updatedPost.tags,
        location: updatedPost.location,
      });
      
      await onSave(updatedPost);
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setIsUploading(false);
    }
  };

  // Check if post can be saved
  const canSave = content.trim() || imageItems.length > 0;

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

            {/* Multiple Image Previews */}
            {imageItems.length > 0 && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {imageItems.map((item, index) => (
                    <div key={index} className="position-relative" style={{ width: '120px', height: '120px' }}>
                      <img 
                        src={item.preview} 
                        alt={`Preview ${index + 1}`} 
                        className="rounded"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button 
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: '4px', right: '4px', padding: '2px 6px', fontSize: '12px' }}
                        onClick={() => handleRemoveImage(index)}
                        title={item.isExisting ? 'Xóa ảnh cũ' : 'Xóa ảnh mới'}
                      >
                        ✕
                      </button>
                      {/* Badge hiển thị loại ảnh */}
                      <span 
                        className="badge position-absolute"
                        style={{ 
                          bottom: '4px', 
                          left: '4px', 
                          fontSize: '9px',
                          backgroundColor: item.isExisting ? '#6c757d' : '#28a745'
                        }}
                      >
                        {item.isExisting ? 'Cũ' : 'Mới'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-muted small mt-2">
                  {imageItems.length} / 5 ảnh
                </div>
              </div>
            )}

            {/* Tags and Location display */}
            {(tags.length > 0 || selectedLocation) && (
              <div className="mb-3 d-flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="badge bg-primary rounded-pill px-3 py-2">
                    #{t}
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
                  title="Thêm ảnh (tối đa 5)" 
                  aria-label="Thêm ảnh"
                  style={{ 
                    border: imageItems.length > 0 ? '2px solid #007bff' : '1px solid #007bff',
                    backgroundColor: imageItems.length > 0 ? '#e3f2fd' : 'transparent',
                    color: imageItems.length > 0 ? '#007bff' : '#007bff',
                    transition: 'all 0.3s ease',
                    cursor: imageItems.length >= 5 ? 'not-allowed' : 'pointer',
                    opacity: imageItems.length >= 5 ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (imageItems.length === 0) {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.border = '2px solid #007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (imageItems.length === 0) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.border = '1px solid #007bff';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📷</span>
                  <span className="fw-medium" style={{ color: 'inherit' }}>
                    Ảnh {imageItems.length > 0 ? `(${imageItems.length})` : ''}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={imageItems.length >= 5}
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
                className={`btn flex-grow-1 py-2 fw-semibold ${canSave && !isUploading ? 'btn-primary' : 'btn-secondary disabled'}`}
                onClick={handleSave}
                disabled={!canSave || isUploading}
                style={{ 
                  borderRadius: '8px',
                  fontSize: '16px',
                  height: '40px'
                }}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
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
