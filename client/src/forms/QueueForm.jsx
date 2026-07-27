import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, SelectField, FormButtons } from '../components/FormFields.jsx';
import FilamentOptions from '../components/FilamentOptions.jsx';

export default function QueueForm({ item = null, start = false, onDone }) {
  const { t, closeModal, toast, navigate, loadNotifications } = useApp();
  const own = !start;

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const id = item?.id;
    const url = start ? `/api/queue/${id}/start` : id ? `/api/queue/${id}` : '/api/queue';
    const method = start ? 'POST' : id ? 'PUT' : 'POST';
    try {
      await api(url, { method, body: JSON.stringify(data) });
      closeModal();
      toast(start ? 'Print started' : 'Queue saved');
      navigate(start ? 'home' : 'queue');
      await loadNotifications();
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('product')} name="productName" defaultValue={item?.product_name} required />
      <SelectField label={t('filament')} name="filamentId" defaultValue={item?.filament_id ?? ''}>
        <FilamentOptions ownOnly={own} />
      </SelectField>
      <Field label={t('estimatedGrams')} name="estimatedGrams" type="number" defaultValue={item?.estimated_grams} required min="0.1" step="0.1" />
      <Field label={t('durationMinutes')} name="estimatedDurationMinutes" type="number" defaultValue={item?.estimated_duration_minutes || 60} required min="1" />
      <SelectField label={t('priority')} name="priority" defaultValue={item?.priority || 'Normal'}>
        {['Low', 'Normal', 'High'].map((v) => <option key={v} value={v}>{t(v.toLowerCase())}</option>)}
      </SelectField>
      <Field label={t('modelLink')} name="modelLink" type="url" defaultValue={item?.model_link} />
      <Field label={t('imageUrl')} name="imageUrl" type="url" defaultValue={item?.image_url} full />
      <TextAreaField label={t('notes')} name="notes" defaultValue={item?.notes} />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
