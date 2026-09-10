import { useApp } from '../AppContext.jsx';
import { fmtNum } from '../i18n.js';
import CostDetails from './CostDetails.jsx';

export default function CostCell({ record }) {
  const { t, language, openModal } = useApp();
  const cost = record.cost;
  if (!cost) return '—';
  const label = cost.isComplete ? `${fmtNum(cost.totalCost, language, 2)} ${cost.currency}` : t('costInformationMissing');
  return (
    <button className={`cost-button${cost.isComplete ? '' : ' incomplete'}`} onClick={() => openModal(t('printCostDetails'), <CostDetails cost={cost} result={record.result} />)}>
      {label}
    </button>
  );
}
