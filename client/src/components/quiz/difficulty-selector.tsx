import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onSelectDifficulty }: DifficultySelectorProps) {
  return (
    <Card className="bg-cyberdark p-6 rounded-lg cyber-border">
      <CardContent className="p-0">
        <h3 className="text-xl font-cyber font-semibold mb-4 text-white">Selecciona el Nivel de Dificultad</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.button 
            className="cyber-btn bg-green-600 hover:bg-green-700 text-white p-4 rounded-md flex flex-col items-center transition duration-300 transform hover:-translate-y-1"
            onClick={() => onSelectDifficulty('easy')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg font-medium mb-1">Fácil</span>
            <span className="text-sm">Conceptos básicos</span>
          </motion.button>
          
          <motion.button 
            className="cyber-btn bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-md flex flex-col items-center transition duration-300 transform hover:-translate-y-1"
            onClick={() => onSelectDifficulty('medium')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg font-medium mb-1">Medio</span>
            <span className="text-sm">Aplicaciones simples</span>
          </motion.button>
          
          <motion.button 
            className="cyber-btn bg-red-600 hover:bg-red-700 text-white p-4 rounded-md flex flex-col items-center transition duration-300 transform hover:-translate-y-1"
            onClick={() => onSelectDifficulty('hard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg font-medium mb-1">Difícil</span>
            <span className="text-sm">Problemas complejos</span>
          </motion.button>
        </div>
        
        <div className="text-center text-gray-300">
          <p>Selecciona un nivel para comenzar el quiz. Cada nivel contiene preguntas con diferente dificultad.</p>
        </div>
      </CardContent>
    </Card>
  );
}
