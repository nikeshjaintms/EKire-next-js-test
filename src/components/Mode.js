// components/Mode.js
import { useEffect } from "react";

const Mode = () => {
  useEffect(() => {
    const themeToggleBtn = document.querySelector(".header-dark");
    const sunLogo = document.querySelector(".sun-logo");
    const moonLogo = document.querySelector(".moon-logo");

    const handleThemeToggle = () => {
      sunLogo?.classList.toggle("sun");
      moonLogo?.classList.toggle("moon");

      const isDark = document.body.classList.contains("dark");

      if (isDark) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("theme-mode", "light");
      } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("theme-mode", "dark");
      }
    };

    // Attach click event
    themeToggleBtn?.addEventListener("click", handleThemeToggle);

    

    // Cleanup
    return () => {
      themeToggleBtn?.removeEventListener("click", handleThemeToggle);
    };
  }, []);

  return (
    <li className="header-dark" style={{ cursor: 'pointer' }}>
      <div className="sun-logo head-icon">
        <i className="iconoir-sun-light"></i>
      </div>
      <div className="moon-logo head-icon">
        <i className="iconoir-half-moon"></i>
      </div>
    </li>
  );
};

export default Mode;
