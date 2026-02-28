import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { SocketContext } from './SocketContext';


interface ProtectedRouteProps {
  children?: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const socketContext = useContext(SocketContext);
  const [isChecking, setIsChecking] = useState(true);


  const userId = socketContext?.userId ||localStorage.getItem('userId');

  useEffect(() => {
 
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [userId]);

 
  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
