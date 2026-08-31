# LTLINE – SISTEMI DIGJITAL QR DHE SHËRBIMIT

**ID e dokumentit:** LTLINE-DOC-11  
**Revizioni:** 1.0  
**Statusi:** PROJEKT

## 1. Qëllimi

Ky dokument përcakton arkitekturën bazë të sistemit LTLINE për identifikimin digjital me QR Code dhe menaxhimin e shërbimeve pas shitjes. Sistemi synon të lidhë produktin, projektin, dokumentacionin teknik, garancinë, mirëmbajtjen dhe historikun e ndërhyrjeve me një identifikues unik.

## 2. Parimi kryesor

**Një ID unike = një objekt/produkt/aset = një dosje digjitale e gjurmueshme.**

QR Code nuk përdoret vetëm si element grafik. Ai duhet të shërbejë si hyrje e shpejtë në informacionin e autorizuar për produktin, projektin ose shërbimin.

## 3. Identifikimi

Formati i rekomanduar fillestar është:

`LTLINE-[KATEGORIA]-[VITI]-[NUMRI]`

Shembull:

`LTLINE-H100-2026-0001`

ID-ja duhet të jetë unike dhe të mos ripërdoret për një objekt tjetër.

## 4. Përdorimet e QR Code

- Identifikimi i produktit LTLINE HOME 100.
- Identifikimi i pajisjeve dhe aseteve të instaluara.
- Hyrje në dokumentacionin teknik.
- Verifikim i dokumenteve dhe certifikatave të autorizuara.
- Hapje e historikut të mirëmbajtjes.
- Hapje e historikut të servisit.
- Hapje e të dhënave të garancisë.
- Krijim i kërkesës së shërbimit.

## 5. Informacioni i shërbimit

Portali i shërbimit duhet të mundësojë, sipas autorizimit të përdoruesit:

- ID-në e objektit/produktit;
- modelin dhe përshkrimin;
- datën e instalimit;
- statusin e garancisë;
- dokumentet përkatëse;
- historikun e mirëmbajtjes;
- raportet e ndërhyrjeve;
- pjesët e përdorura ose të zëvendësuara;
- fotografitë e shërbimit;
- kërkesat aktive dhe statusin e tyre.

## 6. Rrjedha e shërbimit

**Skanim QR → Identifikim → Kërkesë shërbimi → Planifikim → Ndërhyrje → Raport pune → Pjesët/materialet → Verifikim → Mbyllje → Përditësim i historikut.**

## 7. QR statik dhe dinamik

Për dokumente ose informacion të pandryshueshëm mund të përdoret QR statik. Për produkte, asete dhe shërbime afatgjata preferohet QR dinamik, ku adresa e destinacionit mund të menaxhohet pa zëvendësuar etiketën fizike.

## 8. Siguria dhe privatësia

QR Code nuk duhet të ekspozojë drejtpërdrejt të dhëna personale ose dokumente konfidenciale. QR duhet të çojë në një pikë të kontrolluar të sistemit dhe autorizimi duhet të zbatohet sipas rolit të përdoruesit.

## 9. Integrimi me dokumentacionin LTLINE

Sistemi lidhet me:

- SOP-006 – Garancia dhe Pas-Shitja;
- formularët e kërkesës dhe raportit të shërbimit;
- regjistrin e mirëmbajtjes;
- regjistrin e projekteve;
- regjistrin e klientëve;
- regjistrin e aseteve;
- dokumentacionin teknik;
- regjistrin e rishikimeve.

## 10. Strukturë e rekomanduar e portalit

**LTLINE SERVICE**

- Të dhënat e produktit
- Dokumentet
- Garancia
- Kërko servis
- Historiku i servisit
- Mirëmbajtja
- Foto/raporte
- Kontakti LTLINE

## 11. Fazat e zbatimit

### Faza 1 – Standardi
Përcaktimi i ID-ve, QR-ve, roleve dhe rregullave të informacionit.

### Faza 2 – Regjistri qendror
Krijimi i regjistrit të produkteve/aseteve dhe lidhja me ID unike.

### Faza 3 – Portal shërbimi
Ndërtimi i ndërfaqes web për klientë dhe teknikë.

### Faza 4 – Automatizimi
Krijimi automatik i QR-ve, kërkesave të shërbimit, raporteve dhe përditësimit të historikut.

### Faza 5 – Zgjerimi
Integrim gradual me sistemet e shitjes, projektit, magazinës dhe financave.

## 12. Rregull kontrolli

Asnjë QR Code nuk duhet të shpërndahet si QR zyrtar LTLINE pa një ID të regjistruar dhe një destinacion të kontrolluar.

## 13. Dokumentet që do të krijohen

- **QR-001** – Standardi i QR Code
- **QR-002** – Identifikimi i Produkteve
- **QR-003** – Identifikimi i Pajisjeve dhe Aseteve
- **QR-004** – Menaxhimi i Garancisë Digjitale
- **QR-005** – Kërkesa e Shërbimit
- **QR-006** – Historiku i Mirëmbajtjes
- **QR-007** – Verifikimi Digjital i Dokumenteve

Këto dokumente/formularë do të zhvillohen në përputhje me këtë dokument bazë dhe do të kenë të njëjtin kontroll të ID-së dhe revizionit si dokumentacioni tjetër LTLINE.
