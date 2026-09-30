import { useState } from 'react';
import { Modal, Button } from '../../components/ui.jsx';
import { TextAreaField } from '../../components/fields.jsx';

export default function RejectModal({ name, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const go = async () => {
    setBusy(true);
    try {
      await onConfirm(reason.trim());
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={`Reject ${name}?`} onClose={onClose}
      footer={<>
        <button className="btn line" onClick={onClose} disabled={busy}>Cancel</button>
        <Button className="danger-solid" loading={busy} onClick={go}>Reject registration</Button>
      </>}
    >
      <p className="muted">The applicant will be emailed. Adding a reason helps them understand what to fix if they register again.</p>
      <TextAreaField label="Reason" optional value={reason} onChange={setReason} maxLength={500} placeholder="For example: could not confirm the business address." />
    </Modal>
  );
}
