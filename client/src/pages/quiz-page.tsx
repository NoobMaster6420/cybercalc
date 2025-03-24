import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import DifficultySelector from "@/components/quiz/difficulty-selector";
import QuestionCard from "@/components/quiz/question-card";
import QuestionResult from "@/components/quiz/question-result";
import NoLives from "@/components/game/no-lives";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { QuizQuestion, UserProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Difficulty = 'easy' | 'medium' | 'hard' | null;

export default function QuizPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/questions", difficulty],
    enabled: !!difficulty,
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

  // Mutation to save quiz result
  const saveQuizMutation = useMutation({
    mutationFn: async (quizData: { difficulty: string, score: number }) => {
      const res = await apiRequest("POST", "/api/quizzes", quizData);
      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "¡Quiz completado!",
        description: `Has ganado ${data.score} puntos.`,
      });
      
      // Actualizar la información de progreso
      refetchUserProgress();
      
      // Actualizar directamente la caché del usuario para reflejar los puntos ganados
      if (user) {
        queryClient.setQueryData(["/api/user"], {
          ...user,
          points: (user.points || 0) + data.score
        });
      }
    },
  });

  const handleSelectDifficulty = (selected: Difficulty) => {
    setDifficulty(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleSelectOption = (optionId: string) => {
    if (!showResult) {
      setSelectedOption(optionId);
    }
  };

  const handleNextQuestion = () => {
    // Save answer
    setUserAnswers([...userAnswers, selectedOption || ""]);
    
    // Check if answer is correct
    const correct = selectedOption === questions?.[currentQuestionIndex].correctOptionId;
    
    // Update score
    if (correct) {
      const pointsPerQuestion = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore(prevScore => prevScore + pointsPerQuestion);
    } else {
      // Decrease lives if answer is incorrect and lives > 0
      if (userProgress && userProgress.lives > 0) {
        updateLivesMutation.mutate(userProgress.lives - 1);
      }
    }
    
    // Reset and move to next question or complete quiz
    setShowResult(false);
    setSelectedOption(null);
    
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
      
      // Save quiz result
      if (difficulty) {
        saveQuizMutation.mutate({
          difficulty,
          score
        });
      }
    }
  };

  const handleVerifyAnswer = () => {
    if (selectedOption) {
      setShowResult(true);
    } else {
      toast({
        title: "Selecciona una opción",
        description: "Debes seleccionar una opción antes de verificar",
        variant: "destructive",
      });
    }
  };

  const handleRestart = () => {
    setDifficulty(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
    setQuizCompleted(false);
    setScore(0);
  };

  if (!difficulty) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-cyber font-bold text-center mb-8">
              <span className="text-cyberaccent">Quiz</span> Interactivo
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
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

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-3xl mx-auto bg-cyberbg cyber-border rounded-lg p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-cyber font-bold mb-4">¡Quiz Completado!</h2>
                <div className="bg-cyberprimary inline-block rounded-full p-4 mb-4">
                  <Check className="h-12 w-12 text-white" />
                </div>
                <p className="text-xl mb-2">
                  Has obtenido <span className="text-cyberaccent font-bold">{score} puntos</span>
                </p>
                <p className="text-gray-300">
                  Respondiste correctamente {userAnswers.filter((answer, index) => 
                    answer === questions?.[index].correctOptionId
                  ).length} de {questions?.length} preguntas.
                </p>
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  className="cyber-btn bg-cyberprimary hover:bg-purple-700 px-6"
                  onClick={handleRestart}
                >
                  Volver a Intentar
                </Button>
                <Button
                  className="cyber-btn bg-cybersecondary hover:bg-blue-700 px-6"
                  onClick={() => setDifficulty(null)}
                >
                  Cambiar Dificultad
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar las preguntas. Por favor, intenta de nuevo.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-8">
              <Button
                className="cyber-btn bg-cyberprimary hover:bg-purple-700"
                onClick={() => setDifficulty(null)}
              >
                Volver
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Check if user has no lives
  if (userProgress && userProgress.lives <= 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-cyber font-bold text-center mb-8">
              <span className="text-cyberaccent">Quiz</span> Interactivo
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
            <span className="text-cyberaccent">Quiz</span> Interactivo
          </h1>
          
          <div className="max-w-3xl mx-auto">
            {showResult ? (
              <QuestionResult 
                question={currentQuestion}
                selectedOption={selectedOption}
                onNext={handleNextQuestion}
                isLastQuestion={currentQuestionIndex === questions.length - 1}
              />
            ) : (
              <QuestionCard 
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                onVerifyAnswer={handleVerifyAnswer}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
