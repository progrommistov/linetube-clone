
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import VideoPage from './components/VideoPage';
import DeveloperPanelPage from './components/DeveloperPanelPage';
import AuthModal from './components/AuthModal';
import ChannelPage from './components/ChannelPage';
import UploadPage from './components/UploadPage';
import SearchResultsPage from './components/SearchResultsPage';
import ShortsPage from './components/ShortsPage';
import HistoryPage from './components/HistoryPage';
import { type Video } from './types';
import { useAuth } from './contexts/AuthContext';

type Page = 'home' | 'video' | 'developer' | 'channel' | 'upload' | 'search' | 'shorts' | 'history';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setCurrentPage('video');
    window.scrollTo(0, 0);
  };

  const navigateTo = (page: Page, payload?: string) => {
    setSelectedVideo(null);
    setSelectedChannelId(null);
    
    if (page === 'channel' && payload) {
      setSelectedChannelId(payload);
    }
    if (page === 'search' && payload) {
        setSearchQuery(payload);
    }
    
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'developer':
        return currentUser?.isAdmin ? <DeveloperPanelPage /> : <HomePage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'upload':
        return currentUser ? <UploadPage onUploadSuccess={() => navigateTo('home')} /> : <HomePage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'channel':
        return selectedChannelId ? <ChannelPage channelId={selectedChannelId} onSelectVideo={handleSelectVideo} /> : <HomePage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'video':
        return selectedVideo ? <VideoPage video={selectedVideo} onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} /> : <HomePage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'search':
        return <SearchResultsPage query={searchQuery} onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'shorts':
        return <ShortsPage onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'history':
        return <HistoryPage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
      case 'home':
      default:
        return <HomePage onSelectVideo={handleSelectVideo} onChannelClick={(id) => navigateTo('channel', id)} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        onMenuClick={toggleSidebar} 
        onSignInClick={() => setIsAuthModalOpen(true)} 
        onUploadClick={() => navigateTo('upload')}
        onSearch={(query) => navigateTo('search', query)}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onNavigate={navigateTo} />
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-60' : 'ml-20'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}