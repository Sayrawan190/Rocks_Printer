import { useEffect, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtNum } from '../i18n.js';
import { Loader, PageHead, StatCard, SummaryRow } from '../components/Shared.jsx';

export default function Statistics() {
  const { t, language, toast } = useApp();
  const [d, setD] = useState(null);
  const [dash, setDash] = useState(null);

  useEffect(() => {
    Promise.all([api('/api/statistics'), api('/api/dashboard')])
      .then(([stats, dashboard]) => { setD(stats); setDash(dashboard); })
      .catch((error) => toast(error.message, 'error'));
  }, [toast]);

  if (!d || !dash) return <Loader />;
  const c = dash.cards;

  return (
    <>
      <PageHead title={t('statisticsTitle')} subtitle={t('statisticsSubtitle')} />
      <div className="stats-grid grid">
        <StatCard label={t('printerStatus')} value={dash.current ? t(dash.current.status.toLowerCase()) : t('idle')} note={dash.current ? dash.current.product_name : t('noActivePrint')} icon="◉" />
        <StatCard label={t('queueCount')} value={fmtNum(c.queue.pending, language)} icon="☷" />
        <StatCard label={t('spools')} value={fmtNum(c.filaments.count, language)} note={`${fmtNum(c.filaments.grams, language, 1)} ${t('grams')}`} icon="◌" />
        <StatCard label={t('printsMonth')} value={fmtNum(c.history.month, language)} icon="↗" />
        <StatCard label={t('favoriteItems')} value={fmtNum(c.favorites, language)} icon="☆" />
        <StatCard label={t('canceledPrints')} value={fmtNum(d.global.canceled, language)} icon="×" />
      </div>
      <div className="stats-grid grid" style={{ marginTop: 17 }}>
        <StatCard label={t('totalPrints')} value={fmtNum(d.global.total, language)} icon="◉" />
        <StatCard label={t('successful')} value={fmtNum(d.global.successful, language)} icon="✓" />
        <StatCard label={t('failedPrints')} value={fmtNum(d.global.failed, language)} icon="!" />
        <StatCard label={t('totalConsumed')} value={`${fmtNum(d.global.grams, language, 1)}g`} icon="◌" />
        <StatCard label={t('mostUsedFilament')} value={d.top.filament || '—'} icon="◎" />
        <StatCard label={t('mostUsedColor')} value={d.top.color || '—'} icon="●" />
        <StatCard label={t('mostActiveUser')} value={d.top.active_user || '—'} icon="↗" />
        <StatCard label={t('maintenanceCost')} value={`${fmtNum(d.maintenance.total_cost, language, 2)} ${t('sar')}`} icon="⌘" />
      </div>
      <div className="grid two-col" style={{ marginTop: 17 }}>
        <section className="card">
          <div className="section-title"><h3>{t('userPerformance')}</h3></div>
          <div className="bar-list">
            {d.users.map((u) => (
              <div key={u.display_name} className="bar-row">
                <b>{u.display_name}</b>
                <div className="progress"><span style={{ width: `${u.success_rate}%` }} /></div>
                <span>{fmtNum(u.success_rate, language, 1)}%</span>
              </div>
            ))}
          </div>
          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>{t('owner')}</th>
                  <th>{t('totalPrints')}</th>
                  <th>{t('successful')}</th>
                  <th>{t('failedPrints')}</th>
                  <th>{t('canceledPrints')}</th>
                  <th>{t('gramsUsed')}</th>
                </tr>
              </thead>
              <tbody>
                {d.users.map((u) => (
                  <tr key={u.display_name}>
                    <td>{u.display_name}</td>
                    <td>{u.total_prints}</td>
                    <td>{u.successful}</td>
                    <td>{u.failed}</td>
                    <td>{u.canceled}</td>
                    <td>{fmtNum(u.grams, language, 1)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card">
          <div className="section-title"><h3>{t('maintenanceOverview')}</h3></div>
          <div className="grid two-col">
            <SummaryRow label={t('repairs')} value={d.maintenance.repairs} />
            <SummaryRow label={t('upgrades')} value={d.maintenance.upgrades} />
            <SummaryRow label={t('parts')} value={d.maintenance.parts} />
            <SummaryRow label={t('commonType')} value={d.maintenance.common_type ? t(d.maintenance.common_type.toLowerCase()) : '—'} />
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '20px 0' }} />
          <div className="bar-list">
            {d.payments.map((p) => (
              <SummaryRow key={p.display_name} label={`${t('totalPaid')} · ${p.display_name}`} value={`${fmtNum(p.paid, language, 2)} ${t('sar')}`} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
