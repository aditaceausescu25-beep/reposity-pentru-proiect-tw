import { useState } from "react";
import { Link } from "react-router-dom";
import { ETICHETE_LABEL, calculeazaImpactEco } from "../constants.js";
import styles from "./ComparaBar.module.css";

export default function ComparaBar({
  compara,
  onScoate,
  onGoleste,
  onAdaugaInCos,
}) {
  const [deschis, setDeschis] = useState(false);

  if (!compara || compara.length === 0) return null;

  return (
    <>
      <div className={styles.dock} role="region" aria-label="Compară produse">
        <div className={styles.dockItems}>
          <span className={styles.dockTitle}>
            ⇄ Compară ({compara.length}/3)
          </span>
          {compara.map((item) => (
            <div key={item.id} className={styles.chip}>
              {item.imagine && (
                <img src={item.imagine} alt={item.titlu} className={styles.chipImg} />
              )}
              <span className={styles.chipName}>{item.titlu}</span>
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => onScoate(item.id)}
                aria-label={`Scoate ${item.titlu} din comparație`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className={styles.dockActions}>
          <button
            type="button"
            className="btn"
            disabled={compara.length < 2}
            onClick={() => setDeschis(true)}
          >
            {compara.length < 2
              ? "Mai alege 1 produs"
              : `Compară acum (${compara.length})`}
          </button>
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setDeschis(false);
              onGoleste();
            }}
          >
            Golește
          </button>
        </div>
      </div>

      {deschis && (
        <div
          className={styles.backdrop}
          onClick={() => setDeschis(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tabel comparativ produse"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Comparație rapidă</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setDeschis(false)}
                aria-label="Închide comparația"
              >
                ✕
              </button>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Criteriu</th>
                    {compara.map((item) => (
                      <th key={item.id}>
                        <div className={styles.colHead}>
                          {item.imagine && (
                            <img
                              src={item.imagine}
                              alt={item.titlu}
                              className={styles.modalImg}
                            />
                          )}
                          <Link
                            to={`/produse/${item.id}`}
                            className={styles.colTitle}
                            onClick={() => setDeschis(false)}
                          >
                            {item.titlu}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Preț</td>
                    {compara.map((item) => (
                      <td key={item.id} className={styles.strongCell}>
                        {item.pret ?? "-"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Tip anunț</td>
                    {compara.map((item) => (
                      <td key={item.id}>
                        {ETICHETE_LABEL[item.eticheta] ?? item.eticheta}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Zonă</td>
                    {compara.map((item) => (
                      <td key={item.id}>📍 {item.zona ?? "Nespecificat"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Status</td>
                    {compara.map((item) => (
                      <td key={item.id}>
                        {item.gata ? "Indisponibil" : "Disponibil"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Impact ecologic</td>
                    {compara.map((item) => {
                      const eco = calculeazaImpactEco(item);
                      return (
                        <td key={item.id} className={styles.ecoCell}>
                          🌱 −{eco.co2Kg} kg CO₂
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>Descriere</td>
                    {compara.map((item) => (
                      <td key={item.id} className={styles.descCell}>
                        {item.descriere ?? "-"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Acțiuni</td>
                    {compara.map((item) => (
                      <td key={item.id}>
                        <div className={styles.cellActions}>
                          {!item.gata && (
                            <button
                              type="button"
                              className="btn"
                              onClick={() => onAdaugaInCos(item)}
                            >
                              + În coș
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => onScoate(item.id)}
                          >
                            Elimină
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}