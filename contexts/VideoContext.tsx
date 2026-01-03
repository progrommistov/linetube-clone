
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { type Video } from '../types';
import { MOCK_VIDEOS } from '../constants';

type NewVideoPayload = Omit<Video, 'id' | 'views' | 'uploadedAt' | 'duration' | 'tags' | 'isShorts'> & {
    tags?: string[];
    isShorts?: boolean;
};

interface VideoContextType {
  videos: Video[];
  addVideo: (videoPayload: NewVideoPayload) => void;
  getVideosByChannel: (channelId: string) => Video[];
  deleteVideo: (videoId: string) => void;
  editVideo: (videoId: string, updatedDetails: Partial<Pick<Video, 'title' | 'description' | 'tags'>>) => void;
  deleteVideosByChannel: (channelId: string) => void;
  updateChannelInfoOnVideos: (channelId: string, updates: { newUsername: string; newAvatarUrl: string }) => void;
  incrementViewCount: (videoId: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const VIDEOS_STORAGE_KEY = 'yt-videos';

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const storedVideos = localStorage.getItem(VIDEOS_STORAGE_KEY);
      if (!storedVideos) {
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(MOCK_VIDEOS));
        return MOCK_VIDEOS;
      }
      return JSON.parse(storedVideos);
    } catch (error) {
      console.error("Failed to parse videos from localStorage", error);
      return MOCK_VIDEOS;
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videos));
    } catch (error) {
        console.error("Failed to save videos to localStorage", error);
    }
  }, [videos]);

  const addVideo = (videoPayload: NewVideoPayload) => {
    const newVideo: Video = {
      ...videoPayload,
      id: `vid_${Date.now()}`,
      views: 0,
      uploadedAt: { en: 'Just now', ru: 'Только что' },
      duration: videoPayload.isShorts ? `0:${String(Math.floor(Math.random() * 45) + 15).padStart(2, '0')}` : `${Math.floor(Math.random() * 10)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      tags: videoPayload.tags || [],
      isShorts: videoPayload.isShorts || false,
    };
    setVideos(prevVideos => [newVideo, ...prevVideos]);
  };
  
  const getVideosByChannel = (channelId: string) => {
    return videos.filter(video => video.channelId === channelId);
  }

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  }

  const editVideo = (videoId: string, updatedDetails: Partial<Pick<Video, 'title' | 'description' | 'tags'>>) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, ...updatedDetails } : v));
  }

  const deleteVideosByChannel = (channelId: string) => {
    setVideos(prev => prev.filter(v => v.channelId !== channelId));
  }

  const updateChannelInfoOnVideos = (channelId: string, updates: { newUsername: string; newAvatarUrl: string }) => {
    setVideos(prevVideos => 
      prevVideos.map(video => {
        if (video.channelId === channelId) {
          return {
            ...video,
            channelName: updates.newUsername,
            channelAvatarUrl: updates.newAvatarUrl,
          };
        }
        return video;
      })
    );
  };
  
  const incrementViewCount = (videoId: string) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId ? { ...video, views: video.views + 1 } : video
      )
    );
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, getVideosByChannel, deleteVideo, editVideo, deleteVideosByChannel, updateChannelInfoOnVideos, incrementViewCount }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};