import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { FilterSelect, Loader, PageHead } from '../components/Shared.jsx';
import HistoryTable from '../components/HistoryTable.jsx';

export default function History() {
  const { t, users, toast } = useApp();
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState('');
  const [result, setResult] = useState('');
  const [date, setDate] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api('/api/history'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.toLowerCase();
    return items.filter((i) => [i.product_name, i.owner_name, i.filament_name, i.filament_color, i.result, i.note]
      .join(' ').toLowerCase().includes(q)
      && (!owner || i.owner_name === owner)
      && (!result || i.result === result)
      && (!date || String(i.finished_at).slice(0, 10) === date));
  }, [items, search, owner, result, date]);

  if (!items) return <Loader />;

  return (
    <>
      <PageHead title={t('historyTitle')} subtitle={t('historySubtitle')} />
      <div className="toolbar">
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
        </div>
        <FilterSelect value={owner} onChange={setOwner} list={users.map((u) => u.display_name)} allLabel={t('allOwners')} />
        <FilterSelect value={result} onChange={setResult} list={['Completed', 'Failed', 'Canceled']} allLabel={t('allResults')} labelFor={(v) => t(v.toLowerCase())} />
        <input type="date" style={{ width: 'auto' }} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <HistoryTable items={filtered} onDone={load} />
    </>
  );
}
