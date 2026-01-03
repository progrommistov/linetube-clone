
import React, { useState, useEffect } from 'react';
import { useVideo } from '../contexts/VideoContext';
import { type Video } from '../types';
import VideoCard from './VideoCard';
import { useI18n } from '../contexts/I18nContext';

interface SearchResultsPageProps {
  query: string;
  onSelectVideo: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, onSelectVideo, onChannelClick }) => {
  const { videos } = useVideo();
  const { t } = useI18n();
  const [results, setResults] = useState<Video[]>([]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filteredVideos = videos.filter(video => 
        video.title.en.toLowerCase().includes(lowercasedQuery) ||
        video.title.ru.toLowerCase().includes(lowercasedQuery) ||
        video.description.en.toLowerCase().includes(lowercasedQuery) ||
        video.description.ru.toLowerCase().includes(lowercasedQuery) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
      );
      setResults(filteredVideos);
    } else {
      setResults([]);
    }
  }, [query, videos]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {t('searchResultsFor')}: <span className="text-yt-light-gray">{query}</span>
      </h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
          {results.map(video => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onSelect={onSelectVideo} 
              onChannelClick={onChannelClick} 
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-yt-light-gray mt-10">{t('noResultsFoundFor', { query })}</p>
      )}
    </div>
  );
};

export default SearchResultsPage;