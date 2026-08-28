import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, SelectField, TextAreaField, FormButtons } from '../components/FormFields.jsx';
import FilamentOptions from '../components/FilamentOptions.jsx';

export default function HistoryRequeueForm({ record, onDone }) {
  const { t, closeModal, toast, navigate } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    try {
      await api(`/api/history/${record.id}/requeue`, { method: 'POST', body: JSON.stringify(data) });
      closeModal();
      toast('Added to queue');
      navigate('queue');
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  const estimatedGrams = record.original_estimated_grams ?? (record.grams > 0 ? record.grams : '');
  const duration = record.original_duration_minutes ?? record.duration_minutes ?? 60;
  const priority = record.original_priority || 'Normal';
  const notes = record.original_notes ?? record.note ?? '';

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('product')} name="productName" defaultValue={record.product_name} required full />
      <SelectField label={t('filament')} name="filamentId" defaultValue={record.filament_id ?? ''}>
        <FilamentOptions ownOnly ownerId={record.owner_id} />
      </SelectField>
      <SelectField label={t('priority')} name="priority" defaultValue={priority}>
        {['Low', 'Normal', 'High'].map((v) => <option key={v} value={v}>{t(v.toLowerCase())}</option>)}
      </SelectField>
      <Field label={t('estimatedGrams')} name="estimatedGrams" type="number" defaultValue={estimatedGrams} required min="0.1" step="0.1" />
      <Field label={t('durationMinutes')} name="estimatedDurationMinutes" type="number" defaultValue={duration} required min="1" />
      <TextAreaField label={t('notes')} name="notes" defaultValue={notes} full />
      <FormButtons onClose={closeModal} submitLabel={t('addRequest')} />
    </form>
  );
}
