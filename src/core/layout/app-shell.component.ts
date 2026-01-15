import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-dvh bg-(--bg) text-(--text)">
      <!-- Top header -->
      <header class="sticky top-0 z-20 border-b border-(--border) bg-(--bg)/80 backdrop-blur">
        <div class="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div class="flex items-center gap-2">
            <span class="text-lg">📵</span>
            <span class="font-semibold tracking-tight">Unplug Kit</span>
          </div>

          <button
            type="button"
            class="rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm font-medium active:scale-[0.98]"
          >
            Start ✨
          </button>
        </div>
      </header>

      <!-- Main content -->
      <main class="mx-auto max-w-md pb-24">
        <router-outlet />
      </main>

      <!-- Bottom nav -->
      <nav
        class="fixed bottom-0 left-0 right-0 z-30 border-t border-(--border) bg-(--bg)/80 backdrop-blur"
        style="padding-bottom: env(safe-area-inset-bottom);"
      >
        <div class="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
          <a
            routerLink="/"
            routerLinkActive="text-[var(--text)]"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-(--muted) active:scale-[0.98]"
          >
            <span class="text-lg leading-none">🏠</span>
            <span class="font-medium">Home</span>
          </a>

          <a
            routerLink="/routines"
            routerLinkActive="text-[var(--text)]"
            class="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-(--muted) active:scale-[0.98]"
          >
            <span class="text-lg leading-none">🧘</span>
            <span class="font-medium">Routines</span>
          </a>

          <a
            routerLink="/library"
            routerLinkActive="text-[var(--text)]"
            class="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-(--muted) active:scale-[0.98]"
          >
            <span class="text-lg leading-none">🔁</span>
            <span class="font-medium">Swaps</span>
          </a>

          <a
            routerLink="/settings"
            routerLinkActive="text-[var(--text)]"
            class="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs text-(--muted) active:scale-[0.98]"
          >
            <span class="text-lg leading-none">⚙️</span>
            <span class="font-medium">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  `,
})
export class AppShellComponent {}
