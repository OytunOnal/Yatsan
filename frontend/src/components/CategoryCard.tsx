'use client';

import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  count: number;
  color?: 'blue' | 'orange' | 'teal' | 'purple';
}

const colorClasses = {
  blue: 'category-yacht',
  orange: 'category-part',
  teal: 'category-marina',
  purple: 'category-crew',
};

export default function CategoryCard({ icon, title, description, category, count, color = 'blue' }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings?category=${category}`);
  };

  return (
    <div
      className={`card-hover p-6 text-center cursor-pointer ${colorClasses[color]}`}
      onClick={handleClick}
    >
      <div className="w-16 h-16 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {description}
      </p>
      <div className="flex items-center justify-center gap-1">
        <span className="text-2xl font-bold text-gray-900">{count}</span>
        <span className="text-sm text-gray-600">ilan</span>
      </div>
    </div>
  );
}
