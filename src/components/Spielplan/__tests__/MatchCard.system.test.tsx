/**
 * System Tests: MatchCard Component
 *
 * Testet Rendering und Interaktion mit mockten Abhängigkeiten (Supabase, i18n).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MatchCard from "@/components/Spielplan/MatchCard";
import type { Match } from "@/lib/types";
import { GoalService } from "@/lib/services/goal-service";

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      field: "Platz",
      group: "Gruppe",
      finished: "Beendet",
      upcoming: "Kommend",
      goalsLabel: "Tore",
      goalEntryTitle: "Tor eintragen",
      minutePlaceholder: "Minute",
      playerPlaceholder: "Spieler",
    };
    return translations[key] || key;
  },
}));

// Mock GoalService
vi.mock("@/lib/services/goal-service", () => ({
  GoalService: {
    getGoals: vi.fn(),
    subscribeToGoals: vi.fn(() => () => {}),
  },
}));

const mockMatch: Match = {
  id: 1,
  matchNo: 1,
  time: "14:00",
  pitch: "A" as const,
  group: "A" as const,
  phase: "group" as const,
  homeTeam: "Varnsdorf",
  awayTeam: "Šluknov B",
  homeScore: 2,
  awayScore: 1,
  status: "finished" as const,
  fairplay: false,
};

describe("MatchCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render match time and pitch", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText(/Platz A/)).toBeInTheDocument();
  });

  it("should render group info", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByText(/Gruppe A/)).toBeInTheDocument();
  });

  it("should display correct score", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    // Score "2" and "1" appear in the score display
    const scoreSpans = screen.queryAllByText(/\d/);
    const scoreValues = scoreSpans.map((s) => s.textContent);
    expect(scoreValues).toContain("2");
    expect(scoreValues).toContain("1");
  });

  it("should show teams correctly", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByText("Varnsdorf")).toBeInTheDocument();
    expect(screen.getByText("Šluknov B")).toBeInTheDocument();
  });

  it("should show finished status for played match", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    expect(screen.getByText("Beendet")).toBeInTheDocument();
  });

  it("should show upcoming status for unplayed match", () => {
    const upcomingMatch = {
      ...mockMatch,
      homeScore: null,
      awayScore: null,
      status: "scheduled" as const,
    };
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={upcomingMatch} />);

    expect(screen.getByText("Kommend")).toBeInTheDocument();
  });

  it("should render team badges with short names", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    // Team badges render short names
    expect(screen.getByText("VAR")).toBeInTheDocument();
  });

  it("should render editable mode with score buttons", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} editable />);

    // Editable mode shows +/- buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should call onScoreChange when score button clicked", () => {
    const mockChange = vi.fn();
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} editable onScoreChange={mockChange} />);

    const buttons = screen.getAllByRole("button");
    // Click the last button (should be + for away team)
    fireEvent.click(buttons[buttons.length - 1]);

    expect(mockChange).toHaveBeenCalledWith(1, "away", 1);
  });

  it("should render all team logos for known teams", () => {
    vi.mocked(GoalService.getGoals).mockResolvedValue([]);
    render(<MatchCard match={mockMatch} />);

    // Both team badges should render
    const badges = document.querySelectorAll("[class*='rounded-lg']");
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });
});
