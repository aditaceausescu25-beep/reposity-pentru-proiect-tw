# Jurnal utilizare AI - Etapa 6

**Prompt 1:** Cum instalez și configurez json-server pentru un proiect React cu Vite?
**Răspuns AI:** Mi-a explicat comanda necesară pentru a instala versiunea specifică (0.17.4) și cum să adaug scriptul `"api": "json-server --watch db.json --port 3001"` în fișierul `package.json`.

**Prompt 2:** Cum ar trebui să arate structura fișierului db.json pentru lista mea de produse?
**Răspuns AI:** Mi-a oferit un exemplu de bază de date JSON, sugerându-mi să mut datele mele locale din `App.jsx` într-o cheie principală numită `"produse"`.

**Prompt 3:** Cum folosesc o variabilă de mediu pentru adresa API-ului local?
**Răspuns AI:** Mi-a arătat cum să creez fișierele `.env` și `.env.example` și cum să citesc valoarea în fișierul meu `api.js` folosind `import.meta.env.VITE_API_URL`.

**Prompt 4:** Am deja o componentă complexă. Cum adaug useEffect pentru fetch fără să stric funcționalitățile existente (coș, favorite)?
**Răspuns AI:** M-a sfătuit să adaug doar două state-uri noi (`loading` și `error`) și mi-a explicat logica din interiorul `useEffect` cu funcția asincronă. Mi-a explicat de asemenea rolul variabilei `ignore` pentru curățarea efectului.

**Prompt 5:** Cum pot să afișez condiționat stările de loading și eroare în interfață?
**Răspuns AI:** Mi-a dat un exemplu folosind operatorul logic `&&` (ex: `{loading && <p>Se încarcă...</p>}`) pentru a afișa mesajele în mod dinamic înainte de a randa lista mea de produse.

**Prompt 6:** Datele se încarcă instant și nu pot vedea mesajul de "loading". Cum pot testa această stare?
**Răspuns AI:** M-a învățat un truc util: să folosesc flag-ul `--delay 4000` atunci când pornesc comanda de json-server în terminal, pentru a simula o conexiune lentă la internet.