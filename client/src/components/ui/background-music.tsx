
import React, { useState } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    // Obtener el elemento de audio (o crearlo si no existe)
    let audioElement = document.getElementById('background-music') as HTMLAudioElement;
    
    if (!audioElement) {
      // Crear el elemento si no existe
      audioElement = document.createElement('audio');
      audioElement.id = 'background-music';
      audioElement.src = BACKGROUND_MUSIC_URL;
      audioElement.loop = true;
      audioElement.style.display = 'none';
      audioElement.volume = 0.3;
      document.body.appendChild(audioElement);
    }
    
    // Alternar el estado
    if (isMuted) {
      // Activar el audio
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Reproduciendo música");
            setIsMuted(false);
          })
          .catch(err => {
            console.error("Error al reproducir:", err);
            alert("Por favor, intenta hacer clic de nuevo para activar la música. Los navegadores requieren interacción del usuario para reproducir audio automáticamente.");
          });
      }
    } else {
      // Desactivar el audio
      audioElement.pause();
      setIsMuted(true);
      console.log("Música pausada");
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
