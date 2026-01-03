
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const { currentUser } = useAuth();
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center text-yt-light-gray p-4 bg-yt-dark rounded-lg">
        {t('signInToComment')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-4">
      <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('addCommentPlaceholder')}
          className="bg-transparent border-b border-yt-border w-full focus:outline-none focus:border-yt-text-primary pb-1 resize-none"
          rows={1}
        />
        {text && (
          <div className="flex justify-end space-x-4 mt-2">
            <button type="button" onClick={() => setText('')} className="text-sm font-semibold px-4 py-2 hover:bg-yt-dark rounded-full">
              {t('cancel')}
            </button>
            <button type="submit" className="text-sm font-semibold px-4 py-2 bg-yt-interactive text-white rounded-full disabled:bg-yt-dark-gray" disabled={!text.trim()}>
              {t('comment')}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentForm;