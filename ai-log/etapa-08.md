# Jurnal utilizare AI - Etapa 8

**Prompt 1:** Cum organizez rutele în React Router ca să am un header și un footer comune pe toate paginile, fără să le repet?
**Răspuns AI:** Mi-a explicat cum funcționează ruta părinte `<Route element={<Layout />}>` împreună cu `<Outlet />` și cum trebuie înfășurat `<App />` în `<BrowserRouter>` în `main.jsx`.

**Prompt 2:** Cum fac să marchez automat pagina activă în bara de navigație, fără să rămână mereu activ linkul spre `/`?
**Răspuns AI:** Mi-a arătat cum să folosesc `<NavLink>` cu funcția `({ isActive })` și mi-a atras atenția să pun atributul `end` pe linkul către `/` ca să facă potrivire exactă.

**Prompt 3:** Am mutat stilurile în fișiere `.module.css`, dar cum combin o clasă globală din `index.css` (de exemplu `.panel`) cu o clasă locală din modul?
**Răspuns AI:** Mi-a explicat că clasele comune rămân ca text simplu, iar cele locale se folosesc cu `styles.nume`, putând fi combinate într-un template string (ex: ``className={`panel ${styles.detail}`}``).

**Prompt 4:** După ce am instalat `react-router-dom` și am pus `<BrowserRouter>`, am primit ecran gol și eroarea `Invalid hook call` / `Cannot read properties of null (reading 'useRef')` în consolă. De unde vine?
**Răspuns AI:** Mi-a explicat că eroarea apare când se încarcă două instanțe de React sau când pachetul a fost instalat în folderul greșit. Am verificat `node_modules` din rădăcină, am reinstalat `react-router-dom` în `frontend/` și am curățat cache-ul Vite cu `npx vite --force`, după care aplicația a pornit corect.

**Prompt 5:** Cum tratez corect în pagina de detaliu un ID inexistent (ex: `/produse/999`) și cum verific rapid atributele `data-testid` noi?
**Răspuns AI:** M-a sfătuit să prind eroarea 404 din `fetchProdus(id)` în state-ul `error` ca să afișez un mesaj și un link înapoi spre listă, și mi-a indicat comenzile `querySelectorAll` din consolă pentru a verifica `nav` și `detail-title`.