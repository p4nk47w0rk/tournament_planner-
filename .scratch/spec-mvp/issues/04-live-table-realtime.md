# T04: Live-Tabelle + Realtime-Updates

**Was zu bauen ist:** Die Gruppenstand-Tabelle berechnet sich automatisch aus den Spiel-Ergebnissen und aktualisiert sich in Echtzeit, wenn der Admin einen Score ändert.

**Blocked by:** T03 (MatchCard), T01 (goals DB)

**Status:** ready-for-agent

- [ ] `calculateStandings()` Funktion: Nimmt Match-Array, berechnet: Spiele, Siege, Unentschieden, Niederlagen, Tore, TD, Punkte
- [ ] `src/lib/tournament-data.ts`: Standings-Interface erweitern um `played`, `points` etc.
- [ ] StandingsTable Component: Zeigt `# | Team | S | U | N | Tore | TD | Punkte`
- [ ] Sortierung: Punkte (desc) → TD (desc) → Tore (desc)
- [ ] Supabase Realtime Subscription auf `matches` table changes → Tabelle aktualisiert sich automatisch
- [ ] Gäste sehen die aktualisierte Tabelle ohne Page-Reload
- [ ] Admin-Feedback: Kurze visuelle Rückmeldung ("✓ Score aktualisiert")
