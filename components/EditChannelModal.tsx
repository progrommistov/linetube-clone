
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { type User } from '../types';
import { useVideo } from '../contexts/VideoContext';

interface EditChannelModalProps {
  user: User;
  onClose: () => void;
}

const EditChannelModal: React.FC<EditChannelModalProps> = ({ user, onClose }) => {
  const { updateUserProfile } = useAuth();
  const { updateChannelInfoOnVideos } = useVideo();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    username: user.username,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl || '',
  });
  const [error, setError] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.username.trim().length < 3) {
      setError(t('usernameError'));
      return;
    }
    
    const result = updateUserProfile(user.id, {
        username: formData.username,
        avatarUrl: formData.avatarUrl,
        bannerUrl: formData.bannerUrl,
    });

    if (result.success) {
        updateChannelInfoOnVideos(user.id, {
            newUsername: formData.username,
            newAvatarUrl: formData.avatarUrl,
        });
        alert(t('profileUpdated'));
        onClose();
    } else {
        setError(t('usernameTakenSuggestions', {
            username: formData.username,
            suggestions: result.suggestions?.join(', ') || ''
        }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-yt-dark rounded-lg p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6">{t('editChannel')}</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-yt-light-gray" htmlFor="username">{t('username')}</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleTextChange}
              className="mt-1 bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-yt-light-gray">{t('banner')}</label>
            <div className="mt-2 aspect-[16/5] w-full bg-yt-dark-gray rounded-lg relative overflow-hidden group">
                {formData.bannerUrl && <img src={formData.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />}
                <label htmlFor="bannerInput" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="font-semibold">{t('change')}</span>
                </label>
                <input id="bannerInput" name="bannerUrl" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'bannerUrl')} />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-yt-light-gray">{t('avatar')}</label>
            <div className="mt-2 flex items-center space-x-4">
                <div className="w-24 h-24 rounded-full bg-yt-dark-gray relative overflow-hidden group">
                    {formData.avatarUrl && <img src={formData.avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />}
                    <label htmlFor="avatarInput" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="font-semibold text-sm">{t('change')}</span>
                    </label>
                    <input id="avatarInput" name="avatarUrl" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatarUrl')} />
                </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm pt-1">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-yt-dark-gray rounded-lg hover:bg-gray-600">
                {t('cancel')}
            </button>
            <button type="submit" className="px-4 py-2 bg-yt-interactive text-white rounded-lg hover:bg-yt-interactive-hover">
                {t('saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChannelModal;