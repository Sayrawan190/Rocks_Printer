import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, SelectField, FormButtons } from '../components/FormFields.jsx';

export default function HistoryForm({ record, onDone }) {
  const { t, closeModal, toast } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    try {
      await api(`/api/history/${record.id}`, { method: 'PUT', body: JSON.stringify(data) });
      closeModal();
      toast(t('save'));
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('product')} name="productName" defaultValue={record.product_name} required />
      <Field label={t('gramsUsed')} name="grams" type="number" defaultValue={record.grams} required min="0" step="0.1" />
      <SelectField label={t('result')} name="result" defaultValue={record.result}>
        {['Completed', 'Failed', 'Canceled'].map((v) => <option key={v} value={v}>{t(v.toLowerCase())}</option>)}
      </SelectField>
      <Field label={t('durationMinutes')} name="durationMinutes" type="number" defaultValue={record.duration_minutes} required min="0" />
      <TextAreaField label={t('note')} name="note" defaultValue={record.note} />
      <Field label={t('password')} name="password" type="password" required full />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
