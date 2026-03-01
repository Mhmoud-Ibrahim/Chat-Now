// import { UsersList } from './UserList';

// function Users() {
//     return (
//         <div className="container-fluid min-vh-100 bg-light py-5" style={{ marginTop: '60px' }}>
//             <div className="container">
//                 {/* هيدر الصفحة */}
//                 <div className="row mb-5 animate__animated animate__fadeInDown">
//                     <div className="col-12 text-center">
//                         <div className="display-6 fw-bold text-primary mb-2">
//                             <i className="fa-solid fa-earth-americas me-2"></i>
//                             المجتمع النشط
//                         </div>
//                         <p className="text-muted fw-medium">تواصل مع المستخدمين المتصلين الآن وابدأ محادثاتك</p>
//                         <div className="mx-auto bg-primary rounded-pill" style={{ width: '60px', height: '4px' }}></div>
//                     </div>
//                 </div>

//                 <div className="row justify-content-center">
//                     <div className="col-lg-10">
//                         {/* 
//                            لاحظ هنا: قمنا بتغليف UsersList داخل حاوية 
//                            تتحكم في شكل العناصر بداخلها عبر الـ CSS 
//                         */}
//                         <div className="custom-users-grid animate__animated animate__fadeInUp">
//                             <UsersList />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style>{`
//                 /* تحويل القائمة إلى نظام شبكة (Grid) احترافي */
//                 .custom-users-grid .list-group {
//                     display: grid;
//                     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//                     gap: 20px;
//                     background: transparent;
//                 }

//                 .custom-users-grid .list-group-item {
//                     background: white;
//                     border: 1px solid #eee;
//                     border-radius: 15px !important;
//                     margin-bottom: 0;
//                     padding: 1.5rem;
//                     transition: all 0.3s ease;
//                     display: flex;
//                     align-items: center;
//                     box-shadow: 0 4px 6px rgba(0,0,0,0.02);
//                 }

//                 .custom-users-grid .list-group-item:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 10px 20px rgba(0,0,0,0.08);
//                     border-color: #0d6efd;
//                     background-color: #fff;
//                     cursor: pointer;
//                 }

//                 .animate__animated {
//                     --animate-duration: 0.6s;
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default Users;
import { useContext } from 'react';
import { UsersList } from './UserList';
import { SocketContext } from './SocketContext';
import Loading from './Loading';

function Users() {
    const context = useContext(SocketContext);

    // إذا كان الكونتكس لسه بيعمل CheckAuth من الكوكيز، نعرض شاشة التحميل
    if (context?.loading) {
        return <Loading />;
    }

    return (
        <div className="container-fluid min-vh-100 bg-light py-5" style={{ marginTop: '60px' }}>
            <div className="container">
                {/* هيدر الصفحة بتصميم عصري */}
                <div className="row mb-5 animate__animated animate__fadeInDown">
                    <div className="col-12 text-center">
                        <div className="display-5 fw-bold text-primary mb-2">
                            <i className="fa-solid fa-users-viewfinder me-2"></i>
                            المجتمع النشط
                        </div>
                        <p className="text-muted fs-5 fw-medium">
                            اكتشف المستخدمين المتصلين الآن وابدأ محادثات فورية آمنة
                        </p>
                        <div className="mx-auto bg-warning rounded-pill" style={{ width: '80px', height: '5px' }}></div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        {/* 
                           تغليف الـ UsersList في حاوية مخصصة 
                           لتطبيق نظام الـ Grid الاحترافي عليها
                        */}
                        <div className="custom-users-page animate__animated animate__fadeInUp">
                            <UsersList />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* تخصيص شكل القائمة لتظهر كـ Cards في صفحة المستخدمين */
                .custom-users-page .card {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                .custom-users-page .list-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    background: transparent !important;
                    max-height: none !important; /* إلغاء التمرير الداخلي في هذه الصفحة */
                    overflow: visible !important;
                }

                .custom-users-page .list-group-item {
                    background: white !important;
                    border: 1px solid #f0f0f0 !important;
                    border-radius: 20px !important;
                    padding: 1.25rem !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.04) !important;
                    margin-bottom: 0 !important;
                }

                .custom-users-page .list-group-item:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 15px 30px rgba(13, 110, 253, 0.1) !important;
                    border-color: #0d6efd !important;
                    z-index: 2;
                }

                /* إخفاء الهيدر الداخلي للـ UsersList لأنه مكرر هنا */
                .custom-users-page .card-header, 
                .custom-users-page h6.p-3 {
                    display: none !important;
                }

                /* تحسين شكل الصورة في الكارت */
                .custom-users-page .rounded-circle {
                    width: 55px !important;
                    height: 55px !important;
                    background: #f8f9fa;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .animate__animated {
                    --animate-duration: 0.8s;
                }

                @media (max-width: 768px) {
                    .custom-users-page .list-group {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Users;
