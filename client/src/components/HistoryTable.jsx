import { useApp } from '../AppContext.jsx';
import { fmtDate, fmtNum } from '../i18n.js';
import { Badge, Empty, ImageThumb } from './Shared.jsx';

export default function HistoryTable({ items, compact = false }) {
  const { t, language } = useApp();
  if (!items.length) return <Empty title={t('noHistory')} />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('product')}</th>
            <th>{t('owner')}</th>
            <th>{t('filament')}</th>
            <th>{t('result')}</th>
            <th>{t('gramsUsed')}</th>
            <th>{t('duration')}</th>
            <th>{t('date')}</th>
            {!compact && <><th>{t('note')}</th><th>{t('finishedBy')}</th></>}
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                <div className="product-cell">
                  <ImageThumb url={i.image_url} />
                  <strong>{i.product_name}</strong>
                </div>
              </td>
              <td>{i.owner_name}</td>
              <td>{i.filament_name || '—'}<br /><small className="muted">{i.filament_color || ''}</small></td>
              <td><Badge value={i.result} /></td>
              <td>{fmtNum(i.grams, language, 1)}g</td>
              <td>{fmtNum(i.duration_minutes, language)} {t('minutes')}</td>
              <td>{fmtDate(i.finished_at, language, true)}</td>
              {!compact && <><td>{i.note || '—'}</td><td>{i.finished_by_name || '—'}</td></>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
