import ProdusCard from "./ProdusCard.jsx";

export default function ProdusList({ produse, onToggle, onDelete, onSelect, favorite, onToggleFavorite }) {
  if (produse.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nu s-a găsit nimic!</h2>
        <p>Încearcă alt termen de căutare sau adaugă produse la favorite.</p>
      </div>
    );
  }

  return (
    <div className="ads-grid">
      {produse.map((produs) => (
        <ProdusCard 
          key={produs.id} 
          produs={produs} 
          onToggle={onToggle}
          onDelete={onDelete}
          onSelect={() => onSelect(produs)}
          isFavorite={favorite.includes(produs.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}