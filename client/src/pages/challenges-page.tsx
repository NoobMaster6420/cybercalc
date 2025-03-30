import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ChallengeCard from "@/components/challenges/challenge-card";
import NoLives from "@/components/game/no-lives";
import { Loader2, RefreshCw, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { ChallengeQuestion, UserProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Latex } from "@/components/ui/latex";

export default function ChallengesPage() {
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: challenges, isLoading: isLoadingChallenges } = useQuery<ChallengeQuestion[]>({
    queryKey: ["/api/challenges"],
  });

  // Query to get user progress
  const { data: userProgress, refetch: refetchUserProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
    enabled: !!user,
  });

  // Mutation to update lives
  const updateLivesMutation = useMutation({
    mutationFn: async (lives: number) => {
      const res = await apiRequest("PATCH", "/api/user/lives", { lives });
      return await res.json();
    },
    onSuccess: () => {
      refetchUserProgress();
    },
  });

  // Mutation to save challenge result
  const saveChallengeMutation = useMutation({
    mutationFn: async (challengeData: { score: number }) => {
      const res = await apiRequest("POST", "/api/challenges", challengeData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Reto completado!",
        description: `Has ganado ${challengeScore} puntos.`,
      });
      refetchUserProgress();
    },
  });

  const getRandomChallenge = () => {
    if (!challenges || challenges.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  };

  const handleStartChallenge = () => {
    setCurrentChallenge(getRandomChallenge());
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (!showResult) {
      setSelectedOption(optionId);
    }
  };

  const handleVerifyAnswer = () => {
    if (selectedOption) {
      setShowResult(true);
      const isCorrect = selectedOption === currentChallenge?.correctOptionId;
      
      if (isCorrect) {
        // Add points
        const points = currentChallenge?.points || 0;
        setChallengeScore(points);
        
        // Save challenge result
        saveChallengeMutation.mutate({ score: points });
      } else {
        // Decrease lives if incorrect and lives > 0
        if (userProgress && userProgress.lives > 0) {
          updateLivesMutation.mutate(userProgress.lives - 1);
        }
        
        toast({
          title: "Respuesta incorrecta",
          description: "Has perdido una vida",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Selecciona una opción",
        description: "Debes seleccionar una opción antes de verificar",
        variant: "destructive",
      });
    }
  };

  const handleTryAgain = () => {
    setCurrentChallenge(getRandomChallenge());
    setSelectedOption(null);
    setShowResult(false);
    setChallengeScore(0);
  };

  if (isLoadingChallenges) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyberprimary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar los retos. Por favor, intenta de nuevo.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Check if user has no lives
  if (userProgress && userProgress.lives <= 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-cyber font-bold text-center mb-8">
              Retos <span className="text-cyberaccent">Aleatorios</span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <NoLives onReset={() => refetchUserProgress()} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-cyber font-bold text-center mb-8">
            Retos <span className="text-cyberaccent">Aleatorios</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            {!currentChallenge ? (
              <motion.div 
                className="bg-cyberbg rounded-lg p-6 cyber-border mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-cyberprimary mx-auto mb-4" />
                  <h2 className="text-2xl font-cyber font-semibold mb-2">¡Desafíate con un Reto!</h2>
                  <p className="text-gray-300 mb-6">Pon a prueba tus conocimientos con ejercicios de derivación sorpresa.</p>
                  <Button 
                    className="cyber-btn bg-cyberprimary hover:bg-purple-700 text-white font-medium rounded-md px-6 py-3"
                    onClick={handleStartChallenge}
                  >
                    Comenzar Reto
                  </Button>
                </div>
              </motion.div>
            ) : (
              <ChallengeCard
                challenge={currentChallenge}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                onVerifyAnswer={handleVerifyAnswer}
                showResult={showResult}
                onTryAgain={handleTryAgain}
              />
            )}
            
            <div className="bg-cyberbg p-6 rounded-lg cyber-border mt-8">
              <h2 className="text-xl font-cyber font-semibold mb-4 text-white">¿Quieres otro reto?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cyberdark p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Reto Rápido</h3>
                  <p className="text-gray-300 mb-4">Un problema de derivación que puedes resolver en 2 minutos.</p>
                  <Button 
                    className="cyber-btn bg-cybersecondary hover:bg-blue-700 text-white rounded-md px-4 py-2"
                    onClick={handleStartChallenge}
                  >
                    Intentar
                  </Button>
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium mb-2 text-cyberaccent">Reto Avanzado</h3>
                  <p className="text-gray-300 mb-4">Un problema más complejo que pondrá a prueba tus habilidades.</p>
                  <Button 
                    className="cyber-btn bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2"
                    onClick={handleStartChallenge}
                  >
                    Desafiarme
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
