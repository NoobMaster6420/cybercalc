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
//import GameArea from "../components/game/game-area";
//import MathQuestionModal from "../components/game/math-question-modal";
//import { generateMathQuestion } from "../lib/game-utils";

export default function GamePage() {
  // Removed all game state variables
  //const [isPlaying, setIsPlaying] = useState(false);
  //const [isGameOver, setIsGameOver] = useState(false);
  //const [showQuestion, setShowQuestion] = useState(false);
  //const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  //const [selectedOption, setSelectedOption] = useState<string | null>(null);
  //const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  //const [deathCount, setDeathCount] = useState(0);
  //const [correctAnswers, setCorrectAnswers] = useState(0);
  //const [score, setScore] = useState(0);
  //const [timeLeft, setTimeLeft] = useState(10);
  //const [level, setLevel] = useState(1);
  //const [highScore, setHighScore] = useState(0);
  //const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Removed game related queries and mutations

  // Removed useEffect for highscore

  // Removed all game handling functions

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-cyber font-bold">
                <span className="text-cyberaccent">Próximamente</span>
              </h1>
            </div>

            <div className="bg-cyberbg p-6 rounded-lg text-center mb-6 cyber-border">
              <h2 className="text-2xl font-cyber font-bold mb-4">¡Próximamente!</h2>
              <p className="mb-6 text-gray-300">
                Esta sección estará disponible pronto.
              </p>
              <div className="flex justify-center">
                <Button
                  className="cyber-btn bg-cyberaccent hover:bg-purple-700 text-xl px-6 py-3"
                  disabled
                >
                  ¡Comenzar!
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}