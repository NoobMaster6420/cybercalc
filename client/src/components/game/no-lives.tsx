import { Button } from "@/components/ui/button";
import { Skull, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface NoLivesProps {
  onReset: () => void;
}

export default function NoLives({ onReset }: NoLivesProps) {
  const [isResetting, setIsResetting] = useState(false);
  const { user } = useAuth();

  // Mutation to reset lives
  const resetLivesMutation = useMutation({
    mutationFn: async () => {
      setIsResetting(true);
      // Resetear vidas a 3
      const res1 = await apiRequest("PATCH", "/api/user/lives", { lives: 3 });
      // Resetear puntos a 0
      const res2 = await apiRequest("PATCH", "/api/user/points", { points: 0 });
      return true;
    },
    onSuccess: () => {
      setIsResetting(false);
      onReset();
    },
    onError: () => {
      setIsResetting(false);
    },
  });

  const handleReset = () => {
    resetLivesMutation.mutate();
  };

  return (
    <motion.div
      className="bg-cyberbg rounded-lg p-8 cyber-border text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Skull className="h-20 w-20 text-red-500 mx-auto mb-6" />
      
      <h2 className="text-2xl font-cyber font-bold mb-4">¡Te has quedado sin vidas!</h2>
      
      <p className="text-gray-300 mb-8">
        Has agotado todas tus vidas. Para continuar jugando, deberás reiniciar tu progreso.
      </p>
      
      <Button
        onClick={handleReset}
        disabled={isResetting}
        className="cyber-btn bg-cyberaccent hover:bg-purple-700 w-48 mx-auto"
      >
        {isResetting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Reiniciando...
          </>
        ) : (
          "Reiniciar Progreso"
        )}
      </Button>
    </motion.div>
  );
}