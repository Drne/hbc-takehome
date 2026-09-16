import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useApiContext } from '../context/ApiContext';

const socketCache = new Map<string, Socket>();

export function useSocket() {
  const apiUrl = useApiContext();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket = socketCache.get(apiUrl);
    if (!socket) {
      socket = io(apiUrl, { transports: ['websocket'] });
      socketCache.set(apiUrl, socket);
    }

    socketRef.current = socket;
    setConnected(socket.connected);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [apiUrl]);

  return { socketRef, connected };
}
