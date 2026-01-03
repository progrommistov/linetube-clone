
import React, { useState, useMemo } from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { useVideo } from '../contexts/VideoContext';
import { useI18n } from '../contexts/I18nContext';
import { type Video } from '../types';
import HistoryVideoRow from './HistoryVideoRow';
import { SearchIcon } from './Icons';

interface HistoryPageProps {
  onSelectVideo: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectVideo, onChannelClick }) => {
  const { history, clearHistory } = useHistory();
  const { videos } = useVideo();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const watchedVideos = useMemo(() => {
    return history
      .map(historyItem => videos.find(video => video.id === historyItem.videoId))
      .filter((video): video is Video => !!video);
  }, [history, videos]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) {
      return watchedVideos;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return watchedVideos.filter(video =>
      video.title.en.toLowerCase().includes(lowercasedQuery) ||
      video.title.ru.toLowerCase().includes(lowercasedQuery) ||
      video.channelName.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, watchedVideos]);

  const handleClearHistory = () => {
    if (window.confirm(t('confirmClearHistory'))) {
      clearHistory();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold mb-6">{t('history')}</h1>
        {watchedVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-yt-light-gray">{t('watchHistoryEmpty')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVideos.map(video => (
              <HistoryVideoRow
                key={video.id}
                video={video}
                onSelectVideo={onSelectVideo}
                onChannelClick={onChannelClick}
              />
            ))}
          </div>
        )}
      </div>
      <div className="w-full lg:w-80 lg:flex-shrink-0">
        <div className="sticky top-20">
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder={t('searchWatchHistory')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-yt-dark border border-yt-border rounded-full px-4 py-2 w-full pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                </div>
            </div>

            <button
            onClick={handleClearHistory}
            className="w-full text-center text-yt-interactive hover:text-yt-interactive-hover py-2"
            >
            {t('clearWatchHistory')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;