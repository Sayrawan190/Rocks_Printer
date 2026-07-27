import { useApp } from '../AppContext.jsx';
import { fmtNum } from '../i18n.js';

export default function FilamentOptions({ ownOnly = false }) {
  const { t, me, filaments, language } = useApp();
  const list = ownOnly ? filaments.filter((f) => f.owners.map(Number).includes(me.id)) : filaments;
  return (
    <>
      <option value="">{t('selectFilament')}</option>
      {list.map((f) => {
        const critical = (Number(f.remaining_grams) / Number(f.total_grams)) * 100 < 10;
        return (
          <option key={f.id} value={f.id} style={critical ? { color: 'var(--red)', fontWeight: 700 } : undefined}>
            {critical ? '⚠ ' : ''}{f.name} · {fmtNum(f.remaining_grams, language, 1)}g
          </option>
        );
      })}
    </>
  );
}
