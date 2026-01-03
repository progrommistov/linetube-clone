
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { type Language } from '../types';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    search: 'Search',
    signIn: 'Sign In',
    logout: 'Logout',
    home: 'Home',
    shorts: 'Shorts',
    subscriptions: 'Subscriptions',
    you: 'You',
    history: 'History',
    developerPanel: 'Developer Panel',
    signInToViewProfile: 'Please sign in to see your profile.',
    views: 'views',
    subscribers: 'subscribers',
    subscribed: 'Subscribed',
    subscribe: 'Subscribe',
    share: 'Share',
    comments: 'Comments',
    reply: 'Reply',
    signInToSubscribe: 'Please sign in to subscribe.',
    usernameError: 'Username must be at least 3 characters long.',
    passwordError: 'Password must be at least 3 characters long.',
    invalidCredentialsError: 'Invalid username or password.',
    usernameTakenError: 'Username already taken. Try logging in.',
    signUp: 'Sign Up',
    username: 'Username',
    enterUsername: 'Enter your username',
    password: 'Password',
    enterPassword: 'Enter your password',
    authDisclaimer: 'Disclaimer: This is a demo. Do not use real passwords.',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    signInToComment: 'Please sign in to leave a comment.',
    addCommentPlaceholder: 'Add a comment...',
    cancel: 'Cancel',
    comment: 'Comment',
    channelNotFound: 'Channel not found.',
    uploads: 'Uploads',
    noUploads: "This channel hasn't uploaded any videos yet.",
    mustBeLoggedInToUpload: 'You must be logged in to upload a video.',
    videoUploadedSuccessfully: 'Video uploaded successfully!',
    uploadNewVideo: 'Upload a new video',
    title: 'Title',
    description: 'Description',
    thumbnailUrl: 'Thumbnail URL', // Now used for label in Dev Panel
    tagsLabel: 'Tags (comma-separated)',
    tagsPlaceholder: 'e.g. gaming, review, tech',
    uploadVideo: 'Upload Video',
    searchResultsFor: 'Search results for',
    noResultsFoundFor: 'No results found for "{query}". Try another search.',
    manageUsers: 'Manage Users',
    user: 'User',
    role: 'Role',
    actions: 'Actions',
    admin: 'Admin',
    save: 'Save',
    editSubs: 'Edit Subs',
    toggleAdmin: 'Toggle Admin',
    delete: 'Delete',
    manageVideos: 'Manage Videos',
    video: 'Video',
    channel: 'Channel',
    edit: 'Edit',
    editVideo: 'Edit Video',
    saveChanges: 'Save Changes',
    confirmUserDeletion: 'Are you sure you want to delete this user and all their videos? This action cannot be undone.',
    confirmVideoDeletion: 'Are you sure you want to delete this video?',
    like: 'Like',
    dislike: 'Dislike',
    toggleTheme: 'Toggle Theme',
    // Categories
    all: 'All',
    gaming: 'Gaming',
    music: 'Music',
    cartoons: 'Cartoons',
    tech: 'Tech',
    cooking: 'Cooking',
    travel: 'Travel',
    ai: 'AI',
    // Channel Edit
    editChannel: 'Edit Channel',
    avatar: 'Avatar',
    banner: 'Banner',
    change: 'Change',
    usernameTakenSuggestions: 'Username "{username}" is taken. Try: {suggestions}',
    profileUpdated: 'Profile updated successfully!',
    // Upload Page v2 & v3
    uploadVideoTab: 'Upload Video',
    uploadShortTab: 'Upload Short',
    videoFileLabel: 'Video or Audio file (MP4, MP3)',
    thumbnailFileLabel: 'Thumbnail file',
    chooseFile: 'Choose file',
    noFileChosen: 'No file chosen',
    titleAndVideoRequired: 'Title and a video/audio file are required.',
    customThumbnailRequired: 'Please select a thumbnail file or uncheck the custom thumbnail option.',
    useCustomThumbnail: 'Use custom thumbnail',
    // History
    searchWatchHistory: 'Search watch history',
    clearWatchHistory: 'Clear all watch history',
    watchHistoryEmpty: 'This list has no videos.',
    confirmClearHistory: 'Are you sure you want to clear your entire watch history? This action cannot be undone.',
  },
  ru: {
    search: 'Поиск',
    signIn: 'Войти',
    logout: 'Выйти',
    home: 'Главная',
    shorts: 'Shorts',
    subscriptions: 'Подписки',
    you: 'Вы',
    history: 'История',
    developerPanel: 'Панель разработчика',
    signInToViewProfile: 'Пожалуйста, войдите, чтобы увидеть свой профиль.',
    views: 'просмотров',
    subscribers: 'подписчиков',
    subscribed: 'Вы подписаны',
    subscribe: 'Подписаться',
    share: 'Поделиться',
    comments: 'Комментарии',
    reply: 'Ответить',
    signInToSubscribe: 'Пожалуйста, войдите, чтобы подписаться.',
    usernameError: 'Имя пользователя должно быть не менее 3 символов.',
    passwordError: 'Пароль должен быть не менее 3 символов.',
    invalidCredentialsError: 'Неверное имя пользователя или пароль.',
    usernameTakenError: 'Имя пользователя уже занято. Попробуйте войти.',
    signUp: 'Регистрация',
    username: 'Имя пользователя',
    enterUsername: 'Введите имя пользователя',
    password: 'Пароль',
    enterPassword: 'Введите пароль',
    authDisclaimer: 'Дисклеймер: Это демонстрация. Не используйте настоящие пароли.',
    dontHaveAccount: 'Нет аккаунта?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    signInToComment: 'Пожалуйста, войдите, чтобы оставить комментарий.',
    addCommentPlaceholder: 'Оставьте комментарий...',
    cancel: 'Отмена',
    comment: 'Оставить комментарий',
    channelNotFound: 'Канал не найден.',
    uploads: 'Видео',
    noUploads: 'На этом канале пока нет видео.',
    mustBeLoggedInToUpload: 'Вы должны войти в систему, чтобы загрузить видео.',
    videoUploadedSuccessfully: 'Видео успешно загружено!',
    uploadNewVideo: 'Загрузить новое видео',
    title: 'Название',
    description: 'Описание',
    thumbnailUrl: 'URL обложки',
    tagsLabel: 'Теги (через запятую)',
    tagsPlaceholder: 'например, игры, обзор, технологии',
    uploadVideo: 'Загрузить видео',
    searchResultsFor: 'Результаты поиска по запросу',
    noResultsFoundFor: 'По запросу "{query}" ничего не найдено. Попробуйте другой запрос.',
    manageUsers: 'Управление пользователями',
    user: 'Пользователь',
    role: 'Роль',
    actions: 'Действия',
    admin: 'Админ',
    save: 'Сохранить',
    editSubs: 'Изм. подп.',
    toggleAdmin: 'Сменить роль',
    delete: 'Удалить',
    manageVideos: 'Управление видео',
    video: 'Видео',
    channel: 'Канал',
    edit: 'Редакт.',
    editVideo: 'Редактировать видео',
    saveChanges: 'Сохранить изменения',
    confirmUserDeletion: 'Вы уверены, что хотите удалить этого пользователя и все его видео? Это действие необратимо.',
    confirmVideoDeletion: 'Вы уверены, что хотите удалить это видео?',
    like: 'Нравится',
    dislike: 'Не нравится',
    toggleTheme: 'Переключить тему',
    // Categories
    all: 'Все',
    gaming: 'Игры',
    music: 'Музыка',
    cartoons: 'Мультфильмы',
    tech: 'Технологии',
    cooking: 'Кулинария',
    travel: 'Путешествия',
    ai: 'ИИ',
    // Channel Edit
    editChannel: 'Редактировать канал',
    avatar: 'Аватар',
    banner: 'Баннер',
    change: 'Изменить',
    usernameTakenSuggestions: 'Имя "{username}" занято. Попробуйте: {suggestions}',
    profileUpdated: 'Профиль успешно обновлен!',
    // Upload Page v2 & v3
    uploadVideoTab: 'Загрузить видео',
    uploadShortTab: 'Загрузить Short',
    videoFileLabel: 'Файл видео или аудио (MP4, MP3)',
    thumbnailFileLabel: 'Файл обложки',
    chooseFile: 'Выберите файл',
    noFileChosen: 'Файл не выбран',
    titleAndVideoRequired: 'Требуется название и файл видео/аудио.',
    customThumbnailRequired: 'Пожалуйста, выберите файл обложки или отключите эту опцию.',
    useCustomThumbnail: 'Использовать свою обложку',
    // History
    searchWatchHistory: 'Искать в истории просмотра',
    clearWatchHistory: 'Очистить всю историю просмотра',
    watchHistoryEmpty: 'В этом списке нет видео.',
    confirmClearHistory: 'Вы уверены, что хотите очистить всю историю просмотра? Это действие нельзя будет отменить.',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'yt-lang';

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
      try {
        const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return (storedLang === 'en' || storedLang === 'ru') ? storedLang : 'en';
      } catch {
        return 'en';
      }
  });

  useEffect(() => {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        console.error("Failed to save language to localStorage", error);
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || key;
    if (params) {
        Object.keys(params).forEach(paramKey => {
            translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
        });
    }
    return translation;
  };
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};