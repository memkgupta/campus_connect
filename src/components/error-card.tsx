// components/ErrorCard.tsx
import React from 'react';

interface ErrorCardProps {
  title: string;
  message: string;
  
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title, message}) => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-red-600">{title}</div>
        <p className="text-gray-700 text-base">
          {message}
        </p>
      </div>
      <div className="px-6 py-4">
       
      </div>
    </div>
  );
};

export default ErrorCard;
