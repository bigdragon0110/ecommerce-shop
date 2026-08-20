"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("housho-theme");
    const enabled = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("housho-theme", next ? "dark" : "light");
  };

  return <button type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={dark} className={`hidden md:flex absolute -bottom-[50px] right-0 w-14 h-[50px] items-center justify-center z-30 transition-colors ${dark ? "bg-black text-[#ffc400] hover:bg-[#111]" : "bg-[#5c5d60] text-white hover:bg-[#4b4c4f]"}`}>
    {dark ? <Sun size={19} /> : <Moon size={19} />}
  </button>;
}
