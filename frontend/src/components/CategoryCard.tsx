'use client';

import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  count: number;
  color?: 'blue' | 'orange' | 'teal' | 'purple' | 'green' | 'red' | 'indigo' | 'pink' | 'yellow' | 'cyan';
}

const colorClasses = {
  blue: 'category-yacht',
  orange: 'category-part',
  teal: 'category-marina',
  purple: 'category-crew',
  green: 'bg-gradient-to-br from-green-400 to-green-600',
  red: 'bg-gradient-to-br from-red-400 to-red-600',
  indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
  yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  cyan: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
};

export default function CategoryCard({ icon, title, description, category, count, color = 'blue' }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings?category=${category}`);
  };

  return (
    <div
      className={`card-hover p-6 text-center cursor-pointer ${colorClasses[color].startsWith('bg-gradient') ? colorClasses[color] : colorClasses[color]}`}
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
