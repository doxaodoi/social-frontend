import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://universe-mq1h.onrender.com");

    socketRef.current.on("connect", () =>
      console.log("🟢 Connected to UniVerse socket server")
    );

    socketRef.current.on("disconnect", () =>
      console.log("🔴 Disconnected from socket server")
    );

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
