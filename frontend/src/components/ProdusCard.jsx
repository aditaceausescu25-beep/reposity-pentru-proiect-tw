import { Link } from "react-router-dom";
import {
  ETICHETE_LABEL,
  calculeazaImpactEco,
  formatTimpRamas,
} from "../constants.js";
import styles from "./ProdusCard.module.css";

export default function ProdusCard({
  produs,
  onToggle,
  onDelete,
  isFavorite,
  onToggleFavorite,
  onAdaugaInCos,
  inCos,
  inCompara,
  onToggleCompara,
  acum,
}) {
  const etichetaKey = (produs.eticheta ?? "vanzare").toLowerCase();
  const eco = calculeazaImpactEco(produs);
  const timpRezervare = formatTimpRamas(produs.rezervare?.expiraLa, acum);
  const esteRezervat = Boolean(timpRezervare) && !produs.gata;

  return (
    <li
      className={produs.gata ? `${styles.card} ${styles.done}` : styles.card}
      data-testid="item"
      data-id={produs.id}
    >
      <Link to={`/produse/${produs.id}`} className={styles.imageBox}>
        {produs.imagine ? (
          <img src={produs.imagine} alt={produs.titlu} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>Fără imagine</div>
        )}
        <span className={`badge badge-${etichetaKey} ${styles.imageBadge}`}>
          {ETICHETE_LABEL[produs.eticheta] ?? produs.eticheta}
        </span>
        {esteRezervat && (
          <span className={styles.reservedBadge}>⏳ {timpRezervare}</span>
        )}
      </Link>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <Link
              to={`/produse/${produs.id}`}
              className={styles.title}
              data-testid="item-link"
            >
              {produs.titlu}
            </Link>

            <div className={styles.metaRow}>
              <span className={styles.statusPill}>
                {produs.gata
                  ? "Indisponibil"
                  : esteRezervat
                    ? "Rezervat 24h"
                    : "Disponibil"}
              </span>
              <span className={styles.ecoPill} title="Emisii CO₂ economisite prin reutilizare">
                🌱 −{eco.co2Kg} kg CO₂
              </span>
              {produs.zona && (
                <span className={styles.location}>📍 {produs.zona}</span>
              )}
            </div>
          </div>

          <div className={styles.price}>
            {produs.pret ?? (produs.eticheta === "Donatie" ? "Gratuit" : "-")}
          </div>
        </div>

        {produs.descriere && (
          <p className={styles.desc}>{produs.descriere}</p>
        )}

        <div className={styles.bottomRow}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={Boolean(produs.gata)}
              onChange={() => onToggle(produs.id)}
              aria-label={`Marchează ${produs.titlu}`}
              data-testid="item-toggle"
            />
            <span>{produs.gata ? "Finalizat" : "Marchează indisponibil"}</span>
          </label>

          <div className={styles.actions}>
            {!produs.gata && (
              <button
                type="button"
                className={inCos ? styles.inCartBtn : styles.cartBtn}
                onClick={() => onAdaugaInCos(produs)}
              >
                {inCos ? "+ Încă unul în coș" : "+ Adaugă în coș"}
              </button>
            )}

            {onToggleCompara && (
              <button
                type="button"
                className={
                  inCompara
                    ? `${styles.compareBtn} ${styles.compareActive}`
                    : styles.compareBtn
                }
                onClick={() => onToggleCompara(produs)}
                title="Compară cu alte produse"
              >
                ⇄ {inCompara ? "În comparație" : "Compară"}
              </button>
            )}

            <button
              type="button"
              className={
                isFavorite
                  ? `${styles.heartBtn} ${styles.heartActive}`
                  : styles.heartBtn
              }
              onClick={(e) => onToggleFavorite(produs.id, e)}
              aria-label={isFavorite ? "Scoate de la favorite" : "Adaugă la favorite"}
              title={isFavorite ? "La favorite" : "Salvează la favorite"}
            >
              {isFavorite ? "♥" : "♡"}
            </button>

            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(produs.id)}
              aria-label={`Șterge ${produs.titlu}`}
              data-testid="item-delete"
            >
              Șterge
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}