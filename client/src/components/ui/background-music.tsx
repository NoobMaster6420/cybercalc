
import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = BACKGROUND_MUSIC_URL;
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Precargar el audio
    audio.load();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
          })
          .catch(error => {
            console.error("Error reproduciendo audio:", error);
          });
      }
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
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
