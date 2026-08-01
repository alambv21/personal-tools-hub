@import "tailwindcss";

/* Enable class-based dark mode (Tailwind v4 defaults to prefers-color-scheme).
   Our theme.js toggles the `.dark` class on <html>, so `dark:` utilities must
   respond to that class, not the OS color scheme. Without this line every
   `dark:` utility in the project is dead code and the theme toggle button
   does nothing. */
@custom-variant dark (&:where(.dark, .dark *));

/* Design System v1.0 Global Custom CSS Utilities */

:root {
  --container-width: 1280px;
  --content-width: 1100px;
  --btn-radius: 14px;
  --card-radius: 20px;
  --input-radius: 14px;
  --dialog-radius: 24px;
}

/* Custom Smooth Transitions */
.transition-smooth {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Print styles for exportable content */
@media print {
  header, footer, nav, button {
    display: none !important;
  }
}
