import {useCallback, useEffect, useState} from 'react'
import type {ChatMessage} from '../types'
import {useSocket} from './useSocket'

export type MessagePayload = Partial<Pick<ChatMessage, 'id' | 'createdAt'>> & Pick<ChatMessage, 'employeeName' | 'text'>

const buildMessage = (payload: MessagePayload): ChatMessage => ({
  id: payload.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  employeeName: payload.employeeName,
  text: payload.text,
  createdAt: payload.createdAt ?? new Date().toISOString(),
})

export function useMessages() {
  const {socketRef, connected} = useSocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) {
      return
    }

    const handleMessage = (payload: MessagePayload) => {
      setMessages((previous) => {
        const nextMessage = buildMessage(payload)
        return previous.some((message) => message.id === nextMessage.id) ? previous : [...previous, nextMessage]
      })
    }

    socket.on('message', handleMessage)
    return () => {
      socket.off('message', handleMessage)
    }
  }, [socketRef])

  const sendMessage = useCallback((payload: MessagePayload) => {
    const socket = socketRef.current
    if (!socket) {
      return
    }

    const nextMessage = buildMessage(payload)
    socket.emit('message', {employeeName: nextMessage.employeeName, text: nextMessage.text})
    setMessages((previous) => {
      if (previous.some((message) => message.id === nextMessage.id)) {
        return previous
      }

      return [...previous, nextMessage]
    })
  }, [socketRef])

  return {messages, connected, sendMessage}
}
