
import { useState, useEffect } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';
import ReactAudioPlayer from 'react-audio-player';

const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('backgroundMusicMuted');
    if (savedMuteState !== null) {
      const shouldBeMuted = savedMuteState === 'true';
      setIsMuted(shouldBeMuted);
      setVolume(shouldBeMuted ? 0 : 0.3);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('backgroundMusicMuted', isMuted.toString());
  }, [isMuted]);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    setVolume(newMuteState ? 0 : 0.3);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={toggleMute}
        size="icon"
        variant="outline"
        className="bg-cyberdark border-cyberprimary hover:bg-cyberaccent"
      >
        {isMuted ? 
          <VolumeX className="h-5 w-5" /> : 
          <Volume2 className="h-5 w-5" />
        }
      </Button>
      
      <audio
        src={BACKGROUND_MUSIC_URL}
        autoPlay
        loop
        id="background-music"
        style={{ display: 'none' }}
      />
    </div>
  );
}
