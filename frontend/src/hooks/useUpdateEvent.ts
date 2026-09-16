import { useEffect } from 'react';
import { useSocket } from './useSocket';

export interface UpdateEventPayload {
  entity?: string;
  action?: string;
  id?: number;
  data?: unknown;
}

export function useUpdateEvent(eventEntity: string, refetchCallback: () => void) {
  const { socketRef } = useSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleUpdate = (payload: UpdateEventPayload) => {
      const entity = payload.entity?.toLowerCase();
      if (entity === eventEntity) {
        refetchCallback();
      }
    };

    socket.on('update', handleUpdate);

    return () => {
      socket.off('update', handleUpdate);
    };
  }, [eventEntity, refetchCallback, socketRef]);
}
