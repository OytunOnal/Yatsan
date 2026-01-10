'use client';

import { useState } from 'react';

interface ContactButtonsProps {
  phone: string;
  sellerId: string;
}

export default function ContactButtons({ phone, sellerId }: ContactButtonsProps) {
  const [showPhone, setShowPhone] = useState(false);

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    alert('Mesaj gönderme özelliği yakında eklenecek');
  };

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleMessage}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Mesaj Gönder
      </button>

      {showPhone ? (
        <div className="w-full bg-gray-100 text-center py-3 px-4 rounded-lg">
          <span className="font-semibold">{phone}</span>
        </div>
      ) : (
        <button
          onClick={handleShowPhone}
          className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Telefonu Göster
        </button>
      )}
    </div>
  );
}