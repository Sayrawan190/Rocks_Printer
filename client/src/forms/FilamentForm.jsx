import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, SelectField, FormButtons } from '../components/FormFields.jsx';

const MATERIALS = ['PLA', 'PLA+'];

export default function FilamentForm({ filament = null, onDone }) {
  const { t, users, closeModal, toast, navigate } = useApp();
  const checked = (id) => filament?.owners.map(Number).includes(id);

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    data.owners = fd.getAll('owners').map(Number);
    const id = filament?.id;
    try {
      await api(id ? `/api/filaments/${id}` : '/api/filaments', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
      closeModal();
      toast('Filament saved');
      navigate('inventory');
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('title')} name="name" defaultValue={filament?.name} required />
      <SelectField label={t('material')} name="material" defaultValue={filament?.material || 'PLA'}>
        {MATERIALS.map((v) => <option key={v} value={v}>{v}</option>)}
      </SelectField>
      
      <a className="btn secondary small full" href="https://www.amazon.sa/s?k=pla" target="_blank" rel="noreferrer">🛒 {t('shopOnAmazon')}</a>
      <a className="btn secondary small full" href="https://ar.aliexpress.com/w/wholesale-PLA.html?spm=a2g0o.home.search.0" target="_blank" rel="noreferrer">🛒 {t('AliExpress')}</a>
      <Field label={t('color')} name="color" defaultValue={filament?.color} required />
      <Field label={t('colorHex')} name="colorHex" type="color" defaultValue={filament?.color_hex || '#64748b'} />
      <Field label={t('totalWeight')} name="totalGrams" type="number" defaultValue={filament?.total_grams || 1000} required min="0.1" step="0.1" />
      <Field label={t('remainingWeight')} name="remainingGrams" type="number" defaultValue={filament?.remaining_grams ?? 1000} required min="0" step="0.1" />
      <Field label={t('price')} name="priceSar" type="number" defaultValue={filament?.price_sar} min="0" step="0.01" />
      <Field label={t('purchaseDate')} name="purchaseDate" type="date" defaultValue={filament?.purchase_date?.slice(0, 10) || ''} />
      <label className="full">
        <span>{t('owners')}</span>
        <div className="owner-badges">
          {users.map((u) => (
            <label key={u.id} className="check-row">
              <input type="checkbox" name="owners" value={u.id} defaultChecked={checked(u.id)} /> {u.display_name}
            </label>
          ))}
        </div>
      </label>
      <TextAreaField label={t('notes')} name="notes" defaultValue={filament?.notes} />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
