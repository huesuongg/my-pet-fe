import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

interface MessageBubbleProps {
  role: "user" | "assistant";
  text: string;
  imageUrls?: string[];
}

/**
 * Format AI text để hiển thị đẹp hơn
 * Convert markdown-like formatting và line breaks
 */
function formatAIText(text: string): string {
  let formatted = text;
  
  // Nếu text đã có HTML tags từ backend, chỉ cần escape và format thêm
  const hasHTMLTags = /<[a-z][\s\S]*>/i.test(text);
  
  if (hasHTMLTags) {
    // Backend đã format, chỉ cần apply thêm styles
    return formatted;
  }
  
  // Convert **text** to <strong>text</strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0066cc; font-weight: 600;">$1</strong>');
  
  // Convert line breaks first
  formatted = formatted.replace(/\n\n/g, '</p><p style="margin: 0.5rem 0;">');
  formatted = formatted.replace(/\n/g, '<br/>');
  formatted = '<p style="margin: 0.5rem 0;">' + formatted + '</p>';
  
  // Convert bullet points
  formatted = formatted.replace(/^\* (.+)$/gm, '<li style="margin-bottom: 0.25rem;">$1</li>');
  
  // Wrap consecutive <li> in <ul>
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>(?:\s*<li[^>]*>.*?<\/li>)*)/g, 
    (match) => `<ul style="margin: 0.75rem 0; padding-left: 1.5rem; list-style-type: disc;">${match}</ul>`
  );
  
  // Format section headers (text ending with :)
  formatted = formatted.replace(/^([^*]+:)$/gm, 
    '<div style="font-weight: 600; color: #0066cc; margin-top: 1rem; margin-bottom: 0.5rem; font-size: 1.05rem;">$1</div>'
  );
  
  return formatted;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  role, 
  text, 
  imageUrls 
}) => {
  const isUser = role === "user";
  const user = useSelector((state: RootState) => state.auth.user);
  const userAvatar = user?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzx5O9jN4urn2la1D6ni7Bh9PTVG23AZbEb-mgcWUwwgrsPOZtkS2hGKL_aHZNtCrfa44&usqp=CAU';
  
  return (
    <div 
      className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"}`}
    >
      {/* Avatar cho AI */}
      {!isUser && (
        <div 
          className="me-2 rounded-circle d-flex align-items-center justify-content-center" 
          style={{ 
            width: 40, 
            height: 40, 
            flexShrink: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <span style={{ fontSize: "20px" }}>🩺</span>
        </div>
      )}
      
      {/* Message bubble */}
      <div 
        className={`p-3 rounded-3 shadow-sm`}
        style={{ 
          maxWidth: "85%",
          ...(isUser ? {
            background: "linear-gradient(135deg, #2F80ED 0%, #1e5bb8 100%)",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(47, 128, 237, 0.3)"
          } : {
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          })
        }}
      >
        {/* Header cho AI response */}
        {!isUser && (
          <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
            <span className="badge bg-info-subtle text-info-emphasis">
              🩺 AI Bác sĩ thú y
            </span>
          </div>
        )}
        
        {/* Images nếu có */}
        {imageUrls && imageUrls.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {imageUrls.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={`Uploaded ${index + 1}`}
                className="rounded" 
                style={{ 
                  width: 112, 
                  height: 112, 
                  objectFit: "cover", 
                  border: "2px solid #e0e0e0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Text content */}
        {!isUser && text.includes('<') && text.includes('>') ? (
          // Text có HTML tags từ backend
          <div 
            style={{ 
              wordBreak: "break-word",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              color: "#333"
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ) : !isUser ? (
          // Text không có HTML, format markdown
          <div 
            style={{ 
              whiteSpace: "pre-wrap", 
              wordBreak: "break-word",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              color: "#333"
            }}
            dangerouslySetInnerHTML={{ __html: formatAIText(text) }}
          />
        ) : (
          // User message - formatted text
          <div 
            style={{ 
              whiteSpace: "pre-wrap", 
              wordBreak: "break-word",
              fontSize: "0.95rem",
              lineHeight: "1.5",
              color: "#ffffff"
            }}
          >
            {text}
          </div>
        )}
      </div>
      
      {/* Avatar cho User */}
      {isUser && (
        <div 
          className="ms-2 rounded-circle d-flex align-items-center justify-content-center overflow-hidden" 
          style={{ 
            width: 40, 
            height: 40, 
            flexShrink: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            border: "2px solid #ffffff"
          }}
        >
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt="User avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              onError={(e) => {
                // Fallback nếu ảnh lỗi
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '👤';
              }}
            />
          ) : (
            <span style={{ fontSize: "20px" }}>👤</span>
          )}
        </div>
      )}
    </div>
  );
};