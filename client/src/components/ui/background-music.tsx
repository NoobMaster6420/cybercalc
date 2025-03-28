
import { useState } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo más liviana
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749d484.mp3';

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Función simple para reproducir/detener música
  const toggleMusic = () => {
    // Obtener el elemento audio o crearlo si no existe
    let audio = document.getElementById('cybercalc-audio') as HTMLAudioElement;
    
    if (!audio) {
      // Si no existe, crear un nuevo elemento de audio
      audio = new Audio(BACKGROUND_MUSIC_URL);
      audio.id = 'cybercalc-audio';
      audio.loop = true;
      audio.volume = 0.5;
      
      // Agregar el evento de finalización para actualizar el estado
      audio.onended = () => setIsPlaying(false);
      
      // Guardar el elemento en el DOM
      document.body.appendChild(audio);
    }
    
    if (isPlaying) {
      // Si está reproduciendo, pausar
      audio.pause();
      setIsPlaying(false);
    } else {
      // Si está pausado, reproducir
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              console.log('Música iniciada correctamente');
            })
            .catch(error => {
              console.error('Error al reproducir audio:', error);
              setIsPlaying(false);
            });
        }
      } catch (e) {
        console.error('Error general al intentar reproducir:', e);
      }
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleMusic}
        size="icon"
        variant="outline"
        className="bg-cyberdark border-cyberprimary hover:bg-cyberaccent flex items-center justify-center relative glow-effect"
        title={isPlaying ? "Silenciar música" : "Activar música"}
      >
        {isPlaying ? 
          <Volume2 className="h-5 w-5 text-blue-400" /> : 
          <VolumeX className="h-5 w-5 text-gray-400" />
        }
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </Button>
    </div>
  );
}
