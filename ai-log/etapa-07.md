# Jurnal utilizare AI - Etapa 7

**Prompt 1:** Cum pot scrie o funcție generică de fetch în React care să suporte POST, PATCH și DELETE fără să repet același cod?
**Răspuns AI:** Mi-a explicat cum să creez o funcție de utilitate care folosește `...options` pentru a adăuga dinamic metoda HTTP și `body`-ul cererii. De asemenea, mi-a reamintit să tratez cazul `204 No Content` la ștergere.

**Prompt 2:** Ce face mai exact `e.preventDefault()` într-un formular și de ce am nevoie de el în React?
**Răspuns AI:** Mi-a clarificat că previne reîncărcarea întregii pagini (comportamentul nativ HTML) și m-a sfătuit să îl pun mereu prima linie în funcția `handleSubmit`.

**Prompt 3:** Primesc eroarea `Cannot read properties of undefined (reading 'gata')` în componenta ProdusCard, deși datele vin de la server. Cum investighez?
**Răspuns AI:** M-a îndrumat să verific proprietățile (props) transmise din componenta părinte. Urmând sfatul, am descoperit că uitasem să pasez prop-ul `produs={produs}` în interiorul funcției `map` din listă.

**Prompt 4:** Aplicația nu se mai randează și Vite îmi dă o eroare `[PARSE_ERROR] Expected '...' but found '}'`.
**Răspuns AI:** Mi-a explicat că am lăsat un comentariu invalid în interiorul unui tag JSX. Mi-a arătat cum se comentează corect în JSX (`{/* comentariu */}`) și astfel am putut curăța codul.

**Prompt 5:** Cum pot să testez dacă butonul meu se dezactivează corect la trimitere, din moment ce serverul meu local răspunde instantaneu?
**Răspuns AI:** Mi-a sugerat să pornesc `json-server` cu un flag suplimentar, `--delay 3000`, pentru a simula o rețea lentă. Astfel am putut vizualiza starea de "Se salvează...".