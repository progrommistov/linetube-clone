
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { type Video } from '../types';
import VideoCard from './VideoCard';
import { VerifiedIcon } from './Icons';
import { useI18n } from '../contexts/I18nContext';
import EditChannelModal from './EditChannelModal';

interface ChannelPageProps {
  channelId: string;
  onSelectVideo: (video: Video) => void;
}

const ChannelPage: React.FC<ChannelPageProps> = ({ channelId, onSelectVideo }) => {
  const { getUserById, currentUser, toggleSubscription } = useAuth();
  const { getVideosByChannel } = useVideo();
  const { t, language } = useI18n();
  
  const channel = getUserById(channelId);
  const channelVideos = getVideosByChannel(channelId);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser && channel) {
      setIsSubscribed(currentUser.subscriptions.includes(channel.id));
    } else {
      setIsSubscribed(false);
    }
  }, [currentUser, channel]);

  if (!channel) {
    return <div className="text-center text-xl mt-10">{t('channelNotFound')}</div>;
  }
  
  const handleSubscribeClick = () => {
    if (!currentUser) {
        alert(t('signInToSubscribe'));
        return;
    }
    toggleSubscription(channel.id);
  }

  return (
    <div className="w-full">
      <div className="w-full">
         {channel.bannerUrl ? (
          <img src={channel.bannerUrl} alt={`${channel.username}'s banner`} className="w-full h-32 md:h-48 object-cover" />
        ) : (
          <div className="h-32 md:h-48 bg-yt-dark-gray"></div>
        )}
      </div>
      <div className="px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16">
          <img src={channel.avatarUrl} alt={channel.username} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-yt-black" />
          <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-grow">
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-bold">{channel.username}</h1>
              {channel.subscribers >= 100000 && <VerifiedIcon />}
            </div>
            <p className="text-yt-light-gray text-sm">@{channel.username.toLowerCase().replace(/\s/g, '')} &middot; {channel.subscribers.toLocaleString(language)} {t('subscribers')}</p>
          </div>
          {currentUser?.id === channel.id ? (
             <button
                onClick={() => setIsEditModalOpen(true)}
                className="font-semibold px-4 py-2 rounded-full transition-colors bg-yt-dark-gray text-yt-text-primary hover:bg-yt-dark mt-4 sm:mt-0"
            >
              {t('editChannel')}
            </button>
          ) : (
            <button
                onClick={handleSubscribeClick}
                className={`font-semibold px-4 py-2 rounded-full transition-colors mt-4 sm:mt-0 ${
                    isSubscribed
                      ? 'bg-yt-dark-gray text-yt-text-primary hover:bg-yt-dark'
                      : 'bg-yt-text-primary text-yt-black hover:bg-yt-dark-gray'
                  }`}
            >
              {isSubscribed ? t('subscribed') : t('subscribe')}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 px-4 sm:px-8">{t('uploads')}</h2>
        {channelVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 px-4 sm:px-0">
            {channelVideos.map(video => (
              <VideoCard key={video.id} video={video} onSelect={onSelectVideo} onChannelClick={() => {}} />
            ))}
          </div>
        ) : (
          <p className="text-yt-light-gray text-center mt-10">{t('noUploads')}</p>
        )}
      </div>

       {isEditModalOpen && (
        <EditChannelModal 
          user={channel} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ChannelPage;