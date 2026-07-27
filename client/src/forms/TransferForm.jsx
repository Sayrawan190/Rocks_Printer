import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';

export default function TransferForm() {
  const { t, users, setMe, loadUsers, toast, navigate } = useApp();
  const candidates = users.filter((u) => !u.is_admin);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    if (!window.confirm(t('transferWarning'))) return;
    try {
      await api('/api/admin/transfer', { method: 'POST', body: JSON.stringify({ userId: Number(data.userId) }) });
      const { user } = await api('/api/me');
      setMe(user);
      await loadUsers();
      toast('Admin transferred');
      navigate('home');
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <select name="userId">
        {candidates.map((u) => <option key={u.id} value={u.id}>{u.display_name}</option>)}
      </select>
      <button className="btn warning wide" type="submit">{t('transfer')}</button>
    </form>
  );
}
