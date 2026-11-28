/**
 * Guest View Types — TeamInfo + getTeamInfo helper
 *
 * Pure function + interface, no React dependencies.
 * Used by GuestMatchCard and other guest-view components.
 */

export interface TeamInfo {
  name: string;
  shortName: string;
  color: string;
  logo?: string;
}

export function getTeamInfo(teamName: string): TeamInfo {
  const teamNames = [
    "Varnsdorf",
    "Šluknov B",
    "Česká Lípa A",
    "Grossharthau",
    "Vilémov",
    "SFA Jiřetín",
    "Neusalza",
    "Šluknov A",
    "Česká Lípa B",
    "Union Děčín",
  ];
  const teamIndex = teamNames.indexOf(teamName);
  const colors = [
    "#1e40af",
    "#dc2626",
    "#059669",
    "#d97706",
    "#7c3aed",
    "#be185d",
    "#0891b2",
    "#65a30d",
    "#b45309",
    "#4338ca",
  ];
  return {
    name: teamName,
    shortName: teamName.slice(0, 3).toUpperCase(),
    color: colors[teamIndex] ?? "#94a3b8",
    logo: undefined,
  };
}
