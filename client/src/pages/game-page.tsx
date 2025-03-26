import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { UserProgress, QuizQuestion, ChallengeQuestion } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Skull, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Latex } from "@/components/ui/latex";
import GameArea from "@/components/game/game-area";
import MathQuestionModal from "@/components/game/math-question-modal";
import { generateMathQuestion } from "@/lib/game-utils";

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [deathCount, setDeathCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Query to get user progress
  const { data: userProgress, refetch: refetchUserProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
    enabled: !!user,
  });

  // Get quiz and challenge questions to use for math questions
  const { data: quizQuestions } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/questions", "all"],
  });

  const { data: challengeQuestions } = useQuery<ChallengeQuestion[]>({
    queryKey: ["/api/challenges"],
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

  // Mutation to update points
  const updatePointsMutation = useMutation({
    mutationFn: async (points: number) => {
      const res = await apiRequest("PATCH", "/api/user/points", { points });
      return await res.json();
    },
    onSuccess: () => {
      refetchUserProgress();
    },
  });

  useEffect(() => {
    if (userProgress) {
      setHighScore(userProgress.points);
    }
  }, [userProgress]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setDeathCount(0);
    setCorrectAnswers(0);
    setScore(0);
    setLevel(1);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    showMathQuestion();
  };

  const showMathQuestion = () => {
    setDeathCount(prev => prev + 1);
    
    // Combine quiz and challenge questions
    const allQuestions = [
      ...(quizQuestions || []), 
      ...(challengeQuestions || []).map(q => ({...q, difficulty: 'hard'}))
    ];
    
    // Get random question from our bank, or generate a basic math question if none available
    let question;
    if (allQuestions.length > 0) {
      question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    } else {
      question = generateMathQuestion(level);
    }
    
    setCurrentQuestion(question);
    setSelectedOption(null);
    setAnswerCorrect(null);
    setShowQuestion(true);
    setTimeLeft(10);
    
    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    setAnswerCorrect(false);
    setTimeout(() => {
      setShowQuestion(false);
      if (userProgress && userProgress.lives > 0) {
        updateLivesMutation.mutate(userProgress.lives - 1);
      }
      toast({
        title: "¡Tiempo agotado!",
        description: "No respondiste a tiempo. Inténtalo de nuevo.",
        variant: "destructive",
      });
      restartGame();
    }, 1500);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOption) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    setAnswerCorrect(isCorrect);
    
    setTimeout(() => {
      setShowQuestion(false);
      
      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
        const pointsEarned = 10 * level;
        setScore(prev => prev + pointsEarned);
        
        toast({
          title: "¡Respuesta Correcta!",
          description: `Has ganado ${pointsEarned} puntos.`,
        });
        
        // Continue game
        setIsPlaying(true);
        setIsGameOver(false);
        setLevel(prev => prev + 1);
      } else {
        if (userProgress && userProgress.lives > 0) {
          updateLivesMutation.mutate(userProgress.lives - 1);
        }
        
        toast({
          title: "Respuesta Incorrecta",
          description: "Has perdido una vida. ¡Inténtalo de nuevo!",
          variant: "destructive",
        });
        
        restartGame();
      }
    }, 1500);
  };

  const restartGame = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setLevel(1);
    
    // Save score if it's higher than current points
    if (userProgress && score > userProgress.points) {
      updatePointsMutation.mutate(score);
      setHighScore(score);
    }
  };

  const handleContinue = () => {
    // Reset the game state and start again
    setIsPlaying(true);
    setIsGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-cyber font-bold">
                <span className="text-cyberaccent">Desafío</span> Extremo
              </h1>
              
              <div className="flex gap-4 items-center">
                <div className="bg-cyberbg p-2 rounded-lg">
                  <span className="font-bold">Nivel: </span>
                  <span className="text-cyberaccent">{level}</span>
                </div>
                <div className="bg-cyberbg p-2 rounded-lg">
                  <span className="font-bold">Puntuación: </span>
                  <span className="text-cyberaccent">{score}</span>
                </div>
                <div className="bg-cyberbg p-2 rounded-lg flex items-center">
                  <Skull className="text-red-500 mr-2 h-5 w-5" />
                  <span className="text-red-400">{deathCount}</span>
                </div>
                <div className="bg-cyberbg p-2 rounded-lg flex items-center">
                  <Trophy className="text-yellow-500 mr-2 h-5 w-5" />
                  <span className="text-yellow-400">{correctAnswers}</span>
                </div>
              </div>
            </div>
            
            {!isPlaying && !isGameOver && !showQuestion ? (
              <motion.div 
                className="bg-cyberbg p-6 rounded-lg text-center mb-6 cyber-border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-cyber font-bold mb-4">¡Desafío Extremo!</h2>
                <p className="mb-6 text-gray-300">
                  Controla un personaje que debe navegar por un laberinto imposible de obstáculos.
                  Si pierdes, tendrás que responder una pregunta matemática en menos de 10 segundos para continuar.
                  Si respondes incorrectamente, ¡volverás al inicio!
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleStartGame} 
                    className="cyber-btn bg-cyberaccent hover:bg-purple-700 text-xl px-6 py-3"
                  >
                    ¡Comenzar Desafío!
                  </Button>
                </div>
              </motion.div>
            ) : null}
            
            {(isPlaying && !showQuestion) && (
              <GameArea 
                level={level}
                onGameOver={handleGameOver}
              />
            )}
            
            <AnimatePresence>
              {showQuestion && (
                <MathQuestionModal
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectOption}
                  onVerifyAnswer={handleVerifyAnswer}
                  timeLeft={timeLeft}
                  answerCorrect={answerCorrect}
                />
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}