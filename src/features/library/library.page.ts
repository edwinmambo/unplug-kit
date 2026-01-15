import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-library-page',
  template: `
    <div class="p-4">
      <h1 class="text-xl font-semibold">Swaps 🔁</h1>
      <p class="mt-1 text-sm text-(--muted)">Replace scroll triggers with analog actions.</p>
    </div>
  `,
})
export class LibraryPage {}
