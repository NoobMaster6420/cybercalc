import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Tipos para nuestro juego
interface GameAreaProps {
  level: number;
  onGameOver: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed?: number;
  direction?: number;
}

export default function GameArea({ level, onGameOver }: GameAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameWidth, setGameWidth] = useState(800);
  const [gameHeight, setGameHeight] = useState(500);
  const [player, setPlayer] = useState<GameObject>({
    x: 50,
    y: 250,
    width: 20,
    height: 20,
    color: "#00FFFF",
  });
  const [obstacles, setObstacles] = useState<GameObject[]>([]);
  const [goal, setGoal] = useState<GameObject>({
    x: 750,
    y: 250,
    width: 30,
    height: 80,
    color: "#00FF00",
  });
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  
  const { toast } = useToast();
  
  // Inicializar el juego con obstáculos basados en el nivel
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Ajustar el tamaño del canvas a su contenedor
    if (gameAreaRef.current) {
      const width = gameAreaRef.current.clientWidth;
      setGameWidth(width);
      setGameHeight(500);
    }
    
    // Restablecer el jugador
    setPlayer({
      x: 50,
      y: 250,
      width: 20,
      height: 20,
      color: "#00FFFF",
    });
    
    // Establecer meta
    setGoal({
      x: gameWidth - 50,
      y: 250 - 40,
      width: 30,
      height: 80,
      color: "#00FF00",
    });
    
    // Generar obstáculos según el nivel
    const newObstacles = generateObstacles(level);
    setObstacles(newObstacles);
    
    setIsGameActive(true);
    
    // Iniciar el game loop
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [level, gameWidth]);
  
  // Agregar event listeners para controles en un efecto separado
  useEffect(() => {
    if (!isGameActive) return;
    
    // Función para capturar eventos de teclado
    const keyDownHandler = (e: KeyboardEvent) => {
      // Prevenir el comportamiento predeterminado (scrolling)
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      handleKeyDown(e);
    };
    
    const keyUpHandler = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      handleKeyUp(e);
    };
    
    // Agregar event listeners
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    
    // Focus en el elemento del juego
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
    
    // Mensaje sobre los controles
    toast({
      title: "Controles del juego",
      description: "Usa las flechas o WASD para mover el personaje",
    });
    
    return () => {
      // Limpiar event listeners
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [isGameActive]);
  
  // Manejar las teclas presionadas
  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement> | KeyboardEvent) => {
    if (!isGameActive) return;
    
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        setKeys(prev => ({ ...prev, up: true }));
        break;
      case "ArrowDown":
      case "s":
      case "S":
        setKeys(prev => ({ ...prev, down: true }));
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        setKeys(prev => ({ ...prev, left: true }));
        break;
      case "ArrowRight":
      case "d":
      case "D":
        setKeys(prev => ({ ...prev, right: true }));
        break;
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent<HTMLCanvasElement> | KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "w":
      case "W":
        setKeys(prev => ({ ...prev, up: false }));
        break;
      case "ArrowDown":
      case "s":
      case "S":
        setKeys(prev => ({ ...prev, down: false }));
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case "ArrowRight":
      case "d":
      case "D":
        setKeys(prev => ({ ...prev, right: false }));
        break;
    }
  };
  
  // Game loop
  const gameLoop = () => {
    if (!canvasRef.current || !isGameActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcular nueva posición del jugador
    let newPlayerX = player.x;
    let newPlayerY = player.y;
    
    const playerSpeed = 5;
    
    if (keys.up) newPlayerY -= playerSpeed;
    if (keys.down) newPlayerY += playerSpeed;
    if (keys.left) newPlayerX -= playerSpeed;
    if (keys.right) newPlayerX += playerSpeed;
    
    // Comprobar límites del canvas
    newPlayerX = Math.max(0, Math.min(newPlayerX, canvas.width - player.width));
    newPlayerY = Math.max(0, Math.min(newPlayerY, canvas.height - player.height));
    
    // Mover obstáculos
    const movedObstacles = obstacles.map(obs => {
      if (obs.speed) {
        let newY = obs.y + (obs.speed * (obs.direction || 1));
        
        // Rebotar en los bordes
        if (newY <= 0 || newY + obs.height >= canvas.height) {
          const dir = obs.direction || 1;
          return { ...obs, direction: -dir, y: newY <= 0 ? 0 : canvas.height - obs.height };
        }
        
        return { ...obs, y: newY };
      }
      return obs;
    });
    
    // Verificar colisiones con obstáculos
    const hasCollision = checkCollisions(
      { ...player, x: newPlayerX, y: newPlayerY },
      movedObstacles
    );
    
    if (hasCollision) {
      setIsGameActive(false);
      onGameOver();
      return;
    }
    
    // Comprobar si el jugador ha alcanzado la meta
    const reachedGoal = checkCollision(
      { ...player, x: newPlayerX, y: newPlayerY },
      goal
    );
    
    if (reachedGoal) {
      setIsGameActive(false);
      toast({
        title: "¡Nivel completado!",
        description: `Has superado el nivel ${level}.`,
      });
      // En lugar de onGameOver, se podría implementar una función onLevelComplete
      return;
    }
    
    // Actualizar posición del jugador
    setPlayer(prev => ({ ...prev, x: newPlayerX, y: newPlayerY }));
    setObstacles(movedObstacles);
    
    // Dibujar todos los elementos
    // Fondo
    ctx.fillStyle = "#0F0F1A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar cuadrícula ciberpunk
    drawCyberpunkGrid(ctx, canvas.width, canvas.height);
    
    // Dibujar obstáculos
    movedObstacles.forEach(obs => {
      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      
      // Agregar efecto de glow a los obstáculos
      ctx.shadowColor = obs.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = obs.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      ctx.shadowBlur = 0;
    });
    
    // Dibujar meta
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    
    // Efecto de glow para la meta
    ctx.shadowColor = goal.color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = goal.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);
    ctx.shadowBlur = 0;
    
    // Dibujar jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(newPlayerX, newPlayerY, player.width, player.height);
    
    // Efecto de glow para el jugador
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(newPlayerX, newPlayerY, player.width, player.height);
    ctx.shadowBlur = 0;
    
    // Continuar el loop
    if (isGameActive) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Función para generar obstáculos basados en el nivel
  const generateObstacles = (level: number): GameObject[] => {
    const baseObstacles = [];
    const colors = ["#FF00FF", "#FF0066", "#9933FF", "#00FFCC", "#FF3300"];
    
    // Obstáculos verticales en movimiento
    const numMovingObstacles = Math.min(3 + level, 10);
    for (let i = 0; i < numMovingObstacles; i++) {
      const width = 20;
      const x = 150 + (gameWidth - 200) * (i / numMovingObstacles);
      const speed = 2 + (level * 0.5);
      
      baseObstacles.push({
        x,
        y: Math.random() * (gameHeight - 100),
        width,
        height: 100 - (level * 5) > 30 ? 100 - (level * 5) : 30,
        color: colors[i % colors.length],
        speed,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
    
    // Obstáculos estáticos
    const numStaticObstacles = Math.min(level, 15);
    for (let i = 0; i < numStaticObstacles; i++) {
      const isHorizontal = Math.random() > 0.5;
      const width = isHorizontal ? 200 : 20;
      const height = isHorizontal ? 20 : 200;
      
      baseObstacles.push({
        x: 100 + Math.random() * (gameWidth - 300),
        y: Math.random() * (gameHeight - height),
        width,
        height,
        color: colors[(i + 2) % colors.length],
      });
    }
    
    // Agregar "pasajes minúsculos" a medida que aumenta el nivel
    if (level > 2) {
      const gap = Math.max(30 - (level * 2), 22); // El espacio se reduce con el nivel, mínimo 22px
      
      baseObstacles.push({
        x: gameWidth / 2 - 100,
        y: 0,
        width: 20,
        height: (gameHeight - gap) / 2,
        color: "#FF3300",
      });
      
      baseObstacles.push({
        x: gameWidth / 2 - 100,
        y: (gameHeight + gap) / 2,
        width: 20,
        height: (gameHeight - gap) / 2,
        color: "#FF3300",
      });
    }
    
    return baseObstacles;
  };
  
  // Función para dibujar la cuadrícula ciberpunk
  const drawCyberpunkGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 40;
    
    ctx.strokeStyle = "#1A1A3A";
    ctx.lineWidth = 1;
    
    // Líneas horizontales
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Líneas verticales
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };
  
  // Función para comprobar colisiones entre objetos
  const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  };
  
  // Comprobar colisiones con varios obstáculos
  const checkCollisions = (player: GameObject, obstacles: GameObject[]): boolean => {
    return obstacles.some(obstacle => checkCollision(player, obstacle));
  };
  
  // Función para dar foco al canvas al hacer clic
  const focusCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.focus();
      
      // Si el juego está pausado, reanudarlo
      if (!isGameActive) {
        setIsGameActive(true);
        requestRef.current = requestAnimationFrame(gameLoop);
        toast({
          title: "¡Juego activado!",
          description: "Usa las flechas o WASD para mover el personaje",
        });
      }
    }
  };

  return (
    <motion.div
      ref={gameAreaRef}
      className="bg-cyberbg rounded-lg p-4 cyber-border mb-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={gameWidth}
          height={gameHeight}
          className="border border-cyberprimary rounded-lg cursor-pointer hover:border-cyberaccent transition-colors duration-300"
          tabIndex={0}
          onClick={focusCanvas}
          onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLCanvasElement>)}
          onKeyUp={(e) => handleKeyUp(e as React.KeyboardEvent<HTMLCanvasElement>)}
          style={{ outline: "none" }}
        />
        
        {!isGameActive && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 cursor-pointer" 
            onClick={focusCanvas}
          >
            <div className="text-center p-6 bg-cyberdark bg-opacity-90 border-2 border-cyberaccent rounded-lg transform transition-transform hover:scale-105">
              <h3 className="text-xl font-cyber font-bold text-cyberaccent mb-3">
                Juego Pausado
              </h3>
              <p className="text-white mb-4">Haz clic para continuar</p>
              <div className="mx-auto w-32 h-10 bg-cyberaccent bg-opacity-20 rounded-md border border-cyberaccent flex items-center justify-center animate-pulse">
                <span className="text-cyberaccent font-bold">INICIAR</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-300 text-sm">
        <div className="bg-cyberdark p-3 rounded-md border border-cyberprimary mb-2">
          <h3 className="text-cyberaccent font-bold mb-2 text-center">CONTROLES DEL JUEGO</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 w-10 h-10 flex items-center justify-center rounded-md border border-cyberaccent mb-1">
                <span className="text-cyberaccent">W</span>
              </div>
              <span>Arriba</span>
            </div>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 w-10 h-10 flex items-center justify-center rounded-md border border-cyberaccent mb-1">
                  <span className="text-cyberaccent">A</span>
                </div>
                <span>Izquierda</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 w-10 h-10 flex items-center justify-center rounded-md border border-cyberaccent mb-1">
                  <span className="text-cyberaccent">S</span>
                </div>
                <span>Abajo</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 w-10 h-10 flex items-center justify-center rounded-md border border-cyberaccent mb-1">
                  <span className="text-cyberaccent">D</span>
                </div>
                <span>Derecha</span>
              </div>
            </div>
          </div>
          <p className="text-center">También puedes usar las <span className="text-cyberaccent font-bold">flechas</span> del teclado</p>
        </div>
        <div className="bg-cyberdark p-3 rounded-md border border-purple-700">
          <p className="text-center"><span className="text-cyberaccent font-bold">Objetivo:</span> Evita los obstáculos y llega al portal verde.</p>
          <p className="text-center mt-1">La dificultad aumentará con cada nivel que superes.</p>
          <p className="text-center mt-1 text-red-400 font-bold animate-pulse">¡HAGA CLIC EN EL JUEGO PARA COMENZAR!</p>
        </div>
      </div>
    </motion.div>
  );
}