import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, SelectField, FormButtons } from '../components/FormFields.jsx';
import FilamentOptions from '../components/FilamentOptions.jsx';

export default function FavoriteQueueForm({ item, onDone }) {
  const { t, closeModal, toast, navigate } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    try {
      await api(`/api/favorites/${item.id}/to-queue`, { method: 'POST', body: JSON.stringify(data) });
      closeModal();
      toast('Added to queue');
      navigate('queue');
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <SelectField label={t('filament')} name="filamentId" defaultValue={item.preferred_filament_id ?? ''} full>
        <FilamentOptions ownOnly />
      </SelectField>
      <Field label={t('estimatedGrams')} name="estimatedGrams" type="number" defaultValue={item.estimated_grams} required min="0.1" step="0.1" />
      <Field label={t('durationMinutes')} name="estimatedDurationMinutes" type="number" defaultValue={60} required min="1" />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
