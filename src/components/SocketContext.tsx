import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import api from "./api";

// --- دالة مساعدة لجلب الكوكي ---
const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

export interface OnlineUser {
    userId: string;
    name: string;
}

export interface MsgData {
    text: string;
    sender: string;
    imageUrl?: string;
    senderId: string;
    _id?: string; 
    receiverId: string;
    timestamps: string;
      createdAt?: string | Date; 
    seen: boolean; // 👈 إضافة حقل الحالة (مقروءة أم لا)
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    userImage?: string;
    fulluserImage?: string;
    createdAt?: string;
}

interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    messages: MsgData[];
    notification: { msg: string, senderName: string, senderId: string } | null;
    sendMsg: (msg: MsgData) => void;
    deleteMsg: (msg: MsgData) => void;
    deleteSenderMessages: () => void;
    userId: string;
    selectedUser: string | null;
    sendPrivateMsg: (msg: string, receiverId: string, imageUrl?: string) => void;
    setSelectedUser: (id: string | null) => void;
    onlineUsers: OnlineUser[];
    logout: () => Promise<void>;
    userName: string | undefined;
    getMyProfile: () => Promise<void>;
    setUsername: (name: string | undefined) => void;
    clearNotification: () => void;
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    updateUserData: (newData: Partial<UserData>) => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<MsgData[]>([]);
    const [userName, setUsername] = useState<string | undefined>();
    const [user, setUser] = useState<UserData | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [notification, setNotification] = useState<{ msg: string, senderName: string, senderId: string } | null>(null);

    const updateUserData = useCallback((newData: Partial<UserData>) => {
        setUser((prev) => {
            if (!prev) return newData as UserData;
            return { ...prev, ...newData };
        });
    }, []);

    const deleteMsg = useCallback((msg: MsgData) => {
        if (socket && msg._id) {
            socket.emit("delete_msg", { messageId: msg._id, receiverId: msg.receiverId });
        }
    }, [socket]);

    const deleteSenderMessages = useCallback(() => { 
        if (socket && selectedUser) {
            socket.emit("delete_sender_messages", { receiverId: selectedUser });
        }
    }, [socket, selectedUser]);

    const clearNotification = useCallback(() => setNotification(null), []);

    useEffect(() => {

           // حاول جلب الـ ID من الكوكي أو من LocalStorage كخيار بديل أضمن
    const id = getCookie("userId") || localStorage.getItem("userId") || "";
    
    if (!id) {
        console.log("No user ID found, socket will not connect.");
        return;
    }
        const myIdFromCookie = getCookie("userId") || localStorage.getItem("userId") || "";
        setUserId(myIdFromCookie);

        if (!myIdFromCookie) return;

        const newSocket = io("https://m2dd-chatserver.hf.space", {
            withCredentials: true,
            transports: ['websocket'],
            auth: { userId: myIdFromCookie ||localStorage.getItem("userId") },
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
            newSocket.emit("get_profile");
        });

        newSocket.on("profile_data", (data) => {
            const userData = data.user || data;
            setUser(userData);
            if (userData.name) setUsername(userData.name);
        });

        newSocket.on("profile_updated", (data) => {
            const updated = data.user || data;
            setUser(updated);
        });

        newSocket.on("get_history", (history: MsgData[]) => {
            setMessages(history);
        });

    
        newSocket.on("private_reply", (data: MsgData) => {
            setMessages((prev) => [...prev, data]);
            const incomingSenderId = String(data.senderId).replace(/['"]+/g, '');
            const currentUserId = String(myIdFromCookie).replace(/['"]+/g, '');

            if (incomingSenderId !== currentUserId) {
                setOnlineUsers((currentList) => {
                    const senderObj = currentList.find(u => 
                        String(u.userId).replace(/['"]+/g, '') === incomingSenderId
                    );
                    setNotification({ 
                        msg: data.text || "أرسل رسالة جديدة", 
                        senderName: senderObj ? senderObj.name : "مستخدم جديد",
                        senderId: incomingSenderId
                    });
                    return currentList;
                });
            }
        });

        newSocket.on("online_users", (users: OnlineUser[]) => setOnlineUsers(users));

        newSocket.on("message_deleted", ({ messageId }) => {
            setMessages((prev) => prev.filter(m => m._id !== messageId));
        });
          newSocket.on("messages_read", ({ readerId }) => {
  setMessages(prev => prev.map(m => {
    // إذا كان الشخص الذي فتح المحادثة (readerId) هو مستلم الرسالة، اجعلها مقروءة
    if (String(m.receiverId || m.receiverId).replace(/['"]+/g, '') === String(readerId)) {
      return { ...m, seen: true };
    }
    return m;
  }));
});

        newSocket.on("messages_read_update", ({ readBy }) => {
  setMessages((prev) =>
    prev.map((msg) => {
      // إذا كان مستلم هذه الرسالة هو الشخص الذي قرأها الآن (readBy)
      const msgReceiver = String(msg.receiverId || msg.receiverId || "").replace(/['"]+/g, '');
      const reader = String(readBy).replace(/['"]+/g, '');

      if (msgReceiver === reader) {
        return { ...msg, seen: true }; // تحديث الحالة في المصفوفة فوراً
      }
      return msg;
    })
  );
});



        setSocket(newSocket);

        return () => {
            newSocket.off("messages_read_update");
            newSocket.off("messages_read");
            newSocket.off("profile_data");
            newSocket.off("profile_updated");
            newSocket.off("private_reply"); // أضف هذه
            newSocket.off("get_history");   // أضف هذه
            newSocket.close();
        };
    }, [userId]); 

    const sendPrivateMsg = (msg: string, receiverId: string, imageUrl?: string) => {
        socket?.emit("private_msg", { 
            msg, 
            receiverId, 
            senderId: userId, 
            imageUrl: imageUrl || null
        });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket, isConnected, messages, clearNotification, sendPrivateMsg, notification,
            userId, sendMsg: (msg) => socket?.emit("chatMsg", msg), setSelectedUser, updateUserData,
            selectedUser, onlineUsers, logout, userName, setUsername,
            deleteMsg, deleteSenderMessages, getMyProfile: async () => { await api.get('/auth/getMe') }, user, setUser
        }}>
            {children}
        </SocketContext.Provider>
    );
}
