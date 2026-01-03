
import React from 'react';
import { type Video } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { VerifiedIcon } from './Icons';
import { useI18n } from '../contexts/I18nContext';

interface RelatedVideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const RelatedVideoCard: React.FC<RelatedVideoCardProps> = ({ video, onSelect, onChannelClick }) => {
  const { getUserById } = useAuth();
  const { language, t } = useI18n();
  const channel = getUserById(video.channelId);

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChannelClick(video.channelId);
  }

  const formatViews = (views: number) => {
    const formatter = new Intl.NumberFormat(language, { notation: 'compact', compactDisplay: 'short' });
    return `${formatter.format(views)} ${t('views')}`;
  };

  return (
    <div className="flex cursor-pointer group" onClick={() => onSelect(video)}>
      <div className="relative w-40 h-24 flex-shrink-0">
        <img src={video.thumbnailUrl} alt={video.title[language]} className="w-full h-full object-cover rounded-lg group-hover:rounded-none transition-all duration-200" />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      <div className="flex flex-col ml-3">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {video.title[language]}
        </h3>
        <div className="text-yt-light-gray text-xs mt-1 cursor-pointer hover:text-yt-text-primary flex items-center" onClick={handleChannelClick}>
            <span>{video.channelName}</span>
            {channel && channel.subscribers >= 100000 && <VerifiedIcon />}
        </div>
        <div className="text-yt-light-gray text-xs flex items-center mt-1">
          <span>{formatViews(video.views)}</span>
          <span className="mx-1 font-bold">&middot;</span>
          <span>{video.uploadedAt[language]}</span>
        </div>
      </div>
    </div>
  );
};

export default RelatedVideoCard;