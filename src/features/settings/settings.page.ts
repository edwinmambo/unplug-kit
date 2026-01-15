import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';
import { UiCardComponent } from '../../shared/ui/ui-card.component';
import { UiButtonComponent } from '../../shared/ui/ui-button.component';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [UiCardComponent, UiButtonComponent],
  template: `
    <div class="p-4 space-y-4">
      <div>
        <h1 class="text-xl font-semibold">Settings ⚙️</h1>
        <p class="mt-1 text-sm text-(--muted)">Make it yours.</p>
      </div>

      <app-ui-card>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium">Theme 🌗</p>
            <p class="mt-0.5 text-sm text-(--muted)">Toggle between dark and light.</p>
          </div>

          <app-ui-button variant="secondary" size="sm" (click)="toggleTheme()">
            {{ themeLabel }}
          </app-ui-button>
        </div>
      </app-ui-card>

      <app-ui-card>
        <p class="text-sm font-medium">Coming soon ✨</p>
        <p class="mt-1 text-sm text-(--muted)">
          Export/Import routines, installable PWA, and guided sessions.
        </p>
      </app-ui-card>
    </div>
  `,
})
export class SettingsPage {
  private readonly theme = inject(ThemeService);

  constructor() {
    this.theme.init();
  }

  get themeLabel() {
    return this.theme.current === 'dark' ? 'Dark 🌑' : 'Light ☀️';
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
