# Etapa 2: Jurnal AI

## Instrumente
- Gemini / ChatGPT / Copilot în VS Code (păstrează doar instrumentul folosit efectiv)


## Solicitări cheie

### 1. Metode de array imutabile și operatorul spread
- Întrebat: Cum pot implementa operații pe liste în JavaScript fără a modifica array-ul original?
- Primit: S-a sugerat utilizarea metodelor de array precum `.map()`, `.filter()` și a operatorului spread `[...]` pentru adăugarea elementelor sau comutarea stării în mod imutabil.
- Modificat sau respins: Am adaptat denumirile proprietăților și ale câmpurilor pentru a se potrivi cu tema proiectului meu de Marketplace Local (de exemplu, `produse`, `eticheta`, `gata`).

### 2. Generarea sigură a unui ID unic
- Întrebat: De ce este incorectă utilizarea `array.length + 1` pentru ID-uri și cum se folosește `.reduce()` în schimb?
- Primit: S-a furnizat o funcție `nextId` folosind `reduce` pentru a găsi cel mai mare ID existent și a-l incrementa cu 1, evitând duplicatele după ștergerea elementelor.
- Modificat sau respins: Am integrat funcția `nextId` direct în logica de adăugare a produselor.

## Ce am învățat / ce nu a funcționat
- Am învățat principiul fundamental al imutabilității și de ce crearea de referințe noi pentru array-uri/obiecte este crucială pentru etapele viitoare (cum ar fi React).
- Am exersat metode avansate de array (`map`, `filter`, `find`, `reduce`) pentru a manipula datele eficient.
- Am verificat cu succes toată logica și mesajele de validare direct în consola browserului (F12).