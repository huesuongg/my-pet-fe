// src/features/users/components/UserTable.tsx
import React from "react";
import { Badge, Table, Image } from "react-bootstrap";
import Pagination from "../../../components/common/Pagination";
import { Status, User } from "../types/types";
import styles from "./UserTable.module.css";

type Props = {
  users: User[];                 // data đã filter và slice theo trang
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onToggleStatus: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
};

const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  const variant = status === "Active" ? "success" : "danger";
  return (
    <Badge bg={variant} pill className="px-3 py-2 fw-semibold" style={{ fontSize: 12 }}>
      {status}
    </Badge>
  );
};

const UserTable: React.FC<Props> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onToggleStatus,
}) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead   >
            <tr >
              <th style={{ width: 36 }} className={styles.tableHeader}>
                <input type="checkbox" aria-label="Select all" />
              </th>
              <th className={styles.tableHeader}>Full Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Username</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <input type="checkbox" aria-label={`Select ${u.fullName}`} />
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {u.avatarUrl ? (
                      <Image
                        src={u.avatarUrl}
                        alt={u.fullName}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, fontSize: 12 }}
                        aria-hidden
                      >
                        {u.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <span className="fw-semibold">{u.fullName}</span>
                  </div>
                </td>
                <td className="text-muted">{u.email}</td>
                <td className="text-muted">{u.username}</td>
                <td>
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => onToggleStatus(u.id)}
                    title="Toggle status"
                  >
                    <StatusPill status={u.status} />
                  </button>
                </td>
                <td>
                  <span className="badge text-bg-light border fw-semibold px-3 py-2" style={{ fontSize: 12 }}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination area */}
      <div className="px-3 py-2 border-top bg-white d-flex justify-content-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserTable;
