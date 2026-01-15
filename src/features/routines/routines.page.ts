import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-routines-page',
  template: `
    <div class="p-4">
      <h1 class="text-xl font-semibold">Routines 🧘</h1>
      <p class="mt-1 text-sm text-(--muted)">Build calming step-by-step routines.</p>
    </div>
  `,
})
export class RoutinesPage {}
