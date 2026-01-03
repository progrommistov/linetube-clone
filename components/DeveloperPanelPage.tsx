
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { type User, type Video } from '../types';
import { useI18n } from '../contexts/I18nContext';

const DeveloperPanelPage: React.FC = () => {
  const { users, updateUserSubscribers, deleteUser, toggleAdminStatus } = useAuth();
  const { videos, deleteVideo, editVideo, deleteVideosByChannel } = useVideo();
  const { t, language } = useI18n();
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newSubCount, setNewSubCount] = useState<string>('');
  
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', tags: '' });

  // User Management
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewSubCount(String(user.subscribers));
  };

  const handleSaveUser = (userId: string) => {
    const count = parseInt(newSubCount, 10);
    if (!isNaN(count)) {
      updateUserSubscribers(userId, count);
    }
    setEditingUser(null);
    setNewSubCount('');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(t('confirmUserDeletion'))) {
        deleteUser(userId);
        deleteVideosByChannel(userId);
    }
  };

  // Video Management
  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoForm({
        title: video.title[language],
        description: video.description[language],
        tags: video.tags?.join(', ') || ''
    });
  };
  
  const handleCancelEditVideo = () => {
    setEditingVideo(null);
    setVideoForm({ title: '', description: '', tags: '' });
  };

  const handleSaveVideo = () => {
    if (!editingVideo) return;
    const tagsArray = videoForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    const updatedTitle = { ...editingVideo.title, [language]: videoForm.title };
    const updatedDescription = { ...editingVideo.description, [language]: videoForm.description };

    editVideo(editingVideo.id, {
        title: updatedTitle,
        description: updatedDescription,
        tags: tagsArray,
    });
    handleCancelEditVideo();
  };
  
  const handleDeleteVideo = (videoId: string) => {
      if(window.confirm(t('confirmVideoDeletion'))) {
          deleteVideo(videoId);
      }
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      <h1 className="text-3xl font-bold">{t('developerPanel')}</h1>
      
      {/* User Management Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('manageUsers')}</h2>
        <div className="bg-yt-dark rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-yt-border">
            <thead className="bg-yt-dark-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yt-light-gray uppercase">{t('user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yt-light-gray uppercase">{t('subscribers')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yt-light-gray uppercase">{t('role')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-yt-light-gray uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yt-border">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" /><div className="ml-4"><div className="text-sm font-medium">{user.username}</div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap">{editingUser?.id === user.id ? <input type="number" value={newSubCount} onChange={(e) => setNewSubCount(e.target.value)} className="bg-yt-black w-24 border border-yt-border rounded-md px-2 py-1"/> : <span>{user.subscribers.toLocaleString(language)}</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.isAdmin ? <span className="px-2 text-xs font-semibold rounded-full bg-green-900 text-green-300">{t('admin')}</span> : <span className="px-2 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">{t('user')}</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    {editingUser?.id === user.id ? <button onClick={() => handleSaveUser(user.id)} className="text-indigo-400 hover:text-indigo-300">{t('save')}</button> : <button onClick={() => handleEditUser(user)} className="text-indigo-400 hover:text-indigo-300">{t('editSubs')}</button>}
                    <button onClick={() => toggleAdminStatus(user.id)} className="text-yellow-400 hover:text-yellow-300">{t('toggleAdmin')}</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Management Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('manageVideos')}</h2>
         <div className="bg-yt-dark rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-yt-border">
            <thead className="bg-yt-dark-gray">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yt-light-gray uppercase">{t('video')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yt-light-gray uppercase">{t('channel')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-yt-light-gray uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yt-border">
                {videos.map(video => (
                    <tr key={video.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <img className="h-9 w-16 rounded object-cover" src={video.thumbnailUrl} alt={video.title[language]} />
                                <div className="ml-4">
                                    <div className="text-sm font-medium line-clamp-2">{video.title[language]}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{video.channelName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                            <button onClick={() => handleEditVideo(video)} className="text-indigo-400 hover:text-indigo-300">{t('edit')}</button>
                            <button onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-400">{t('delete')}</button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={handleCancelEditVideo}>
          <div className="bg-yt-dark rounded-lg p-8 w-full max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold">{t('editVideo')}</h3>
            <div>
              <label className="text-sm">{t('title')}</label>
              <input type="text" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="mt-1 bg-yt-black border border-yt-border rounded-lg px-3 py-2 w-full" />
            </div>
             <div>
              <label className="text-sm">{t('description')}</label>
              <textarea value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})} rows={4} className="mt-1 bg-yt-black border border-yt-border rounded-lg px-3 py-2 w-full" />
            </div>
             <div>
              <label className="text-sm">{t('tagsLabel')}</label>
              <input type="text" value={videoForm.tags} onChange={e => setVideoForm({...videoForm, tags: e.target.value})} className="mt-1 bg-yt-black border border-yt-border rounded-lg px-3 py-2 w-full" />
            </div>
            <div className="flex justify-end space-x-4 pt-2">
                <button onClick={handleCancelEditVideo} className="px-4 py-2 bg-yt-dark-gray rounded-lg hover:bg-gray-600">{t('cancel')}</button>
                <button onClick={handleSaveVideo} className="px-4 py-2 bg-yt-interactive rounded-lg hover:bg-yt-interactive-hover">{t('saveChanges')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPanelPage;