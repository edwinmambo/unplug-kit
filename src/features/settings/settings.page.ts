import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  template: `
    <div class="p-4">
      <h1 class="text-xl font-semibold">Settings ⚙️</h1>
      <p class="mt-1 text-sm text-(--muted)">Theme, export/import, and preferences.</p>
    </div>
  `,
})
export class SettingsPage {}
