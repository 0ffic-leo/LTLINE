# LTLINE QR & Service Web App

## Qëllimi
Web-aplikacion për identifikimin me QR dhe menaxhimin e shërbimit pas shitjes.

## Modulet V1
- Paneli kryesor
- Skanimi dhe zgjidhja e QR
- Projekte / Objekte
- Produkte
- Pajisje dhe Asete
- Garanci
- Kërkesa shërbimi
- Mirëmbajtje
- Historik ndërhyrjesh
- Dokumente dhe evidenca
- Klientë
- Përdorues dhe role

## ID
Formati bazë: `LTLINE-{TIPI}-{VITI}-{NUMRI}`.

Shembull: `LTLINE-H100-2026-0001`.

## Parim
QR-ja është hyrje në një rekord të kontrolluar; të dhënat reale të klientëve nuk vendosen në kodin QR vetë.

## Supabase
Aplikacioni përdor Supabase JS 2 nga CDN dhe konfigurimin publik në `supabase-config.js`.

- `url` është URL-ja publike e projektit.
- `anonKey` duhet të jetë vetëm **anon/publishable key**.
- Mos vendos kurrë `service_role` ose çelësa sekretë në frontend.
- Siguria e tabelave mbështetet në RLS.

Për dashboard-in përdoret RPC-ja `get_dashboard_stats()` që kthen vetëm numra agregatë. Migration-i ndodhet te `supabase/migrations/20260831_dashboard_stats.sql` dhe duhet të ekzekutohet një herë në SQL Editor nëse nuk është aplikuar automatikisht.

## Faza
1. UI/MVP — përfunduar
2. Database bazë — përfunduar
3. Lidhja me Supabase — në zhvillim
4. Autentikimi dhe rolet
5. QR real me kamerë
6. Garanci/servis/mirëmbajtje
7. Integrime dhe njoftime
