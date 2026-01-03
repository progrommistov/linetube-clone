
import React, { useState, useEffect } from 'react';
import { type Video } from '../types';
import { DislikeIcon, LikeIcon, LikeIconFilled, ShareIcon, VerifiedIcon } from './Icons';
import RelatedVideoCard from './RelatedVideoCard';
import CommentForm from './CommentForm';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { useI18n } from '../contexts/I18nContext';
import { useComment } from '../contexts/CommentContext';
import { useHistory } from '../contexts/HistoryContext';

interface VideoPageProps {
  video: Video;
  onSelectVideo: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const VideoPage: React.FC<VideoPageProps> = ({ video, onSelectVideo, onChannelClick }) => {
  const { currentUser, toggleSubscription, getUserById } = useAuth();
  const { videos, incrementViewCount } = useVideo();
  const { getCommentsByVideoId, addComment } = useComment();
  const { t, language } = useI18n();
  const { addToHistory } = useHistory();
  
  const videoComments = getCommentsByVideoId(video.id);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeState, setLikeState] = useState<'liked' | 'disliked' | null>(null);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const channel = getUserById(video.channelId);
  
  useEffect(() => {
    if (currentUser) {
      setIsSubscribed(currentUser.subscriptions.includes(video.channelId));
    } else {
      setIsSubscribed(false);
    }
    addToHistory(video.id);
  }, [currentUser, video.channelId, video.id, addToHistory]);

  useEffect(() => {
    const viewTimer = setTimeout(() => {
      incrementViewCount(video.id);
    }, 8000); // 8 seconds delay

    return () => {
      clearTimeout(viewTimer);
    };
  }, [video.id, incrementViewCount]);
  
  const formatViews = (views: number) => {
    return new Intl.NumberFormat(language, { notation: 'compact', maximumFractionDigits: 1 }).format(views);
  };

  const handleAddComment = (text: string) => {
    addComment(video.id, text);
  };

  const handleLikeClick = () => {
    const newLikeState = likeState === 'liked' ? null : 'liked';
    setLikeState(newLikeState);
    if (newLikeState === 'liked') {
        setIsAnimatingLike(true);
        setTimeout(() => setIsAnimatingLike(false), 500);
    }
  };

  const handleSubscribeClick = () => {
    if (!currentUser) {
        alert(t('signInToSubscribe'));
        return;
    }
    toggleSubscription(video.channelId);
  }
  
  const relatedVideos = videos.filter(v => v.id !== video.id && !v.isShorts).slice(0, 10);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-grow">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video src={video.videoUrl} poster={video.thumbnailUrl} controls autoPlay className="w-full h-full"></video>
        </div>
        <h1 className="text-2xl font-bold mt-4">{video.title[language]}</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
          <div className="flex items-center space-x-3">
            <img src={video.channelAvatarUrl} alt={video.channelName} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onChannelClick(video.channelId)} />
            <div className="cursor-pointer" onClick={() => onChannelClick(video.channelId)}>
              <div className="flex items-center">
                <p className="font-semibold">{video.channelName}</p>
                {channel && channel.subscribers >= 100000 && <VerifiedIcon />}
              </div>
              <p className="text-yt-light-gray text-sm">{channel?.subscribers.toLocaleString(language)} {t('subscribers')}</p>
            </div>
            <button 
                onClick={handleSubscribeClick}
                className={`font-semibold px-4 py-2 rounded-full ml-4 transition-colors ${
                    isSubscribed
                      ? 'bg-yt-dark-gray text-yt-text-primary hover:bg-yt-dark'
                      : 'bg-yt-text-primary text-yt-black hover:bg-gray-200'
                  }`}
            >
              {isSubscribed ? t('subscribed') : t('subscribe')}
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <div className="flex items-center bg-yt-dark rounded-full">
              <button 
                onClick={handleLikeClick}
                className={`flex items-center space-x-2 px-4 py-2 hover:bg-yt-dark-gray rounded-l-full transition-colors ${isAnimatingLike ? 'like-animate' : ''}`}
               >
                {likeState === 'liked' ? <LikeIconFilled /> : <LikeIcon />}
                <span>{formatViews(video.views / 10 + (likeState === 'liked' ? 1 : 0))}</span>
              </button>
              <div className="w-px h-6 bg-yt-dark-gray"></div>
              <button 
                onClick={() => setLikeState(likeState === 'disliked' ? null : 'disliked')}
                className="px-4 py-2 hover:bg-yt-dark-gray rounded-r-full transition-colors"
              >
                <DislikeIcon />
              </button>
            </div>
            <button className="flex items-center space-x-2 bg-yt-dark px-4 py-2 rounded-full hover:bg-yt-dark-gray transition-colors">
              <ShareIcon />
              <span>{t('share')}</span>
            </button>
          </div>
        </div>
        
        <div className="bg-yt-dark p-4 rounded-xl mt-4">
          <p className="font-semibold">{video.views.toLocaleString(language)} {t('views')} &nbsp; {video.uploadedAt[language]}</p>
          <p className="text-sm mt-2 whitespace-pre-wrap">{video.description[language]}</p>
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
                {video.tags.map(tag => (
                    <span key={tag} className="text-xs text-yt-interactive">#{tag}</span>
                ))}
            </div>
          )}
        </div>

        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">{videoComments.length} {t('comments')}</h2>
            <CommentForm onSubmit={handleAddComment} />
            <div className="space-y-6 mt-6">
                {videoComments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-4">
                        <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm">{comment.authorName}</span>
                                <span className="text-xs text-yt-light-gray">{comment.timestamp[language]}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                            <div className="flex items-center space-x-4 mt-2 text-yt-light-gray">
                                <button className="flex items-center space-x-1 hover:text-yt-text-primary">
                                    <LikeIcon />
                                    <span className="text-xs">{comment.likes > 0 && comment.likes}</span>
                                </button>
                                <button className="hover:text-yt-text-primary"><DislikeIcon /></button>
                                <button className="text-xs font-semibold hover:text-yt-text-primary">{t('reply')}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
      <div className="w-full lg:w-96 lg:flex-shrink-0">
        <div className="space-y-4">
            {relatedVideos.map(relatedVideo => (
                <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} onSelect={onSelectVideo} onChannelClick={onChannelClick} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;