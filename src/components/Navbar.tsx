
import { Link } from 'react-router-dom'

import 'aos/dist/aos.css';

import { useContext } from 'react';
import { SocketContext } from './SocketContext';


window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  const userName = document.querySelector('.userName');
  if (window.scrollY > 8) {
    nav?.classList.add('bg-costom', 'shadow');
    userName?.classList.add('text-warning');
  } else {
    nav?.classList.remove('bg-costom', 'shadow');
    userName?.classList.remove('text-warning');
  }
});




function Navbar() {
  const socketContext = useContext(SocketContext);

  const { logout, socket,notification, user ,clearNotification,setSelectedUser} = socketContext!


  return <>
    <nav className="navbar navbar-expand-lg navbar-light  bg-main  py-0 text-light   fixed-top shadow ">
      <div className="container ">
        <li data-aos="zoom-in-down" data-aos-duration="900"
          className="nav-item list-unstyled">
          <Link className="nav-link text-white cursor-pointer " to="home" >
          </Link>
        </li>   Chat Now
     <i className="fa-solid fa-comment-dots text-warning"></i>
        <ul className=" d-flex  mb-0 mt-1   me-auto">
          <li 
            className="nav-item list-unstyled mx-1">
            <Link className="nav-link active text-white   rounded-2 p-1 " aria-current="page"
              to="home">Home
            </Link>
          </li>
          <li 
            className="nav-item list-unstyled mx-1">
            <Link className="nav-link active text-white   rounded-2 p-1 " aria-current="page"
              to="users">User
            </Link>
          </li>
            <li
              className="nav-item list-unstyled">
              <Link className="nav-link text-white   rounded-2 p-1 " to="chat">chat
              </Link>
            </li>

          {socket?.connected ? null
          : <>
            <li
              className="nav-item list-unstyled">
              <Link className="nav-link text-white   rounded-2 p-1 " to="login">login
              </Link>
            </li>
            <li
              className="nav-item list-unstyled">
              <Link className="nav-link text-white   rounded-2 p-1 " to="register">Register
              </Link>
            </li>

          </>}




        </ul>
{socket?.connected ?
 <ul className="navbar-nav d-flex  justify-content-end w-50 align-items-center flex-row ms-auto">
           
        {/* تنبيه الرسالة الجديدة */}
     
{notification && (
  <div 
    className="position-absolute top-0 start-50 translate-middle-x mt-3 z-3 animate__animated animate__bounceInDown" 
    style={{ width: '90%', maxWidth: '400px', cursor: 'pointer' }}
    onClick={() => {
      // 1. استخراج الـ ID الخاص بالمرسل من التنبيه
      // ملاحظة: تأكد أن السوكيت بيبعت senderId جوه الـ notification في الكونتكس
      const senderId = (notification as any).senderId; 
      if (senderId) {
        setSelectedUser(senderId); // فتح الشات مع المرسل
        clearNotification(); // مسح التنبيه
      }
    }}
  >
    <div className="alert alert-primary shadow-lg border-0 rounded-pill d-flex align-items-center justify-content-between py-2 px-4 hover-shadow">
      <div className="d-flex align-items-center overflow-hidden">
        <i className="fa-solid fa-bell-concierge text-warning me-2"></i>
        <span className="small text-truncate">
          <strong>{notification.senderName}:</strong> {notification.msg}
        </span>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation(); // منع انتقال الضغطة للحاوية الكبيرة
          clearNotification();
        }} 
        className="btn-close ms-2" 
        style={{ fontSize: '0.7rem' }}
      ></button>
    </div>
  </div>
)}
        
        {/* باقي محتوى الناف بار */}
            <div className="fw-bold text-dark small mb-0">
                <Link to="/profile" className="text-decoration-none d-flex align-items-center text-dark">
                  <div className="rounded-circle overflow-hidden border border-primary" style={{ width: '35px', height: '35px' }}>
                    {user?.fulluserImage ? (
                      <img 
                        src={user.fulluserImage} 
                        alt="profile" 
                        className="w-100 h-100 object-fit-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com' }} 
                      />
                    ) : (
                      <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                        <i className="fa-solid fa-user text-secondary"></i>
                      </div>
                    )}
                  </div>
                  <span className="ms-2 fw-bold small text-truncate userName" style={{ maxWidth: '100px' }}>
                    {user?.name || "Guest"}
                  </span>
                </Link>
   
            </div>
            <div className='mx-3'>
              <li
              className="nav-item text-white  ">
              <span
                onClick={logout}
                className='nav-link btn btn-light text-white fw-bold cursor-pointer    rounded-2 py-1 '>Logout</span>
            </li></div>
            
          </ul>: null}


      </div>
    </nav>

  </>
}

export default Navbar
