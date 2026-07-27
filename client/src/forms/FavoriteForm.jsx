import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, SelectField, FormButtons } from '../components/FormFields.jsx';
import FilamentOptions from '../components/FilamentOptions.jsx';

export default function FavoriteForm({ onDone }) {
  const { t, closeModal, toast, navigate } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    try {
      await api('/api/favorites', { method: 'POST', body: JSON.stringify(data) });
      closeModal();
      toast('Favorite saved');
      navigate('favorites');
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('product')} name="productName" required />
      <Field label={t('estimatedGrams')} name="estimatedGrams" type="number" min="0.1" step="0.1" />
      <SelectField label={t('preferredFilament')} name="filamentId">
        <FilamentOptions ownOnly />
      </SelectField>
      <Field label={t('tags')} name="tags" placeholder="phone, useful" />
      <Field label={t('modelLink')} name="modelLink" type="url" />
      <Field label={t('imageUrl')} name="imageUrl" type="url" />
      <TextAreaField label={t('notes')} name="notes" />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
