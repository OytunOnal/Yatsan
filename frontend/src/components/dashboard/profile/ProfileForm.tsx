'use client';

import { useState, FormEvent } from 'react';
import { UserProfile } from '@/lib/api';

interface ProfileFormProps {
  profile: UserProfile | null;
  onSubmit: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }) => void;
}

export default function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad zorunludur';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (formData.phone && !/^[0-9+\s()-]*$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="label">
            Ad
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`input ${errors.firstName ? 'input-error' : ''}`}
            placeholder="Adınız"
          />
          {errors.firstName && (
            <p className="text-error-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="label">
            Soyad
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`input ${errors.lastName ? 'input-error' : ''}`}
            placeholder="Soyadınız"
          />
          {errors.lastName && (
            <p className="text-error-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label">
          E-posta
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? 'input-error' : ''}`}
          placeholder="ornek@email.com"
        />
        {errors.email && (
          <p className="text-error-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="label">
          Telefon
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`input ${errors.phone ? 'input-error' : ''}`}
          placeholder="+90 555 000 0000"
        />
        {errors.phone && (
          <p className="text-error-600 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </form>
  );
}
