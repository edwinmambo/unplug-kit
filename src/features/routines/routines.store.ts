import { Injectable, computed, inject, signal } from '@angular/core';
import { Routine } from '../../core/models/routine.model';
import { RoutinesRepository } from '../../core/storage/routines.repository';

function uid(prefix = 'rt') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

@Injectable({ providedIn: 'root' })
export class RoutinesStore {
  private _routines = signal<Routine[]>([]);
  routines = this._routines.asReadonly();
  private repo = inject(RoutinesRepository);

  count = computed(() => this._routines().length);

  constructor() {
    this.repo.list();
  }

  load() {
    this._routines.set(this.repo.list());
  }

  createQuick(name: string, emoji = '🧘') {
    const now = Date.now();
    const routine: Routine = {
      id: uid('routine'),
      name: name.trim() || 'My routine',
      emoji,
      createdAt: now,
      updatedAt: now,
      steps: [
        { id: uid('step'), title: 'Breathe', minutes: 2, type: 'breathe' },
        { id: uid('step'), title: 'Read', minutes: 10, type: 'read' },
        { id: uid('step'), title: 'Plan tomorrow', minutes: 5, type: 'journal' },
      ],
    };

    const saved = this.repo.upsert(routine);
    this._routines.update((list) => [saved, ...list]);
    return saved;
  }

  delete(id: string) {
    this.repo.delete(id);
    this._routines.update((list) => list.filter((r) => r.id !== id));
  }
}
