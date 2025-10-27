# Verify Register Updates

## Tóm tắt thay đổi

### 1. **Xử lý response verify-register giống login**

Sau khi verify OTP thành công (status 200):

```typescript
// Lấy data từ response
const { user, accessToken, refreshToken } = response.data;

// Lưu vào localStorage
localStorage.setItem("token", accessToken);
localStorage.setItem("refreshToken", refreshToken);
localStorage.setItem("user", JSON.stringify(user));

// Cập nhật Redux state
dispatch(setUser(user));

// Navigate đến trang chủ
navigate("/");
```

### 2. **Xử lý lỗi chi tiết**

Nếu verify OTP thất bại:

```typescript
catch (err: any) {
  const errorMessage = 
    err.response?.data?.message ||      // Message từ server
    err.response?.data?.error ||        // Error từ server  
    err.message ||                      // Error message mặc định
    "Xác thực OTP thất bại";            // Fallback
    
  setError(errorMessage);              // Hiển thị trong Alert
  toast.error(errorMessage);           // Toast notification
  setIsLoading(false);                 // Tắt loading
}
```

### 3. **Flow hoàn chỉnh**

#### Khi verify thành công:
1. Lưu tokens (accessToken, refreshToken) vào localStorage
2. Lưu user data vào localStorage
3. Cập nhật Redux state với `dispatch(setUser(user))`
4. Hiển thị toast success
5. Navigate đến trang chủ "/"
6. Tắt loading state

#### Khi verify thất bại:
1. Hiển thị error message trong Alert component
2. Hiển thị error trong toast
3. Tắt loading để user có thể thử lại
4. Error message lấy từ API response hoặc fallback message

### 4. **Thêm Redux Dispatch**

Đã import lại:
```typescript
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store";
import { setUser } from "../authSlice";

// Sử dụng
const dispatch = useDispatch<AppDispatch>();
dispatch(setUser(user)); // Update Redux state ngay
```

### 5. **Kết quả**

- ✅ User tự động đăng nhập sau khi verify OTP
- ✅ Tokens được lưu và tự động gắn vào mọi request
- ✅ Redux state được cập nhật ngay lập tức
- ✅ Error handling đầy đủ với thông báo rõ ràng
- ✅ Loading state được quản lý đúng cách

### 6. **User Experience**

- Verify thành công → Lưu data → Đăng nhập tự động → Chuyển đến trang chủ
- Verify thất bại → Hiển thị lỗi → Có thể thử lại OTP khác
- Loading hiển thị trong suốt quá trình verify

