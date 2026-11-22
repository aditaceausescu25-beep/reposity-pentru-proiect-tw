import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RomaniaMap from "@svg-maps/romania";
import {
  CODURI_JUDETE,
  ETICHETE_LABEL,
  calculeazaImpactEco,
  detecteazaJudet,
  normalizeazaJudet,
} from "../constants.js";
import styles from "./HartaProduse.module.css";

const HARTA = RomaniaMap?.locations ? RomaniaMap : RomaniaMap?.default;

function calculeazaCentruPath(d) {
  if (!d) return { cx: 500, cy: 350 };
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g);
  if (!tokens) return { cx: 500, cy: 350 };

  let i = 0;
  let cmd = "";
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const record = (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  const nextNum = () => parseFloat(tokens[i++]);
  const isCmd = (tok) => /^[a-zA-Z]$/.test(tok);

  while (i < tokens.length) {
    if (isCmd(tokens[i])) {
      cmd = tokens[i++];
    }

    switch (cmd) {
      case "M":
        cx = nextNum();
        cy = nextNum();
        sx = cx;
        sy = cy;
        record(cx, cy);
        cmd = "L";
        break;
      case "m":
        cx += nextNum();
        cy += nextNum();
        sx = cx;
        sy = cy;
        record(cx, cy);
        cmd = "l";
        break;
      case "L":
        cx = nextNum();
        cy = nextNum();
        record(cx, cy);
        break;
      case "l":
        cx += nextNum();
        cy += nextNum();
        record(cx, cy);
        break;
      case "H":
        cx = nextNum();
        record(cx, cy);
        break;
      case "h":
        cx += nextNum();
        record(cx, cy);
        break;
      case "V":
        cy = nextNum();
        record(cx, cy);
        break;
      case "v":
        cy += nextNum();
        record(cx, cy);
        break;
      case "C": {
        const x1 = nextNum();
        const y1 = nextNum();
        const x2 = nextNum();
        const y2 = nextNum();
        cx = nextNum();
        cy = nextNum();
        record(x1, y1);
        record(x2, y2);
        record(cx, cy);
        break;
      }
      case "c": {
        const x1 = cx + nextNum();
        const y1 = cy + nextNum();
        const x2 = cx + nextNum();
        const y2 = cy + nextNum();
        cx += nextNum();
        cy += nextNum();
        record(x1, y1);
        record(x2, y2);
        record(cx, cy);
        break;
      }
      case "S":
      case "Q": {
        const x1 = nextNum();
        const y1 = nextNum();
        cx = nextNum();
        cy = nextNum();
        record(x1, y1);
        record(cx, cy);
        break;
      }
      case "s":
      case "q": {
        const x1 = cx + nextNum();
        const y1 = cy + nextNum();
        cx += nextNum();
        cy += nextNum();
        record(x1, y1);
        record(cx, cy);
        break;
      }
      case "T":
        cx = nextNum();
        cy = nextNum();
        record(cx, cy);
        break;
      case "t":
        cx += nextNum();
        cy += nextNum();
        record(cx, cy);
        break;
      case "A":
        i += 5;
        cx = nextNum();
        cy = nextNum();
        record(cx, cy);
        break;
      case "a":
        i += 5;
        cx += nextNum();
        cy += nextNum();
        record(cx, cy);
        break;
      case "Z":
      case "z":
        cx = sx;
        cy = sy;
        cmd = "";
        break;
      default:
        i++;
        break;
    }
  }

  if (!Number.isFinite(minX)) return { cx: 500, cy: 350 };
  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
  };
}

export default function HartaProduse({ produse, onAdaugaInCos }) {
  const [selectatId, setSelectatId] = useState(null);
  const [hoverJudet, setHoverJudet] = useState(null);

  const { viewBox, aspectRatio, judete } = useMemo(() => {
    const vb = HARTA?.viewBox ?? "0 0 1000 704";
    const [vbX, vbY, vbW, vbH] = vb.split(/\s+/).map(Number);
    const latime = vbW || 1000;
    const inaltime = vbH || 704;

    const lista = (HARTA?.locations ?? []).map((loc) => {
      const key = normalizeazaJudet(loc.name);
      const { cx, cy } = calculeazaCentruPath(loc.path);
      const offsetY = key === "ilfov" ? -16 : 0;

      return {
        id: loc.id,
        key,
        nume: key === "bucuresti" ? "București" : loc.name,
        cod: CODURI_JUDETE[key] ?? loc.id.toUpperCase().slice(0, 2),
        path: loc.path,
        cx,
        cy: cy + offsetY,
        pctX: ((cx - (vbX || 0)) / latime) * 100,
        pctY: ((cy + offsetY - (vbY || 0)) / inaltime) * 100,
      };
    });

    return {
      viewBox: vb,
      aspectRatio: `${latime} / ${inaltime}`,
      judete: lista,
    };
  }, []);

  const grupatePeJudet = useMemo(() => {
    const map = {};
    for (const produs of produse) {
      const key = detecteazaJudet(produs.zona);
      if (!map[key]) map[key] = [];
      map[key].push(produs);
    }
    return map;
  }, [produse]);

  if (produse.length === 0) {
    return (
      <p className="empty" data-testid="empty">
        Nu există anunțuri de afișat pe hartă pentru filtrele curente.
      </p>
    );
  }

  const produsSelectat =
    produse.find((p) => p.id === selectatId) ?? produse[0];
  const judetActivKey = detecteazaJudet(produsSelectat.zona);
  const produseInJudetActiv = grupatePeJudet[judetActivKey] ?? [produsSelectat];
  const ecoSelectat = calculeazaImpactEco(produsSelectat);

  const judetHoverInfo = hoverJudet
    ? judete.find((j) => j.key === hoverJudet)
    : null;
  const numarInHover = hoverJudet ? (grupatePeJudet[hoverJudet]?.length ?? 0) : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.mapCard}>
        <div className={styles.mapTopBar}>
          <span className={styles.mapTitle}>
            🗺️ România — {Object.keys(grupatePeJudet).length} județe cu anunțuri
          </span>
          <span className={styles.hoverBadge}>
            {judetHoverInfo
              ? `${judetHoverInfo.nume}: ${numarInHover} ${
                  numarInHover === 1 ? "anunț" : "anunțuri"
                }`
              : "Treci cu mouse-ul sau apasă pe un județ"}
          </span>
        </div>

        <div className={styles.canvasWrap}>
          <div className={styles.mapStage} style={{ aspectRatio }}>
            <svg
              className={styles.mapSvg}
              viewBox={viewBox}
              role="img"
              aria-label="Harta interactivă a României pe județe"
            >
              {judete.map((j) => {
                const anunturiJudet = grupatePeJudet[j.key] ?? [];
                const areAnunturi = anunturiJudet.length > 0;
                const esteActiv = j.key === judetActivKey;

                return (
                  <g
                    key={j.id}
                    className={styles.countyGroup}
                    onMouseEnter={() => setHoverJudet(j.key)}
                    onMouseLeave={() => setHoverJudet(null)}
                    onClick={() => {
                      if (areAnunturi) setSelectatId(anunturiJudet[0].id);
                    }}
                  >
                    <path
                      d={j.path}
                      className={`${styles.county} ${
                        areAnunturi ? styles.countyHasItems : ""
                      } ${esteActiv ? styles.countyActive : ""}`}
                    />
                    <text
                      x={j.cx}
                      y={j.cy}
                      className={`${styles.countyCode} ${
                        areAnunturi ? styles.countyCodeActive : ""
                      }`}
                    >
                      {j.cod}
                    </text>
                  </g>
                );
              })}
            </svg>

            {judete.map((j) => {
              const lista = grupatePeJudet[j.key];
              if (!lista || lista.length === 0) return null;

              const esteActiv = j.key === judetActivKey;
              const unic = lista.length === 1;
              const etichetaKey = (lista[0].eticheta ?? "vanzare").toLowerCase();

              return (
                <button
                  key={`pin-${j.key}`}
                  type="button"
                  style={{ left: `${j.pctX}%`, top: `${j.pctY}%` }}
                  className={`${styles.pin} ${
                    unic ? styles[`pin_${etichetaKey}`] ?? "" : styles.pinCluster
                  } ${esteActiv ? styles.pinActive : ""}`}
                  onMouseEnter={() => setHoverJudet(j.key)}
                  onMouseLeave={() => setHoverJudet(null)}
                  onClick={() => setSelectatId(lista[0].id)}
                  title={`${j.nume} — ${lista.length} ${
                    lista.length === 1 ? "anunț" : "anunțuri"
                  }`}
                >
                  <span className={styles.pinDot} />
                  <span className={styles.pinTag}>
                    {unic ? lista[0].pret ?? "Gratuit" : `${lista.length} anunțuri`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.legend}>
          <span>
            <i className={`${styles.dot} ${styles.dotVanzare}`} /> Vânzare
          </span>
          <span>
            <i className={`${styles.dot} ${styles.dotSchimb}`} /> Schimb
          </span>
          <span>
            <i className={`${styles.dot} ${styles.dotDonatie}`} /> Donație
          </span>
          <span>
            <i className={`${styles.dot} ${styles.dotCluster}`} /> Mai multe în județ
          </span>
        </div>
      </div>

      <aside className={`panel ${styles.previewCard}`}>
        <div className={styles.previewTop}>
          <span className={styles.previewLabel}>
            📍 {judete.find((j) => j.key === judetActivKey)?.nume ?? "România"}
          </span>
          <span className={styles.previewCount}>
            {produseInJudetActiv.length}{" "}
            {produseInJudetActiv.length === 1 ? "anunț" : "anunțuri"}
          </span>
        </div>

        {produseInJudetActiv.length > 1 && (
          <div className={styles.countySwitcher}>
            {produseInJudetActiv.map((p) => (
              <button
                key={p.id}
                type="button"
                className={
                  p.id === produsSelectat.id
                    ? `${styles.switchChip} ${styles.switchChipActive}`
                    : styles.switchChip
                }
                onClick={() => setSelectatId(p.id)}
              >
                {p.titlu}
              </button>
            ))}
          </div>
        )}

        {produsSelectat.imagine && (
          <img
            src={produsSelectat.imagine}
            alt={produsSelectat.titlu}
            className={styles.previewImg}
          />
        )}

        <div className={styles.previewBadges}>
          <span
            className={`badge badge-${(produsSelectat.eticheta ?? "vanzare").toLowerCase()}`}
          >
            {ETICHETE_LABEL[produsSelectat.eticheta] ?? produsSelectat.eticheta}
          </span>
          <span className={styles.ecoPill}>🌱 −{ecoSelectat.co2Kg} kg CO₂</span>
        </div>

        <h2 className={styles.previewTitle}>{produsSelectat.titlu}</h2>
        <div className={styles.previewPrice}>{produsSelectat.pret ?? "Gratuit"}</div>
        <p className={styles.previewMeta}>
          📍 {produsSelectat.zona ?? "Predare locală"}
        </p>
        <p className={styles.previewDesc}>{produsSelectat.descriere}</p>

        <div className={styles.previewActions}>
          <Link
            to={`/produse/${produsSelectat.id}`}
            className={`btn ${styles.detailBtn}`}
          >
            Vezi detaliile →
          </Link>
          {!produsSelectat.gata && (
            <button
              type="button"
              className={styles.cartBtn}
              onClick={() => onAdaugaInCos(produsSelectat)}
            >
              + În coș
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}