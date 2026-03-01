import { useContext } from "react";
import { SocketContext } from "./SocketContext";
import { useNavigate, useLocation } from "react-router-dom"; // أضفنا الـ Hooks

export function UsersList() {
  const context = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation(); // لمعرفة الصفحة الحالية

  if (!context) return null;

  const { onlineUsers, setSelectedUser, userId, selectedUser } = context;

  // دالة التعامل مع الضغط على اليوزر
  const handleUserSelect = (id: string) => {
    setSelectedUser(id);
    // إذا كان المستخدم في صفحة الـ Users، ينقله تلقائياً للشات
    if (location.pathname === "/users") {
      navigate("/home");
    }
  };

  const filteredUsers = onlineUsers?.filter(user => user.userId !== userId);

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden shadow-hover">
      <h6 className="p-3 bg-white mb-0 border-bottom fw-bold text-dark d-flex align-items-center">
        <span className="pulse-green me-2"></span>
        المستخدمون المتصلون ({filteredUsers?.length || 0})
      </h6>
      
      <div className="list-group list-group-flush" style={{maxHeight: '450px', overflowY: 'auto', backgroundColor: '#f8f9fa'}}>
        {filteredUsers?.map(user => (
          <button 
            key={user.userId} 
            onClick={() => handleUserSelect(user.userId)}
            className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 px-4 transition-all ${
                selectedUser === user.userId ? 'bg-primary-subtle border-start border-primary border-4 shadow-sm' : ''
            }`}
          >
            {/* أيقونة مستخدم افتراضية أو صورة */}
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border me-3" style={{width: 40, height: 40}}>
                <i className="fa-solid fa-user text-secondary"></i>
            </div>

            <div className="flex-grow-1">
                <div className={`small mb-0 ${selectedUser === user.userId ? 'fw-bold text-primary' : 'fw-bold text-dark'}`}>
                    {user.name}
                </div>
                <small className="text-success" style={{fontSize: '10px'}}>
                   <i className="fa-solid fa-circle fa-2xs me-1"></i> نشط الآن
                </small>
            </div>
            
            {selectedUser === user.userId && (
                <i className="fa-solid fa-chevron-left text-primary fa-xs animate__animated animate__fadeInRight"></i>
            )}
          </button>
        ))}

        {filteredUsers?.length === 0 && (
            <div className="p-5 text-center text-muted">
                <i className="fa-solid fa-user-slash fa-2x mb-2 opacity-25"></i>
                <div className="small">لا يوجد مستخدمون آخرون متصلون حالياً</div>
            </div>
        )}
      </div>

      <style>{`
        .pulse-green {
          width: 10px;
          height: 10px;
          background: #28a745;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(40, 167, 69, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
        }
        .transition-all { transition: all 0.2s ease-in-out; }
        .shadow-hover:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}
