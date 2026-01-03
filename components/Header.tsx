
import React, { useState } from 'react';
import { MenuIcon, SearchIcon, MicIcon, VideoIcon, BellIcon, SunIcon, MoonIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
    onMenuClick: () => void;
    onSignInClick: () => void;
    onUploadClick: () => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSignInClick, onUploadClick, onSearch }) => {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };
  
  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'ru' : 'en');
  }

  return (
    <header className="bg-yt-black h-14 flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-yt-dark transition-colors">
          <MenuIcon />
        </button>
        <div className="flex items-center">
            <svg className="w-8 h-8 text-yt-brand" viewBox="0 0 28 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.336 3.056a3.483 3.483 0 00-2.454-2.47C22.64.002 14.002 0 14.002 0S5.362.002 3.12 0.586A3.483 3.483 0 00.666 3.056C0 5.24 0 9.8 0 9.8s0 4.56.666 6.744a3.483 3.483 0 002.454 2.47c2.242.584 10.88.584 10.88.584s8.642 0 10.88-.584a3.483 3.483 0 002.454-2.47C28 14.36 28 9.8 28 9.8s0-4.56-.664-6.744zM11.2 14V5.6l7.336 4.2L11.2 14z" />
            </svg>
            <span className="text-xl font-bold tracking-tighter ml-1">LineTube</span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex justify-center items-center max-w-2xl px-4">
        <form onSubmit={handleSearchSubmit} className="flex w-full">
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-yt-black border border-yt-border rounded-l-full px-4 py-2 w-full focus:outline-none focus:border-yt-interactive"
          />
          <button type="submit" className="bg-yt-dark-gray px-6 border-y border-r border-yt-border rounded-r-full hover:bg-yt-dark transition-colors">
            <SearchIcon />
          </button>
        </form>
        <button className="ml-4 p-2 rounded-full bg-yt-dark hover:bg-yt-dark-gray transition-colors">
          <MicIcon />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {currentUser && (
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-yt-dark transition-colors" aria-label={t('toggleTheme')}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        )}
        <button onClick={toggleLanguage} className="font-semibold p-2 rounded-full hover:bg-yt-dark transition-colors text-sm w-10 h-10 flex items-center justify-center">
            {language.toUpperCase()}
        </button>
        <button onClick={currentUser ? onUploadClick : onSignInClick} className="p-2 rounded-full hover:bg-yt-dark transition-colors">
          <VideoIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-yt-dark transition-colors">
          <BellIcon />
        </button>
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-8 h-8 rounded-full" />
            <button onClick={logout} className="text-sm bg-yt-dark-gray px-3 py-1.5 rounded-md hover:bg-yt-dark">{t('logout')}</button>
          </div>
        ) : (
          <button onClick={onSignInClick} className="bg-yt-interactive text-white font-semibold px-4 py-2 rounded-full hover:bg-yt-interactive-hover transition-colors">
            {t('signIn')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;