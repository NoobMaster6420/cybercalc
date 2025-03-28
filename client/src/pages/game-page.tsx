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
import { AlertCircle, Loader2, Skull, Trophy, Clock, BookOpen, Rocket, ChevronRight, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Latex } from "@/components/ui/latex";
import MathQuestionModal from "../components/game/math-question-modal";
import NoLives from "../components/game/no-lives";
import { generateMathQuestion } from "../lib/game-utils";

// Historias y escenarios para juegos educativos
const storyScenarios = [
  {
    id: 1,
    title: "La Nave del Futuro",
    description: "En el año 2150, eres un piloto de naves espaciales que debe comprender la velocidad y aceleración para realizar maniobras seguras.",
    image: "🚀",
    stories: [
      {
        id: "velocity-intro",
        title: "Episodio 1: Entendiendo la Velocidad",
        content: "Capitán, bienvenido a bordo de la Nave Quantum. Como piloto, necesitas entender que la velocidad es una aplicación directa de la derivada. Si s(t) representa la posición de la nave en función del tiempo, entonces la velocidad v(t) es la primera derivada: v(t) = s'(t). Esto mide cómo cambia la posición de la nave respecto al tiempo.",
        example: "s(t) = 3t^2 + 2t + 1",
        solution: "v(t) = s'(t) = 6t + 2",
        explanation: "Al derivar s(t) = 3t² + 2t + 1, aplicamos la regla de la potencia y el coeficiente: la derivada de t² es 2t, multiplicada por 3 da 6t. La derivada de 2t es 2, y la derivada de la constante 1 es 0.",
        questionPrompt: "La computadora de navegación se ha bloqueado. ¡Calcula la velocidad para evitar colisionar!",
        question: {
          id: 1,
          question: "Si la posición de la nave viene dada por s(t) = 5t^3 - 2t + 7, ¿cuál es la expresión para la velocidad v(t)?",
          formula: "s(t) = 5t^3 - 2t + 7",
          options: [
            { id: "a", formula: "v(t) = 15t^2 - 2" },
            { id: "b", formula: "v(t) = 5t^2 - 2" },
            { id: "c", formula: "v(t) = 15t^2 - 2 + 7" },
            { id: "d", formula: "v(t) = 15t^2" }
          ],
          correctOptionId: "a",
          explanation: "La velocidad es la primera derivada de la posición. Derivando s(t) = 5t³ - 2t + 7: \nv(t) = s'(t) = 5·3t² - 2·1 + 0 = 15t² - 2"
        }
      },
      {
        id: "acceleration-intro",
        title: "Episodio 2: Controlando la Aceleración",
        content: "Excelente trabajo, Capitán. Ahora, necesitamos entender la aceleración para realizar maniobras avanzadas. La aceleración a(t) es la segunda derivada de la posición, o la primera derivada de la velocidad: a(t) = v'(t) = s''(t). Esto mide cómo cambia la velocidad respecto al tiempo.",
        example: "s(t) = 2t^3 + 4t^2 - t + 5",
        solution: "v(t) = s'(t) = 6t^2 + 8t - 1\na(t) = v'(t) = 12t + 8",
        explanation: "Primero calculamos la velocidad derivando la posición. Luego, la aceleración es la derivada de la velocidad. Para un movimiento suave, necesitamos controlar tanto la velocidad como la aceleración.",
        questionPrompt: "¡Sistemas de emergencia activados! Calcula la aceleración para estabilizar la nave:",
        question: {
          id: 2,
          question: "Si la posición de la nave viene dada por s(t) = 2t⁴ + 3t² - 4, ¿cuál es la expresión para la aceleración a(t)?",
          formula: "s(t) = 2t^4 + 3t^2 - 4",
          options: [
            { id: "a", formula: "a(t) = 24t^2 + 6" },
            { id: "b", formula: "a(t) = 8t^3 + 6t" },
            { id: "c", formula: "a(t) = 24t^2 + 3" },
            { id: "d", formula: "a(t) = 8t^2 + 6" }
          ],
          correctOptionId: "a",
          explanation: "Primero calculamos la velocidad: v(t) = s'(t) = 2·4t³ + 3·2t = 8t³ + 6t\nLuego la aceleración: a(t) = v'(t) = 8·3t² + 6 = 24t² + 6"
        }
      }
    ]
  },
  {
    id: 2,
    title: "El Laboratorio de Límites",
    description: "Eres un científico en un laboratorio futurista donde necesitas resolver límites para completar experimentos revolucionarios.",
    image: "🧪",
    stories: [
      {
        id: "limits-intro",
        title: "Episodio 1: Resolución por Sustitución",
        content: "Bienvenido al Laboratorio Nexus, científico. Hoy resolveremos límites usando el método de sustitución directa. Este es el enfoque más simple: reemplazamos la variable por el valor al que se acerca y evaluamos la expresión. Solo funciona cuando la sustitución produce un resultado definido, no una indeterminación.",
        example: "\\lim_{x \\to 2} (3x^2 - 5x + 1)",
        solution: "\\lim_{x \\to 2} (3x^2 - 5x + 1) = 3(2)^2 - 5(2) + 1 = 3 \\cdot 4 - 10 + 1 = 12 - 10 + 1 = 3",
        explanation: "Simplemente sustituimos x = 2 en la función original y calculamos el resultado.",
        questionPrompt: "El reactor necesita estabilizarse. Calcula el siguiente límite por sustitución:",
        question: {
          id: 3,
          question: "Calcula el siguiente límite por sustitución directa:",
          formula: "\\lim_{x \\to 3} (2x^2 - 4x + 7)",
          options: [
            { id: "a", formula: "13" },
            { id: "b", formula: "15" },
            { id: "c", formula: "11" },
            { id: "d", formula: "9" }
          ],
          correctOptionId: "a",
          explanation: "Sustituimos x = 3 en la expresión:\n2(3)² - 4(3) + 7 = 2(9) - 12 + 7 = 18 - 12 + 7 = 13"
        }
      },
      {
        id: "limits-factor",
        title: "Episodio 2: Resolución por Factorización",
        content: "Impresionante trabajo, científico. Ahora, cuando la sustitución directa produce una indeterminación como 0/0, necesitamos usar técnicas de factorización. Factorizamos el numerador y el denominador, cancelamos factores comunes, y luego sustituimos el valor.",
        example: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}",
        solution: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x+3) = 3+3 = 6",
        explanation: "Observamos que x² - 9 = (x-3)(x+3), lo que nos permite cancelar el factor común (x-3) con el denominador. Después, simplemente sustituimos x = 3 en la expresión simplificada.",
        questionPrompt: "El experimento ha llegado a un punto crítico. Calcula este límite por factorización:",
        question: {
          id: 4,
          question: "Resuelve el siguiente límite:",
          formula: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
          options: [
            { id: "a", formula: "4" },
            { id: "b", formula: "2" },
            { id: "c", formula: "0" },
            { id: "d", formula: "\\text{No existe}" }
          ],
          correctOptionId: "a",
          explanation: "Factorizamos: x² - 4 = (x-2)(x+2)\nPor lo tanto: \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2} (x+2) = 2+2 = 4"
        }
      }
    ]
  }
];

export default function GamePage() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Query para obtener el progreso del usuario
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
    enabled: !!user,
  });

  // Mutation para actualizar los puntos del usuario
  const updatePointsMutation = useMutation({
    mutationFn: async (points: number) => {
      const res = await apiRequest("PATCH", "/api/user/points", { points });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  // Mutation para actualizar las vidas del usuario
  const updateLivesMutation = useMutation({
    mutationFn: async (lives: number) => {
      const res = await apiRequest("PATCH", "/api/user/lives", { lives });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  const startQuestion = (question: any) => {
    setCurrentQuestion(question);
    setSelectedOption(null);
    setAnswerCorrect(null);
    setTimeLeft(30);
    setShowQuestion(true);

    // Iniciar el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setAnswerCorrect(false);
          
          // Restar una vida al usuario si se acaba el tiempo
          if (userProgress && userProgress.lives > 0) {
            updateLivesMutation.mutate(userProgress.lives - 1);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleVerifyAnswer = () => {
    if (!currentQuestion || !selectedOption) return;
    
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    setAnswerCorrect(isCorrect);
    
    // Detener el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Actualizar puntos o vidas según la respuesta
    if (isCorrect) {
      // Si es correcta, sumar puntos
      if (userProgress) {
        updatePointsMutation.mutate(userProgress.points + 10);
      }
      
      // Marcar historia como completada
      if (selectedStory) {
        setProgress(prev => ({...prev, [selectedStory]: true}));
      }
      
      // Mostrar un mensaje de éxito
      setTimeout(() => {
        toast({
          title: "¡Respuesta correcta!",
          description: "Has ganado 10 puntos."
        });
        setShowQuestion(false);
      }, 2000);
    } else {
      // Si es incorrecta, restar una vida
      if (userProgress && userProgress.lives > 0) {
        updateLivesMutation.mutate(userProgress.lives - 1);
      }
      
      // Mostrar un mensaje de error
      setTimeout(() => {
        toast({
          title: "Respuesta incorrecta",
          description: "Has perdido una vida.",
          variant: "destructive"
        });
        setShowQuestion(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    // Recargar la página para reiniciar todo
    window.location.reload();
  };

  const selectScenario = (id: number) => {
    setSelectedScenario(id);
    setSelectedStory(null);
  };

  const selectStory = (id: string) => {
    setSelectedStory(id);
  };

  const backToScenarios = () => {
    setSelectedScenario(null);
    setSelectedStory(null);
  };

  const backToStories = () => {
    setSelectedStory(null);
  };

  // Limpiar el temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Renderizar la vista de no vidas si el usuario se queda sin vidas
  if (userProgress && userProgress.lives <= 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-8 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <NoLives onReset={handleReset} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Encontrar el escenario seleccionado
  const currentScenario = selectedScenario !== null 
    ? storyScenarios.find(s => s.id === selectedScenario) 
    : null;

  // Encontrar la historia seleccionada
  const currentStory = currentScenario && selectedStory !== null
    ? currentScenario.stories.find(s => s.id === selectedStory) 
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-cyber font-bold">
                <span className="text-blue-400">Juegos</span> de <span className="text-blue-400">Historia</span>
              </h1>
              
              {(selectedScenario !== null || selectedStory !== null) && (
                <div className="flex items-center space-x-3">
                  {selectedStory !== null && (
                    <Button 
                      onClick={backToStories} 
                      className="cyber-btn bg-gray-700 hover:bg-gray-600"
                    >
                      Volver a Episodios
                    </Button>
                  )}
                  {selectedScenario !== null && (
                    <Button 
                      onClick={backToScenarios} 
                      className="cyber-btn bg-gray-700 hover:bg-gray-600"
                    >
                      Volver a Escenarios
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Navegación de Breadcrumbs */}
            <div className="mb-6 flex items-center text-sm text-gray-400">
              <span className="text-blue-400">Juegos de Historia</span>
              {selectedScenario !== null && currentScenario && (
                <>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <span className="text-blue-400">{currentScenario.title}</span>
                </>
              )}
              {selectedStory !== null && currentStory && (
                <>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <span className="text-blue-400">{currentStory.title}</span>
                </>
              )}
            </div>

            {/* Lista de escenarios */}
            {selectedScenario === null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storyScenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    className="bg-cyberbg p-6 rounded-lg cyber-border hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                    whileHover={{ y: -5 }}
                    onClick={() => selectScenario(scenario.id)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{scenario.image}</div>
                      <h2 className="text-2xl font-cyber font-bold text-blue-400">{scenario.title}</h2>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {scenario.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        {scenario.stories.length} episodios
                      </div>
                      <Button
                        className="cyber-btn bg-blue-600 hover:bg-blue-500"
                      >
                        Explorar <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Lista de historias/episodios */}
            {selectedScenario !== null && selectedStory === null && currentScenario && (
              <div className="bg-cyberbg p-6 rounded-lg cyber-border mb-6">
                <div className="flex items-center mb-6">
                  <div className="text-5xl mr-4">{currentScenario.image}</div>
                  <div>
                    <h2 className="text-2xl font-cyber font-bold text-blue-400">{currentScenario.title}</h2>
                    <p className="text-gray-300 mt-1">
                      {currentScenario.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {currentScenario.stories.map(story => (
                    <motion.div
                      key={story.id}
                      className={`p-4 rounded-lg cyber-border cursor-pointer ${
                        progress[story.id] ? 'bg-blue-900 bg-opacity-20 border-blue-500' : 'bg-cyberdark'
                      }`}
                      whileHover={{ x: 5 }}
                      onClick={() => selectStory(story.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-cyber font-medium text-blue-400">{story.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {story.content.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex items-center">
                          {progress[story.id] && (
                            <span className="mr-3 text-green-400 flex items-center">
                              <Trophy className="h-4 w-4 mr-1" /> Completado
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-blue-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contenido de la historia */}
            {selectedStory !== null && currentStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-cyberbg p-6 rounded-lg cyber-border"
              >
                <h2 className="text-2xl font-cyber font-bold text-blue-400 mb-4">{currentStory.title}</h2>
                
                <div className="mb-6 text-gray-300 leading-relaxed space-y-4">
                  {currentStory.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg mb-6">
                  <h3 className="font-cyber text-lg mb-2 text-blue-400">Ejemplo</h3>
                  <div className="bg-black bg-opacity-70 p-3 rounded-md mb-3">
                    <Latex formula={currentStory.example} />
                  </div>
                  <div className="bg-blue-900 bg-opacity-20 p-3 rounded-md mb-3">
                    <Latex formula={currentStory.solution} />
                  </div>
                  <div className="text-gray-300 text-sm">
                    {currentStory.explanation}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-20 rounded-lg"></div>
                    <div className="relative bg-cyberdark p-4 rounded-lg border border-blue-500">
                      <h3 className="font-cyber text-lg mb-2 text-yellow-400 flex items-center">
                        <PenTool className="h-5 w-5 mr-2" /> Desafío
                      </h3>
                      <p className="text-gray-300 mb-4">{currentStory.questionPrompt}</p>
                      
                      <Button
                        onClick={() => startQuestion(currentStory.question)}
                        className="cyber-btn bg-blue-600 hover:bg-blue-500 px-6 py-2"
                        disabled={progress[currentStory.id]}
                      >
                        {progress[currentStory.id] ? (
                          <span className="flex items-center">
                            <Trophy className="h-5 w-5 mr-2" /> Completado
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Rocket className="h-5 w-5 mr-2" /> Iniciar Desafío
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {progress[currentStory.id] && (
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-500">
                    <h3 className="font-cyber text-lg mb-2 text-green-400 flex items-center">
                      <Trophy className="h-5 w-5 mr-2" /> ¡Desafío Completado!
                    </h3>
                    <p className="text-gray-300">
                      Has superado este desafío exitosamente. Continúa con los siguientes episodios para aprender más.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modal de pregunta matemática */}
      <AnimatePresence>
        {showQuestion && currentQuestion && (
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
      
      <Footer />
    </div>
  );
}