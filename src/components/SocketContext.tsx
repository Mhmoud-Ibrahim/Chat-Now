import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import api from "./api";
import ChatLoader from "./ChatLoader";

// --- Interfaces ---
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
    seen: boolean;
}

export interface UserData {
    _id: string; // تأكد من استخدامه كـ _id كما في MongoDB
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
    setUsername: (name: string | undefined) => void;
    clearNotification: () => void;
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    updateUserData: (newData: Partial<UserData>) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    // 1. All States defined at the top level
    const [userId, setUserId] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<MsgData[]>([]);
    const [userName, setUsername] = useState<string | undefined>();
    const [user, setUser] = useState<UserData | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [notification, setNotification] = useState<{ msg: string, senderName: string, senderId: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // 2. Callbacks
    const updateUserData = useCallback((newData: Partial<UserData>) => {
        setUser((prev) => (prev ? { ...prev, ...newData } : (newData as UserData)));
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

    // 3. Effect #1: Authentication Check (Runs once on mount)
 useEffect(() => {
    const checkAuth = async () => {
        try {
            const res = await api.get("/auth/me"); 
            setUser(res.data.user);
            setUserId(res.data.user._id);
        } catch (err) {
            setUser(null);
            setUserId('');
            // 👈 إذا كنت في صفحة محمية (مثل البروفايل) والتوكن تمسح، اذهب للوجن
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };
    checkAuth();
}, []);


    // 4. Effect #2: Socket Management (Runs when userId changes)
    useEffect(() => {

    if (!userId || userId === '') {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        return;
    }
        const newSocket = io("https://m2dd-chatserver.hf.space", {
            withCredentials: true,
            transports: ['websocket'],
        });

          newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected via Token Cookie ✅");
    });

        newSocket.on("profile_data", (data) => {
            const userData = data.user || data;
            setUser(userData);
        });

        newSocket.on("get_history", (history: MsgData[]) => {
            setMessages(history);
        });

        newSocket.on("private_reply", (data: MsgData) => {
            setMessages((prev) => [...prev, data]);
            const incomingSenderId = String(data.senderId).replace(/['"]+/g, '');
            const currentUserId = String(userId).replace(/['"]+/g, '');

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
                if (String(m.receiverId).replace(/['"]+/g, '') === String(readerId)) {
                    return { ...m, seen: true };
                }
                return m;
            }));
        });

        newSocket.on("messages_read_update", ({ readBy }) => {
            setMessages((prev) =>
                prev.map((msg) => {
                    const msgReceiver = String(msg.receiverId || "").replace(/['"]+/g, '');
                    const reader = String(readBy).replace(/['"]+/g, '');
                    return msgReceiver === reader ? { ...msg, seen: true } : msg;
                })
            );
        });

        setSocket(newSocket);

        return () => {
            newSocket.off("messages_read_update");
            newSocket.off("messages_read");
            newSocket.off("private_reply");
            newSocket.off("get_history");
            newSocket.close();
        };
    }, [userId]); 

    // 5. Helper Methods
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
            setUser(null);
            setUserId('');
            socket?.disconnect();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // 6. Conditional Rendering (Must be AFTER all Hooks)
    if (loading) {
        return <ChatLoader/>; 
    }

    return (
        <SocketContext.Provider value={{
            socket, isConnected, messages, clearNotification, sendPrivateMsg, notification,
            userId, sendMsg: (msg) => socket?.emit("chatMsg", msg), setSelectedUser, updateUserData,
            selectedUser, onlineUsers, logout, userName, setUsername,
            deleteMsg, deleteSenderMessages, user, setUser,loading,setLoading
        }}>
            {children}
        </SocketContext.Provider>
    );
}
