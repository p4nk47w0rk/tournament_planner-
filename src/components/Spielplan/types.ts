export interface Phase {
  key: string;
  label: string;
  colSpan: number;
}

export const PHASES: Phase[] = [
  { key: "play_in", label: "Play-in", colSpan: 4 },
  { key: "quarterfinal", label: "Viertelfinale", colSpan: 2 },
  { key: "semifinal", label: "Halbfinale", colSpan: 2 },
  { key: "final", label: "Finale", colSpan: 1 },
];
