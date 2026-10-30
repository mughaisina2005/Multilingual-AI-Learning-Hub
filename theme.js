/**
 * MULTILINGUAL AI LEARNING HUB — UNIVERSAL THEME ENGINE
 * Supports: 'light', 'dark', 'system' (OS preference)
 * Persists in localStorage and synchronizes with server /api/user/settings
 */

(function () {
  const THEME_KEY = 'hub_theme_preference';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const effectiveTheme = theme === 'system' ? getSystemPreference() : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-theme-setting', theme);

    // Update meta theme-color if present
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = effectiveTheme === 'dark' ? '#0b1329' : '#f0f9ff';

    // Dispatch custom event for components
    window.dispatchEvent(new CustomEvent('hubThemeChanged', { detail: { theme, effectiveTheme } }));
  }

  // Initial immediate application before DOM render to prevent flashing
  const savedTheme = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(savedTheme);

  // Listen for OS system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const currentSetting = document.documentElement.getAttribute('data-theme-setting') || 'system';
      if (currentSetting === 'system') {
        applyTheme('system');
      }
    });
  }

  // Global HubTheme Controller
  window.HubTheme = {
    getTheme() {
      return document.documentElement.getAttribute('data-theme-setting') || localStorage.getItem(THEME_KEY) || 'system';
    },

    getEffectiveTheme() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    setTheme(newTheme, syncServer = true) {
      if (!['light', 'dark', 'system'].includes(newTheme)) return;
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme(newTheme);

      if (syncServer) {
        fetch('/api/user/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: newTheme })
        }).catch(err => console.warn('Could not sync theme to server:', err));
      }
    },

    // Sync from server settings (called after authentication)
    async syncFromServer() {
      try {
        const res = await fetch('/api/user/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && data.settings.theme) {
            localStorage.setItem(THEME_KEY, data.settings.theme);
            applyTheme(data.settings.theme);
          }
        }
      } catch (err) {
        // Fallback to local
      }
    }
  };
})();
