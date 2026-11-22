import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProdus, fetchProduse, updateProdus } from "../api.js";
import {
  ETICHETE_LABEL,
  calculeazaImpactEco,
  formatTimpRamas,
  obtineGalerie,
} from "../constants.js";
import styles from "./ProdusDetaliuPage.module.css";

const MESAJE_RAPIDE = [
  "Bună! Mai este disponibil?",
  "Ne putem întâlni astăzi pentru predare?",
  "Se poate vedea înainte?",
];

const INTERVALE_ORARE = [
  "Astăzi, 17:00 – 19:00",
  "Mâine, 10:00 – 13:00",
  "Mâine, 17:00 – 20:00",
  "În weekend (flexibil)",
];

function comentariiImplicite(produs) {
  const zona = produs.zona && produs.zona !== "Nespecificat" ? produs.zona : "zonă";
  const esteDonatie = produs.eticheta === "Donatie";
  const esteSchimb = produs.eticheta === "Schimb";

  const seturi = [
    [
      {
        id: `def-${produs.id}-1`,
        autor: "Elena M.",
        data: "acum 3 ore",
        rating: 5,
        text: esteDonatie
          ? `Super inițiativă să oferiți "${produs.titlu}" în comunitate! Arată foarte îngrijit în poze.`
          : esteSchimb
            ? `Arată excelent! Am câteva lucruri în stare foarte bună dacă mai e valabil pentru schimb în ${zona}.`
            : `Am mai luat de la membri din ${zona} și experiența a fost mereu impecabilă. Prețul pentru "${produs.titlu}" este chiar corect.`,
        util: 4,
      },
      {
        id: `def-${produs.id}-2`,
        autor: "Radu Ionescu",
        data: "ieri",
        rating: 5,
        text: "Se poate ridica și după ora 18:00? Pare exact ce căutam și apreciez descrierea clară.",
        util: 2,
      },
      {
        id: `def-${produs.id}-3`,
        autor: "Ioana D.",
        data: "acum 2 zile",
        rating: 4,
        text: "Foarte frumos prezentat anunțul! Recomand comunitatea Târg Local pentru predarea rapidă.",
        util: 3,
      },
    ],
    [
      {
        id: `def-${produs.id}-1`,
        autor: "Mihai Popa",
        data: "acum 5 ore",
        rating: 5,
        text: "Arată mult mai bine decât mă așteptam pentru un produs din comunitate. Se vede că a fost păstrat cu grijă.",
        util: 5,
      },
      {
        id: `def-${produs.id}-2`,
        autor: "Andreea S.",
        data: "ieri",
        rating: 5,
        text: `Am verificat zona (${zona}), e foarte ușor de ajuns. Sper să mai fie disponibil până diseară!`,
        util: 2,
      },
      {
        id: `def-${produs.id}-3`,
        autor: "Cristian V.",
        data: "acum 3 zile",
        rating: 4,
        text: "Îmi place mult ideea de a da o a doua viață lucrurilor bune. Mult succes cu anunțul!",
        util: 1,
      },
    ],
  ];

  const index = Number(produs.id) % seturi.length;
  return seturi[Number.isNaN(index) ? 0 : index];
}

function initiale(nume) {
  return (nume || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProdusDetaliuPage({
  onAdaugaInCos,
  favorite = [],
  compara = [],
  onToggleFavorite,
  onToggleCompara,
}) {
  const { id } = useParams();
  const [produs, setProdus] = useState(null);
  const [toateProdusele, setToateProdusele] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tabActiv, setTabActiv] = useState("poveste");
  const [fotoIndex, setFotoIndex] = useState(0);
  const [lightboxDeschis, setLightboxDeschis] = useState(false);
  const [copiatLink, setCopiatLink] = useState(false);
  const [adaugatRecent, setAdaugatRecent] = useState(false);
  const [acum, setAcum] = useState(() => Date.now());

  const [mesajDeschis, setMesajDeschis] = useState(false);
  const [textMesaj, setTextMesaj] = useState("");
  const [mesajTrimis, setMesajTrimis] = useState(false);

  const [rezervaDeschis, setRezervaDeschis] = useState(false);
  const [numeRezervare, setNumeRezervare] = useState("");
  const [intervalRezervare, setIntervalRezervare] = useState(INTERVALE_ORARE[0]);
  const [locIntalnire, setLocIntalnire] = useState("");
  const [eroareRezervare, setEroareRezervare] = useState("");
  const [salveazaRezervare, setSalveazaRezervare] = useState(false);

  const [schimbDeschis, setSchimbDeschis] = useState(false);
  const [autorSchimb, setAutorSchimb] = useState("");
  const [produsOferitSelect, setProdusOferitSelect] = useState("");
  const [produsOferitText, setProdusOferitText] = useState("");
  const [diferentaSchimb, setDiferentaSchimb] = useState("");
  const [eroareSchimb, setEroareSchimb] = useState("");
  const [trimiteSchimb, setTrimiteSchimb] = useState(false);

  const [autorOferta, setAutorOferta] = useState("");
  const [valoareOferta, setValoareOferta] = useState("");
  const [eroareOferta, setEroareOferta] = useState("");
  const [trimiteOferta, setTrimiteOferta] = useState(false);

  const [autorComentariu, setAutorComentariu] = useState("");
  const [textComentariu, setTextComentariu] = useState("");
  const [ratingComentariu, setRatingComentariu] = useState(5);
  const [eroareComentariu, setEroareComentariu] = useState("");
  const [trimiteComentariu, setTrimiteComentariu] = useState(false);
  const [voturiUtile, setVoturiUtile] = useState({});

  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAcum(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ignore = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchProdus(id)
      .then((data) => {
        if (!ignore) {
          setProdus(data);
          setError(null);
          setTabActiv("poveste");
          setFotoIndex(0);
          setAdaugatRecent(false);
          setMesajTrimis(false);
          setMesajDeschis(false);
          setRezervaDeschis(false);
          setSchimbDeschis(false);
          setEroareComentariu("");
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    fetchProduse()
      .then((lista) => {
        if (!ignore && Array.isArray(lista)) {
          setToateProdusele(lista);
        }
      })
      .catch(() => {
        // opțional
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const galerie = obtineGalerie(produs);
  const indexSigur = fotoIndex < galerie.length ? fotoIndex : 0;
  const fotoCurenta = galerie[indexSigur];

  useEffect(() => {
    if (!lightboxDeschis || galerie.length === 0) return;

    function handleKey(e) {
      if (e.key === "Escape") setLightboxDeschis(false);
      if (e.key === "ArrowRight") {
        setFotoIndex((prev) => (prev + 1) % galerie.length);
      }
      if (e.key === "ArrowLeft") {
        setFotoIndex((prev) => (prev - 1 + galerie.length) % galerie.length);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxDeschis, galerie.length]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 9,
      ry: (x - 0.5) * 9,
      mx: Math.round(x * 100),
      my: Math.round(y * 100),
    });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  function handleAdauga() {
    if (!produs || produs.gata) return;
    onAdaugaInCos(produs);
    setAdaugatRecent(true);
  }

  function handleCopiazaLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiatLink(true);
    setTimeout(() => setCopiatLink(false), 2200);
  }

  function handleTrimiteMesaj(e) {
    e.preventDefault();
    if (!textMesaj.trim()) return;
    setMesajTrimis(true);
    setTextMesaj("");
  }

  async function handleRezerva(e) {
    e.preventDefault();
    if (!numeRezervare.trim()) {
      setEroareRezervare("Introdu numele tău pentru rezervare.");
      return;
    }

    setEroareRezervare("");
    setSalveazaRezervare(true);

    const rezervareNoua = {
      nume: numeRezervare.trim(),
      interval: intervalRezervare,
      locatie:
        locIntalnire.trim() ||
        `Punct public în ${produs.zona ?? "zonă"}`,
      expiraLa: Date.now() + 24 * 60 * 60 * 1000,
    };

    try {
      const actualizat = await updateProdus(produs.id, {
        rezervare: rezervareNoua,
      });
      setProdus(actualizat);
    } catch {
      setProdus((prev) => ({ ...prev, rezervare: rezervareNoua }));
    } finally {
      setAcum(Date.now());
      setSalveazaRezervare(false);
      setRezervaDeschis(false);
      setNumeRezervare("");
      setLocIntalnire("");
    }
  }

  async function handleAnuleazaRezervare() {
    try {
      const actualizat = await updateProdus(produs.id, { rezervare: null });
      setProdus(actualizat);
    } catch {
      setProdus((prev) => ({ ...prev, rezervare: null }));
    }
  }

  async function handlePropuneSchimb(e) {
    e.preventDefault();
    const ceOfera = produsOferitText.trim() || produsOferitSelect.trim();
    if (!autorSchimb.trim()) {
      setEroareSchimb("Introdu numele tău.");
      return;
    }
    if (!ceOfera) {
      setEroareSchimb("Alege un produs sau descrie ce oferi la schimb.");
      return;
    }

    setEroareSchimb("");
    setTrimiteSchimb(true);

    const dif = Number(diferentaSchimb) || 0;
    const ofertaSchimb = {
      id: Date.now(),
      tip: "schimb",
      autor: autorSchimb.trim(),
      produsOferit: ceOfera,
      valoare: dif,
    };
    const oferteActualizate = [ofertaSchimb, ...(produs.oferte ?? [])];

    try {
      const actualizat = await updateProdus(produs.id, {
        oferte: oferteActualizate,
      });
      setProdus(actualizat);
    } catch {
      setProdus((prev) => ({ ...prev, oferte: oferteActualizate }));
    } finally {
      setTrimiteSchimb(false);
      setSchimbDeschis(false);
      setAutorSchimb("");
      setProdusOferitSelect("");
      setProdusOferitText("");
      setDiferentaSchimb("");
      setTabActiv("oferte");
    }
  }

  async function handleTrimiteOferta(e) {
    e.preventDefault();
    const suma = Number(valoareOferta);
    if (!autorOferta.trim()) {
      setEroareOferta("Introdu numele tău.");
      return;
    }
    if (!suma || suma <= 0) {
      setEroareOferta("Introdu o sumă pozitivă în RON.");
      return;
    }

    setEroareOferta("");
    setTrimiteOferta(true);

    const ofertaNoua = {
      id: Date.now(),
      tip: "pret",
      autor: autorOferta.trim(),
      valoare: suma,
    };
    const oferteActualizate = [...(produs.oferte ?? []), ofertaNoua];

    try {
      const actualizat = await updateProdus(produs.id, {
        oferte: oferteActualizate,
      });
      setProdus(actualizat);
    } catch {
      setProdus((prev) => ({ ...prev, oferte: oferteActualizate }));
    } finally {
      setAutorOferta("");
      setValoareOferta("");
      setTrimiteOferta(false);
    }
  }

  async function handleAdaugaComentariu(e) {
    e.preventDefault();
    if (!autorComentariu.trim()) {
      setEroareComentariu("Te rugăm să îți scrii numele.");
      return;
    }
    if (textComentariu.trim().length < 4) {
      setEroareComentariu("Comentariul trebuie să aibă cel puțin 4 caractere.");
      return;
    }

    setEroareComentariu("");
    setTrimiteComentariu(true);

    const listaCurenta =
      Array.isArray(produs.comentarii) && produs.comentarii.length > 0
        ? produs.comentarii
        : comentariiImplicite(produs);

    const comentariuNou = {
      id: Date.now(),
      autor: autorComentariu.trim(),
      data: "chiar acum",
      rating: ratingComentariu,
      text: textComentariu.trim(),
      util: 0,
    };

    const comentariiActualizate = [comentariuNou, ...listaCurenta];

    try {
      const actualizat = await updateProdus(produs.id, {
        comentarii: comentariiActualizate,
      });
      setProdus(actualizat);
    } catch {
      setProdus((prev) => ({ ...prev, comentarii: comentariiActualizate }));
    } finally {
      setAutorComentariu("");
      setTextComentariu("");
      setRatingComentariu(5);
      setTrimiteComentariu(false);
    }
  }

  function handleToggleUtil(comentariuId) {
    setVoturiUtile((prev) => ({
      ...prev,
      [comentariuId]: !prev[comentariuId],
    }));
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p className="info" data-testid="loading">
          Se încarcă anunțul...
        </p>
      </div>
    );
  }

  if (error || !produs) {
    return (
      <section className={`panel ${styles.errorCard}`}>
        <p className="error" data-testid="error">
          Produsul nu a putut fi încărcat: {error ?? "Element inexistent"}
        </p>
        <Link to="/" className={styles.backLink}>
          ← Înapoi la toate anunțurile
        </Link>
      </section>
    );
  }

  const etichetaKey = (produs.eticheta ?? "vanzare").toLowerCase();
  const etichetaText = ETICHETE_LABEL[produs.eticheta] ?? produs.eticheta;
  const esteFavorit = favorite.includes(produs.id);
  const inCompara = compara.some((item) => item.id === produs.id);
  const eco = calculeazaImpactEco(produs);
  const timpRezervare = formatTimpRamas(produs.rezervare?.expiraLa, acum);
  const esteRezervat = Boolean(timpRezervare) && !produs.gata;

  const oferte = Array.isArray(produs.oferte) ? produs.oferte : [];
  const comentarii =
    Array.isArray(produs.comentarii) && produs.comentarii.length > 0
      ? produs.comentarii
      : comentariiImplicite(produs);

  const medieRating = (
    comentarii.reduce((sum, c) => sum + (c.rating || 5), 0) / comentarii.length
  ).toFixed(1);

  const alteProduseActive = toateProdusele.filter(
    (item) => String(item.id) !== String(id) && !item.gata
  );
  const recomandari = alteProduseActive.slice(0, 3);

  return (
    <section className={styles.showcase} data-testid="detail">
      <div className={styles.ambientOrbOne} aria-hidden="true" />
      <div className={styles.ambientOrbTwo} aria-hidden="true" />

      <div className={styles.topNav}>
        <Link to="/" className={styles.backPill}>
          <span>←</span> Înapoi la toate anunțurile
        </Link>
        <div className={styles.breadcrumb}>
          <span>Explorează</span>
          <span>/</span>
          <span>{etichetaText}</span>
          <span>/</span>
          <span className={styles.crumbCurrent}>#{produs.id}</span>
        </div>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.visualCol}>
          <div
            className={styles.imageStage}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              "--rx": `${tilt.rx}deg`,
              "--ry": `${tilt.ry}deg`,
              "--mx": `${tilt.mx}%`,
              "--my": `${tilt.my}%`,
            }}
          >
            <div className={styles.stageGlow} aria-hidden="true" />

            {fotoCurenta ? (
              <img
                src={fotoCurenta.url}
                alt={produs.titlu}
                style={{
                  objectPosition: fotoCurenta.position,
                  transform: `scale(${fotoCurenta.scale})`,
                }}
                className={
                  produs.gata
                    ? `${styles.heroImage} ${styles.heroImageDone}`
                    : styles.heroImage
                }
                onClick={() => setLightboxDeschis(true)}
              />
            ) : (
              <div className={styles.noImage}>Fără fotografie</div>
            )}

            <div className={styles.floatingTop}>
              <span className={`badge badge-${etichetaKey} ${styles.heroBadge}`}>
                {etichetaText}
              </span>
              <span
                className={
                  produs.gata
                    ? `${styles.livePill} ${styles.livePillOff}`
                    : styles.livePill
                }
              >
                <span className={styles.pulseDot} />
                {produs.gata
                  ? "Indisponibil"
                  : esteRezervat
                    ? `Rezervat (${timpRezervare})`
                    : "Disponibil acum"}
              </span>
            </div>

            <div className={styles.floatingBottom}>
              <span className={styles.glassChip}>
                📍 {produs.zona ?? "Predare locală"}
              </span>

              <div className={styles.stageTools}>
                {onToggleFavorite && (
                  <button
                    type="button"
                    className={styles.glassBtn}
                    onClick={(e) => onToggleFavorite(produs.id, e)}
                    title={
                      esteFavorit ? "Scoate de la favorite" : "Salvează la favorite"
                    }
                  >
                    {esteFavorit ? "♥ Salvat" : "♡ Salvează"}
                  </button>
                )}
                {onToggleCompara && (
                  <button
                    type="button"
                    className={styles.glassBtn}
                    onClick={() => onToggleCompara(produs)}
                    title="Adaugă la comparație"
                  >
                    {inCompara ? "✓ În comparație" : "⇄ Compară"}
                  </button>
                )}
                <button
                  type="button"
                  className={styles.glassBtn}
                  onClick={handleCopiazaLink}
                  title="Copiază link-ul anunțului"
                >
                  {copiatLink ? "✓ Copiat" : "↗ Distribuie"}
                </button>
                {fotoCurenta && (
                  <button
                    type="button"
                    className={styles.glassBtn}
                    onClick={() => setLightboxDeschis(true)}
                    title="Mărește imaginea"
                  >
                    ⤢
                  </button>
                )}
              </div>
            </div>
          </div>

          {galerie.length > 1 && (
            <div className={styles.thumbStrip}>
              {galerie.map((foto, idx) => (
                <button
                  key={`${foto.url}-${idx}`}
                  type="button"
                  className={
                    idx === indexSigur
                      ? `${styles.thumbBtn} ${styles.thumbActive}`
                      : styles.thumbBtn
                  }
                  onClick={() => setFotoIndex(idx)}
                >
                  <img
                    src={foto.url}
                    alt={foto.label}
                    style={{
                      objectPosition: foto.position,
                      transform: `scale(${foto.scale})`,
                    }}
                  />
                  <span>{foto.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.decisionCard}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrow}>
              Anunț #{produs.id} • {etichetaText}
            </span>
            <a href="#comentarii" className={styles.ratingPill}>
              ★ {medieRating} ({comentarii.length})
            </a>
          </div>

          <h1
            className={
              produs.gata ? `${styles.title} ${styles.titleDone}` : styles.title
            }
            data-testid="detail-title"
          >
            {produs.titlu}
          </h1>

          <div className={styles.priceBanner}>
            <div>
              <span className={styles.priceLabel}>
                {produs.eticheta === "Donatie"
                  ? "Oferit comunității"
                  : produs.eticheta === "Schimb"
                    ? "Disponibil pentru"
                    : "Preț solicitat"}
              </span>
              <div className={styles.priceValue}>{produs.pret ?? "-"}</div>
            </div>
            <span className={styles.ecoBadge}>
              🌱 −{eco.co2Kg} kg CO₂
            </span>
          </div>

          <p className={styles.leadDesc}>
            {produs.descriere ?? "Produs disponibil în comunitatea Târg Local."}
          </p>

          {esteRezervat && (
            <div className={styles.reservedBox}>
              <div>
                <strong>⏳ Rezervat temporar ({timpRezervare} rămase)</strong>
                <span>
                  De {produs.rezervare.nume} • {produs.rezervare.interval} •{" "}
                  {produs.rezervare.locatie}
                </span>
              </div>
              <button
                type="button"
                className={styles.cancelResBtn}
                onClick={handleAnuleazaRezervare}
              >
                Eliberează
              </button>
            </div>
          )}

          {!produs.gata ? (
            <div className={styles.ctaGroup}>
              <button
                type="button"
                className={
                  adaugatRecent
                    ? `${styles.ctaPrimary} ${styles.ctaAdded}`
                    : styles.ctaPrimary
                }
                onClick={handleAdauga}
              >
                <span className={styles.ctaShine} aria-hidden="true" />
                {adaugatRecent
                  ? "✓ Adăugat în coș — mai adaugă unul"
                  : "+ Adaugă în coș"}
              </button>

              <div className={styles.secondaryActions}>
                <button
                  type="button"
                  className={styles.secBtn}
                  onClick={() => setSchimbDeschis(true)}
                >
                  🤝 Propune un schimb
                </button>
                <button
                  type="button"
                  className={styles.secBtn}
                  onClick={() => setRezervaDeschis((prev) => !prev)}
                >
                  ⏳ {esteRezervat ? "Modifică rezervarea" : "Rezervă 24h"}
                </button>
              </div>

              {rezervaDeschis && (
                <form className={styles.reserveForm} onSubmit={handleRezerva}>
                  <strong>Rezervă produsul și propune o întâlnire</strong>
                  <input
                    type="text"
                    value={numeRezervare}
                    onChange={(e) => setNumeRezervare(e.target.value)}
                    placeholder="Numele tău"
                  />
                  <select
                    value={intervalRezervare}
                    onChange={(e) => setIntervalRezervare(e.target.value)}
                  >
                    {INTERVALE_ORARE.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={locIntalnire}
                    onChange={(e) => setLocIntalnire(e.target.value)}
                    placeholder={`Punct public (ex: Metrou ${produs.zona ?? "Centru"})`}
                  />
                  {eroareRezervare && <p className="error">{eroareRezervare}</p>}
                  <button
                    type="submit"
                    className="btn"
                    disabled={salveazaRezervare}
                  >
                    {salveazaRezervare
                      ? "Se rezervă..."
                      : "Confirmă rezervarea 24h"}
                  </button>
                </form>
              )}

              {adaugatRecent && (
                <Link to="/cos" className={styles.goCartBtn}>
                  Deschide coșul și finalizează →
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.soldBanner}>
              Acest produs și-a găsit deja un nou proprietar.
            </div>
          )}

          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <span>🌱</span>
              <div>
                <strong>−{eco.co2Kg} kg CO₂</strong>
                <small>{eco.categorie}</small>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span>🤝</span>
              <div>
                <strong>Predare directă</strong>
                <small>{produs.zona ?? "Local"}</small>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span>⚡</span>
              <div>
                <strong>0% comision</strong>
                <small>Direct cu vecinii</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainFlow}>
          <div className={`panel ${styles.detailsPanel}`}>
            <div className={styles.tabsHeader} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tabActiv === "poveste"}
                className={
                  tabActiv === "poveste"
                    ? `${styles.tabBtn} ${styles.tabActive}`
                    : styles.tabBtn
                }
                onClick={() => setTabActiv("poveste")}
              >
                Povestea produsului
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tabActiv === "oferte"}
                className={
                  tabActiv === "oferte"
                    ? `${styles.tabBtn} ${styles.tabActive}`
                    : styles.tabBtn
                }
                onClick={() => setTabActiv("oferte")}
              >
                Oferte & Schimburi ({oferte.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tabActiv === "predare"}
                className={
                  tabActiv === "predare"
                    ? `${styles.tabBtn} ${styles.tabActive}`
                    : styles.tabBtn
                }
                onClick={() => setTabActiv("predare")}
              >
                Predare & Impact
              </button>
            </div>

            {tabActiv === "poveste" && (
              <div className={styles.tabBody}>
                <div className={styles.quoteCard}>
                  <span className={styles.quoteLabel}>
                    De ce își caută un nou proprietar
                  </span>
                  <blockquote>
                    „
                    {produs.motivVanzare && produs.motivVanzare !== "-"
                      ? produs.motivVanzare
                      : "Nu îl mai folosim și vrem să se bucure altcineva de el."}
                    ”
                  </blockquote>
                  <p className={styles.storyFull}>
                    {produs.descriere ?? "Fără descriere suplimentară."}
                  </p>
                </div>
              </div>
            )}

            {tabActiv === "oferte" && (
              <div className={styles.tabBody}>
                <div className={styles.offersLayout}>
                  <div className={styles.offersListWrap}>
                    <h3>Propuneri primite</h3>
                    {oferte.length === 0 ? (
                      <p className="info">
                        Nu există încă oferte sau propuneri de schimb. Fii primul!
                      </p>
                    ) : (
                      <ul className={styles.offersList}>
                        {oferte.map((o) => (
                          <li key={o.id} className={styles.offerItem}>
                            <div>
                              <span className={styles.offerAuthor}>{o.autor}</span>
                              {o.tip === "schimb" && (
                                <span className={styles.tradeDetail}>
                                  🤝 Oferă: <strong>{o.produsOferit}</strong>
                                </span>
                              )}
                            </div>
                            <strong className={styles.offerAmount}>
                              {o.tip === "schimb"
                                ? o.valoare > 0
                                  ? `+ ${o.valoare} RON`
                                  : "Schimb direct"
                                : `${o.valoare} RON`}
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {!produs.gata && (
                    <form
                      className={styles.offerForm}
                      onSubmit={handleTrimiteOferta}
                    >
                      <h3>Propune un preț</h3>
                      <input
                        type="text"
                        value={autorOferta}
                        onChange={(e) => setAutorOferta(e.target.value)}
                        placeholder="Numele tău"
                      />
                      <input
                        type="number"
                        min="1"
                        value={valoareOferta}
                        onChange={(e) => setValoareOferta(e.target.value)}
                        placeholder="Suma propusă (RON)"
                      />
                      {eroareOferta && <p className="error">{eroareOferta}</p>}
                      <button
                        type="submit"
                        className="btn"
                        disabled={trimiteOferta}
                      >
                        {trimiteOferta ? "Se trimite..." : "Trimite oferta"}
                      </button>
                      <button
                        type="button"
                        className={styles.secBtn}
                        onClick={() => setSchimbDeschis(true)}
                      >
                        🤝 Sau propune un schimb
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {tabActiv === "predare" && (
              <div className={styles.tabBody}>
                <div className={styles.safetyGrid}>
                  <div className={styles.safetyItem}>
                    <strong>1. Întâlnire într-un loc public</strong>
                    <p>
                      Recomandăm predarea personală în zona{" "}
                      <strong>{produs.zona ?? "locală"}</strong>, într-un spațiu
                      ușor accesibil.
                    </p>
                  </div>
                  <div className={styles.safetyItem}>
                    <strong>2. Impact ecologic real</strong>
                    <p>
                      Reutilizând acest obiect economisești aproximativ{" "}
                      <strong>{eco.co2Kg} kg CO₂</strong> față de cumpărarea
                      unui produs nou.
                    </p>
                  </div>
                  <div className={styles.safetyItem}>
                    <strong>3. Plată flexibilă</strong>
                    <p>
                      Donațiile și schimburile nu necesită card bancar; pentru
                      vânzări poți achita sigur la finalizare.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div id="comentarii" className={`panel ${styles.commentsPanel}`}>
            <div className={styles.commentsHeader}>
              <div>
                <h2>Comentarii din comunitate ({comentarii.length})</h2>
                <p className={styles.commentsSub}>
                  Întrebări, impresii și păreri de la ceilalți utilizatori
                </p>
              </div>
              <div className={styles.ratingSummary}>
                <span className={styles.ratingBig}>★ {medieRating}</span>
                <small>din 5</small>
              </div>
            </div>

            <form
              className={styles.commentForm}
              onSubmit={handleAdaugaComentariu}
              noValidate
            >
              <div className={styles.commentFormTop}>
                <input
                  type="text"
                  value={autorComentariu}
                  onChange={(e) => setAutorComentariu(e.target.value)}
                  placeholder="Numele tău"
                  className={styles.commentNameInput}
                />

                <div
                  className={styles.starPicker}
                  role="radiogroup"
                  aria-label="Alege nota"
                >
                  <span>Notă:</span>
                  {[1, 2, 3, 4, 5].map((stea) => (
                    <button
                      key={stea}
                      type="button"
                      className={
                        stea <= ratingComentariu
                          ? `${styles.starBtn} ${styles.starActive}`
                          : styles.starBtn
                      }
                      onClick={() => setRatingComentariu(stea)}
                      aria-label={`${stea} stele`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows="3"
                value={textComentariu}
                onChange={(e) => setTextComentariu(e.target.value)}
                placeholder="Lasă un comentariu sau o întrebare despre acest produs..."
                className={styles.commentTextarea}
              />

              {eroareComentariu && <p className="error">{eroareComentariu}</p>}

              <div className={styles.commentFormActions}>
                <button
                  type="submit"
                  className="btn"
                  disabled={trimiteComentariu}
                >
                  {trimiteComentariu ? "Se publică..." : "Publică comentariul"}
                </button>
              </div>
            </form>

            <ul className={styles.commentsList}>
              {comentarii.map((c) => {
                const aVotat = Boolean(voturiUtile[c.id]);
                const totalUtil = (c.util || 0) + (aVotat ? 1 : 0);

                return (
                  <li key={c.id} className={styles.commentCard}>
                    <div className={styles.commentAvatar}>
                      {initiale(c.autor)}
                    </div>
                    <div className={styles.commentBody}>
                      <div className={styles.commentMeta}>
                        <div>
                          <strong>{c.autor}</strong>
                          <span className={styles.commentDate}>{c.data}</span>
                        </div>
                        <span
                          className={styles.commentStars}
                          aria-label={`${c.rating || 5} din 5 stele`}
                        >
                          {"★".repeat(c.rating || 5)}
                          {"☆".repeat(5 - (c.rating || 5))}
                        </span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                      <button
                        type="button"
                        className={
                          aVotat
                            ? `${styles.helpfulBtn} ${styles.helpfulActive}`
                            : styles.helpfulBtn
                        }
                        onClick={() => handleToggleUtil(c.id)}
                      >
                        👍 Util ({totalUtil})
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className={styles.sideRail}>
          <div className={`panel ${styles.sellerCard}`}>
            <span className={styles.railLabel}>Despre vânzător</span>
            <div className={styles.sellerTop}>
              <div className={styles.avatar}>
                <span>TL</span>
                <span className={styles.onlineDot} />
              </div>
              <div className={styles.sellerInfo}>
                <strong>Membru activ Târg Local</strong>
                <span>★ 4.9 • Răspunde în ~15 min</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.msgToggleBtn}
              onClick={() => {
                setMesajDeschis((prev) => !prev);
                setMesajTrimis(false);
              }}
            >
              {mesajDeschis
                ? "Închide fereastra de mesaj"
                : "💬 Trimite un mesaj vânzătorului"}
            </button>

            {mesajDeschis && (
              <div className={styles.msgDrawer}>
                {mesajTrimis ? (
                  <p className={styles.msgSuccess}>
                    ✓ Mesajul tău a fost trimis! Vei primi răspuns în curând.
                  </p>
                ) : (
                  <>
                    <div className={styles.quickChips}>
                      {MESAJE_RAPIDE.map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={styles.quickChip}
                          onClick={() => setTextMesaj(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <form
                      className={styles.msgForm}
                      onSubmit={handleTrimiteMesaj}
                    >
                      <input
                        type="text"
                        value={textMesaj}
                        onChange={(e) => setTextMesaj(e.target.value)}
                        placeholder="Scrie mesajul tău..."
                      />
                      <button type="submit" className="btn">
                        Trimite
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={`panel ${styles.specsCard}`}>
            <span className={styles.railLabel}>Fișă rapidă anunț</span>
            <dl className={styles.specsList}>
              <div className={styles.specRow}>
                <dt>Status</dt>
                <dd>
                  {produs.gata
                    ? "Indisponibil"
                    : esteRezervat
                      ? "Rezervat 24h"
                      : "Disponibil"}
                </dd>
              </div>
              <div className={styles.specRow}>
                <dt>Categorie</dt>
                <dd>{etichetaText}</dd>
              </div>
              <div className={styles.specRow}>
                <dt>Zonă predare</dt>
                <dd>{produs.zona ?? "Nespecificat"}</dd>
              </div>
              <div className={styles.specRow}>
                <dt>Eco-Impact</dt>
                <dd>🌱 −{eco.co2Kg} kg CO₂</dd>
              </div>
              <div className={styles.specRow}>
                <dt>Cod anunț</dt>
                <dd>#{produs.id}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {recomandari.length > 0 && (
        <div className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <h2>Alte descoperiri din comunitate</h2>
            <Link to="/" className={styles.seeAllLink}>
              Vezi toate →
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {recomandari.map((item) => (
              <Link
                key={item.id}
                to={`/produse/${item.id}`}
                className={styles.relatedCard}
              >
                <div className={styles.relatedImgWrap}>
                  {item.imagine && (
                    <img
                      src={item.imagine}
                      alt={item.titlu}
                      className={styles.relatedImg}
                    />
                  )}
                </div>
                <div className={styles.relatedBody}>
                  <span className={styles.relatedZone}>
                    {item.zona ?? "Local"}
                  </span>
                  <strong>{item.titlu}</strong>
                  <span className={styles.relatedPrice}>
                    {item.pret ?? "Gratuit"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {schimbDeschis && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSchimbDeschis(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Propune un schimb"
        >
          <form
            className={`panel ${styles.tradeModal}`}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handlePropuneSchimb}
          >
            <div className={styles.tradeHeader}>
              <h2>🤝 Propune un schimb</h2>
              <button
                type="button"
                className={styles.tradeClose}
                onClick={() => setSchimbDeschis(false)}
              >
                ✕
              </button>
            </div>
            <p className={styles.tradeIntro}>
              Pentru <strong>{produs.titlu}</strong> — alege un produs existent sau scrie ce oferi la schimb.
            </p>

            <label className={styles.tradeField}>
              Numele tău
              <input
                type="text"
                value={autorSchimb}
                onChange={(e) => setAutorSchimb(e.target.value)}
                placeholder="Ex: Maria Popescu"
              />
            </label>

            {alteProduseActive.length > 0 && (
              <label className={styles.tradeField}>
                Alege un produs din listă (opțional)
                <select
                  value={produsOferitSelect}
                  onChange={(e) => setProdusOferitSelect(e.target.value)}
                >
                  <option value="">— Sau scrie mai jos produsul tău —</option>
                  {alteProduseActive.map((p) => (
                    <option key={p.id} value={p.titlu}>
                      {p.titlu} ({p.pret ?? "Gratuit"})
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className={styles.tradeField}>
              Ce oferi la schimb
              <input
                type="text"
                value={produsOferitText}
                onChange={(e) => setProdusOferitText(e.target.value)}
                placeholder="Ex: Căști Bluetooth aproape noi / Cărți SF"
              />
            </label>

            <label className={styles.tradeField}>
              Diferență suplimentară în RON (opțional)
              <input
                type="number"
                min="0"
                value={diferentaSchimb}
                onChange={(e) => setDiferentaSchimb(e.target.value)}
                placeholder="0"
              />
            </label>

            {eroareSchimb && <p className="error">{eroareSchimb}</p>}

            <button type="submit" className="btn" disabled={trimiteSchimb}>
              {trimiteSchimb ? "Se trimite propunerea..." : "Trimite propunerea de schimb"}
            </button>
          </form>
        </div>
      )}

      {lightboxDeschis && fotoCurenta && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxDeschis(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagine mărită"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setLightboxDeschis(false)}
            aria-label="Închide imaginea"
          >
            ✕
          </button>

          {galerie.length > 1 && (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                setFotoIndex((prev) => (prev - 1 + galerie.length) % galerie.length);
              }}
              aria-label="Imaginea anterioară"
            >
              ‹
            </button>
          )}

          <img
            src={fotoCurenta.url}
            alt={produs.titlu}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />

          {galerie.length > 1 && (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={(e) => {
                e.stopPropagation();
                setFotoIndex((prev) => (prev + 1) % galerie.length);
              }}
              aria-label="Imaginea următoare"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}