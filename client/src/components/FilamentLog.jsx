import { useEffect, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtDate, fmtNum } from '../i18n.js';
import { Badge, Empty } from './Shared.jsx';

export default function FilamentLog({ filamentId }) {
  const { t, language, toast } = useApp();
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    api(`/api/filaments/${filamentId}/logs`).then(setLogs).catch((error) => toast(error.message, 'error'));
  }, [filamentId, toast]);

  if (!logs) return null;
  if (!logs.length) return <Empty title={t('noData')} />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t('product')}</th>
            <th>{t('owner')}</th>
            <th>{t('gramsUsed')}</th>
            <th>{t('result')}</th>
            <th>{t('date')}</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.product_name}</td>
              <td>{l.owner_name || '—'}</td>
              <td>{fmtNum(l.grams, language, 1)}g</td>
              <td><Badge value={l.result} /></td>
              <td>{fmtDate(l.created_at, language, true)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
