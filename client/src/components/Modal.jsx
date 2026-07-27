import { useApp } from '../AppContext.jsx';

export default function Modal() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;
  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{modal.eyebrow}</p>
            <h2>{modal.title}</h2>
          </div>
          <button className="icon-btn" type="button" onClick={closeModal}>×</button>
        </div>
        <div>{modal.body}</div>
      </div>
    </div>
  );
}
