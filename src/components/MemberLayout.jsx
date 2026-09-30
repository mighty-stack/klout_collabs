import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { ConfirmDialog } from './ui.jsx';
import { useAuth } from '../context/Auth.jsx';
import ProjectNav from './ProjectNav.jsx';

export default function MemberLayout() {
  const { user, logout } = useAuth();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  return (
    <>
      <ProjectNav user={user} onLogout={() => setConfirmingLogout(true)} />
      <div className="app-wrap">
        <h1>Your dashboard</h1>
        <p className="lede">Manage your profile and see what is available to verified members.</p>
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
