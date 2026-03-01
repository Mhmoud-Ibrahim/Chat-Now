
// import { Link } from 'react-router-dom'

// import 'aos/dist/aos.css';

// import { useContext } from 'react';
// import { SocketContext } from './SocketContext';


// window.addEventListener('scroll', () => {
//   const nav = document.querySelector('.navbar');
//   const userName = document.querySelector('.userName');
//   if (window.scrollY > 8) {
//     nav?.classList.add('bg-costom', 'shadow');
//     userName?.classList.add('text-warning');
//   } else {
//     nav?.classList.remove('bg-costom', 'shadow');
//     userName?.classList.remove('text-warning');
//   }
// });




// function Navbar() {
//   const socketContext = useContext(SocketContext);

//   const { logout, socket,notification, user ,clearNotification,setSelectedUser} = socketContext!


//   return <>
//     <nav className="navbar navbar-expand-lg navbar-light  bg-main  py-0 text-light   fixed-top shadow ">
//       <div className="container ">
//         <li data-aos="zoom-in-down" data-aos-duration="900"
//           className="nav-item list-unstyled">
//           <Link className="nav-link text-white cursor-pointer " to="home" >
//           </Link>
//         </li>   Chat Now
//      <i className="fa-solid fa-comment-dots text-warning"></i>
//         <ul className=" d-flex  mb-0 mt-1   me-auto">
//           <li 
//             className="nav-item list-unstyled mx-1">
//             <Link className="nav-link active text-white   rounded-2 p-1 " aria-current="page"
//               to="home">Home
//             </Link>
//           </li>
//           <li 
//             className="nav-item list-unstyled mx-1">
//             <Link className="nav-link active text-white   rounded-2 p-1 " aria-current="page"
//               to="users">Users
//             </Link>
//           </li>
           

//           {socket?.connected ? null
//           : <>
//             <li
//               className="nav-item list-unstyled">
//               <Link className="nav-link text-white   rounded-2 p-1 " to="login">login
//               </Link>
//             </li>
//             <li
//               className="nav-item list-unstyled">
//               <Link className="nav-link text-white   rounded-2 p-1 " to="register">Register
//               </Link>
//             </li>

//           </>}




//         </ul>
// {socket?.connected ?
//  <ul className="navbar-nav d-flex  justify-content-end w-50 align-items-center flex-row ms-auto">
           
//         {/* تنبيه الرسالة الجديدة */}
     
// {notification && (
//   <div 
//     className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3 animate__animated animate__bounceInDown" 
//     style={{ width: '90%', maxWidth: '400px', cursor: 'pointer' }}
//     onClick={() => {
//       // 1. استخراج الـ ID الخاص بالمرسل من التنبيه
//       // ملاحظة: تأكد أن السوكيت بيبعت senderId جوه الـ notification في الكونتكس
//       const senderId = (notification as any).senderId; 
//       if (senderId) {
//         setSelectedUser(senderId); // فتح الشات مع المرسل
//         clearNotification(); // مسح التنبيه
//       }
//     }}
//   >
//     <div className="alert alert-primary shadow-lg border-0 rounded-pill d-flex align-items-center justify-content-between py-2 px-4 hover-shadow">
//       <div className="d-flex align-items-center overflow-hidden">
//         <i className="fa-solid fa-bell-concierge text-warning me-2"></i>
//         <span className="small text-truncate">
//           <strong>{notification.senderName}:</strong> {notification.msg}
//         </span>
//       </div>
//       <button 
//         onClick={(e) => {
//           e.stopPropagation(); // منع انتقال الضغطة للحاوية الكبيرة
//           clearNotification();
//         }} 
//         className="btn-close ms-2" 
//         style={{ fontSize: '0.7rem' }}
//       ></button>
//     </div>
//   </div>
// )}
        
//         {/* باقي محتوى الناف بار */}
//             <div className="fw-bold text-dark small mb-0">
//                 <Link to="/profile" className="text-decoration-none d-flex align-items-center text-dark">
//                   <div className="rounded-circle overflow-hidden border border-primary" style={{ width: '35px', height: '35px' }}>
//                     {user?.fulluserImage ? (
//                       <img 
//                         src={user.fulluserImage} 
//                         alt="profile" 
//                         className="w-100 h-100 object-fit-cover" 
//                         onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com' }} 
//                       />
//                     ) : (
//                       <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
//                         <i className="fa-solid fa-user text-secondary"></i>
//                       </div>
//                     )}
//                   </div>
//                   <span className="ms-2 fw-bold small text-truncate userName" style={{ maxWidth: '100px' }}>
//                     {user?.name || "Guest"}
//                   </span>
//                 </Link>
   
//             </div>
//             <div className='mx-3'>
//               <li
//               className="nav-item text-white  ">
//               <span
//                 onClick={logout}
//                 className='nav-link btn btn-light text-white fw-bold cursor-pointer    rounded-2 py-1 '>Logout</span>
//             </li></div>
            
//           </ul>: null}


//       </div>
//     </nav>

//   </>
// }

// export default Navbar



import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';
import {  useContext, useEffect } from 'react';
import { SocketContext } from './SocketContext';

// منطق تغيير لون الناف بار عند السكرول
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 8) {
    nav?.classList.add('bg-costom', 'shadow');
  } else {
    nav?.classList.remove('bg-costom', 'shadow');
  }
});

function Navbar() {
  const socketContext = useContext(SocketContext);
  
  // تأكد من عمل check بسيط لتجنب errors إذا كان الكونتكس غير متاح
  if (!socketContext) return null;

  const { logout, user, notification, clearNotification, setSelectedUser } = socketContext;



  useEffect(() => {
  console.log(user?.fulluserImage);
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-main py-2 text-light fixed-top shadow">
        <div className="container d-flex align-items-center justify-content-between">
          
          {/* Logo Section */}
          <div className="d-flex align-items-center">
            <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="home">
              <span>Chat Now</span>
              <i className="fa-solid fa-comment-dots text-warning"></i>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            <li className="nav-item">
              <Link className="nav-link text-white p-1" to="home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white p-1" to="users">Users</Link>
            </li>
          </ul>

          {/* Auth Section: يظهر بناءً على وجود اليوزر */}
          <div className="d-flex align-items-center ms-auto">
            {!user ? (
              // إذا لم يسجل دخول: اظهر Login & Register
              <ul className="navbar-nav d-flex flex-row gap-2 mb-0">
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light btn-sm px-3 text-white border-0" to="login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-warning btn-sm px-3 text-dark fw-bold" to="register">Register</Link>
                </li>
              </ul>
            ) : (
              // إذا سجل دخول: اظهر Profile & Logout
              <div className="d-flex align-items-center gap-3">
                <Link to="/profile" className="text-decoration-none d-flex align-items-center text-white gap-2">
                  <div className="rounded-circle overflow-hidden border border-2 border-warning shadow-sm" style={{ width: '38px', height: '38px' }}>
                    {user.fulluserImage ? (
                      <img 
                        src={user.fulluserImage} 
                        alt="me" 
                        className="w-100 h-100 object-fit-cover" 
                      />
                    ) : (
                      <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-user text-white"></i>
                      </div>
                    )}
                  </div>
                  <span className="fw-bold small d-none d-md-inline userName">{user.name}</span>
                </Link>

                <button 
                  onClick={logout} 
                  className="btn btn-danger btn-sm rounded-pill px-3 fw-bold shadow-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification Toast - يظهر فوق الناف بار عند وجود رسالة */}
        {notification && (
          <div 
            className="position-absolute top-100 start-50 translate-middle-x mt-2 z-3 animate__animated animate__fadeInDown" 
            style={{ width: '90%', maxWidth: '350px', cursor: 'pointer' }}
            onClick={() => {
              if (notification.senderId) {
                setSelectedUser(notification.senderId);
                clearNotification();
              }
            }}
          >
            <div className="alert alert-warning shadow-lg border-0 rounded-4 d-flex align-items-center py-2 px-3">
              <i className="fa-solid fa-envelope-open-text me-2 fs-5 text-primary"></i>
              <div className="flex-grow-1 overflow-hidden">
                <p className="mb-0 small text-dark text-truncate">
                  <strong>{notification.senderName}:</strong> {notification.msg}
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); clearNotification(); }} className="btn-close ms-2" style={{ scale: '0.7' }}></button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
