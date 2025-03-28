import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Función para aplicar tema
  const applyTheme = (isDark: boolean) => {
    // Remover clases anteriores
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Aplicar la nueva clase
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
  
  // Cargar el tema desde localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Si no hay tema guardado, usar dark por defecto
    const prefersDark = savedTheme ? savedTheme === 'dark' : true;
    
    setIsDarkMode(prefersDark);
    applyTheme(prefersDark);
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    applyTheme(newMode);
  };
  
  return (
    <Button 
      onClick={toggleTheme}
      size="icon"
      variant="outline"
      className="bg-cyberbg border-blue-500 hover:bg-cyberdark"
      title={isDarkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-blue-400" />
      )}
    </Button>
  );
}