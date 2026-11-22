import ProdusCard from "./ProdusCard.jsx";
import styles from "./ProdusList.module.css";

export default function ProdusList({
  produse,
  onToggle,
  onDelete,
  favorite,
  onToggleFavorite,
  onAdaugaInCos,
  cos = [],
  compara = [],
  onToggleCompara,
  acum,
}) {
  if (produse.length === 0) {
    return (
      <p className="empty" data-testid="empty">
        Nu am găsit niciun anunț pentru filtrele selectate.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {produse.map((produs) => (
        <ProdusCard
          key={produs.id}
          produs={produs}
          onToggle={onToggle}
          onDelete={onDelete}
          isFavorite={favorite.includes(produs.id)}
          onToggleFavorite={onToggleFavorite}
          onAdaugaInCos={onAdaugaInCos}
          inCos={cos.some((item) => item.id === produs.id)}
          inCompara={compara.some((item) => item.id === produs.id)}
          onToggleCompara={onToggleCompara}
          acum={acum}
        />
      ))}
    </ul>
  );
}