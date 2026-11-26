# T05: Playoffs strukturieren + existierende Features reparieren

**Was zu bauen ist:** Playoff-Brackettstruktur als Daten hinzufügen und bestehende UI-Features (Dark Mode, i18n, Countdown) reparieren/überprüfen.

**Blocked by:** T03 (MatchCard), T04 (Live-Tabelle)

**Status:** ready-for-agent

**Playoffs:**
- [ ] Playoff-Spiele in `src/lib/tournament-data.ts` hinzufügen:
  - Play-in: 3. A vs 4. A, 3. B vs 4. B
  - Viertelfinale: 1A vs PI-Winner2, 2B vs PI-Winner1, 1B vs PI-Winner1, 2A vs PI-Winner2
  - Halbfinale: 2 Spiele
  - Finale + Platz 3: 2 Spiele
  - Sieger-Markierung (`vítěz`)
- [ ] Playoff-Ansicht auf Spielplan-Seite (separater Tab oder Sektion)
- [ ] Admin kann Playoff-Spiele ebenso wie Gruppenspiele bearbeiten (Score, Tore)

**Bestehende Features reparieren:**
- [ ] Dark Mode testen und ggf. reparieren (next-themes)
- [ ] i18n Sprachwechsel reparieren (aktuell: `window.location.reload()` ist suboptimal)
- [ ] Countdown-Timer testen und ggf. reparieren (Hydration-Fix: `new Date()` server/client mismatch)
- [ ] Alle Übersetzungen vorhanden (DE + CS)
