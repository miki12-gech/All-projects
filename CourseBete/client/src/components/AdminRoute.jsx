import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  // 1. Must be logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Must be an Admin
  if (role !== 'admin') {
    // If they are a student trying to hack in, send them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;