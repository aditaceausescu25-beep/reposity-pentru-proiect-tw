Markdown
# Marketplace Local pentru Donarea sau Schimbul de Obiecte

## Descriere
O aplicație web destinată comunităților locale care facilitează economia circulară prin donarea, schimbul sau împrumutul de obiecte între vecini și membri ai aceleiași comunități (reducerea deșeurilor și sprijin reciproc).

## Modelul de Date
Fiecare obiect înregistrat în platformă conține următoarele atribute:
1. **Numele obiectului** (String): Numele descriptiv al produsului (ex: *Bicicletă pentru copii*, *Televizor vechi*).
2. **Stare** (Boolean / String): Indică disponibilitatea obiectului (*Activ / Disponibil* sau *Rezervat / Donat*).
3. **Tip operațiune** (Etichetă fixă): Selectată dintr-o listă predefinită: *Donație*, *Schimb*, *Împrumut*.
4. **Categorie** (String): Domeniul în care se încadrează obiectul (ex: *Electronice*, *Casă și Grădină*, *Haine*, *Jucării*, *Educație*).
5. **Utilizator** (String): Numele proprietarului care a publicat anunțul (necesar din etapele ulterioare).

---

## Elemente de Test (Neschimbate în toate etapele)

Aceste 3 elemente sunt folosite pentru testarea interfeței și a funcționalităților:

1. **Bicicletă pentru copii**
   * Stare: Activ (Disponibil)
   * Tip operațiune: Donație
   * Categorie: Jucării / Sport
   * Proprietar: Andrei Popescu

2. **Culegere mate clasa a X-a**
   * Stare: Finalizat / Rezervat (`done`)
   * Tip operațiune: Schimb
   * Categorie: Educație
   * Proprietar: Maria Ionescu

3. **Monitor LCD vechi**
   * Stare: Activ (Disponibil)
   * Tip operațiune: Donație
   * Categorie: Electronice
   * Proprietar: Ion Georgescu

---

## Tabel de Verificare - Etapa 1 (Mockup HTML & CSS)


| ID Regulă | Cerință Etapa 1 | Permalink Cod GitHub |
| :--- | :--- | :--- |
| **S1-R1** | Structura semantică HTML5 (header, nav, main, section, footer) | [Link cod index.html](#) |
| **S1-R2** | Folosirea variabilelor CSS în `:root` și suport pentru temă întunecată | [Link cod style.css](#) |
| **S1-R3** | Modelul cutiei resetat corect (`box-sizing: border-box`) | [Link cod style.css](#) |
| **S1-R4** | Layout principal realizat cu CSS Grid | [Link cod style.css](#) |
| **S1-R5** | Aranjarea cardurilor din catalog folosind Flexbox | [Link cod style.css](#) |
| **S1-R6** | Design responsive pentru ecrane înguste cu `@media (max-width)` | [Link cod style.css](#) |
| **S1-R7** | Cele 3 elemente de test prezente, unul marcat `done` (rezervat) | [Link cod index.html](#) |
| **S1-R8** | Jurnalul AI completat în folderul `ai-log/etapa-01.md` | [Link jurnal AI](#) |