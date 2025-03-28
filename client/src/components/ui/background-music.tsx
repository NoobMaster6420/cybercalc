
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  
  // Crear el elemento de audio una vez al cargar el componente
  useEffect(() => {
    const audioExists = document.getElementById('background-music') as HTMLAudioElement;
    
    if (!audioExists) {
      // Agregamos un elemento audio visible para solucionar
      // el problema de reproducción automática
      const audioTag = document.createElement('audio');
      audioTag.id = 'background-music';
      audioTag.src = BACKGROUND_MUSIC_URL;
      audioTag.loop = true;
      audioTag.controls = true; // Mostrar controles para interacción inicial
      audioTag.style.position = 'absolute';
      audioTag.style.bottom = '80px';
      audioTag.style.right = '20px';
      audioTag.style.width = '250px';
      audioTag.style.zIndex = '50';
      audioTag.style.opacity = '0.8';
      audioTag.volume = 0.3;
      
      document.body.appendChild(audioTag);
      
      // Agregar un listener para ocultar los controles después de la primera reproducción
      audioTag.addEventListener('play', () => {
        setIsMuted(false);
      });
      
      audioTag.addEventListener('pause', () => {
        setIsMuted(true);
      });
    }
    
    // Limpieza
    return () => {
      const audioElement = document.getElementById('background-music');
      if (audioElement) {
        audioElement.remove();
      }
    };
  }, []);
  
  const toggleMute = () => {
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.play()
        .then(() => setIsMuted(false))
        .catch(err => console.error("Error al reproducir:", err));
    } else {
      audioElement.pause();
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleMute}
        size="icon"
        variant="outline"
        className="bg-cyberdark border-cyberprimary hover:bg-cyberaccent"
        title={isMuted ? "Activar música" : "Silenciar música"}
      >
        {isMuted ? 
          <VolumeX className="h-5 w-5" /> : 
          <Volume2 className="h-5 w-5" />
        }
      </Button>
    </div>
  );
}
