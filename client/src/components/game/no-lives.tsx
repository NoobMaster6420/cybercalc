import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, RefreshCw, Trophy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface NoLivesProps {
  onReset: () => void;
}

export default function NoLives({ onReset }: NoLivesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  // Mutation to reset lives and points
  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      // Reset lives to 3
      await apiRequest("PATCH", "/api/user/lives", { lives: 3 });
      // Reset points to 0
      return await apiRequest("PATCH", "/api/user/points", { points: 0 });
    },
    onSuccess: () => {
      // Invalidar la consulta de progreso
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
      
      // Actualizar directamente el usuario en caché
      if (user) {
        queryClient.setQueryData(["/api/user"], {
          ...user,
          points: 0,
          lives: 3
        });
      }
      
      toast({
        title: "¡Vidas restablecidas!",
        description: "Tus vidas han sido restablecidas a 3 y tus puntos a 0.",
      });
      
      setIsResetting(false);
      onReset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron restablecer tus vidas y puntos.",
        variant: "destructive",
      });
      setIsResetting(false);
    }
  });

  const handleResetProgress = () => {
    setIsResetting(true);
    resetProgressMutation.mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-cyberbg p-6 rounded-lg cyber-border mb-8">
        <CardContent className="p-0 mb-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-red-500 bg-opacity-20 rounded-full p-6 mb-4">
              <Heart className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-cyber font-bold text-white mb-2">¡Te has quedado sin vidas!</h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Para continuar aprendiendo, puedes restablecer tus vidas y comenzar de nuevo.
              Ten en cuenta que esto reiniciará tu puntuación a 0.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-cyberdark p-4 rounded-lg text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-cyber text-white mb-1">
                  <span className="text-red-500">0</span> Vidas
                </h3>
                <p className="text-gray-400 text-sm">Necesitas vidas para jugar</p>
              </div>
              
              <div className="bg-cyberdark p-4 rounded-lg text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-lg font-cyber text-white mb-1">
                  Puntuación: <span className="text-yellow-500">?</span>
                </h3>
                <p className="text-gray-400 text-sm">Se reiniciará a 0</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-0 flex justify-center">
          <Button 
            className="cyber-btn bg-cyberprimary hover:bg-purple-600 text-white rounded-md px-6 py-3 transition shadow-neon-purple w-full"
            onClick={handleResetProgress}
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Reiniciando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Vidas y Puntos
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}