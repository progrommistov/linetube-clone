
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username.trim().length < 3) {
      setError(t('usernameError'));
      return;
    }
     if (password.length < 3) {
      setError(t('passwordError'));
      return;
    }

    let success = false;
    if (isLogin) {
      success = login(username, password);
      if (!success) {
        setError(t('invalidCredentialsError'));
      }
    } else {
      success = signup(username, password);
      if (!success) {
        setError(t('usernameTakenError'));
      }
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-yt-dark rounded-lg p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? t('signIn') : t('signUp')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-yt-light-gray" htmlFor="username">{t('username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('enterUsername')}
              className="mt-1 bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
              aria-label="Username"
            />
          </div>
           <div>
            <label className="text-sm font-medium text-yt-light-gray" htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              className="mt-1 bg-yt-black border border-yt-border rounded-lg px-4 py-3 w-full focus:outline-none focus:border-yt-interactive"
              aria-label="Password"
            />
          </div>
          {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
          <div className="pt-2">
            <button type="submit" className="w-full bg-yt-interactive text-white font-semibold py-3 rounded-lg hover:bg-yt-interactive-hover transition-colors">
              {isLogin ? t('signIn') : t('signUp')}
            </button>
          </div>
        </form>
         <p className="text-center text-xs text-yt-dark-gray mt-4">
            {t('authDisclaimer')}
        </p>
        <p className="text-center text-sm text-yt-light-gray mt-4">
          {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-yt-interactive hover:underline ml-1">
            {isLogin ? t('signUp') : t('signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;