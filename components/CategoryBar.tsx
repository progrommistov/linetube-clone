
import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useI18n();

  const categoryTranslations: Record<string, string> = {
    'All': t('all'),
    'Gaming': t('gaming'),
    'Music': t('music'),
    'Cartoons': t('cartoons'),
    'Tech': t('tech'),
    'Cooking': t('cooking'),
    'Travel': t('travel'),
    'AI': t('ai'),
  };

  const translateCategory = (category: string) => categoryTranslations[category] || category;

  return (
    <div className="sticky top-14 bg-yt-black z-30 py-2">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                        ? 'bg-yt-text-primary text-yt-black'
                        : 'bg-yt-dark hover:bg-yt-dark-gray text-yt-text-primary'
                    }`}
                >
                    {translateCategory(category)}
                </button>
            ))}
        </div>
    </div>
  );
};

export default CategoryBar;