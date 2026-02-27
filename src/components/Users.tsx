import { UsersList } from './UserList';

function Users() {
    return (
        <div className="container-fluid min-vh-100 bg-light py-5" style={{ marginTop: '60px' }}>
            <div className="container">
                {/* هيدر الصفحة */}
                <div className="row mb-5 animate__animated animate__fadeInDown">
                    <div className="col-12 text-center">
                        <div className="display-6 fw-bold text-primary mb-2">
                            <i className="fa-solid fa-earth-americas me-2"></i>
                            المجتمع النشط
                        </div>
                        <p className="text-muted fw-medium">تواصل مع المستخدمين المتصلين الآن وابدأ محادثاتك</p>
                        <div className="mx-auto bg-primary rounded-pill" style={{ width: '60px', height: '4px' }}></div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* 
                           لاحظ هنا: قمنا بتغليف UsersList داخل حاوية 
                           تتحكم في شكل العناصر بداخلها عبر الـ CSS 
                        */}
                        <div className="custom-users-grid animate__animated animate__fadeInUp">
                            <UsersList />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* تحويل القائمة إلى نظام شبكة (Grid) احترافي */
                .custom-users-grid .list-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    background: transparent;
                }

                .custom-users-grid .list-group-item {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 15px !important;
                    margin-bottom: 0;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }

                .custom-users-grid .list-group-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
                    border-color: #0d6efd;
                    background-color: #fff;
                    cursor: pointer;
                }

                .animate__animated {
                    --animate-duration: 0.6s;
                }
            `}</style>
        </div>
    );
}

export default Users;
