import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiCardComponent } from '../../shared/ui/ui-card.component';

@Component({
  standalone: true,
  selector: 'app-routine-detail-page',
  imports: [UiCardComponent, RouterLink],
  template: `
    <div class="p-4 space-y-4">
      <a routerLink="/routines" class="text-sm font-semibold hover:underline">← Back</a>

      <app-ui-card>
        <p class="text-sm font-medium">Routine details 🧩</p>
        <p class="mt-1 text-sm text-(--muted)">ID: {{ id }}</p>
        <p class="mt-3 text-sm text-(--muted)">
          Next milestone: full routine builder (edit steps, reorder, total time).
        </p>
      </app-ui-card>
    </div>
  `,
})
export class RoutineDetailPage {
  private route = inject(ActivatedRoute);
  id = this.route.snapshot.paramMap.get('id') ?? '';
}
