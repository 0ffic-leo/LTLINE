# LTLINE — Kuadri Bazë

**ID e dokumentit:** LTLINE-DOC-00  
**Revizioni:** 1.1  
**Statusi:** PROJEKT

## 1. Qëllimi

Ky dokument përcakton arkitekturën bazë të sistemit të dokumentacionit të LTLINE dhe mënyrën se si organizohen dokumentet korporative, komerciale, teknike, operative, financiare, të cilësisë, sigurisë dhe projekteve.

## 2. Fusha e veprimit

Sistemi mbulon planifikimin, produktet, shitjet, ofertat, prokurimin, magazinën, projektet, instalimin, testimin, komisionimin, dorëzimin, garancinë, shërbimin pas shitjes, financat, HR, HSE dhe përgatitjen për eksport.

## 3. Parimet e kontrollit

- Çdo dokument i kontrolluar ka ID, revizion dhe status.
- Të dhënat teknike duhet të jenë të gjurmueshme deri te burimi.
- Shifrat financiare ndahen në `SUPozim`, `OFERTË`, `FAKT` dhe `PARASHIKIM`.
- Procedurat duhet të jenë praktike dhe të auditueshme.
- Cilësia dhe siguria zbatohen në të gjitha fazat.
- Të dhënat e pakonfirmuara shënohen `TBD` dhe nuk shpiken.

## 4. Statuset

- `PROJEKT` — në përgatitje
- `SHQYRTIM` — për kontroll
- `MIRATUAR` — për përdorim zyrtar
- `ARKIVUAR` — version i zëvendësuar

## 5. Arkitektura e dokumentacionit

`docs/sq/` është burimi kanonik për dokumentacionin shqiptar. Brenda tij dokumentet ndahen në: dokumente themelore, SOP, formularë, projekte, regjistra, shitje, magazinë, HR, HSE dhe eksport.

## 6. Burimi dhe gjurmueshmëria

Dokumentet teknike duhet të referojnë dokumentacionin e prodhuesit, specifikimet e miratuara, standardet/kërkesat e zbatueshme ose burimin tjetër të verifikueshëm. Supozimet e brendshme nuk paraqiten si certifikime ose specifikime të prodhuesit.
