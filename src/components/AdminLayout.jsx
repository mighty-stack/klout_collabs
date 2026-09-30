import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wordmark, cx, ConfirmDialog } from './ui.jsx';
import { useAuth } from '../context/Auth.jsx';
import { api } from '../api/client.js';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const refreshStats = () => api('/admin/stats').then(setStats).catch(() => {});
  useEffect(() => { refreshStats(); }, []);

  return (
    <div className="adm">
      <aside className="rail">
        <Wordmark to="/admin/registrations" />
        <nav>
          <NavLink to="/admin/registrations" className={({ isActive }) => cx(isActive && 'on')}>
            Registrations {stats?.unseen > 0 && <span className="count-badge">{stats.unseen} new</span>}
          </NavLink>
          <NavLink to="/admin/opportunities" className={({ isActive }) => cx(isActive && 'on')}>Opportunities</NavLink>
          <NavLink to="/admin/options" className={({ isActive }) => cx(isActive && 'on')}>Categories and locations</NavLink>
          <NavLink to="/admin/admins" className={({ isActive }) => cx(isActive && 'on')}>Admins</NavLink>
        </nav>
        <div className="who">
          <b>{user.displayName}</b>
          <div className="row"><span>Admin</span><button className="link" onClick={() => setConfirmingLogout(true)}>Log out</button></div>
        </div>
      </aside>
      <Outlet context={{ refreshStats }} />
      {confirmingLogout && (
        <ConfirmDialog
          title="Log out?" message="You will need to log in again to access the admin dashboard." confirmLabel="Log out"
          danger={false} onClose={() => setConfirmingLogout(false)} onConfirm={logout}
        />
      )}
    </div>
  );
}
