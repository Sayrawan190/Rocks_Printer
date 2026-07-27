import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtDate, fmtNum } from '../i18n.js';
import { Badge, Empty, FilterSelect, ImageThumb, Loader, PageHead } from '../components/Shared.jsx';
import QueueForm from '../forms/QueueForm.jsx';

export default function Queue() {
  const { t, me, users, language, toast, openModal } = useApp();
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api('/api/queue'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.toLowerCase();
    return items.filter((i) => [i.product_name, i.owner_name, i.filament_name, i.material, i.filament_color, i.notes, i.status, i.priority]
      .join(' ').toLowerCase().includes(q)
      && (!owner || i.owner_name === owner)
      && (!status || i.status === status)
      && (!priority || i.priority === priority));
  }, [items, search, owner, status, priority]);

  function openAdd() {
    openModal(t('addRequest'), <QueueForm onDone={load} />);
  }
  function openEdit(item) {
    openModal(t('edit'), <QueueForm item={item} onDone={load} />);
  }
  function openStart(item) {
    openModal(t('startPrinting'), <QueueForm item={item} start onDone={load} />);
  }

  async function handleDelete(id) {
    if (!window.confirm(`${t('delete')}?`)) return;
    try {
      await api(`/api/queue/${id}`, { method: 'DELETE' });
      toast('Deleted');
      await load();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function handleReorder(id, direction) {
    try {
      await api(`/api/queue/${id}/reorder`, { method: 'POST', body: JSON.stringify({ direction }) });
      await load();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  if (!items) return <Loader />;

  return (
    <>
      <PageHead
        title={t('queueTitle')}
        subtitle={t('queueSubtitle')}
        action={<button className="btn primary" onClick={openAdd}>+ {t('addRequest')}</button>}
      />
      <div className="toolbar">
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
        </div>
        <FilterSelect value={owner} onChange={setOwner} list={users.map((u) => u.display_name)} allLabel={t('allOwners')} />
        <FilterSelect value={status} onChange={setStatus} list={['Pending', 'Printing', 'Done', 'Failed', 'Canceled']} allLabel={t('allStatuses')} labelFor={(v) => t(v.toLowerCase())} />
        <FilterSelect value={priority} onChange={setPriority} list={['Low', 'Normal', 'High']} allLabel={t('allPriorities')} labelFor={(v) => t(v.toLowerCase())} />
      </div>
      {!filtered.length ? <Empty title={t('noQueue')} text={t('noQueueText')} /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('product')}</th>
                <th>{t('owner')}</th>
                <th>{t('filament')}</th>
                <th>{t('estimatedGrams')}</th>
                <th>{t('priority')}</th>
                <th>{t('status')}</th>
                <th>{t('added')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const own = i.owner_id === me.id;
                const showActions = i.status === 'Pending';
                return (
                  <tr key={i.id}>
                    <td>
                      <div className="product-cell">
                        <ImageThumb url={i.image_url} />
                        <div>
                          <strong>{i.product_name}</strong>
                          {i.model_link && <><br /><a className="link" href={i.model_link} target="_blank" rel="noreferrer">{t('view')}</a></>}
                        </div>
                      </div>
                    </td>
                    <td>{i.owner_name}</td>
                    <td>{i.filament_name || '—'}</td>
                    <td>{fmtNum(i.estimated_grams, language, 1)}g</td>
                    <td><Badge value={i.priority} /></td>
                    <td><Badge value={i.status} /></td>
                    <td>{fmtDate(i.added_at, language)}</td>
                    <td>
                      <div className="row-actions">
                        {showActions && me.is_admin && (
                          <>
                            <button className="btn primary small" onClick={() => openStart(i)}>{t('startPrinting')}</button>
                            <button className="btn secondary small" onClick={() => handleReorder(i.id, 'up')}>↑</button>
                            <button className="btn secondary small" onClick={() => handleReorder(i.id, 'down')}>↓</button>
                          </>
                        )}
                        {showActions && (own || me.is_admin) && (
                          <>
                            <button className="btn secondary small" onClick={() => openEdit(i)}>{t('edit')}</button>
                            <button className="btn danger outline small" onClick={() => handleDelete(i.id)}>{t('delete')}</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
