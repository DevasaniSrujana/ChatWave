const ThemeToggle = ({ theme, setTheme }) => {
  return (
    <button
      className="btn btn-sm btn-outline absolute top-4 right-4 z-50"
      onClick={() => setTheme(theme === "corporate" ? "dark" : "corporate")}
    >
      {theme === "corporate" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;
