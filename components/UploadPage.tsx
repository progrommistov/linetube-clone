
import React from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { useI18n } from '../contexts/I18nContext';
import { type Video } from '../types';

interface UploadPageProps {
  onUploadSuccess: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const { currentUser } = useAuth();
  const { addVideo } = useVideo();
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [activeTab, setActiveTab] = useState<'video' | 'shorts'>('video');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [useCustomThumbnail, setUseCustomThumbnail] = useState(false);
  const [error, setError] = useState('');

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentUser) {
      alert(t('mustBeLoggedInToUpload'));
      return;
    }

    if (!title.trim() || !videoFile) {
        setError(t('titleAndVideoRequired'));
        return;
    }
    
    if (useCustomThumbnail && !thumbnailFile) {
        setError(t('customThumbnailRequired'));
        return;
    }

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const videoUrl = URL.createObjectURL(videoFile);
    const thumbnailUrl = useCustomThumbnail && thumbnailFile 
      ? URL.createObjectURL(thumbnailFile)
      : `https://picsum.photos/seed/thumb_${Date.now()}/360/202`;
      
    const mediaType: Video['mediaType'] = videoFile.type.startsWith('audio/') ? 'audio' : 'video';

    addVideo({
      title: { en: title, ru: title },
      description: { en: description, ru: description },
      thumbnailUrl,
      videoUrl,
      channelId: currentUser.id,
      channelName: currentUser.username,
      channelAvatarUrl: currentUser.avatarUrl,
      tags: tagsArray,
      isShorts: activeTab === 'shorts',
      mediaType,
    });
    
    alert(t('videoUploadedSuccessfully'));
    onUploadSuccess();
  };
  
  const fileInputAccept = activeTab === 'shorts' ? 'video/*' : 'video/mp4,audio/mpeg';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t('uploadNewVideo')}</h1>
      
      <div className="flex border-b border-yt-border mb-6">
        <button 
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'video' ? 'border-b-2 border-yt-text-primary text-yt-text-primary' : 'text-yt-light-gray hover:text-yt-text-primary'}`}
        >
          {t('uploadVideoTab')}
        </button>
        <button 
          onClick={() => setActiveTab('shorts')}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'shorts' ? 'border-b-2 border-yt-text-primary text-yt-text-primary' : 'text-yt-light-gray hover:text-yt-text-primary'}`}
        >
          {t('uploadShortTab')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-yt-dark p-8 rounded-lg">
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium text-yt-light-gray mb-2">{t('videoFileLabel')}</label>
          <div className="flex items-center">
            <label htmlFor="videoFile" className="cursor-pointer bg-yt-dark-gray text-white font-semibold py-2 px-4 rounded-lg hover:bg-yt-dark transition-colors">
              {t('chooseFile')}
            </label>
            <input id="videoFile" name="videoFile" type="file" className="hidden" accept={fileInputAccept} onChange={handleVideoFileChange} />
            <span className="ml-4 text-sm text-yt-light-gray">{videoFile ? videoFile.name : t('noFileChosen')}</span>
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex items-center">
                <input
                    id="useCustomThumbnail"
                    type="checkbox"
                    checked={useCustomThumbnail}
                    onChange={(e) => setUseCustomThumbnail(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 bg-yt-black text-yt-interactive focus:ring-yt-interactive"
                />
                <label htmlFor="useCustomThumbnail" className="ml-2 block text-sm text-yt-light-gray">{t('useCustomThumbnail')}</label>
            </div>

            {useCustomThumbnail && (
                <div>
                    <label htmlFor="thumbnailFile" className="block text-sm font-medium text-yt-light-gray mb-2">{t('thumbnailFileLabel')}</label>
                    <div className="flex items-center">
                        <label htmlFor="thumbnailFile" className="cursor-pointer bg-yt-dark-gray text-white font-semibold py-2 px-4 rounded-lg hover:bg-yt-dark transition-colors">
                        {t('chooseFile')}
                        </label>
                        <input id="thumbnailFile" name="thumbnailFile" type="file" className="hidden" accept="image/*" onChange={handleThumbnailFileChange} />
                        <span className="ml-4 text-sm text-yt-light-gray">{thumbnailFile ? thumbnailFile.name : t('noFileChosen')}</span>
                    </div>
                </div>
            )}
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-yt-light-gray mb-1">{t('title')}</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-yt-light-gray mb-1">{t('description')}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-yt-light-gray mb-1">{t('tagsLabel')}</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('tagsPlaceholder')}
            className="bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button type="submit" className="w-full bg-yt-interactive text-white font-semibold py-3 rounded-lg hover:bg-yt-interactive-hover transition-colors">
            {t('uploadVideo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;