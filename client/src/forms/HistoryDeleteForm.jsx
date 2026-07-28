import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, FormButtons } from '../components/FormFields.jsx';

export default function HistoryDeleteForm({ record, onDone }) {
  const { t, closeModal, toast } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    try {
      await api(`/api/history/${record.id}`, { method: 'DELETE', body: JSON.stringify(data) });
      closeModal();
      toast(t('delete'));
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <p className="full muted">{record.product_name}</p>
      <Field label={t('password')} name="password" type="password" required full />
      <FormButtons onClose={closeModal} submitLabel={t('delete')} danger />
    </form>
  );
}
