
import React from 'react';
import { type Video } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { VerifiedIcon } from './Icons';
import { useI18n } from '../contexts/I18nContext';

interface VideoCardProps {
  video: Video;
  onSelect: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect, onChannelClick }) => {
  const { getUserById } = useAuth();
  const { language, t } = useI18n();
  const channel = getUserById(video.channelId);

  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onSelect for the video
    onChannelClick(video.channelId);
  }
  
  const formatViews = (views: number) => {
    const formatter = new Intl.NumberFormat(language, { notation: 'compact', compactDisplay: 'short' });
    return `${formatter.format(views)} ${t('views')}`;
  };
  
  return (
    <div>
      <div className="cursor-pointer group" onClick={() => onSelect(video)}>
        <div className="relative">
          <img src={video.thumbnailUrl} alt={video.title[language]} className="w-full h-auto rounded-xl group-hover:rounded-none transition-all duration-200 aspect-video object-cover" />
          <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {video.duration}
          </span>
        </div>
      </div>
      <div className="flex mt-3 space-x-3">
        <img 
          src={video.channelAvatarUrl} 
          alt={video.channelName} 
          className="w-9 h-9 rounded-full cursor-pointer"
          onClick={handleChannelClick}
        />
        <div className="flex flex-col">
          <h3 className="text-yt-text-primary text-base font-medium leading-snug break-words cursor-pointer line-clamp-2" onClick={() => onSelect(video)}>
            {video.title[language]}
          </h3>
          <div 
            className="text-yt-light-gray text-sm mt-1 cursor-pointer hover:text-yt-text-primary flex items-center"
            onClick={handleChannelClick}
          >
            <span>{video.channelName}</span>
            {channel && channel.subscribers >= 100000 && <VerifiedIcon />}
          </div>
          <div className="text-yt-light-gray text-sm flex items-center">
            <span>{formatViews(video.views)}</span>
            <span className="mx-1.5 font-bold">&middot;</span>
            <span>{video.uploadedAt[language]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;