
import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TheoryPage from "@/pages/theory-page";
import QuizPage from "@/pages/quiz-page";
import ChallengesPage from "@/pages/challenges-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import GamePage from "@/pages/game-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { BackgroundMusic } from "@/components/ui/background-music";

// URL de música de fondo más liviana
const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_8cb749d484.mp3';

// Componente que inicializa el audio al cargar la aplicación
function MusicInitializer() {
  useEffect(() => {
    // Crear elemento de audio una sola vez
    const audio = new Audio(MUSIC_URL);
    audio.id = 'background-audio-player';
    audio.loop = true;
    audio.volume = 0.4;
    
    // Función para intentar reproducir automáticamente
    const tryToPlay = () => {
      audio.play()
        .then(() => {
          console.log('Música iniciada automáticamente');
          // Una vez que se reproduce con éxito, eliminamos los event listeners
          document.removeEventListener('click', tryToPlay);
          document.removeEventListener('touchstart', tryToPlay);
          document.removeEventListener('keydown', tryToPlay);
        })
        .catch(error => {
          console.warn('No se pudo iniciar la música automáticamente:', error);
        });
    };
    
    // Agregar event listeners para interacción del usuario
    document.addEventListener('click', tryToPlay);
    document.addEventListener('touchstart', tryToPlay);
    document.addEventListener('keydown', tryToPlay);
    
    // Limpieza al desmontar
    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', tryToPlay);
      document.removeEventListener('touchstart', tryToPlay);
      document.removeEventListener('keydown', tryToPlay);
    };
  }, []);
  
  return null; // Este componente no renderiza nada
}

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/teoria" component={TheoryPage} />
      <ProtectedRoute path="/quiz" component={QuizPage} />
      <ProtectedRoute path="/retos" component={ChallengesPage} />
      <ProtectedRoute path="/ranking" component={LeaderboardPage} />
      <ProtectedRoute path="/juegos-historia" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-cyberdark">
          <MusicInitializer />
          <Router />
          <Toaster />
          <BackgroundMusic />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
