// import { useContext, useEffect, useState, useRef } from "react";
// import { SocketContext } from "./SocketContext";
// import api from "./api";

// export function Profile() {
//   const socketContext = useContext(SocketContext);
  
//   // 1. استخراج الدوال بشكل صحيح من الكونتكس (تأكد من مطابقة الأسماء)
//   const { setUser, updateUserData, socket, userId, userName } = socketContext!;

//   const [profileData, setProfileData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!socket) return;
    
//     // طلب البيانات عند الفتح
//     socket.emit("get_profile");

//     const handleProfileData = (data: any) => {
//       const userData = data.user || data;
//       setProfileData(userData);
//       // ✅ تحديث الكونتكس أيضاً لضمان مزامنة الناف بار عند الدخول
//       setUser(userData); 
//       setLoading(false);
//     };

//     socket.on("profile_data", handleProfileData);
//     socket.on("profile_updated", handleProfileData);

//     return () => {
//       socket.off("profile_data", handleProfileData);
//       socket.off("profile_updated", handleProfileData);
//     };
//   }, [socket, setUser]);

//   const handleUpdateField = (field: "name" | "email") => {
//     const label = field === "name" ? "الاسم الجديد" : "البريد الإلكتروني الجديد";
//     const newValue = prompt(`أدخل ${label}:`, profileData?.[field]);
//     if (newValue && newValue !== profileData?.[field]) {
//       setLoading(true);
//       socket?.emit("update_profile", { [field]: newValue });
//     }
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setLoading(true);
//       // تأكد أن المسار مطابق للراوتر في الباك إند (مثلاً /image-profile)
//       const res = await api.post("/profileImage", formData);

//       if (res.data && res.data.user) {
//         const updatedUser = res.data.user;
        
//         // ✅ تحديث الستيت المحلية (للصفحة الحالية)
//         setProfileData(updatedUser);
        
//         // ✅ تحديث الكونتكس (للناف بار وباقي الموقع)
//         updateUserData(updatedUser); 
        
//         alert("تم تحديث الصورة بنجاح");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("فشل في رفع الصورة");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!socketContext) return null;

//   if (loading) return (
//     <div className="text-center mt-5">
//       <div className="spinner-border text-primary"></div>
//       <p className="mt-2">جاري التحميل...</p>
//     </div>
//   );

//   return (
//     <div className="container py-5 mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6 col-lg-5">
//           <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
//             <div className="card-header bg-costom py-5 text-center position-relative">
//               <div className="position-absolute top-100 start-50 translate-middle">
//                 <div className="rounded-circle bg-white p-1 shadow position-relative">
//                   <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
//                        style={{ width: "100px", height: "100px", overflow: "hidden" }}>
//                    {profileData?.fulluserImage ? (
//                       <img src={profileData.fulluserImage} className="w-100 h-100 object-fit-cover" alt="Profile" />
//                     ) : (
//                       <i className="fa-solid fa-user fa-3x text-secondary"></i>
//                     )}
//                   </div>
//                   <button 
//                     className="btn btn-dark btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow-sm"
//                     style={{ width: "32px", height: "32px", border: "2px solid white" }}
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     <i className="fa-solid fa-camera fa-xs text-white"></i>
//                   </button>
//                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
//                 </div>
//               </div>
//             </div>

//             <div className="card-body mt-5 pt-4 text-center">
//               <h3 className="fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
//                 {profileData?.name || userName || "User Name"}
//                 <button className="btn btn-link btn-sm p-0 text-muted" onClick={() => handleUpdateField("name")}>
//                   <i className="fa-solid fa-pen-to-square"></i>
//                 </button>
//               </h3>
//               <p className="text-muted small mb-4">ID: {userId}</p>
              
//               <div className="row g-3 text-start px-3">
//                 <div className="col-12 border-bottom pb-2 d-flex justify-content-between align-items-center">
//                   <div>
//                     <label className="text-muted small d-block">Email Address</label>
//                     <span className="fw-medium text-break">{profileData?.email || "No email available"}</span>
//                   </div>
//                   <button className="btn btn-link btn-sm text-decoration-none" onClick={() => handleUpdateField("email")}>تعديل</button>
//                 </div>

//                 <div className="col-12 border-bottom pb-2">
//                   <label className="text-muted small d-block">Member Since</label>
//                   <span className="fw-medium">
//                     {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('ar-EG') : "N/A"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "./SocketContext";
import api from "./api";

export function Profile() {
  const socketContext = useContext(SocketContext);
  
  // التأكد من وجود الكونتكس
  if (!socketContext) return null;

  const { user, setUser, updateUserData, socket, userId } = socketContext;

  // حالة محلية للتحميل فقط
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث البيانات عبر السوكيت (للاسم والإيميل)
  const handleUpdateField = (field: "name" | "email") => {
    const label = field === "name" ? "الاسم الجديد" : "البريد الإلكتروني الجديد";
    const newValue = prompt(`أدخل ${label}:`, user?.[field]);
    
    if (newValue && newValue !== user?.[field]) {
      setLoading(true);
      // إرسال التحديث للسوكيت (الباك إند سيقوم بتحديث الداتا بيز وإرجاع profile_updated)
      socket?.emit("update_profile", { [field]: newValue });
    }
  };

  // استقبال تحديثات السوكيت (إذا قام الباك إند بإرسالها)
  useEffect(() => {
    if (!socket) return;

    const handleProfileUpdate = (updatedData: any) => {
      const data = updatedData.user || updatedData;
      setUser(data); // تحديث الكونتكس كاملاً
      setLoading(false);
    };

    socket.on("profile_updated", handleProfileUpdate);
    return () => { socket.off("profile_updated", handleProfileUpdate); };
  }, [socket, setUser]);

  // رفع الصورة عبر الـ API (أفضل من السوكيت في الملفات الكبيرة)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/profileImage", formData);
console.log(res.data.user);
      if (res.data && res.data.user) {
        updateUserData(res.data.user);
        alert("تم تحديث الصورة بنجاح ✅");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("فشل في رفع الصورة ❌");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 fw-bold">جاري تحديث بياناتك...</p>
    </div>
  );

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            {/* Header / Cover */}
            <div className="card-header bg-primary py-5 text-center position-relative mb-5">
              <div className="position-absolute top-100 start-50 translate-middle">
                <div className="rounded-circle bg-white p-1 shadow-sm position-relative">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" 
                       style={{ width: "120px", height: "120px", overflow: "hidden" }}>
                   {user?.fulluserImage ? (
                      <img src={user.fulluserImage} className="w-100 h-100 object-fit-cover" alt="Profile" />
                    ) : (
                      <i className="fa-solid fa-user fa-4x text-secondary mt-3"></i>
                    )}
                  </div>
                  <button 
                    className="btn btn-warning btn-sm rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center shadow"
                    style={{ width: "35px", height: "35px", border: "3px solid white" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fa-solid fa-camera text-dark"></i>
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="card-body text-center mt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <h3 className="fw-bold m-0">{user?.name || "مستخدم"}</h3>
                <button className="btn btn-outline-secondary btn-sm border-0 rounded-circle" onClick={() => handleUpdateField("name")}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
              <p className="badge bg-light text-secondary rounded-pill px-3 py-2">ID: {userId}</p>
              
              <div className="mt-4 text-start px-4">
                <div className="mb-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <label className="text-muted small d-block fw-bold">Email Address</label>
                    <span className="text-dark">{user?.email || "لا يوجد بريد"}</span>
                  </div>
                  <button className="btn btn-sm btn-link text-primary p-0" onClick={() => handleUpdateField("email")}>تعديل</button>
                </div>

                <div className="p-3 bg-light rounded-3">
                  <label className="text-muted small d-block fw-bold">Member Since</label>
                  <span className="text-dark">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-white border-0 pb-4 text-center">
               <small className="text-muted">يمكنك تعديل بياناتك الشخصية في أي وقت</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
