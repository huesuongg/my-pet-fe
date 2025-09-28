// src/features/users/pages/UserManagementPage.tsx
import React, { useMemo, useState } from "react";
import UserHeading from "../components/UserHeading";
import UserTable from "../components/UserTable";
import { Role, Status, User } from "../types/types";

const MOCK: User[] = [
  { id: "1", fullName: "John Smith",  email: "john.smith@gmail.com",  username: "jonny77", role: "Admin",    status: "Active" },
  { id: "2", fullName: "Olivia Bennett", email: "ollyben@gmail.com",  username: "olly659", role: "Customer", status: "Banned" },
  { id: "3", fullName: "Daniel Warren", email: "dwarren3@gmail.com", username: "dwarren3", role: "Customer", status: "Active" },
  { id: "4", fullName: "Chloe Hayes",   email: "chloehye@gmail.com",  username: "chloeh",  role: "Doctor",   status: "Active" },
  { id: "5", fullName: "Marcus Reed",   email: "reeds777@gmail.com",  username: "reeds7",  role: "Customer", status: "Banned" },
  { id: "6", fullName: "Isabelle Clark",email: "belleclark@gmail.com",username: "bellecl", role: "Doctor",   status: "Active" },
  { id: "7", fullName: "Lucas Mitchell",email: "lucamich@gmail.com",  username: "lucamich",role: "Customer", status: "Active" },
  { id: "8", fullName: "Mark Wilburg",  email: "markwill32@gmail.com",username: "markwill32",role: "Customer",status: "Banned" },
  { id: "9", fullName: "Nicholas Agen", email: "nicolaas009@gmail.com",username:"nick009", role: "Customer", status: "Active" },
  { id: "10",fullName: "Mia Nadin",     email: "minadiddin@gmail.com",username:"minaddin",role: "Doctor",   status: "Active" },
];

const PAGE_SIZE = 6;

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "All">("All");
  const [status, setStatus] = useState<Status | "All">("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = users;

    // search by name/email/username
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }

    if (role !== "All") data = data.filter((u) => u.role === role);
    if (status !== "All") data = data.filter((u) => u.status === status);

    return data;
  }, [users, search, role, status]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u
      )
    );
  };

  // reset về trang 1 khi filter/search thay đổi
  React.useEffect(() => setPage(1), [search, role, status]);

  return (
    <div className="container py-4">
      <UserHeading
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
      />

      <UserTable
        users={paged}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default UserManagementPage;
