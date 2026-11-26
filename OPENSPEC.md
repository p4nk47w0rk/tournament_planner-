# OpenSpec — Tournament Planner Workflow

Dieses Dokument definiert den einzigen Workflow für das Projekt.
Jeder Agent (menschlich oder KI) folgt diesem Ablauf — keine Ausnahmen.

---

## Das Prinzip

```
Idee → Spec → Tickets → Implement → Test → Review → Merge
```

Jeder Schritt hat einen eigenen Skill. Kein Schritt wird übersprungen.

---

## Der Workflow

### 1. `to-spec` — Anforderungen → Spezifikation

```
/to-spec <Anforderungen>
```

- Wandelt Nutzeranforderungen in eine strukturierte SPEC.md um
- 29 User Stories, 6 Module, Architektur-Entscheidungen
- Akzeptanzkriterien pro Story
- **Output:** `SPEC.md` (Single Source of Truth)

**Trigger:** Neue Features, Änderungen am Produkt, Diskussionen

---

### 2. `to-tickets` — Spec → Tickets

```
/to-spec
/to-tickets
```

- Zerteilt SPEC.md in vertikale Tickets (T01–T20)
- Dependency-Order (T02 blockiert auf T01)
- Labels: `mvp`, `ready-for-agent`, `frontend`, `backend`, etc.
- **Output:** GitHub Issues (oder lokal im `.scratch/` Ordner)

**Trigger:** Nach finalisiertem Spec

---

### 3. `implement` — Ticket implementieren

```
/implement T01
```

Das ist der **wichtigste Skill**. Er folgt streng diesem Ablauf:

#### Phase A: Verstehen
- Ticket lesen (GitHub Issue oder lokale Datei)
- **Acceptance Criteria** extrahieren
- Abhängigkeiten prüfen (was muss VORHER fertig sein?)
- Bestehenden Code lesen (keine Annahmen machen!)

#### Phase B: Test-First (TDD Red)
- **`tdd` Skill laden** bevor ein einziger Zeilen Code geschrieben wird
- Erst Tests schreiben (Unit + Integration für die neue Funktionalität)
- Tests müssen FEHLEN (rot) — das ist das Commitment

#### Phase C: Implementieren (TDD Green)
- Minimalen Code schreiben bis Tests BESTEHEN (grün)
- Kein Refactoring vor den Tests — nur genug um grün zu machen
- Jede Zeile Code muss einen Test rechtfertigen

#### Phase D: Refactorieren (TDD Refactor)
- Code bereinigen: Duplicate entfernen, Namen verbessern, Struktur glätten
- Tests MÜSSEN nach dem Refactoring immer noch bestehen
- Wenn ein Test nach dem Refactoring fällt → Refactoring rückgängig

#### Phase E: Verifizieren
- **`code-review` Skill laden** (siehe unten)
- Alle Acceptance Criteria durchgehen
- TypeScript: `npx tsc --noEmit` — 0 errors
- Linting: `pnpm lint` — 0 warnings/errors
- Commit: Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.)

**Wichtig:**
- Niemals Code committen bevor `tsc --noEmit` durchläuft
- Niemals ein Ticket schließen bevor `code-review` alles abgenickt hat
- Niemals ein Ticket anfangen bevor alle Dependencies closed sind

---

### 4. `tdd` — Test-Driven Development

```
/tdd <Beschreibung der Funktion>
```

Der `tdd` Skill sorgt dafür, dass Tests zuerst kommen.

**Workflow:**
1. Test schreiben (der FEHLEN MUSS)
2. `tsc --noEmit` — Typen prüfen
3. Code schreiben (so wenig wie möglich)
4. Tests BESTEHEN (grün)
5. Refactor (Test bleibt grün)

**Test-Priorität:**
1. **Unit Tests** — pure functions (z.B. `calculateStandings()`)
2. **Integration Tests** — Service + DB/API
3. **Component Tests** — React Components
4. **E2E Tests** — Playwright (T20, am Ende)

**Test-Locations:**
- Unit/Integration: `__tests__/` oder `*.test.ts` neben dem Code
- Components: `*.test.tsx` neben der Komponente
- E2E: `e2e/` Ordner

---

### 5. `code-review` — Qualitätssicherung

```
/code-review
```

Der `code-review` Skill prüft ALLES vor dem Merge.

**Review-Achsen (parallel sub-agent):**

| Achse | Frage | Tool |
|-------|-------|------|
| **Standards** | Folgt der Code den repo-internen Regeln? | Sub-agent `read` + `grep` |
| **Spec** | Entspricht der Code den Acceptance Criteria? | Sub-agent gegen SPEC.md |

**Checkliste:**

- [ ] Tests geschrieben UND bestanden
- [ ] `tsc --noEmit` — 0 errors
- [ ] `pnpm lint` — 0 warnings
- [ ] Keine Console.logs im Production Code
- [ ] Keine `any` Types (außer in Migration-Skripten)
- [ ] Keine hardcoded secrets (nur env vars!)
- [ ] Mobile-first: Touch-Targets ≥ 44px
- [ ] Accessibility: aria-labels, keyboard nav
- [ ] Error handling: try/catch auf allen API Calls
- [ ] Loading states: Skeleton/Spinner auf allen Daten-Views
- [ ] Dark mode: Alle Elemente haben `dark:` Varianten
- [ ] i18n: Keine hardcoded Strings (nur `t('key')`)

**Review-Regeln:**
- Jeder "blocker" muss gefixt werden VOR dem Merge
- "nice-to-have" → als neues Ticket (nicht im PR)
- Review kommentieren → fixen → noch mal reviewen

---

### 6. `diagnosing-bugs` — Fehler debugging

```
/diagnose <Beschreibung des Problems>
```

Nur wenn etwas BROKEN ist:

1. **Reproduzieren** — Error exakt nachstellen
2. **Hypothesen aufstellen** — Mögliche Ursachen
3. **Hypothesen test/en** — Systematisch ausschließen
4. **Fix implementieren** — Mit Test gegen Regression
5. **Verifizieren** — Fix funktioniert in allen Szenarien

---

### 7. `grilling` — Entscheidung stress-testen

```
/grill <Entscheidung/Plan>
```

Nur bei ARCHITEKTUR-Entscheidungen:

1. Annahmen benennen
2. Schwachstellen angreifen
3. Alternativen diskutieren
4. Finale Entscheidung dokumentieren (ADR)

---

## Quick Reference

```
Neues Feature:
  1. /to-spec → SPEC.md
  2. /to-tickets → GitHub Issues
  3. /implement T01 → Phase A→B→C→D→E
     ├── /tdd Tests schreiben
     └── /code-review Review
  4. Commit: "feat: T01 description"
  5. GitHub Issue auf "done" setzen

Bug:
  1. /diagnose Problem
  2. /tdd Test für Bug schreiben
  3. Fix implementieren
  4. /code-review
  5. Commit: "fix: description"

Refactoring:
  1. /tdd Tests schreiben (für bestehende Funktionalität!)
  2. Refactor (Tests bleiben grün)
  3. /code-review
  4. Commit: "refactor: description"
```

---

## Skills im Detail

Alle Skills liegen unter `.agents/skills/`:

| Skill | Aufgabe |
|-------|---------|
| `to-spec` | Anforderungen → SPEC.md |
| `to-tickets` | SPEC.md → GitHub Issues |
| `implement` | Ticket implementieren (Phase A–E) |
| `tdd` | Test-Driven Development |
| `code-review` | Qualitätssicherung (Standards + Spec) |
| `diagnosing-bugs` | Fehler debugging |
| `grilling` | Entscheidung stress-testen |
| `domain-modeling` | Domänen-Modell, Glossar, ADR |
| `prototype` | Throwaway-Prototypen für Designfragen |

---

## Regeln (immer gelten, nie ignorieren)

1. **Tests zuerst** — Kein Code ohne Test
2. **TypeScript Strict** — Keine `any` (außer Migrationen)
3. **Linter durchläuft** — Kein Commit mit `pnpm lint` errors
4. **Review vor Merge** — Kein Commit ohne `/code-review`
5. **Eine Sache pro Commit** — Atomic commits
6. **Commit Messages** — Conventional Commits (`feat:`, `fix:`, `refactor:`)
7. **Spek zuerst** — Keine Implementierung ohne Spec
8. **Ticket zuerst** — Keine Implementierung ohne Ticket
9. **Dependenz-Kette** — T02 erst wenn T01 closed ist
