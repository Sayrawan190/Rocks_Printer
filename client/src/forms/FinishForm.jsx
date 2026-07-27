import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, FormButtons } from '../components/FormFields.jsx';

export default function FinishForm({ result, onDone }) {
  const { t, closeModal, toast, loadFilaments, loadNotifications } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.result = result;
    try {
      await api('/api/current/finish', { method: 'POST', body: JSON.stringify(data) });
      closeModal();
      toast(`Print ${result}`);
      await Promise.all([loadFilaments(), loadNotifications()]);
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('actualGrams')} name="grams" type="number" defaultValue={0} required min="0" step="0.1" full />
      <TextAreaField label={t('resultNote')} name="note" full />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
