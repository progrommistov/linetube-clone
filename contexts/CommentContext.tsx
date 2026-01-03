
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { type Comment } from '../types';
import { useAuth } from './AuthContext';

interface CommentContextType {
  comments: Comment[];
  getCommentsByVideoId: (videoId: string) => Comment[];
  addComment: (videoId: string, text: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

const COMMENTS_STORAGE_KEY = 'yt-comments';

export const CommentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
      return storedComments ? JSON.parse(storedComments) : [];
    } catch (error) {
      console.error("Failed to parse comments from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch (error) {
        console.error("Failed to save comments to localStorage", error);
    }
  }, [comments]);

  const getCommentsByVideoId = (videoId: string) => {
    return comments.filter(comment => comment.videoId === videoId).sort((a, b) => b.id.localeCompare(a.id)); // Newest first
  };

  const addComment = (videoId: string, text: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      videoId: videoId,
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatarUrl: currentUser.avatarUrl,
      text: text,
      likes: 0,
      timestamp: { en: 'Just now', ru: 'Только что' },
    };
    setComments(prevComments => [newComment, ...prevComments]);
  };

  return (
    <CommentContext.Provider value={{ comments, getCommentsByVideoId, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
};
