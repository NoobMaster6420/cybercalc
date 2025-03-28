import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Cargar el tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
      document.documentElement.classList.toggle('dark-theme', savedTheme === 'dark');
    }
  }, []);
  
  // Guardar el tema en localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('light-theme', !isDarkMode);
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <Button 
      onClick={toggleTheme}
      size="icon"
      variant="outline"
      className="bg-cyberbg border-blue-500 hover:bg-cyberdark"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-blue-400" />
      )}
    </Button>
  );
}