import { useRef } from "react";
import { useDoctorAI } from "../context/DoctorAIContext";
import { MessageBubble } from "../components/MessageBubble";

export default function DoctorAIPage() {
  const {
    state,
    setDescription,
    setInput,
    addFiles,
    clearFiles,
    sendMessage,
    clearHistory,
  } = useDoctorAI();
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-light" onClick={() => history.back()}>
          Trở về
        </button>
        <h2 className="m-0">🐾 DoctorAI</h2>
      </div>

      <div className="row g-4" style={{ alignItems: "stretch" }}>
        {/* LEFT: Upload & Description */}
        <div className="col-md-6 col-lg-6 d-flex">
          <div className="card shadow-sm w-100">
            <div className="card-header bg-white">
              <strong>Upload & Mô tả ca bệnh</strong>
            </div>
            <div className="card-body">
              <div
                className=" border-2 border-dashed rounded-3 p-4 text-center mb-3"
                style={{ borderStyle: "dashed" }}
              >
                <div className="display-6">⬇️</div>
                <p className="fw-semibold mb-1">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-muted small">
                  Hỗ trợ: PDF/JPG/PNG/WEBP (≤10MB, tối đa 5 ảnh)
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    addFiles(Array.from(e.target.files || []));
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
                {state.files.length > 0 && (
                  <div className="text-end mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearFiles}
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>

              {state.files.length > 0 && (
                <div className="row g-2 mb-3">
                  {state.files.map((f, i) => (
                    <div key={i} className="col-4">
                      <div className="border rounded-3 p-2 text-center small">
                        {/^image\//.test(f.type) ? (
                          <img
                            src={URL.createObjectURL(f)}
                            onLoad={(e) =>
                              URL.revokeObjectURL(
                                (e.target as HTMLImageElement).src
                              )
                            }
                            className="img-fluid rounded mb-2"
                            style={{
                              height: 96,
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        ) : (
                          <div className="py-4">PDF</div>
                        )}
                        <div className="text-truncate" title={f.name}>
                          {f.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Mô tả tình trạng</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Giống/tuổi/cân nặng, thời gian, triệu chứng kèm, thức ăn/thuốc gần đây..."
                  value={state.description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="text-muted small">
                *Ảnh chỉ dùng để AI phân tích. Bạn có thể xóa trước khi gửi.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Chat */}
        <div className="col-md-6 col-lg-6 d-flex">
          <div
            className="card shadow-sm d-flex flex-column w-100"
            style={{ height: "100%" }}
          >
            <div
              className="card-header bg-white d-flex justify-content-between align-items-center"
              style={{ flexShrink: 0 }}
            >
              <div>
                <strong>AI Bác sĩ thú y</strong>
                <div className="small text-muted">
                  Tư vấn dựa trên ảnh & mô tả
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearHistory}
                >
                  Xóa lịch sử
                </button>
              </div>
            </div>

            <div
              className="card-body"
              style={{
                flex: "1 1 0",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "12px",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {state.messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <div className="display-6">💬</div>
                  <p className="mb-0">
                    Hãy tải ảnh & mô tả ở khung trái, rồi nhập câu hỏi bên dưới
                    để bắt đầu.
                  </p>
                </div>
              ) : (
                <div
                  className="d-flex flex-column gap-2"
                  style={{ paddingRight: "4px" }}
                >
                  {state.messages.map((m, i) => (
                    <MessageBubble
                      key={i}
                      role={m.role}
                      text={m.text}
                      imageUrls={m.imageUrls}
                    />
                  ))}

                  {/* Loading indicator khi AI đang xử lý */}
                  {state.loading && (
                    <div className="d-flex justify-content-start">
                      <div
                        className="me-2 rounded-circle bg-light d-flex align-items-center justify-content-center"
                        style={{ width: 36, height: 36, flexShrink: 0 }}
                      >
                        🤖
                      </div>
                      <div
                        className="p-3 rounded-3 shadow-sm bg-white border"
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="text-muted small">
                            AI đang phân tích ảnh và mô tả của bạn... Vui lòng
                            đợi...
                          </span>
                        </div>
                        <div
                          className="progress mt-2"
                          style={{ height: "2px" }}
                        >
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {state.error && (
                <div className="alert alert-danger mt-3">
                  <strong>⚠️ Lỗi:</strong> {state.error}
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        // Clear error và có thể retry
                        setInput("");
                      }}
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer bg-white" style={{ flexShrink: 0 }}>
              <div className="d-flex gap-2">
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Hỏi tôi về ca bệnh..."
                  value={state.input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="btn btn-primary position-relative"
                  disabled={state.loading}
                  onClick={sendMessage}
                  style={{ minWidth: "80px" }}
                >
                  {state.loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    "Gửi"
                  )}
                </button>
              </div>
              <div className="small text-muted mt-1">
                *Thông tin chỉ tham khảo, không thay thế khám trực tiếp.
                {state.loading && (
                  <div className="mt-1 text-primary">
                    ⏱️ AI đang xử lý, có thể mất 30-60 giây với ảnh...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
