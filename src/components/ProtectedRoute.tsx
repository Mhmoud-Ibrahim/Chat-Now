import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { SocketContext } from './SocketContext';

// 1. تعريف الـ Props لقبول children في TypeScript
interface ProtectedRouteProps {
  children?: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const socketContext = useContext(SocketContext);
  const [isChecking, setIsChecking] = useState(true);

  // تأكد من وجود الكونتكس لتجنب الانهيار
  const userId = socketContext?.userId;

  useEffect(() => {
    // مهلة بسيطة للتأكد من قراءة الكوكيز في الكونتكس
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [userId]);

  // أثناء الفحص، نعرض علامة تحميل
  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // إذا لم يجد userId بعد الفحص، يحول للوجن
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  // إذا وجد userId: 
  // لو استدعيته كـ <ProtectedRoute><Home/></ProtectedRoute> سيعرض الـ children
  // لو استدعيته في الراوتر كـ <Route element={<ProtectedRoute />}/> سيعرض الـ Outlet
  return children ? <>{children}</> : <Outlet />;
}
