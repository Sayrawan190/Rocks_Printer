import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, TextAreaField, SelectField, FormButtons } from '../components/FormFields.jsx';

const TYPES = ['Maintenance', 'Repair', 'Purchased Part', 'Upgrade', 'Cleaning', 'Calibration', 'Consumable Purchase', 'Other'];

export default function MaintenanceForm({ record = null, onDone }) {
  const { t, users, closeModal, toast, navigate, loadNotifications } = useApp();
  const amountFor = (id) => record?.payments.find((p) => p.user_id === id)?.amount || 0;

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    data.payments = users
      .map((u) => ({ userId: u.id, amount: Number(fd.get(`payment_${u.id}`) || 0) }))
      .filter((p) => p.amount > 0);
    const id = record?.id;
    try {
      await api(id ? `/api/maintenance/${id}` : '/api/maintenance', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
      closeModal();
      toast('Maintenance saved');
      navigate('maintenance');
      await loadNotifications();
      onDone();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Field label={t('title')} name="title" defaultValue={record?.title} required />
      <SelectField label={t('type')} name="type" defaultValue={record?.type || 'Maintenance'}>
        {TYPES.map((v) => <option key={v} value={v}>{t(v.toLowerCase())}</option>)}
      </SelectField>
      <Field label={t('date')} name="date" type="date" defaultValue={record?.maintenance_date?.slice(0, 10) || new Date().toISOString().slice(0, 10)} required />
      <Field label={t('printer')} name="printerName" defaultValue={record?.printer_name || 'Ender 3 V3 SE'} required />
      <Field label={t('totalCost')} name="totalCost" type="number" defaultValue={record?.total_cost || 0} required min="0" step="0.01" />
      <Field label={t('store')} name="storeName" defaultValue={record?.store_name} />
      <Field label={t('invoiceLink')} name="invoiceLink" type="url" defaultValue={record?.invoice_link} />
      <Field label={t('receiptImage')} name="receiptImageUrl" type="url" defaultValue={record?.receipt_image_url} />
      <TextAreaField label={t('description')} name="description" defaultValue={record?.description} />
      <div className="full">
        <span className="muted">{t('responsible')} / {t('amountPaid')}</span>
        {users.map((u) => (
          <div key={u.id} className="payment-grid">
            <span>{u.display_name}</span>
            <input name={`payment_${u.id}`} type="number" min="0" step="0.01" defaultValue={amountFor(u.id)} />
          </div>
        ))}
        <small className="muted">{t('paymentsEqual')}</small>
      </div>
      <TextAreaField label={t('notes')} name="notes" defaultValue={record?.notes} />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
