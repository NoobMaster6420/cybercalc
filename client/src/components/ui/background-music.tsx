
import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audioElement = new Audio(BACKGROUND_MUSIC_URL);
    audioElement.loop = true;
    audioRef.current = audioElement;
    
    const playAudio = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.error('Error al reproducir audio:', e));
      }
    };

    // Intentar reproducir cuando el usuario interactúe
    document.addEventListener('click', playAudio, { once: true });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', playAudio);
    };
  }, []);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.pause();
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.error('Error al reproducir audio:', e));
      }
    }
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
