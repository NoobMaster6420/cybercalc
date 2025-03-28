
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(false);
  const [audioCreated, setAudioCreated] = useState(false);
  
  // Crear el elemento de audio una vez al cargar el componente
  useEffect(() => {
    if (audioCreated) return;
    
    // Crear elemento de audio oculto
    const audioElement = document.createElement('audio');
    audioElement.id = 'background-music';
    audioElement.src = BACKGROUND_MUSIC_URL;
    audioElement.loop = true;
    audioElement.style.display = 'none';
    audioElement.volume = 0.3;
    document.body.appendChild(audioElement);
    
    setAudioCreated(true);
    
    // Intentar reproducir automáticamente cuando el usuario interactúe con la página
    const tryAutoplay = () => {
      const audio = document.getElementById('background-music') as HTMLAudioElement;
      if (audio) {
        audio.play()
          .then(() => {
            setIsMuted(false);
            // Remover los event listeners una vez que se reproduce
            document.removeEventListener('click', tryAutoplay);
            document.removeEventListener('keydown', tryAutoplay);
            document.removeEventListener('touchstart', tryAutoplay);
            document.removeEventListener('mousemove', tryAutoplay);
          })
          .catch(err => {
            console.error("No se pudo reproducir automáticamente:", err);
          });
      }
    };
    
    // Agregar event listeners para detectar interacción del usuario
    document.addEventListener('click', tryAutoplay);
    document.addEventListener('keydown', tryAutoplay);
    document.addEventListener('touchstart', tryAutoplay);
    document.addEventListener('mousemove', tryAutoplay);
    
    // Limpiar al desmontar
    return () => {
      const audio = document.getElementById('background-music');
      if (audio) {
        document.body.removeChild(audio);
      }
      
      document.removeEventListener('click', tryAutoplay);
      document.removeEventListener('keydown', tryAutoplay);
      document.removeEventListener('touchstart', tryAutoplay);
      document.removeEventListener('mousemove', tryAutoplay);
    };
  }, [audioCreated]);
  
  // Función para alternar entre silenciar/reproducir
  const toggleMute = () => {
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.play()
        .then(() => {
          setIsMuted(false);
        })
        .catch(err => {
          console.error("Error al reproducir:", err);
        });
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
