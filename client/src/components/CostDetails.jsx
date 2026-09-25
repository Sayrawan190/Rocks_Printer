import { useApp } from '../AppContext.jsx';
import { fmtMoney, fmtNum } from '../i18n.js';

function Amount({ value, currency }) {
  return <strong>{value === null || value === undefined ? '—' : `${fmtMoney(value, 2)} ${currency}`}</strong>;
}

export default function CostDetails({ cost, result }) {
  const { t, language } = useApp();
  const missingLabels = {
    filamentPrice: t('missingFilamentPrice'),
    filamentWeight: t('missingFilamentWeight')
  };
  const hasRisk = result === 'Completed' && cost.baseCost !== null;
  const title = result === 'Completed' ? t('adjustedProductionCost') : t('directPrintCost');

  return (
    <div className="cost-breakdown">
      {!cost.isComplete && (
        <p className="cost-warning">{t('costInformationMissing')}: {cost.missing.map((key) => missingLabels[key] || key).join('، ')}</p>
      )}
      <div className="cost-summary">
        <span>{t('duration')}</span>
        <strong>{fmtNum(cost.durationMinutes, language)} {t('minutes')} ({fmtNum(cost.durationHours, language, 2)} h)</strong>
      </div>
      <div className="cost-summary"><span>{t('filamentCost')}</span><Amount value={cost.filamentCost} currency={cost.currency} /></div>
      <div className="cost-summary"><span>{t('machineCost')}</span><Amount value={cost.machineCost} currency={cost.currency} /></div>
      <div className="cost-summary"><span>{t('electricityCost')}</span><Amount value={cost.electricityCost} currency={cost.currency} /></div>
      {hasRisk && <>
        <div className="cost-summary"><span>{t('baseProductionCost')}</span><Amount value={cost.baseCost} currency={cost.currency} /></div>
        <div className="cost-summary"><span>{t('ownerSuccessRate')}</span><strong>{fmtNum(cost.successRateUsed * 100, language, 1)}%</strong></div>
        <div className="cost-summary"><span>{t('failureRate')}</span><strong>{fmtNum((1 - cost.successRateUsed) * 100, language, 1)}%</strong></div>
        <div className="cost-summary"><span>{t('failureRiskCost')}</span><Amount value={cost.failureRiskCost} currency={cost.currency} /></div>
      </>}
      <div className="cost-total"><span>{title}</span><Amount value={cost.totalCost} currency={cost.currency} /></div>
      {result !== 'Completed' && <p className="muted cost-note">{t('failedPrintCostNote')}</p>}
    </div>
  );
}
