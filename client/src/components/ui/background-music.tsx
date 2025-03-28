import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(BACKGROUND_MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.play().catch(e => console.error('Error al reproducir audio:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        className="bg-cyberdark border-cyberprimary hover:bg-cyberaccent"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
}