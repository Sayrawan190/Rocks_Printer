import { useEffect, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { Field, FormButtons } from '../components/FormFields.jsx';

export default function PrinterCostSettingsForm() {
  const { t, closeModal, toast } = useApp();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api('/api/printer-cost-settings').then(setSettings).catch((error) => toast(error.message, 'error'));
  }, [toast]);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.minimumSuccessRate = Number(data.minimumSuccessRate) / 100;
    try {
      await api('/api/printer-cost-settings', { method: 'PUT', body: JSON.stringify(data) });
      closeModal();
      toast(t('save'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  if (!settings) return <p className="muted">…</p>;
  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <p className="muted full" style={{ margin: 0 }}>{t('printerCostSettingsHint')}</p>
      <Field label={t('printerPurchasePrice')} name="printerPurchasePrice" type="number" defaultValue={settings.printerPurchasePrice} min="0" step="0.01" required />
      <Field label={t('expectedPrinterLifetimeHours')} name="expectedPrinterLifetimeHours" type="number" defaultValue={settings.expectedPrinterLifetimeHours} min="1" step="1" required />
      <Field label={t('expectedMaintenanceCost')} name="expectedMaintenanceCost" type="number" defaultValue={settings.expectedMaintenanceCost} min="0" step="0.01" required />
      <Field label={t('averagePrinterPowerWatts')} name="averagePrinterPowerWatts" type="number" defaultValue={settings.averagePrinterPowerWatts} min="0" step="1" required />
      <Field label={t('electricityPricePerKwh')} name="electricityPricePerKwh" type="number" defaultValue={settings.electricityPricePerKwh} min="0" step="0.001" required />
      <Field label={t('minimumSuccessRate')} name="minimumSuccessRate" type="number" defaultValue={settings.minimumSuccessRate * 100} min="0.1" max="100" step="0.1" required />
      <Field label={t('currency')} name="currency" defaultValue={settings.currency} required />
      <FormButtons onClose={closeModal} />
    </form>
  );
}
