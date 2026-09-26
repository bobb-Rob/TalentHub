import React, { useEffect, useState } from 'react';
import { api, setToken, getToken } from './api.js';
import {
  SignIn, Discover, CreatorDetail, Briefs, BriefDetail, Contracts,
  ContractDetail, Money, LedgerPage,
} from './pages.jsx';

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
  const [tick, setTick] = useState(0);
  const [route, go] = useRoute();

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api('/me').then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);

  const signedIn = ({ token, user: u }) => {
    setToken(token);
    setUser(u);
    go(u.role === 'brand' ? '/discover' : '/briefs');
  };

  const signOut = () => { setToken(null); setUser(null); go('/'); };

  if (!ready) return null;
  if (!user) return <SignIn onSignedIn={signedIn} />;

  const isBrand = user.role === 'brand';
  const name = user.profile?.legal_name || user.profile?.display_name || user.email;

  const tabs = isBrand
    ? [['/discover', 'Find creators'], ['/briefs', 'Briefs'],
       ['/contracts', 'Contracts'], ['/ledger', 'Ledger']]
    : [['/briefs', 'Open briefs'], ['/contracts', 'My work'],
       ['/money', 'Money'], ['/discover', 'Creators']];

  const seg = route.split('/').filter(Boolean);
  let view;
  if (seg[0] === 'creators' && seg[1]) view = <CreatorDetail profileId={seg[1]} go={go} />;
  else if (seg[0] === 'briefs' && seg[1])
    view = <BriefDetail briefId={seg[1]} user={user} go={go} refresh={() => setTick(tick + 1)} />;
  else if (seg[0] === 'contracts' && seg[1])
    view = <ContractDetail contractId={seg[1]} user={user} go={go} refresh={() => setTick(tick + 1)} />;
  else if (seg[0] === 'briefs') view = <Briefs user={user} go={go} />;
  else if (seg[0] === 'contracts') view = <Contracts user={user} go={go} />;
  else if (seg[0] === 'discover') view = <Discover go={go} />;
  else if (seg[0] === 'money') view = <Money refresh={() => setTick(tick + 1)} />;
  else if (seg[0] === 'ledger') view = <LedgerPage />;
  else view = isBrand ? <Discover go={go} /> : <Briefs user={user} go={go} />;

  return (
    <>
      <div className="topbar">
        <div className="brand">TalentHub<span>MVP</span></div>
        <div className="nav">
          {tabs.map(([path, label]) => (
            <button key={path}
                    className={route.startsWith(path) ? 'on' : ''}
                    onClick={() => go(path)}>
              {label}
            </button>
          ))}
          <span className="who">
            {name} · {isBrand ? 'brand' : 'creator'}
          </span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div key={tick}>{view}</div>
    </>
  );
}
