import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import type { ReactNode } from 'react';
import { Header } from '../Header';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.PUBLIC_USER_POOL_ID,
      userPoolClientId: import.meta.env.PUBLIC_USER_POOL_CLIENT_ID,
    },
  },
});

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen flex flex-col">
          <Header user={user} onSignOut={signOut} />
          <main className="flex-grow bg-slate-50">{children}</main>
        </div>
      )}
    </Authenticator>
  );
};
