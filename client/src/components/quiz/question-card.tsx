import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Latex } from "@/components/ui/latex";
import { QuizQuestion, UserProgress } from "@shared/schema";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  onVerifyAnswer: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onVerifyAnswer
}: QuestionCardProps) {
  // Query to get user progress
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-cyberdark p-6 rounded-lg cyber-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-cyber font-semibold text-white">
            Pregunta {questionNumber} de {totalQuestions}
          </h3>
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" fill="#ef4444" />
            <span className="text-white">{userProgress?.lives || 3}</span>
          </div>
        </div>
        
        <CardContent className="p-0 mb-6">
          <p className="text-white text-lg mb-2">{question.question}</p>
          <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
            <Latex formula={question.formula} />
          </div>
          
          <div className="space-y-3">
            {question.options.map((option) => (
              <motion.div
                key={option.id}
                className={`
                  bg-cyberbg border ${selectedOption === option.id ? 'border-2 border-cyberaccent shadow-[0_0_10px_rgba(167,139,250,0.5)]' : 'border-cyberprimary'} 
                  p-3 rounded-md cursor-pointer hover:bg-cyberprimary hover:bg-opacity-20 transition relative
                `}
                onClick={() => onSelectOption(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <Latex formula={option.formula} />
                  {selectedOption === option.id && (
                    <span className="ml-2 bg-cyberaccent text-black font-bold px-2 py-1 rounded-full text-xs">
                      Seleccionada
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-0 flex justify-between">
          <Button
            className="cyber-btn px-4 py-2 bg-gray-600 text-white rounded-md transition duration-300 opacity-50 cursor-not-allowed"
            disabled={true}
          >
            Anterior
          </Button>
          <Button
            className="cyber-btn px-4 py-2 bg-cyberprimary hover:bg-purple-700 text-white rounded-md transition duration-300"
            onClick={onVerifyAnswer}
          >
            Verificar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
