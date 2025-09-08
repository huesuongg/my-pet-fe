

# 🚀 RULE Commit, Pull Request & Process làm việc

## 1. Commit Rule
- Cấu trúc commit message:
```

[TASK-ID] [Label] [type] mô tả ngắn gọn

```
- `TASK-ID`: ID của task trên JIRA.  
- `type`: loại thay đổi (`feat`, `fix`, `chore`, `refactor`, `docs`, `test`...).  
- `Label`: label task (`UI`, `FE`, `BE`).  
- `mô tả`: ngắn gọn, rõ ràng (không viết dài dòng).

- Ví dụ:
```

[PET-1234][FE][feat] add login API
[PET-1235][BE][fix] resolve null pointer exception in cart service
[PET-1236][UI][refactor] extract common method for date validation

```

👉 **Tuyệt đối không commit trực tiếp lên `main`.**

---

## 2. Branch Rule
- Mỗi task JIRA = **1 branch** (không tạo branch riêng cho mỗi người).  
- Tên branch:
```

feat/pet-1234
fix/pet-1235

```
> `1234` là JIRA ID.

- Branch được tạo từ `main`.

---

## 3. Pull Request (PR) Rule
- Sau khi hoàn thành task:
1. Merge code mới nhất từ `main` vào branch của mình (đảm bảo **không conflict**).
2. Tạo Pull Request (PR) với:
   - Tên PR = giống commit chính của task.
   - Nội dung PR: mô tả ngắn gọn thay đổi.
3. PR phải được tạo **chậm nhất vào ngày deadline trên JIRA**.
4. Sau khi tạo PR:
   - Cập nhật status task trên JIRA → **In Review**.
   - Assign lại task cho **Sương**.
5. Review code:
   - Nếu cần chỉnh sửa → comment trong PR.
   - Dev có **1 ngày** để fix theo feedback.
   - Sau khi đạt yêu cầu → sẽ đc merge code.

👉 **Không merge khi chưa review, không tự merge PR của chính mình.**

---

## 4. Process làm việc với JIRA
1. **Lấy task** từ JIRA → tạo branch từ `main`.
2. Làm task, commit theo rule.
3. Hoàn thành → tạo PR.
4. Cập nhật task → **In Review**.
5. Assign task cho Sương.
6. Fix comment (nếu có) → sau đó được merge.

---

## 5. Một số rule bổ sung
- **Code style**:
- Tuân thủ convention của project.
- Format code trước khi commit (`Prettier`/`ESLint` hoặc tương tự).
- Không commit file build, file config cá nhân (`.env`, `node_modules`, `target`, ...).
- **Review**:
- Review nghiêm túc, không approve cho có.
- Ưu tiên chất lượng code, không chỉ chạy được.

---

✅ Tóm gọn:
- **1 task JIRA = 1 branch = 1 PR**.  
- Commit đúng format.  
- Không push code lên `main`.  
- Luôn merge `main` mới nhất vào branch trước khi tạo PR.  
- Tạo PR -> tag Sương review, hông tự ý merge pull request nhaaa



