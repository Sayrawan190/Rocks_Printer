import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtNum } from '../i18n.js';
import { Badge, Empty, FilterSelect, PageHead } from '../components/Shared.jsx';
import FilamentForm from '../forms/FilamentForm.jsx';
import FilamentLog from '../components/FilamentLog.jsx';

function filamentStatus(f) {
  return Number(f.remaining_grams) <= 0 ? 'Empty' : Number(f.remaining_grams) < 100 ? 'Low' : 'Normal';
}

export default function Inventory() {
  const { t, me, users, language, filaments, loadFilaments, toast, openModal } = useApp();
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState('');

  useEffect(() => { loadFilaments().catch((error) => toast(error.message, 'error')); }, [loadFilaments, toast]);

  const filtered = useMemo(() => filaments.filter((f) => [f.name, f.material, f.color, f.notes, (f.owner_details || []).map((o) => o.name).join(' ')]
    .join(' ').toLowerCase().includes(search.toLowerCase()) && (!owner || (f.owner_details || []).some((o) => o.name === owner))), [filaments, search, owner]);

  const available = useMemo(() => filtered.filter((f) => Number(f.remaining_grams) > 0), [filtered]);
  const finished = useMemo(() => filtered.filter((f) => Number(f.remaining_grams) <= 0), [filtered]);

  function openAdd() {
    openModal(t('addFilament'), <FilamentForm onDone={loadFilaments} />);
  }
  function openEdit(f) {
    openModal(t('edit'), <FilamentForm filament={f} onDone={loadFilaments} />);
  }
  function openLog(f) {
    openModal(`${t('viewLog')} · ${f.name}`, <FilamentLog filamentId={f.id} />);
  }

  async function handleDelete(id) {
    if (!window.confirm(`${t('delete')}?`)) return;
    try {
      await api(`/api/filaments/${id}`, { method: 'DELETE' });
      await loadFilaments();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  return (
    <>
      <PageHead
        title={t('inventoryTitle')}
        subtitle={t('inventorySubtitle')}
        action={me.is_admin ? <button className="btn primary" onClick={openAdd}>+ {t('addFilament')}</button> : null}
      />
      <div className="toolbar">
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
        </div>
        <FilterSelect value={owner} onChange={setOwner} list={users.map((u) => u.display_name)} allLabel={t('allOwners')} />
      </div>
      {!filtered.length ? <Empty title={t('noFilaments')} /> : (
        <>
          <div className="grid item-grid">
            {available.map((f) => renderCard(f))}
          </div>
          {Boolean(finished.length) && (
            <>
              <div className="section-title" style={{ marginTop: 26 }}><h3>{t('finishedFilaments')}</h3></div>
              <div className="grid item-grid">
                {finished.map((f) => renderCard(f))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );

  function renderCard(f) {
    const percent = Math.max(0, Math.min(100, (Number(f.remaining_grams) / Number(f.total_grams)) * 100));
    const status = filamentStatus(f);
    const critical = percent < 10;
    const price = f.price_sar ? Number(f.price_sar) / Number(f.total_grams) : null;
    return (
      <article key={f.id} className={`card item-card${critical ? ' critical-glow' : ''}`}>
        <div className="spool-head">
          <span className="color-dot" style={{ background: f.color_hex || '#64748b' }} />
          <div>
            <h3>{f.name}</h3>
            <span className="muted">{f.material} · {f.color}</span>
          </div>
        </div>
        <div className="owner-badges">
          {(f.owner_details || []).map((o) => <span key={o.id ?? o.name} className="mini-avatar" title={o.name}>{o.name[0]}</span>)}
        </div>
        <div>
          <div className="item-meta">
            <span>{t('remaining')}</span>
            <strong>{fmtNum(f.remaining_grams, language, 1)} / {fmtNum(f.total_grams, language, 1)}g</strong>
          </div>
          <div className={`progress ${status.toLowerCase()}`}><span style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="item-meta">
          <span>{t('pricePerGram')}</span>
          <strong>{price ? `${fmtNum(price, language, 3)} ${t('sar')}` : '—'}</strong>
        </div>
        <div className="item-meta">
          <span>{t('usage')}</span>
          <strong>{fmtNum(f.usage_count, language)}</strong>
        </div>
        <div><Badge value={status} /></div>
        <div className="item-actions">
          <button className="btn secondary small" onClick={() => openLog(f)}>{t('viewLog')}</button>
          {me.is_admin && (
            <>
              <button className="btn secondary small" onClick={() => openEdit(f)}>{t('edit')}</button>
              <button className="btn danger outline small" onClick={() => handleDelete(f.id)}>{t('delete')}</button>
            </>
          )}
        </div>
      </article>
    );
  }
}
