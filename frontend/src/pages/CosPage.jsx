import { Link, useNavigate } from "react-router-dom";
import { extragePret } from "../constants.js";
import styles from "./CosPage.module.css";

export default function CosPage({
  cos,
  onActualizeazaCantitate,
  onScoateDinCos,
  onGolesteCos,
}) {
  const navigate = useNavigate();

  const totalProduse = cos.reduce((sum, item) => sum + item.cantitate, 0);
  const totalPret = cos.reduce(
    (sum, item) => sum + extragePret(item) * item.cantitate,
    0
  );

  if (cos.length === 0) {
    return (
      <section className={`panel ${styles.emptyState}`}>
        <h2>Coșul tău este gol</h2>
        <p className="info">
          Adaugă produse din pagina principală, iar ele vor apărea aici.
        </p>
        <Link to="/" className={`btn ${styles.backBtn}`}>
          Explorează anunțurile
        </Link>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1>
          Coșul tău ({totalProduse} {totalProduse === 1 ? "produs" : "produse"})
        </h1>
        <Link to="/" className={styles.continueLink}>
          ← Continuă cumpărăturile
        </Link>
      </div>

      <div className={styles.grid}>
        <ul className={styles.items}>
          {cos.map((item) => (
            <li key={item.id} className={styles.itemCard}>
              {item.imagine && (
                <img src={item.imagine} alt={item.titlu} className={styles.thumb} />
              )}

              <div className={styles.itemInfo}>
                <Link to={`/produse/${item.id}`} className={styles.itemTitle}>
                  {item.titlu}
                </Link>
                <span className={styles.itemZone}>
                  {item.zona ?? "Locație nespecificată"} • {item.eticheta}
                </span>
                <span className={styles.itemPrice}>
                  {item.pret ?? "Gratuit"}
                </span>
              </div>

              <div className={styles.itemControls}>
                <div className={styles.qtyGroup}>
                  <button
                    type="button"
                    onClick={() => onActualizeazaCantitate(item.id, -1)}
                    aria-label="Scade cantitatea"
                  >
                    −
                  </button>
                  <span>{item.cantitate}</span>
                  <button
                    type="button"
                    onClick={() => onActualizeazaCantitate(item.id, 1)}
                    aria-label="Crește cantitatea"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onScoateDinCos(item.id)}
                >
                  Elimină
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className={`panel ${styles.summary}`}>
          <h2>Sumar comandă</h2>
          <div className={styles.summaryRow}>
            <span>Produse ({totalProduse})</span>
            <strong>{totalPret} RON</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Livrare</span>
            <strong>Gratuită</strong>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <strong>{totalPret} RON</strong>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => navigate("/checkout")}
          >
            Trimite comanda →
          </button>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onGolesteCos}
          >
            Golește coșul
          </button>
        </aside>
      </div>
    </div>
  );
}