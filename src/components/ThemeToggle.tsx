"use client";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.classList.add("theme-switching");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // private browsing — preference just won't persist
    }
    window.setTimeout(() => root.classList.remove("theme-switching"), 500);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{ cursor: "none" }}
    >
      {/* Sun — shown in light mode */}
      <svg
        className="icon-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="4.4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.7 5.3l-1.84 1.84M7.14 16.86 5.3 18.7M18.7 18.7l-1.84-1.84M7.14 7.14 5.3 5.3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {/* Moon — shown in dark mode */}
      <svg
        className="icon-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
