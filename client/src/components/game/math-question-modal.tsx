import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QuizQuestion, ChallengeQuestion } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/ui/latex";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MathQuestionModalProps {
  question: QuizQuestion | ChallengeQuestion | any;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  onVerifyAnswer: () => void;
  timeLeft: number;
  answerCorrect: boolean | null;
}

export default function MathQuestionModal({
  question,
  selectedOption,
  onSelectOption,
  onVerifyAnswer,
  timeLeft,
  answerCorrect
}: MathQuestionModalProps) {
  // Determinar el color del temporizador basado en el tiempo restante
  const getTimerColor = () => {
    if (timeLeft > 7) return "text-green-500";
    if (timeLeft > 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-cyberdark w-full max-w-3xl rounded-lg overflow-hidden border-2 border-cyberaccent"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div className="bg-cyberprimary p-4 flex justify-between items-center">
          <h3 className="text-xl font-cyber font-bold text-white">¡Responde para continuar!</h3>
          <div className={cn("flex items-center text-2xl font-bold", getTimerColor())}>
            <Clock className="w-6 h-6 mr-2" />
            {timeLeft}s
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 bg-cyberbg p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2">{question.question}</h4>
            {question.formula && (
              <div className="bg-black bg-opacity-30 p-3 rounded-md">
                <Latex formula={question.formula} displayMode={true} />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {question.options && question.options.map((option: any) => (
              <div
                key={option.id}
                className={cn(
                  "border-2 p-4 rounded-lg cursor-pointer transition-all hover:bg-cyberprimary hover:bg-opacity-20",
                  selectedOption === option.id ? "border-cyberaccent" : "border-gray-700",
                  answerCorrect === true && selectedOption === option.id ? "bg-green-900 border-green-500" : "",
                  answerCorrect === false && selectedOption === option.id ? "bg-red-900 border-red-500" : "",
                  answerCorrect === false && option.id === question.correctOptionId ? "bg-green-900 border-green-500" : "",
                )}
                onClick={() => onSelectOption(option.id)}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center mr-3 border",
                    selectedOption === option.id ? "border-cyberaccent bg-cyberaccent text-white" : "border-gray-600"
                  )}>
                    {option.id}
                  </div>
                  <div className="flex-1">
                    <Latex formula={option.formula} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={onVerifyAnswer}
              disabled={!selectedOption || answerCorrect !== null}
              className="cyber-btn bg-cyberaccent hover:bg-purple-700 disabled:opacity-50"
            >
              Verificar Respuesta
            </Button>
          </div>
        </div>
        
        {answerCorrect !== null && (
          <div className={cn(
            "p-4 text-center text-white font-bold",
            answerCorrect ? "bg-green-700" : "bg-red-700"
          )}>
            {answerCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}