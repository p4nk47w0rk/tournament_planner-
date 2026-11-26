# T03: MatchCard — Score & Tore-Feed (Bundesliga-Style)

**Was zu bauen ist:** Die Match-Card zeigt den Score zwischen zwei Teams und einen chronologischen Tore-Feed darunter — ähnlich wie bei einer Bundesliga-Übertragung. Im Admin-Modus kann der Admin Scores und Tore erfassen.

**Blocked by:** T01 (Setup & DB-Schema), T02 (Admin-Auth-Flow)

**Status:** ready-for-agent

- [ ] Neue `Goal` Interface und Types in `src/lib/tournament-data.ts`
- [ ] Score-Eingabe für Admin: `[+] Tor [Heim]` / `[−] Tor [Gast]` Buttons + optionale Inputs für Zeit und Spielername
- [ ] Tore-Feed darunter: `⚽ 12' Vilémov (M. Fukal)` oder `⚽ Varnsdorf` (ohne Zeit/Name)
- [ ] Gäste sehen nur Score + Feed (read-only)
- [ ] Admin sieht Inputs + Buttons (edit-mode)
- [ ] Spielstatus-Anzeige: `scheduled` | `live` | `finished`
- [ ] Zeit + Spielfeld (A/B) + Gruppe (A/B) als Metadaten
- [ ] Responsive: auf Mobile wird die Card schmaler, Inputs werden blockierend
- [ ] Verwendet Supabase Client zum Speichern von Score und Goals
