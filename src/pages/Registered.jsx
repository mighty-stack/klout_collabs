import { useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import PendingNotice from '../components/PendingNotice.jsx';

export default function Registered() {
  const { state } = useLocation();
  return (
    <AuthLayout heading="You are on the list." sub="Registration is by review. That keeps the list useful for everyone on it.">
      <PendingNotice code="registered" email={state?.email} />
    </AuthLayout>
  );
}
