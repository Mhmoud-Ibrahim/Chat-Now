// import { useContext } from "react";
// import { SocketContext } from "./SocketContext";
// import { useNavigate, useLocation } from "react-router-dom"; // أضفنا الـ Hooks

// export function UsersList() {
//   const context = useContext(SocketContext);
//   const navigate = useNavigate();
//   const location = useLocation(); // لمعرفة الصفحة الحالية

//   if (!context) return null;

//   const { onlineUsers, setSelectedUser, userId, selectedUser } = context;

//   // دالة التعامل مع الضغط على اليوزر
//   const handleUserSelect = (id: string) => {
//     setSelectedUser(id);
//     // إذا كان المستخدم في صفحة الـ Users، ينقله تلقائياً للشات
//     if (location.pathname === "/users") {
//       navigate("/home");
//     }
//   };

//   const filteredUsers = onlineUsers?.filter(user => user.userId !== userId);

//   return (
//     <div className="card shadow-sm border-0 rounded-4 overflow-hidden shadow-hover">
//       <h6 className="p-3 bg-white mb-0 border-bottom fw-bold text-dark d-flex align-items-center">
//         <span className="pulse-green me-2"></span>
//         المستخدمون المتصلون ({filteredUsers?.length || 0})
//       </h6>
      
//       <div className="list-group list-group-flush" style={{maxHeight: '450px', overflowY: 'auto', backgroundColor: '#f8f9fa'}}>
//         {filteredUsers?.map(user => (
//           <button 
//             key={user.userId} 
//             onClick={() => handleUserSelect(user.userId)}
//             className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-4 transition-all ${
//                 selectedUser === user.userId ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
//             }`}
//           >
//             {/* أيقونة مستخدم افتراضية أو صورة */}
//             <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border me-3" style={{width: 40, height: 40}}>
//                 <i className="fa-solid fa-user text-secondary"></i>
//             </div>

//             <div className="flex-grow-1">
//                 <div className={`small mb-0 ${selectedUser === user.userId ? 'fw-bold text-primary' : 'fw-bold text-dark'}`}>
//                     {user.name}
//                 </div>
//                 <small className="text-success" style={{fontSize: '10px'}}>
//                    <i className="fa-solid fa-circle fa-2xs me-1"></i> نشط الآن
//                 </small>
//             </div>
            
//             {selectedUser === user.userId && (
//                 <i className="fa-solid fa-chevron-left text-primary fa-xs animate__animated animate__fadeInRight"></i>
//             )}
//           </button>
//         ))}

//         {filteredUsers?.length === 0 && (
//             <div className="p-5 text-center text-muted">
//                 <i className="fa-solid fa-user-slash fa-2x mb-2 opacity-25"></i>
//                 <div className="small">لا يوجد مستخدمون آخرون متصلون حالياً</div>
//             </div>
//         )}
//       </div>

//       <style>{`
//         .pulse-green {
//           width: 10px;
//           height: 10px;
//           background: #28a745;
//           border-radius: 50%;
//           box-shadow: 0 0 0 rgba(40, 167, 69, 0.4);
//           animation: pulse 2s infinite;
//         }
//         @keyframes pulse {
//           0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
//           70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
//         }
//         .transition-all { transition: all 0.2s ease-in-out; }
//         .shadow-hover:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
//       `}</style>
//     </div>
//   );
// }
import { useContext } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate, useLocation } from "react-router-dom";

export function UsersList() {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!context) return null;

  const { onlineUsers, setSelectedUser, userId, selectedUser, loading } = context;

  // تنظيف الـ IDs لضمان دقة المقارنة (نفس المنطق المستخدم في Home)
  const currentUserId = String(userId || "").replace(/['"]+/g, '');

  const handleUserSelect = (id: string) => {
    const cleanId = String(id).replace(/['"]+/g, '');
    setSelectedUser(cleanId);
    
    // الانتقال لصفحة الشات إذا كان المستخدم في صفحة Users
    if (location.pathname === "/users") {
      navigate("/home");
    }
  };

  // تصفية المستخدمين لاستثناء المستخدم الحالي
  const filteredUsers = onlineUsers?.filter(u => 
    String(u.userId).replace(/['"]+/g, '') !== currentUserId
  );

  // عرض حالة تحميل بسيطة داخل القائمة إذا كان النظام لا يزال يتحقق من البيانات
  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border spinner-border-sm text-primary"></div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
          <span className="pulse-green me-2"></span>
          المتصلون الآن ({filteredUsers?.length || 0})
        </h6>
        <i className="fa-solid fa-users text-muted opacity-50"></i>
      </div>
      
      <div className="list-group list-group-flush custom-scrollbar" style={{maxHeight: 'calc(100vh - 200px)', overflowY: 'auto'}}>
        {filteredUsers?.map(u => {
          const isSelected = String(selectedUser || "").replace(/['"]+/g, '') === String(u.userId).replace(/['"]+/g, '');
          
          return (
            <button 
              key={u.userId} 
              onClick={() => handleUserSelect(u.userId)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-3 transition-all ${
                  isSelected ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
              }`}
            >
              {/* صورة المستخدم أو أيقونة افتراضية */}
              <div className="position-relative me-3">
                <div className="rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center border" style={{width: 45, height: 45, overflow: 'hidden'}}>
                    <i className="fa-solid fa-user text-secondary mt-2 fa-lg"></i>
                </div>
                <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
              </div>

              <div className="flex-grow-1 text-start">
                  <div className={`mb-0 text-truncate ${isSelected ? 'fw-bold text-primary' : 'fw-bold text-dark'}`} style={{maxWidth: '150px'}}>
                      {u.name}
                  </div>
                  <small className="text-success d-block" style={{fontSize: '11px'}}>
                     متصل الآن
                  </small>
              </div>
              
              {isSelected && (
                  <i className="fa-solid fa-comment text-primary fa-xs animate__animated animate__fadeInRight"></i>
              )}
            </button>
          );
        })}

        {filteredUsers?.length === 0 && (
            <div className="p-5 text-center text-muted">
                <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                  <i className="fa-solid fa-user-group fa-2x opacity-25"></i>
                </div>
                <p className="small fw-medium">لا يوجد مستخدمون متصلون</p>
                <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => window.location.reload()}>
                   تحديث القائمة
                </button>
            </div>
        )}
      </div>

      <style>{`
        .pulse-green {
          width: 8px;
          height: 8px;
          background: #28a745;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .transition-all { transition: all 0.2s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
