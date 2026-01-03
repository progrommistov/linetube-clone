
import React from 'react';
import { type Video } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { VerifiedIcon } from './Icons';
import { useI18n } from '../contexts/I18nContext';

interface HistoryVideoRowProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const HistoryVideoRow: React.FC<HistoryVideoRowProps> = ({ video, onSelectVideo, onChannelClick }) => {
  const { getUserById } = useAuth();
  const { language, t } = useI18n();
  const channel = getUserById(video.channelId);

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChannelClick(video.channelId);
  };
  
  const formatViews = (views: number) => {
    const formatter = new Intl.NumberFormat(language, { notation: 'compact', compactDisplay: 'short' });
    return `${formatter.format(views)} ${t('views')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 cursor-pointer group" onClick={() => onSelectVideo(video)}>
      <div className="relative w-full sm:w-60 md:w-80 flex-shrink-0">
        <img src={video.thumbnailUrl} alt={video.title[language]} className="w-full h-auto object-cover rounded-lg group-hover:rounded-none transition-all duration-200 aspect-video" />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium leading-snug line-clamp-2">
          {video.title[language]}
        </h3>
        <div className="text-yt-light-gray text-xs flex items-center mt-2">
          <span>{formatViews(video.views)}</span>
          <span className="mx-1.5 font-bold">&middot;</span>
          <span>{video.uploadedAt[language]}</span>
        </div>
        <div className="flex items-center space-x-2 mt-3 cursor-pointer" onClick={handleChannelClick}>
            <img src={video.channelAvatarUrl} alt={video.channelName} className="w-6 h-6 rounded-full" />
            <div className="text-yt-light-gray text-sm hover:text-yt-text-primary flex items-center">
                <span>{video.channelName}</span>
                {channel && channel.subscribers >= 100000 && <VerifiedIcon />}
            </div>
        </div>
        <p className="text-yt-light-gray text-sm mt-3 line-clamp-2">
            {video.description[language]}
        </p>
      </div>
    </div>
  );
};

export default HistoryVideoRow;