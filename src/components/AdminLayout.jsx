import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfirmDialog } from './ui.jsx';
import { useAuth } from '../context/Auth.jsx';
import { api } from '../api/client.js';
import ProjectNav from './ProjectNav.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const refreshStats = () => api('/admin/stats').then(setStats).catch(() => {});
  useEffect(() => { refreshStats(); }, []);

  return (
    <div className="adm">
      <ProjectNav user={user} unseen={stats?.unseen} onLogout={() => setConfirmingLogout(true)} />
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
