<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` (resolved from this file's directory; in
monorepos the `next` package may not be visible from the repo root) before
writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at
`node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a
diff only re-creates the uncommitted change; committing it with your work keeps
the tree clean.

<!-- END:nextjs-agent-rules -->

## Projekt-Workflow: OpenSpec

Dieses Projekt folgt einem strikten Workflow. Siehe [`OPENSPEC.md`](OPENSPEC.md)
für die vollständigen Details.

**Kurzfassung:**

```
Spec → Tickets → Implement → TDD → Code-Review → Merge
```

**Regeln (nie ignorieren):**

1. **TDD — Test First (immer!)** — Für JEDE Aufgabe (Feature und Bugfix):
   - **Phase Rot**: Erster Schritt IMMER ein schreibender Test (`vi`).
   - **Phase Grün**: Nur genug Code schreiben, damit der Test grün wird.
   - **Phase Refactor**: Aufräumen ohne Test-Änderungen.
   - Kein Produktivcode schreiben ohne vorherigen failing Test.
   - Immer `/tdd` Skill laden bevor Arbeit beginnt.
2. **Review vor Merge** — Immer `/code-review` Skill nutzen
3. **TypeScript Strict** — Keine `any`, `pnpm lint` muss clean durchlaufen
4. **Ticket zuerst** — Keine Implementierung ohne Ticket
5. **Dependenz-Kette** — Tickets in Dependency-Order abarbeiten

**Wichtige Skills:**

- `/to-spec` — Anforderungen → SPEC.md
- `/to-tickets` — SPEC.md → GitHub Issues
- `/implement` — Ticket implementieren (Phase A–E)
- `/tdd` — Test-Driven Development
- `/code-review` — Qualitätssicherung (Standards + Spec)
- `/diagnose` — Fehler debugging

## Arbeitsbereich: Branch-Convention

**WICHTIG — Nie direkt auf `main` arbeiten!**

Alle Änderungen erfolgen auf Feature-/Fix-Branches. Main ist nur für Merge-Commits offen.

**Branch-Namenskonvention:**

- `feat/kurzbeschreibung` — Neue Features
- `fix/kurzbeschreibung` — Bugfixes
- `chore/kurzbeschreibung` — Wartung/Infrastruktur (Dependencies, CI, Config)
- `docs/kurzbeschreibung` — Dokumentationsänderungen

**Beispiele:**

- `fix/pnpm-action-setup-node-24`
- `feat/admin-dashboard`
- `chore/update-eslint-config`

**Workflow:**

1. Branch erstellen: `git checkout -b feat/mein-feature main`
2. Commits auf dem Branch machen
3. Push: `git push origin feat/mein-feature`
4. PR auf main erstellen und mergen
5. Branch nach Merge löschen: `git branch -d feat/mein-feature`

**Regeln:**

- Auf `main` nur Merge-Commits durch PRs
- Branch-Namen kleingeschrieben, Bindestriche statt Unterstriche
- Beschreibung im Branch-Namen knapp und prägnant
