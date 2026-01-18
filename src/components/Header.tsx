import type { UseAuthenticator } from '@aws-amplify/ui-react';
import type { AuthUser } from 'aws-amplify/auth';

type HeaderProps = {
  user: AuthUser | undefined;
  onSignOut: UseAuthenticator['signOut'] | undefined;
};

export const Header: React.FC<HeaderProps> = ({ user, onSignOut: signOut }) => {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">🧾 Smart Receipts</span>
          </div>
          <nav className="hidden md:flex gap-4 text-sm font-medium">
            <a
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Receipts
            </a>
            <a
              href="/statistics"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Statistics
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user?.signInDetails?.loginId && (
            <span className="text-xs text-slate-400 hidden sm:block">
              {user.signInDetails.loginId}
            </span>
          )}
          <button
            onClick={() => signOut?.()}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
