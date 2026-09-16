import { useState, type KeyboardEvent } from 'react';
import { useMessages } from '../hooks';
import type { Employee } from '../types';
import {
  ChatBox,
  ChatBubble,
  ChatFeed,
  ChatMeta,
  Input,
  Panel,
  PanelHeader,
  PanelTitle,
  PrimaryButton,
} from './common';

interface ChatPanelProps {
  currentEmployee: Employee;
}

function ChatPanel({ currentEmployee }: ChatPanelProps) {
  const { messages, connected, sendMessage } = useMessages();
  const [draft, setDraft] = useState('');

  function sendChatMessage() {
    const nextMessage = draft.trim();
    if (!nextMessage) {
      return;
    }

    sendMessage({ employeeName: currentEmployee.name, text: nextMessage });
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendChatMessage();
    }
  }

  return (
    <Panel>
      <ChatBox>
        <PanelHeader>
          <PanelTitle>Chat</PanelTitle>
          <span style={{ color: connected ? '#16a34a' : '#64748b', fontSize: '0.8rem' }}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </PanelHeader>
        <ChatFeed>
          {messages.length === 0 ? (
            <div style={{ color: '#64748b' }}>No recent employee messages.</div>
          ) : (
            messages.map((message) => (
              <ChatBubble key={message.id}>
                <ChatMeta>
                  {message.employeeName}
                  {' '}
                  •
                  {' '}
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </ChatMeta>
                <div>{message.text}</div>
              </ChatBubble>
            ))
          )}
        </ChatFeed>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            style={{ flex: 1 }}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Broadcast a message..."
            onKeyDown={handleKeyDown}
          />
          <PrimaryButton onClick={sendChatMessage}>Send</PrimaryButton>
        </div>
      </ChatBox>
    </Panel>
  );
}

export default ChatPanel
