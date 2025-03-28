
import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(BACKGROUND_MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.remove();
      }
    };
  }, []);

  const toggleMute = async () => {
    if (!audioRef.current || !isLoaded) return;

    try {
      if (isMuted) {
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        disabled={!isLoaded}
        className="bg-cyberdark border-cyberprimary hover:bg-cyberaccent"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}
