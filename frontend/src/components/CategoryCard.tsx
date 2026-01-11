'use client';

import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  count: number;
}

export default function CategoryCard({ icon, title, description, category, count }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings?category=${category}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-primary text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 mb-2">
        {description}
      </p>
      <p className="text-sm text-primary font-medium">
        {count}+ ilan
      </p>
    </div>
  );
}