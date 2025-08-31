
import React from 'react';
import { Message } from '../types';

interface MessageBoxProps {
  message: Message | null;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
  if (!message || !message.text) {
    return null;
  }

  const baseClasses = 'mt-4 p-3 text-sm rounded-lg text-center';
  const typeClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[message.type]}`} role="alert">
      {message.text}
    </div>
  );
};

export default MessageBox;
