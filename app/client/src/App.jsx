import React, { useEffect, useState } from 'react';
import { api, setToken, getToken } from './api.js';
import {
  SignIn, Discover, CreatorDetail, Briefs, BriefDetail, Contracts,
  ContractDetail, Money, LedgerPage,
} from './pages.jsx';
import { CreatorProfile, BrandProfile } from './profile.jsx';
import { AdminDisputes } from './admin.jsx';
import { NotificationBell } from './notifications.jsx';
import { Wordmark } from './components/ui.jsx';

/** A tiny hash router — enough for the MVP, no dependency. */
function useRoute() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => setHash(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (path) => { window.location.hash = path; };
  return [hash, go];
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [route, go] = useRoute();

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api('/me').then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  const signedIn = ({ token, user: u }) => {
    setToken(token);
    setUser(u);
    // A new account has no profile yet, and nothing else works without one.
    go(u.role === 'admin' ? '/disputes'
      : !u.profile ? '/profile' : u.role === 'brand' ? '/discover' : '/briefs');
  };

  const refreshUser = () => api('/me').then(setUser);
  const signOut = () => { setToken(null); setUser(null); go('/'); };

  if (!ready) return null;
  if (!user) return <SignIn onSignedIn={signedIn} />;

  const isBrand = user.role === 'brand';
  const isAdmin = user.role === 'admin';
  const name = user.profile?.trading_name || user.profile?.legal_name ||
               user.profile?.display_name || user.email;

  const tabs = isAdmin ? [['/disputes', 'Disputes'], ['/ledger', 'Ledger']]
    : isBrand
    ? [['/discover', 'Find creators'], ['/briefs', 'Briefs'],
       ['/contracts', 'Contracts'], ['/ledger', 'Ledger'], ['/profile', 'Organisation']]
    : [['/briefs', 'Open briefs'], ['/contracts', 'My work'],
       ['/money', 'Money'], ['/discover', 'Creators'], ['/profile', 'Profile']];

  const seg = route.split('/').filter(Boolean);
  const profilePage = isBrand
    ? <BrandProfile user={user} onSaved={refreshUser} />
    : <CreatorProfile user={user} onSaved={refreshUser} go={go} />;
  let view;
  // An administrator has no marketplace profile; everyone else needs one first.
  if (isAdmin) view = seg[0] === 'ledger' ? <LedgerPage /> : <AdminDisputes />;
  else if (!user.profile || seg[0] === 'profile') view = profilePage;
  else if (seg[0] === 'creators' && seg[1]) view = <CreatorDetail profileId={seg[1]} go={go} />;
  else if (seg[0] === 'briefs' && seg[1])
    view = <BriefDetail briefId={seg[1]} user={user} go={go} />;
  else if (seg[0] === 'contracts' && seg[1])
    view = <ContractDetail contractId={seg[1]} user={user} go={go} />;
  else if (seg[0] === 'briefs') view = <Briefs user={user} go={go} />;
  else if (seg[0] === 'contracts') view = <Contracts user={user} go={go} />;
  else if (seg[0] === 'discover') view = <Discover go={go} />;
  else if (seg[0] === 'money') view = <Money />;
  else if (seg[0] === 'ledger') view = <LedgerPage />;
  else view = isBrand ? <Discover go={go} /> : <Briefs user={user} go={go} />;

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <Wordmark />
          <nav className="nav">
            {(user.profile || isAdmin) && tabs.map(([path, label]) => (
              <button key={path}
                      className={route.startsWith(path) ? 'on' : ''}
                      onClick={() => go(path)}>
                {label}
              </button>
            ))}
          </nav>
          <div className="tools">
            <NotificationBell go={go} route={route} />
            <span className="who">
              <strong>{name}</strong>{user.role}
            </span>
            <button onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>
      <div key={route}>{view}</div>
    </>
  );
}
