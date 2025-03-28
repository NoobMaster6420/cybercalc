
import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';
import ReactAudioPlayer from 'react-audio-player';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  
  // Cargar el estado de silencio desde localStorage al iniciar
  useEffect(() => {
    const savedMuteState = localStorage.getItem('backgroundMusicMuted');
    if (savedMuteState !== null) {
      const shouldBeMuted = savedMuteState === 'true';
      setIsMuted(shouldBeMuted);
      setVolume(shouldBeMuted ? 0 : 0.3);
    }
  }, []);
  
  // Guardar el estado de silencio en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('backgroundMusicMuted', isMuted.toString());
  }, [isMuted]);
  
  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    setVolume(newMuteState ? 0 : 0.3);
    console.log("Cambiando estado de música:", newMuteState ? "Silenciado" : "Reproduciendo");
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
      
      <ReactAudioPlayer
        src={BACKGROUND_MUSIC_URL}
        autoPlay
        loop
        volume={volume}
        style={{ display: 'none' }}
        controls={false}
      />
    </div>
  );
}
