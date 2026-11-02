export default function ProdusCard({ produs, onToggle, onDelete, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <div className={produs.gata ? "object-card done" : "object-card"}>
      <div className="card-image-wrapper" onClick={onSelect}>
        <img src={produs.imagine} alt={produs.titlu} className="card-image" />
        
        <button className="badge-btn" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          {produs.eticheta}
        </button>

        {/* Buton de Favorite pe imagine */}
        <button 
          className={`fav-icon-btn ${isFavorite ? 'is-fav' : ''}`} 
          onClick={(e) => onToggleFavorite(produs.id, e)}
          title="Adaugă la favorite"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <div className="card-header-compact">
          <div className="title-price-group" onClick={onSelect} style={{cursor: 'pointer'}}>
            <h3 className="object-title">{produs.titlu}</h3>
            <p className="object-price-small">Preț: {produs.pret}</p>
          </div>
          
          <label className="checkbox-container" title="Marchează disponibilitatea">
            <input 
              type="checkbox" 
              checked={produs.gata} 
              onChange={() => onToggle(produs.id)}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="card-actions-row">
          <button className="btn-expand" onClick={onSelect}>
            ▼ Vezi detalii și cumpără
          </button>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className="btn-danger" 
          onClick={() => onDelete(produs.id)}
          aria-label={`Șterge ${produs.titlu}`}
        >
          🗑️ Șterge
        </button>
      </div>
    </div>
  );
}