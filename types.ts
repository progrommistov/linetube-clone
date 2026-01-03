
export type Language = 'en' | 'ru';
export type MultilingualString = Record<Language, string>;
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  username: string; // This will also be the channel name
  avatarUrl: string;
  bannerUrl?: string;
  password?: string; // For simulated auth
  subscriptions: string[]; // Array of channel IDs (User IDs)
  isAdmin: boolean;
  subscribers: number;
}

export interface Video {
  id:string;
  thumbnailUrl: string;
  videoUrl: string;
  title: MultilingualString;
  channelId: string; // Link to User.id
  channelName: string; // Keep for display convenience
  channelAvatarUrl: string; // Keep for display convenience
  views: number;
  uploadedAt: MultilingualString;
  duration: string;
  description: MultilingualString;
  tags?: string[];
  isShorts?: boolean;
  mediaType: 'video' | 'audio';
}

export interface Comment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  likes: number;
  timestamp: MultilingualString;
}