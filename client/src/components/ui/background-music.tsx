import { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Button } from './button';
import { Volume2, VolumeX } from 'lucide-react';

// URL de música de fondo ambiental para aprendizaje
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/01/28/audio_2438267e0e.mp3';

export function BackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const [audioVolume, setAudioVolume] = useState(0);
  
  // Cargar el estado de silencio desde localStorage
  useEffect(() => {
    const savedMuteState = localStorage.getItem('backgroundMusicMuted');
    if (savedMuteState) {
      setIsMuted(savedMuteState === 'true');
      setAudioVolume(savedMuteState === 'true' ? 0 : 0.3);
    }
  }, []);
  
  // Guardar el estado de silencio en localStorage
  useEffect(() => {
    localStorage.setItem('backgroundMusicMuted', isMuted.toString());
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setAudioVolume(!isMuted ? 0 : 0.3);
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
      
      <ReactAudioPlayer
        src={BACKGROUND_MUSIC_URL}
        autoPlay
        loop
        volume={audioVolume}
        style={{ display: 'none' }}
      />
    </div>
  );
}