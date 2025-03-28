import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar el elemento de audio
  useEffect(() => {
    // Crear un elemento de audio
    const audioElement = new Audio(BACKGROUND_MUSIC_URL);
    audioElement.loop = true;
    audioElement.volume = 0;
    audioRef.current = audioElement;
    
    // Cargar el estado de silencio desde localStorage
    const savedMuteState = localStorage.getItem('backgroundMusicMuted');
    if (savedMuteState) {
      const shouldBeMuted = savedMuteState === 'true';
      setIsMuted(shouldBeMuted);
      if (!shouldBeMuted) {
        audioElement.volume = 0.3;
        audioElement.play().catch(e => console.error('Error al reproducir audio:', e));
      }
    }
    
    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Guardar el estado de silencio en localStorage y controlar reproducción
  useEffect(() => {
    localStorage.setItem('backgroundMusicMuted', isMuted.toString());
    
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.error('Error al reproducir audio:', e));
      }
    }
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleMute}
        size="icon"
        variant="outline"
        className="bg-cyberbg border-blue-500 hover:bg-cyberdark"
      >
        {isMuted ? <VolumeX className="h-4 w-4 text-gray-400" /> : <Volume2 className="h-4 w-4 text-blue-400" />}
      </Button>
    </div>
  );
}