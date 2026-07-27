import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../AppContext.jsx';
import { api } from '../api.js';
import { fmtNum } from '../i18n.js';
import { Empty, FilterSelect, Loader, PageHead } from '../components/Shared.jsx';
import FavoriteForm from '../forms/FavoriteForm.jsx';
import FavoriteQueueForm from '../forms/FavoriteQueueForm.jsx';

const DESIGN_SITES = [
  { name: 'Thingiverse', url: 'https://www.thingiverse.com' },
  { name: 'Printables', url: 'https://www.printables.com' },
  { name: 'Cults3D', url: 'https://cults3d.com' },
  { name: 'MakerWorld', url: 'https://makerworld.com' },
];

export default function Favorites() {
  const { t, me, users, language, toast, openModal } = useApp();
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api('/api/favorites'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.toLowerCase();
    return items.filter((i) => [i.product_name, i.owner_name, i.filament_name, i.notes, (i.tags || []).join(' ')]
      .join(' ').toLowerCase().includes(q)
      && (!owner || i.owner_name === owner));
  }, [items, search, owner]);

  function openAdd() {
    openModal(t('addFavorite'), <FavoriteForm onDone={load} />);
  }
  function openMoveToQueue(item) {
    openModal(t('moveToQueue'), <FavoriteQueueForm item={item} onDone={load} />);
  }

  async function handleDelete(id) {
    if (!window.confirm(`${t('delete')}?`)) return;
    try {
      await api(`/api/favorites/${id}`, { method: 'DELETE' });
      await load();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  if (!items) return <Loader />;

  return (
    <>
      <PageHead
        title={t('favoriteTitle')}
        subtitle={t('favoriteSubtitle')}
        action={<button className="btn primary" onClick={openAdd}>+ {t('addFavorite')}</button>}
      />
      <div className="toolbar">
        <div className="search-box">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
        </div>
        <FilterSelect value={owner} onChange={setOwner} list={users.map((u) => u.display_name)} allLabel={t('allOwners')} />
      </div>
      <div className="actions" style={{ marginBottom: 17 }}>
        <span className="muted">{t('designSites')}:</span>
        {DESIGN_SITES.map((site) => (
          <a key={site.name} className="btn secondary small" href={site.url} target="_blank" rel="noreferrer">{site.name}</a>
        ))}
      </div>
      <div className="grid item-grid">
        {!filtered.length ? <Empty title={t('noFavorites')} /> : filtered.map((i) => (
          <article key={i.id} className="card item-card">
            {i.image_url && <img className="item-image" src={i.image_url} alt="" />}
            <div>
              <h3>{i.product_name}</h3>
              <p className="muted">{i.notes || ''}</p>
            </div>
            <div className="owner-badges">
              {(i.tags || []).map((tag) => <span key={tag} className="badge">{tag}</span>)}
            </div>
            <div className="item-meta">
              <span>{i.owner_name}</span>
              <span>{i.estimated_grams ? `${fmtNum(i.estimated_grams, language, 1)}g` : '—'}</span>
            </div>
            <div className="item-actions">
              {i.owner_id === me.id && <button className="btn primary small" onClick={() => openMoveToQueue(i)}>{t('moveToQueue')}</button>}
              {(i.owner_id === me.id || me.is_admin) && <button className="btn danger outline small" onClick={() => handleDelete(i.id)}>{t('delete')}</button>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
