## 1. Instrumente utilizate
* **Asistent AI:** Google Gemini
* **Mediu de dezvoltare:** Visual Studio Code (VS Code)
* **Tehnologii și biblioteci:** React 18, Vite, JavaScript (ES6+), CSS3 (cu variabile native și suport pentru Dark Mode)

---

## 2. Solicitări cheie și obiective realizate

### A. Implementarea stării locale (`useState`) pentru lista de produse
* **Întrebat:** Cum pot păstra lista de obiecte în state-ul componentei principale `App` și cum o pot afișa dinamic?
* **Primit:** S-a utilizat hook-ul `useState` din React. Array-ul inițial a fost redenumit în `PRODUSE_INITIALE` pentru a sublinia că reprezintă doar starea de pornire a aplicației.
* **Modificat sau personalizat:** Am adaptat structura datelor la tema proprie de **Marketplace Local**, incluzând atribute specifice precum `id`, `titlu`, `gata` (statusul de disponibilitate), `eticheta` (Donatie/Schimb/Vanzare), `pret`, `descriere`, `motivVanzare`, `zona` și `imagine`.

### B. Actualizări imutabile pentru bifare și ștergere
* **Întrebat:** Cum pot modifica elementele dintr-o listă fără a muta sau altera direct array-ul original (respectând principiul imutabilității din React)?
* **Primit:** S-au implementat funcțiile de actualizare bazate pe funcția de callback `setProduse((prev) => ...)`. 
  * Pentru bifare (`handleToggle`): s-a folosit metoda `.map()` împreună cu operatorul spread (`{ ...p, gata: !p.gata }`) pentru a genera un obiect nou doar pentru elementul modificat.
  * Pentru ștergere (`handleDelete`): s-a utilizat metoda `.filter()` pentru a elimina elementul selectat pe baza ID-ului unic.

### C. Valori derivate și contoare dinamice
* **Întrebat:** Este necesar să păstram numărul de elemente active într-un state separat?
* **Primit:** S-a explicat conceptul de **valoare derivată**. Contorul de anunțuri active nu se stochează într-un `useState` dedicat, ci se calculează automat la fiecare randare direct din listă:
  ```javascript
  const active = produse.filter((p) => !p.gata).length;