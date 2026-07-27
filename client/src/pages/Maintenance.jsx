import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtDate, fmtNum } from '../i18n.js';
import { Badge, Empty, FilterSelect, Loader, PageHead, StatCard } from '../components/Shared.jsx';
import MaintenanceForm from '../forms/MaintenanceForm.jsx';

const TYPES = ['Maintenance', 'Repair', 'Purchased Part', 'Upgrade', 'Cleaning', 'Calibration', 'Consumable Purchase', 'Other'];

export default function Maintenance() {
  const { t, me, users, language, toast, openModal } = useApp();
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [user, setUser] = useState('');
  const [date, setDate] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api('/api/maintenance'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.toLowerCase();
    return items.filter((i) => [i.title, i.description, i.type, i.store_name, i.notes, (i.payments || []).map((p) => p.user_name).join(' ')]
      .join(' ').toLowerCase().includes(q)
      && (!type || i.type === type)
      && (!user || i.payments.some((p) => p.user_name === user))
      && (!date || i.maintenance_date.slice(0, 10) === date));
  }, [items, search, type, user, date]);

  function openAdd() {
    openModal(t('addMaintenance'), <MaintenanceForm onDone={load} />);
  }
  function openEdit(record) {
    openModal(t('edit'), <MaintenanceForm record={record} onDone={load} />);
  }

  async function handleDelete(id) {
    if (!window.confirm(`${t('delete')}?`)) return;
    try {
      await api(`/api/maintenance/${id}`, { method: 'DELETE' });
      await load();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  if (!items) return <Loader />;

  const total = items.reduce((s, i) => s + Number(i.total_cost), 0);
  const repairs = items.filter((i) => i.type === 'Repair').length;
  const upgrades = items.filter((i) => i.type === 'Upgrade').length;
  const consumables = items.filter((i) => i.type === 'Consumable Purchase').reduce((s, i) => s + Number(i.total_cost), 0);
  const paid = (name) => items.flatMap((i) => i.payments).filter((p) => p.user_name === name).reduce((s, p) => s + Number(p.amount), 0);
  const expensive = [...items].sort((a, b) => Number(b.total_cost) - Number(a.total_cost))[0];

  return (
    <>
      <PageHead
        title={t('maintenanceTitle')}
        subtitle={t('maintenanceSubtitle')}
        action={me.is_admin ? <button className="btn primary" onClick={openAdd}>+ {t('addMaintenance')}</button> : null}
      />
      <div className="stats-grid grid">
        <StatCard label={t('maintenanceCost')} value={`${fmtNum(total, language, 2)} ${t('sar')}`} />
        <StatCard label={t('repairs')} value={repairs} />
        <StatCard label={t('upgrades')} value={upgrades} />
        <StatCard label={t('totalConsumed')} value={`${fmtNum(consumables, language, 2)} ${t('sar')}`} />
        {users.map((u) => (
          <StatCard key={u.id} label={`${t('totalPaid')} · ${u.display_name}`} value={`${fmtNum(paid(u.display_name), language, 2)} ${t('sar')}`} />
        ))}
        <StatCard label={t('mostExpensive')} value={expensive ? `${expensive.title} · ${fmtNum(expensive.total_cost, language, 2)} ${t('sar')}` : '—'} />
      </div>
      <div className="toolbar" style={{ marginTop: 20 }}>
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
        </div>
        <FilterSelect value={type} onChange={setType} list={TYPES} allLabel={t('allTypes')} labelFor={(v) => t(v.toLowerCase())} />
        <FilterSelect value={user} onChange={setUser} list={users.map((u) => u.display_name)} allLabel={t('responsible')} />
        <input type="date" style={{ width: 'auto' }} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {!filtered.length ? <Empty title={t('noMaintenance')} /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('title')}</th>
                <th>{t('type')}</th>
                <th>{t('date')}</th>
                <th>{t('cost')}</th>
                <th>{t('responsible')}</th>
                <th>{t('store')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td><strong>{i.title}</strong><br /><small className="muted">{i.description || ''}</small></td>
                  <td><Badge value={i.type} /></td>
                  <td>{fmtDate(i.maintenance_date, language)}</td>
                  <td>{fmtNum(i.total_cost, language, 2)} {t('sar')}</td>
                  <td>{i.payments.map((p) => <span key={p.user_id}>{p.user_name}: {fmtNum(p.amount, language, 2)}<br /></span>)}</td>
                  <td>{i.store_name || '—'}</td>
                  <td>
                    <div className="row-actions">
                      {me.is_admin && (
                        <>
                          <button className="btn secondary small" onClick={() => openEdit(i)}>{t('edit')}</button>
                          <button className="btn danger outline small" onClick={() => handleDelete(i.id)}>{t('delete')}</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
