export type RoutineStepType = 'breathe' | 'read' | 'journal' | 'walk' | 'custom';

export interface RoutineStep {
  id: string;
  title: string;
  minutes: number; // keep whole minutes for MVP simplicity
  type: RoutineStepType;
}

export interface Routine {
  id: string;
  name: string;
  emoji: string; // 🧘 📖 ✍️ etc
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  steps: RoutineStep[];
}
