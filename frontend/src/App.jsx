import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProdusePage from "./pages/ProdusePage.jsx";
import ProdusDetaliuPage from "./pages/ProdusDetaliuPage.jsx";
import CosPage from "./pages/CosPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ContPage from "./pages/ContPage.jsx";
import DesprePage from "./pages/DesprePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function incarcaDinStorage(cheie, fallback) {
  try {
    const salvat = localStorage.getItem(cheie);
    return salvat ? JSON.parse(salvat) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [cos, setCos] = useState(() => incarcaDinStorage("marketplace_cos", []));
  const [favorite, setFavorite] = useState(() =>
    incarcaDinStorage("marketplace_favorite", [])
  );
  const [comenzi, setComenzi] = useState(() =>
    incarcaDinStorage("marketplace_comenzi", [])
  );
  const [compara, setCompara] = useState([]);
  const [notificareCos, setNotificareCos] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("marketplace_cos", JSON.stringify(cos));
    } catch {
      // ignoră eroarea de storage
    }
  }, [cos]);

  useEffect(() => {
    try {
      localStorage.setItem("marketplace_favorite", JSON.stringify(favorite));
    } catch {
      // ignoră eroarea de storage
    }
  }, [favorite]);

  useEffect(() => {
    try {
      localStorage.setItem("marketplace_comenzi", JSON.stringify(comenzi));
    } catch {
      // ignoră eroarea de storage
    }
  }, [comenzi]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function adaugaInCos(produs) {
    if (produs.gata) return;

    setCos((prev) => {
      const exista = prev.find((item) => item.id === produs.id);
      if (exista) {
        return prev.map((item) =>
          item.id === produs.id
            ? { ...item, cantitate: item.cantitate + 1 }
            : item
        );
      }
      return [...prev, { ...produs, cantitate: 1 }];
    });

    setNotificareCos({ id: Date.now(), titlu: produs.titlu });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setNotificareCos(null);
    }, 3000);
  }

  function actualizeazaCantitate(id, delta) {
    setCos((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantitate: item.cantitate + delta }
            : item
        )
        .filter((item) => item.cantitate > 0)
    );
  }

  function scoateDinCos(id) {
    setCos((prev) => prev.filter((item) => item.id !== id));
  }

  function golesteCos() {
    setCos([]);
  }

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    setFavorite((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }

  function scoateDinFavorite(id) {
    setFavorite((prev) => prev.filter((favId) => favId !== id));
  }

  function toggleCompara(produs) {
    setCompara((prev) => {
      const exista = prev.some((item) => item.id === produs.id);
      if (exista) return prev.filter((item) => item.id !== produs.id);
      if (prev.length >= 3) return [...prev.slice(1), produs];
      return [...prev, produs];
    });
  }

  function scoateDinCompara(id) {
    setCompara((prev) => prev.filter((item) => item.id !== id));
  }

  function golesteCompara() {
    setCompara([]);
  }

  function salveazaComanda(comandaNoua) {
    setComenzi((prev) => [comandaNoua, ...prev]);
  }

  const numarProduseCos = cos.reduce((sum, item) => sum + item.cantitate, 0);

  return (
    <Routes>
      <Route
        element={
          <Layout
            numarProduseCos={numarProduseCos}
            notificareCos={notificareCos}
            onInchideNotificare={() => setNotificareCos(null)}
            compara={compara}
            onScoateDinCompara={scoateDinCompara}
            onGolesteCompara={golesteCompara}
            onAdaugaInCos={adaugaInCos}
          />
        }
      >
        <Route
          path="/"
          element={
            <ProdusePage
              cos={cos}
              favorite={favorite}
              compara={compara}
              onToggleFavorite={toggleFavorite}
              onScoateDinFavorite={scoateDinFavorite}
              onToggleCompara={toggleCompara}
              onScoateDinCompara={scoateDinCompara}
              onAdaugaInCos={adaugaInCos}
              onScoateDinCos={scoateDinCos}
            />
          }
        />
        <Route
          path="/produse/:id"
          element={
            <ProdusDetaliuPage
              onAdaugaInCos={adaugaInCos}
              favorite={favorite}
              compara={compara}
              onToggleFavorite={toggleFavorite}
              onToggleCompara={toggleCompara}
            />
          }
        />
        <Route
          path="/cos"
          element={
            <CosPage
              cos={cos}
              onActualizeazaCantitate={actualizeazaCantitate}
              onScoateDinCos={scoateDinCos}
              onGolesteCos={golesteCos}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cos={cos}
              onGolesteCos={golesteCos}
              onSalveazaComanda={salveazaComanda}
            />
          }
        />
        <Route
          path="/cont"
          element={
            <ContPage
              comenzi={comenzi}
              favorite={favorite}
              onToggleFavorite={toggleFavorite}
              onAdaugaInCos={adaugaInCos}
            />
          }
        />
        <Route path="/despre" element={<DesprePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}