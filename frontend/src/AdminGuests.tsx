import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
