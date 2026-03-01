import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { SocketContext } from './SocketContext';

import ChatLoader from './ChatLoader';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const socketContext = useContext(SocketContext);

  if (!socketContext) return null;
  const { user, userId, loading } = socketContext as any; 
  if (loading) {
    return <ChatLoader/>; 
  }
  if (!userId || !user) {
    console.log("Access Denied: No User Found");
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
