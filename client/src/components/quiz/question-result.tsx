import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Latex } from "@/components/ui/latex";
import { QuizQuestion } from "@shared/schema";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionResultProps {
  question: QuizQuestion;
  selectedOption: string | null;
  onNext: () => void;
  isLastQuestion: boolean;
}

export default function QuestionResult({
  question,
  selectedOption,
  onNext,
  isLastQuestion
}: QuestionResultProps) {
  const isCorrect = selectedOption === question.correctOptionId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-cyberdark p-6 rounded-lg cyber-border">
        <CardContent className="p-0 mb-6">
          <div className="flex flex-col items-center mb-6">
            {isCorrect ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-xl font-cyber font-semibold text-white">¡Respuesta Correcta!</h3>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="h-12 w-12 text-red-500 mb-2" />
                <h3 className="text-xl font-cyber font-semibold text-white">Respuesta Incorrecta</h3>
              </div>
            )}
          </div>

          <div className="bg-cyberbg p-4 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-cyberaccent">Pregunta:</h4>
            <p className="text-white mb-2">{question.question}</p>
            <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
              <Latex formula={question.formula} />
            </div>
          </div>

          <div className="bg-cyberbg p-4 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-cyberaccent">Tu respuesta:</h4>
            <div className={`mb-2 bg-black bg-opacity-30 p-3 rounded-md border ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <Latex formula={question.options.find(opt => opt.id === selectedOption)?.formula || ""} />
            </div>
            
            {!isCorrect && (
              <div className="mb-2">
                <h4 className="text-lg font-medium mb-2 text-cyberaccent">Respuesta correcta:</h4>
                <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md border border-green-500">
                  <Latex formula={question.options.find(opt => opt.id === question.correctOptionId)?.formula || ""} />
                </div>
              </div>
            )}
          </div>

          <div className="bg-cyberbg p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-2 text-cyberaccent">Explicación:</h4>
            <div className="bg-black bg-opacity-30 p-3 rounded-md">
              <Latex formula={question.explanation} displayMode={true} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-0 flex justify-end">
          <Button
            className="cyber-btn px-6 py-2 bg-cybersecondary hover:bg-blue-700 text-white rounded-md transition duration-300"
            onClick={onNext}
          >
            {isLastQuestion ? "Finalizar" : "Siguiente"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
