
import React from 'react';
import { HomeIcon, ShortsIcon, SubscriptionsIcon, YouIcon, HistoryIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

interface SidebarProps {
    isOpen: boolean;
    onNavigate: (page: 'home' | 'developer' | 'channel' | 'shorts' | 'history', payload?: string) => void;
}

const DevIcon = () => (
    <svg className="w-6 h-6 text-yt-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
);


const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; isCompact: boolean }> = ({ icon, label, onClick, isCompact }) => (
    <button onClick={onClick} className="flex items-center px-2 py-3 w-full text-left rounded-lg hover:bg-yt-dark transition-colors text-yt-text-primary">
        <div className={`mx-auto ${isCompact ? '' : 'sm:mx-4'}`}>{icon}</div>
        {!isCompact && <span className="ml-4 text-sm font-medium whitespace-nowrap">{label}</span>}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => {
    const { currentUser } = useAuth();
    const { t } = useI18n();
    const isCompact = !isOpen;

    const handleYouClick = () => {
        if (currentUser) {
            onNavigate('channel', currentUser.id);
        } else {
            alert(t('signInToViewProfile'));
        }
    }

    return (
        <aside className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-yt-black transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-60' : 'w-20'}`}>
            <div className="p-2 sm:p-4">
                <nav className="flex flex-col space-y-1">
                    <SidebarItem icon={<HomeIcon />} label={t('home')} onClick={() => onNavigate('home')} isCompact={isCompact} />
                    <SidebarItem icon={<ShortsIcon />} label={t('shorts')} onClick={() => onNavigate('shorts')} isCompact={isCompact} />
                    <SidebarItem icon={<SubscriptionsIcon />} label={t('subscriptions')} isCompact={isCompact} />
                    <SidebarItem icon={<YouIcon />} label={t('you')} onClick={handleYouClick} isCompact={isCompact} />
                    <SidebarItem icon={<HistoryIcon />} label={t('history')} onClick={() => onNavigate('history')} isCompact={isCompact} />
                    {currentUser?.isAdmin && (
                        <>
                            <hr className="border-yt-border my-2" />
                            <SidebarItem icon={<DevIcon />} label={t('developerPanel')} onClick={() => onNavigate('developer')} isCompact={isCompact} />
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;