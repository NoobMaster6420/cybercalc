import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

export default function GamesPage() {
  const [showGame, setShowGame] = useState(false);
  
  if (showGame) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="w-full p-2 bg-cyberdark flex justify-between items-center">
          <h1 className="text-cyberaccent font-cyber text-xl">World's Hardest Game</h1>
          <Button 
            variant="destructive" 
            onClick={() => setShowGame(false)}
            className="font-cyber"
          >
            Volver
          </Button>
        </div>
        <iframe 
          src="https://www.crazygames.com/embed/worlds-hardest-game" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="fullscreen" 
          className="flex-grow"
        ></iframe>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-cyber font-bold text-cyberaccent mb-6">Juegos y Recursos Interactivos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-cyberbg p-6 rounded-lg cyber-border">
            <h2 className="text-xl font-cyber text-white mb-3">World's Hardest Game</h2>
            <p className="text-gray-300 mb-4">
              Pon a prueba tus reflejos y paciencia con este desafiante juego. ¿Podrás completar todos los niveles?
            </p>
            <Button 
              onClick={() => setShowGame(true)}
              className="w-full bg-cybersecondary hover:bg-blue-600 transition-colors duration-300 font-cyber"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              Jugar Ahora
            </Button>
          </div>
          
          <div className="bg-cyberbg p-6 rounded-lg cyber-border">
            <h2 className="text-xl font-cyber text-white mb-3">Juegos Matemáticos</h2>
            <p className="text-gray-300 mb-4">
              Accede a una colección de actividades didácticas para reforzar tus conocimientos sobre cálculo.
            </p>
            <a 
              href="https://wordwall.net/es/resource/10085747" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button 
                className="w-full bg-cyberprimary hover:bg-purple-600 transition-colors duration-300 font-cyber"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Explorar Actividades
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}