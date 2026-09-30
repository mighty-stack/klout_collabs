import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Wordmark, cx, ConfirmDialog } from './ui.jsx';
import { useAuth } from '../context/Auth.jsx';
import { initial } from '../lib/format.js';

export default function MemberLayout() {
  const { user, logout } = useAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const theme = user.role === 'brand' ? 'b' : 'c';

  return (
    <>
      <header className="app-top">
        <Wordmark to="/app" />
        <div className="who">
          <div className={cx('avatar', theme, 'w-10 h-10 text-base')} aria-hidden="true">{initial(user.displayName)}</div>
          <div>
            <b>{user.displayName}</b>
            <small>{user.role === 'brand' ? 'Brand' : 'Creator'} &middot; {user.verificationStatus === 'verified' ? 'Verified' : user.verificationStatus}</small>
          </div>
          <button className="btn line sm" onClick={() => setConfirmingLogout(true)}>Log out</button>
        </div>
      </header>
      <div className="app-wrap">
        <h1>Your dashboard</h1>
        <p className="lede">Manage your profile and see what is available to verified members.</p>
        <nav className="tabbar" aria-label="Dashboard sections">
          <NavLink to="/app" end className={({ isActive }) => cx(isActive && 'on')}>Profile</NavLink>
          <NavLink to="/app/opportunities" className={({ isActive }) => cx(isActive && 'on')}>Opportunities</NavLink>
          <NavLink to="/app/about" className={({ isActive }) => cx(isActive && 'on')}>About Klout Collabs</NavLink>
        </nav>
        <Outlet />
      </div>
      {confirmingLogout && (
        <ConfirmDialog
          title="Log out?" message="You will need to log in again to access your dashboard." confirmLabel="Log out"
          danger={false} onClose={() => setConfirmingLogout(false)} onConfirm={logout}
        />
      )}
    </>
  );
}
