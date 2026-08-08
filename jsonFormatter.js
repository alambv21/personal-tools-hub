/**
  * Theme Utility Manager for Personal Tools Hub
  */
export function initTheme() {
  const savedTheme = localStorage.getItem('pth_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    return true;
  } else {
    document.documentElement.classList.remove('dark');
    return false;
  }
}

export function toggleTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('pth_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('pth_theme', 'light');
  }
}
