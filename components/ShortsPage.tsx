
import React, { useEffect, useState, useRef } from 'react';
import { useVideo } from '../contexts/VideoContext';
import { type Video } from '../types';
import { LikeIcon, DislikeIcon, ShareIcon, VerifiedIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

interface ShortCardProps {
    video: Video;
    onChannelClick: (channelId: string) => void;
    isVisible: boolean;
}

const ShortCard: React.FC<ShortCardProps> = ({ video, onChannelClick, isVisible }) => {
    const { getUserById, currentUser, toggleSubscription } = useAuth();
    const { t, language } = useI18n();
    const channel = getUserById(video.channelId);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if(currentUser && channel) {
            setIsSubscribed(currentUser.subscriptions.includes(channel.id));
        }
    }, [currentUser, channel]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isVisible) {
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Ignore the AbortError which is thrown when the user scrolls away
                    // before the video has a chance to play.
                    if (error.name !== 'AbortError') {
                        console.error("Video play error:", error);
                    }
                });
            }
        } else {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
    }, [isVisible]);

    const handleSubscribe = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return alert(t('signInToSubscribe'));
        toggleSubscription(video.channelId);
    };

    return (
        <div className="snap-start relative w-full h-full rounded-2xl overflow-hidden">
            <video ref={videoRef} src={video.videoUrl} loop muted className="w-full h-full object-cover"></video>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full bg-gradient-to-t from-black/50 to-transparent">
                <p className="font-bold line-clamp-2">{video.title[language]}</p>
                <div className="flex items-center space-x-2 mt-2">
                    <img src={video.channelAvatarUrl} alt={video.channelName} className="w-8 h-8 rounded-full cursor-pointer" onClick={() => onChannelClick(video.channelId)} />
                    <div className="flex items-center cursor-pointer" onClick={() => onChannelClick(video.channelId)}>
                        <p className="text-sm font-semibold">@{video.channelName}</p>
                        {channel && channel.subscribers >= 100000 && <VerifiedIcon />}
                    </div>
                    <button onClick={handleSubscribe} className={`ml-2 text-sm font-bold px-3 py-1.5 rounded-full ${isSubscribed ? 'bg-white/20 text-white' : 'bg-white text-yt-black'}`}>
                        {isSubscribed ? t('subscribed') : t('subscribe')}
                    </button>
                </div>
            </div>
            <div className="absolute right-2 bottom-4 flex flex-col items-center space-y-4 text-white">
                <button className="flex flex-col items-center space-y-1">
                    <div className="bg-white/20 p-3 rounded-full"><LikeIcon /></div>
                    <span className="text-xs">{t('like')}</span>
                </button>
                <button className="flex flex-col items-center space-y-1">
                     <div className="bg-white/20 p-3 rounded-full"><DislikeIcon /></div>
                    <span className="text-xs">{t('dislike')}</span>
                </button>
                <button className="flex flex-col items-center space-y-1">
                     <div className="bg-white/20 p-3 rounded-full"><ShareIcon /></div>
                    <span className="text-xs">{t('share')}</span>
                </button>
            </div>
        </div>
    );
};


const ShortsPage: React.FC<{ onChannelClick: (channelId: string) => void; }> = ({ onChannelClick }) => {
    const { videos } = useVideo();
    const shortsVideos = videos.filter(v => v.isShorts);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleShortIndex, setVisibleShortIndex] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setVisibleShortIndex(index);
                    }
                });
            },
            {
                root: containerRef.current,
                threshold: 0.7, // 70% of the item must be visible
            }
        );

        const shortElements = containerRef.current?.querySelectorAll('.short-card');
        shortElements?.forEach(el => observer.observe(el));

        return () => {
            shortElements?.forEach(el => observer.unobserve(el));
        };
    }, [shortsVideos]);


    return (
        <div className="flex justify-center">
            <div ref={containerRef} className="h-[calc(100vh-8rem)] w-full max-w-[400px] flex flex-col snap-y snap-mandatory overflow-y-scroll scrollbar-hide space-y-4">
                {shortsVideos.map((video, index) => (
                    <div key={video.id} data-index={index} className="short-card h-full flex-shrink-0">
                         <ShortCard 
                            video={video} 
                            onChannelClick={onChannelClick}
                            isVisible={index === visibleShortIndex}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShortsPage;