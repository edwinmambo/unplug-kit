export interface SessionLog {
  id: string;
  routineId: string;
  routineName: string;
  routineEmoji: string;

  startedAt: number;
  endedAt: number;

  plannedMinutes: number;
  completedMinutes: number;

  stepsPlanned: number;
  stepsCompleted: number;

  endedReason: 'completed' | 'ended_early';
}
