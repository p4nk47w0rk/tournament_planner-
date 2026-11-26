"use client";

import { useParams } from "next/navigation";
import { useTournament } from "@/lib/tournament-context";

// Import match services needed by the wrapper
import "@/lib/services/match-service";
import "@/lib/services/goal-service";

import SchedulePage from "./_schedule-wrapper";

export default function ScheduleRoute() {
  return <SchedulePage />;
}
