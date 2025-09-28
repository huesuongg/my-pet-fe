# Pet Management System

## Tổng quan
Hệ thống quản lý hồ sơ thú cưng hoàn chỉnh với đầy đủ tính năng CRUD, lịch sử tiêm phòng, và tích hợp với hệ thống đặt lịch.

## Tính năng
- ✅ **Quản lý hồ sơ thú cưng** - Tạo, xem, sửa, xóa thông tin thú cưng
- ✅ **Lịch sử tiêm phòng** - Theo dõi lịch tiêm vaccine
- ✅ **Lịch sử khám bệnh** - Ghi nhận các lần khám và điều trị
- ✅ **Tích hợp đặt lịch** - Chọn thú cưng khi đặt lịch khám
- ✅ **Redux State Management** - Quản lý state với Redux
- ✅ **Form Validation** - Validation đầy đủ cho form
- ✅ **Responsive UI** - Giao diện đẹp mắt với Material-UI

## Cấu trúc Files
```
src/features/pet/
├── types/
│   └── index.ts              # TypeScript interfaces
├── mockData.ts               # Mock pets data
├── petAPI.ts                 # API functions
├── petThunk.ts               # Redux thunks
├── petSlice.ts               # Redux slice
├── pages/
│   └── PetProfilePage.tsx    # Main pet management page
└── components/
    └── PetForm.tsx           # Pet form component
```

## Pet Data Structure
```typescript
interface Pet {
  id: string;
  userId: number;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  color: string;
  microchipId?: string;
  vaccinationHistory: VaccinationRecord[];
  medicalHistory: MedicalRecord[];
  profileImage?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Cách sử dụng

### 1. Truy cập trang quản lý thú cưng
```
/pet-profile
```

### 2. Sử dụng Pet Hooks
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { getPetsByUserId, createPet, updatePet, deletePet } from '../pet/petThunk';

function MyComponent() {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector((state: RootState) => state.pet);
  
  // Load pets for current user
  useEffect(() => {
    if (user?.id) {
      dispatch(getPetsByUserId(user.id));
    }
  }, [dispatch, user?.id]);
  
  // Create new pet
  const handleCreatePet = (petData) => {
    dispatch(createPet({ userId: user.id, petData }));
  };
}
```

### 3. Tích hợp với Booking
Khi đặt lịch, người dùng sẽ:
1. Chọn thú cưng từ danh sách
2. Nếu chưa có thú cưng, được chuyển hướng đến `/pet-profile`
3. Tạo hồ sơ thú cưng trước khi đặt lịch

## Mock Data
Hệ thống có sẵn 3 thú cưng mẫu:
- **Buddy** (Golden Retriever, 3 tuổi) - thuộc user1
- **Whiskers** (Persian Cat, 2 tuổi) - thuộc user1  
- **Coco** (Cockatiel Bird, 1 tuổi) - thuộc user2

## UI Features
- **Tab Navigation** - Danh sách thú cưng, Lịch sử tiêm phòng, Lịch sử khám bệnh
- **Pet Cards** - Hiển thị thông tin thú cưng với ảnh đại diện
- **Form Dialog** - Tạo/sửa thú cưng trong dialog
- **Delete Confirmation** - Xác nhận trước khi xóa
- **Empty State** - Hướng dẫn khi chưa có thú cưng

## Validation Rules
- Tên thú cưng: Bắt buộc
- Giống loài: Bắt buộc
- Tuổi: > 0
- Cân nặng: > 0
- Màu sắc: Bắt buộc
- Mã chip: Tùy chọn

## Routes
- `/pet-profile` - Trang quản lý hồ sơ thú cưng (yêu cầu đăng nhập)

## State Management
- **Redux Store**: Lưu trữ danh sách pets, current pet, loading states
- **Redux Persist**: Tự động lưu pet data vào localStorage
- **Real-time Updates**: Cập nhật UI ngay khi có thay đổi

## Integration Points
- **Authentication**: Chỉ user đã đăng nhập mới có thể quản lý pets
- **Booking System**: Tích hợp chọn pet khi đặt lịch
- **User Management**: Mỗi user chỉ thấy pets của mình
