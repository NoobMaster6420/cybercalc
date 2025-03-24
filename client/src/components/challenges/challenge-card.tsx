import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Latex } from "@/components/ui/latex";
import { ChallengeQuestion } from "@shared/schema";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw, XCircle, Zap } from "lucide-react";

interface ChallengeCardProps {
  challenge: ChallengeQuestion;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  onVerifyAnswer: () => void;
  showResult: boolean;
  onTryAgain: () => void;
}

export default function ChallengeCard({
  challenge,
  selectedOption,
  onSelectOption,
  onVerifyAnswer,
  showResult,
  onTryAgain
}: ChallengeCardProps) {
  const isCorrect = selectedOption === challenge.correctOptionId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-cyberbg p-6 rounded-lg cyber-border mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-cyber font-semibold text-white">Reto del Día</h3>
          <div className="bg-cyberprimary bg-opacity-20 px-3 py-1 rounded-md text-cyberprimary font-medium">
            +{challenge.points} puntos
          </div>
        </div>

        <CardContent className="p-0 mb-6">
          {showResult ? (
            <div>
              <div className="flex flex-col items-center mb-6">
                {isCorrect ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-cyber font-semibold text-white">¡Respuesta Correcta!</h3>
                    <p className="text-gray-300 mt-2">Has ganado {challenge.points} puntos</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <XCircle className="h-12 w-12 text-destructive mb-2" />
                    <h3 className="text-xl font-cyber font-semibold text-white">Respuesta Incorrecta</h3>
                    <p className="text-gray-300 mt-2">Has perdido una vida</p>
                  </div>
                )}
              </div>

              <div className="bg-cyberdark p-4 rounded-lg mb-4">
                <h4 className="text-lg font-medium mb-2 text-cyberaccent">Pregunta:</h4>
                <p className="text-white mb-2">{challenge.question}</p>
                <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
                  <Latex formula={challenge.formula} />
                </div>
              </div>

              <div className="bg-cyberdark p-4 rounded-lg mb-4">
                <h4 className="text-lg font-medium mb-2 text-cyberaccent">Tu respuesta:</h4>
                <div className={`mb-2 bg-black bg-opacity-30 p-3 rounded-md border ${isCorrect ? 'border-green-500' : 'border-destructive'}`}>
                  <Latex formula={challenge.options.find(opt => opt.id === selectedOption)?.formula || ""} />
                </div>

                {!isCorrect && (
                  <div className="mb-2">
                    <h4 className="text-lg font-medium mb-2 text-cyberaccent">Respuesta correcta:</h4>
                    <div className="mb-2 bg-black bg-opacity-30 p-3 rounded-md border border-green-500">
                      <Latex formula={challenge.options.find(opt => opt.id === challenge.correctOptionId)?.formula || ""} />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-cyberdark p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2 text-cyberaccent">Explicación paso a paso:</h4>
                <div className="bg-black bg-opacity-30 p-3 rounded-md">
                  <Latex formula={challenge.explanation} displayMode={true} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-white text-lg mb-2">{challenge.question}</p>
              <div className="mb-4 bg-black bg-opacity-30 p-4 rounded-md">
                <Latex formula={challenge.formula} />
              </div>

              <div className="space-y-3">
                {challenge.options.map((option) => (
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
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0">
          {showResult ? (
            <Button 
              className="cyber-btn w-full py-3 bg-cybersecondary hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 shadow-neon-blue"
              onClick={onTryAgain}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Intentar Otro Reto
            </Button>
          ) : (
            <Button 
              className="cyber-btn w-full py-3 bg-cyberprimary hover:bg-purple-700 text-white font-medium rounded-md transition duration-300 shadow-neon-purple"
              onClick={onVerifyAnswer}
            >
              <Zap className="h-4 w-4 mr-2" />
              Verificar Respuesta
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}