
import React, { useState, useEffect, useMemo } from 'react';
import VideoCard from './VideoCard';
import { type Video } from '../types';
import { useVideo } from '../contexts/VideoContext';
import CategoryBar from './CategoryBar';

interface HomePageProps {
  onSelectVideo: (video: Video) => void;
  onChannelClick: (channelId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectVideo, onChannelClick }) => {
  const { videos } = useVideo();
  const [shuffledVideos, setShuffledVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setShuffledVideos([...videos].sort(() => Math.random() - 0.5));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'All') {
      return shuffledVideos;
    }
    return shuffledVideos.filter(video => video.tags?.includes(selectedCategory.toLowerCase()));
  }, [selectedCategory, shuffledVideos]);
  
  const categories = ['All', 'Gaming', 'Music', 'Cartoons', 'Tech', 'Cooking', 'Travel', 'AI'];

  return (
    <>
      <CategoryBar categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 mt-6">
        {filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} onSelect={onSelectVideo} onChannelClick={onChannelClick} />
        ))}
      </div>
    </>
  );
};

export default HomePage;