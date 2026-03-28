
const applyTheme = (isDark) => {
  const root = document.documentElement;

  if (isDark) {
    root.style.setProperty("--bg", "#0f0f13");
    root.style.setProperty("--bg-side", "#0b0b0f");
    root.style.setProperty("--bg-nav", "rgba(15,15,19,0.96)");
    root.style.setProperty("--text", "#f0eef8");
    root.style.setProperty("--muted", "#6b7280");
    root.style.setProperty("--active", "#c4b5fd");
    root.style.setProperty("--border", "rgba(255,255,255,0.07)");
    root.style.setProperty("--accent", "#7c3aed");
    root.style.setProperty("--accent-s", "rgba(124,58,237,0.13)");
    root.style.setProperty("--accent-g", "rgba(124,58,237,0.08)");
    root.style.setProperty("--accent-b", "rgba(124,58,237,0.28)");
    root.style.setProperty("--ubg", "rgba(124,58,237,0.16)");
    root.style.setProperty("--uborder", "rgba(124,58,237,0.28)");
    root.style.setProperty("--utext", "#ede9fe");
    root.style.setProperty("--ai-text", "#c4c2d0");
    root.style.setProperty("--hover", "rgba(255,255,255,0.05)");
    root.style.setProperty("--item-active", "rgba(124,58,237,0.14)");
    root.style.setProperty("--shadow", "0 6px 24px rgba(0,0,0,0.55)");
    root.style.setProperty("--danger", "#f87171");
    root.style.setProperty("--danger-bg", "rgba(239,68,68,0.08)");
  } else {
    root.style.setProperty("--bg", "#fafaf9");
    root.style.setProperty("--bg-side", "#f4f3f1");
    root.style.setProperty("--bg-nav", "rgba(250,250,249,0.96)");
    root.style.setProperty("--text", "#1c1b22");
    root.style.setProperty("--muted", "#8a8790");
    root.style.setProperty("--active", "#6d28d9");
    root.style.setProperty("--border", "rgba(0,0,0,0.08)");
    root.style.setProperty("--accent", "#6d28d9");
    root.style.setProperty("--accent-s", "rgba(109,40,217,0.08)");
    root.style.setProperty("--accent-g", "rgba(109,40,217,0.06)");
    root.style.setProperty("--accent-b", "rgba(109,40,217,0.2)");
    root.style.setProperty("--ubg", "rgba(109,40,217,0.08)");
    root.style.setProperty("--uborder", "rgba(109,40,217,0.18)");
    root.style.setProperty("--utext", "#2d1b6b");
    root.style.setProperty("--ai-text", "#3d3a4a");
    root.style.setProperty("--hover", "rgba(0,0,0,0.04)");
    root.style.setProperty("--item-active", "rgba(109,40,217,0.08)");
    root.style.setProperty("--shadow", "0 4px 16px rgba(0,0,0,0.1)");
    root.style.setProperty("--danger", "#dc2626");
    root.style.setProperty("--danger-bg", "rgba(220,38,38,0.07)");
  }
};

export default applyTheme;

export const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); }

.md p { margin-bottom:6px }
.md h1,.md h2,.md h3 { font-weight:600; color:var(--text); margin:10px 0 4px }
.md code { background:var(--accent-s); color:var(--accent); padding:1px 5px; border-radius:4px; font-size:12px }
.md pre { background:var(--bg-side); border:1px solid var(--border); border-radius:8px; padding:12px; overflow-x:auto }
.md ul,.md ol { padding-left:16px }

.msgs::-webkit-scrollbar { width:3px }
.msgs::-webkit-scrollbar-thumb { background:var(--accent-b) }

.ci:hover { background:var(--hover) }
.ci:hover .ci-dot { opacity:1 !important }
.ci.active { background:var(--item-active) }
.ci.active .ci-title { color:var(--active); font-weight:600 }
`;