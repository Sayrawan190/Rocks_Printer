import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtNum, fmtDate } from '../i18n.js';
import { Badge, Empty, Loader, SummaryRow } from '../components/Shared.jsx';
import HistoryTable from '../components/HistoryTable.jsx';
import FinishForm from '../forms/FinishForm.jsx';

function Countdown({ current }) {
  const [label, setLabel] = useState('--:--:--');
  useEffect(() => {
    if (!current) { setLabel('--:--:--'); return; }
    function tick() {
      let ms = current.status === 'Paused'
        ? new Date(current.ends_at) - new Date(current.paused_at)
        : new Date(current.ends_at) - Date.now();
      ms = Math.max(0, ms);
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      setLabel([hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':'));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [current]);
  return <div className="countdown">{label}</div>;
}

function CurrentCard({ current, onChanged }) {
  const { t, me, language, toast, openModal, closeModal } = useApp();

  async function pauseResume(action) {
    try {
      await api(action === 'pause' ? '/api/current/pause' : '/api/current/resume', { method: 'POST' });
      onChanged();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function openFinish(result) {
    openModal(`${t('finish')} · ${t(result.toLowerCase())}`, <FinishForm result={result} onDone={onChanged} />);
  }

  if (!current) {
    return (
      <section className="card current-card">
        <div className="section-title">
          <h3>{t('currentPrinting')}</h3>
          <Badge value="Idle" />
        </div>
        <Empty title={t('noActivePrint')} text={t('queueHint')} />
      </section>
    );
  }

  return (
    <section className="card current-card">
      <div className="current-top">
        <div>
          <p className="eyebrow">{t('currentPrinting').toUpperCase()}</p>
          <h2>{current.product_name}</h2>
        </div>
        <Badge value={current.status} />
      </div>
      {current.image_url && <img className="item-image" src={current.image_url} alt="" />}
      <Countdown current={current} />
      <p className="muted">{t('timeRemaining')}</p>
      <div className="detail-grid">
        <div><small>{t('owner')}</small><b>{current.owner_name}</b></div>
        <div><small>{t('filament')}</small><b>{current.filament_name || '—'}</b></div>
        <div><small>{t('estimatedGrams')}</small><b>{fmtNum(current.estimated_grams, language, 1)}g</b></div>
        <div><small>{t('started')}</small><b>{fmtDate(current.started_at, language, true)}</b></div>
        <div><small>{t('estimatedFinish')}</small><b>{fmtDate(current.ends_at, language, true)}</b></div>
        <div><small>{t('duration')}</small><b>{fmtNum(current.duration_minutes, language)} {t('minutes')}</b></div>
      </div>
      {me?.is_admin && (
        <div className="current-actions">
          {current.status === 'Paused'
            ? <button className="btn success" onClick={() => pauseResume('resume')}>{t('resume')}</button>
            : <button className="btn warning" onClick={() => pauseResume('pause')}>{t('pause')}</button>}
          <button className="btn primary" onClick={() => openFinish('Completed')}>{t('finish')}</button>
          <button className="btn danger outline" onClick={() => openFinish('Failed')}>{t('fail')}</button>
          <button className="btn danger outline" onClick={() => openFinish('Canceled')}>{t('cancel')}</button>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const { t, language, toast } = useApp();
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    try {
      setData(await api('/api/dashboard'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <Loader />;
  const current = data.current;

  return (
    <>
      <div className="grid two-col">
        <CurrentCard current={current} onChanged={load} />
        <section className="card">
          <div className="section-title"><h3>{t('yourSummary')}</h3></div>
          <div className="bar-list">
            <SummaryRow label={t('requests')} value={data.profile.total_requests} />
            <SummaryRow label={t('activeQueue')} value={data.profile.active_queue} />
            <SummaryRow label={t('totalPrints')} value={data.profile.total_prints} />
            <SummaryRow label={t('successful')} value={data.profile.successful} />
            <SummaryRow label={t('failedPrints')} value={data.profile.failed} />
            <SummaryRow label={t('gramsUsed')} value={`${fmtNum(data.profile.grams, language, 1)}g`} />
          </div>
        </section>
      </div>
      <section className="card" style={{ marginTop: 17 }}>
        <div className="section-title"><h3>{t('recentPrints')}</h3></div>
        <HistoryTable items={data.recent} compact />
      </section>
    </>
  );
}
