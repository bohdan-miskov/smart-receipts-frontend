import type { UseAuthenticator } from '@aws-amplify/ui-react';
import type { AuthUser } from 'aws-amplify/auth';

type HeaderProps = {
  user: AuthUser | undefined;
  onSignOut: UseAuthenticator['signOut'] | undefined;
};

export const Header: React.FC<HeaderProps> = ({ user, onSignOut: signOut }) => {
  return (
    <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">🧾 Smart Receipts</span>
        <span className="text-xs text-slate-400 border-l border-slate-700 pl-2 ml-2">
          {user?.signInDetails?.loginId}
        </span>
      </div>
      <button
        onClick={signOut}
        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors"
      >
        Sign Out
      </button>
    </header>
  );
};
