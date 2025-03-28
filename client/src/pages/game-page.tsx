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
import { AlertCircle, Loader2, Skull, Trophy, Clock, BookOpen, Rocket, ChevronRight, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Latex } from "@/components/ui/latex";
import MathQuestionModal from "../components/game/math-question-modal";
import NoLives from "../components/game/no-lives";
import { generateMathQuestion } from "../lib/game-utils";

// Historias y escenarios para juegos educativos
const storyScenarios = [
  {
    id: 1,
    title: "La Nave del Futuro",
    description: "En el año 2150, eres un piloto de naves espaciales que debe comprender la velocidad y aceleración para realizar maniobras seguras.",
    image: "🚀",
    stories: [
      {
        id: "velocity-intro",
        title: "Episodio 1: Entendiendo la Velocidad",
        content: "Capitán, bienvenido a bordo de la Nave Quantum. Como piloto, necesitas entender que la velocidad es una aplicación directa de la derivada. Si s(t) representa la posición de la nave en función del tiempo, entonces la velocidad v(t) es la primera derivada: v(t) = s'(t). Esto mide cómo cambia la posición de la nave respecto al tiempo.\n\nEn este universo del año 2150, las naves espaciales utilizan ecuaciones de movimiento basadas en funciones polinómicas. La computadora de navegación deriva estas funciones para calcular la velocidad en tiempo real, lo que permite una navegación precisa incluso en condiciones extremas.",
        example: "s(t) = 3t^2 + 2t + 1",
        solution: "v(t) = s'(t) = 6t + 2",
        explanation: "Al derivar s(t) = 3t² + 2t + 1, aplicamos la regla de la potencia y el coeficiente: la derivada de t² es 2t, multiplicada por 3 da 6t. La derivada de 2t es 2, y la derivada de la constante 1 es 0.",
        questionPrompt: "La computadora de navegación se ha bloqueado. ¡Calcula la velocidad para evitar colisionar!",
        question: {
          id: 1,
          question: "Si la posición de la nave viene dada por s(t) = 5t^3 - 2t + 7, ¿cuál es la expresión para la velocidad v(t)?",
          formula: "s(t) = 5t^3 - 2t + 7",
          options: [
            { id: "a", formula: "v(t) = 15t^2 - 2" },
            { id: "b", formula: "v(t) = 5t^2 - 2" },
            { id: "c", formula: "v(t) = 15t^2 - 2 + 7" },
            { id: "d", formula: "v(t) = 15t^2" }
          ],
          correctOptionId: "a",
          explanation: "La velocidad es la primera derivada de la posición. Derivando s(t) = 5t³ - 2t + 7: \nv(t) = s'(t) = 5·3t² - 2·1 + 0 = 15t² - 2"
        }
      },
      {
        id: "acceleration-intro",
        title: "Episodio 2: Controlando la Aceleración",
        content: "Excelente trabajo, Capitán. Ahora, necesitamos entender la aceleración para realizar maniobras avanzadas. La aceleración a(t) es la segunda derivada de la posición, o la primera derivada de la velocidad: a(t) = v'(t) = s''(t). Esto mide cómo cambia la velocidad respecto al tiempo.\n\nLas maniobras evasivas en asteroides requieren un control preciso de la aceleración. Si conocemos la función de posición, podemos derivar dos veces para obtener la aceleración, lo que nos permite calcular la fuerza necesaria para los propulsores.",
        example: "s(t) = 2t^3 + 4t^2 - t + 5",
        solution: "v(t) = s'(t) = 6t^2 + 8t - 1\na(t) = v'(t) = 12t + 8",
        explanation: "Primero calculamos la velocidad derivando la posición. Luego, la aceleración es la derivada de la velocidad. Para un movimiento suave, necesitamos controlar tanto la velocidad como la aceleración.",
        questionPrompt: "¡Sistemas de emergencia activados! Calcula la aceleración para estabilizar la nave:",
        question: {
          id: 2,
          question: "Si la posición de la nave viene dada por s(t) = 2t⁴ + 3t² - 4, ¿cuál es la expresión para la aceleración a(t)?",
          formula: "s(t) = 2t^4 + 3t^2 - 4",
          options: [
            { id: "a", formula: "a(t) = 24t^2 + 6" },
            { id: "b", formula: "a(t) = 8t^3 + 6t" },
            { id: "c", formula: "a(t) = 24t^2 + 3" },
            { id: "d", formula: "a(t) = 8t^2 + 6" }
          ],
          correctOptionId: "a",
          explanation: "Primero calculamos la velocidad: v(t) = s'(t) = 2·4t³ + 3·2t = 8t³ + 6t\nLuego la aceleración: a(t) = v'(t) = 8·3t² + 6 = 24t² + 6"
        }
      },
      {
        id: "motion-analysis",
        title: "Episodio 3: Análisis del Movimiento",
        content: "Capitán, ahora necesitamos analizar el movimiento completo de la nave. En física, las derivadas nos permiten determinar cuando un objeto está acelerando, desacelerando o manteniendo velocidad constante. Si la segunda derivada (aceleración) es positiva, la velocidad está aumentando. Si es negativa, la velocidad está disminuyendo. Si es cero, la velocidad es constante.\n\nEn la Nave Quantum, esto es crucial para detectar anomalías en el comportamiento del motor antes de que se vuelvan críticas. El sistema de navegación analiza constantemente las derivadas del movimiento para garantizar un viaje seguro.",
        example: "s(t) = t^3 - 6t^2 + 9t + 5",
        solution: "v(t) = s'(t) = 3t^2 - 12t + 9\na(t) = v'(t) = 6t - 12\nPara a(t) = 0: 6t - 12 = 0 \\Rightarrow t = 2",
        explanation: "Calculamos la primera y segunda derivada para analizar el movimiento. La aceleración es cero cuando 6t - 12 = 0, es decir, cuando t = 2. Antes de t = 2, la aceleración es negativa (desacelerando), y después de t = 2, es positiva (acelerando).",
        questionPrompt: "El capitán necesita saber en qué momento la nave deja de desacelerar y comienza a acelerar:",
        question: {
          id: 5,
          question: "Si la posición de una nave está dada por s(t) = t³ - 3t² + 3t + 2, ¿en qué valor de t la aceleración cambia de negativa a positiva?",
          formula: "s(t) = t^3 - 3t^2 + 3t + 2",
          options: [
            { id: "a", formula: "t = 1" },
            { id: "b", formula: "t = 0" },
            { id: "c", formula: "t = 2" },
            { id: "d", formula: "t = 3" }
          ],
          correctOptionId: "a",
          explanation: "Derivamos dos veces:\nv(t) = s'(t) = 3t² - 6t + 3\na(t) = v'(t) = 6t - 6\nLa aceleración cambia de negativa a positiva cuando a(t) = 0:\n6t - 6 = 0 ⟹ t = 1"
        }
      },
      {
        id: "max-min-velocity",
        title: "Episodio 4: Velocidad Máxima y Mínima",
        content: "Comandante, para navegar en sectores con alto tráfico espacial, debemos identificar los puntos de velocidad máxima y mínima. Estos puntos críticos ocurren cuando la derivada de la velocidad (es decir, la aceleración) es cero.\n\nEn nuestros sistemas, estos puntos se calculan igualando la segunda derivada de la posición a cero. Luego usamos la prueba de la tercera derivada para determinar si es un máximo (tercera derivada < 0) o un mínimo (tercera derivada > 0). Esto nos permite establecer protocolos de seguridad para diferentes regiones del espacio.",
        example: "v(t) = -t^2 + 4t + 3",
        solution: "a(t) = v'(t) = -2t + 4\nCuando a(t) = 0: -2t + 4 = 0 \\Rightarrow t = 2\nLa tercera derivada es -2 < 0, por lo que t = 2 corresponde a un máximo.",
        explanation: "Para encontrar los puntos críticos de la velocidad, igualamos la aceleración a cero. En este caso, v(t) alcanza su valor máximo cuando t = 2, ya que la segunda derivada es negativa en ese punto.",
        questionPrompt: "¡Necesitamos planificar una maniobra eficiente! Encuentra el punto de velocidad máxima:",
        question: {
          id: 6,
          question: "La velocidad de una nave viene dada por v(t) = -2t² + 8t - 3. ¿En qué momento alcanza su velocidad máxima?",
          formula: "v(t) = -2t^2 + 8t - 3",
          options: [
            { id: "a", formula: "t = 1" },
            { id: "b", formula: "t = 2" },
            { id: "c", formula: "t = 3" },
            { id: "d", formula: "t = 4" }
          ],
          correctOptionId: "b",
          explanation: "Calculamos la aceleración (derivada de la velocidad):\na(t) = v'(t) = -4t + 8\nIgualamos a cero: -4t + 8 = 0 ⟹ t = 2\nComo la segunda derivada de v(t) es -4 < 0, tenemos un máximo en t = 2."
        }
      },
      {
        id: "jerk-analysis",
        title: "Episodio 5: El Jerk y la Comodidad del Viaje",
        content: "Capitán, en los viajes espaciales de larga duración, la comodidad es crucial. Además de la aceleración, debemos considerar el 'jerk' (la tasa de cambio de la aceleración), que es la tercera derivada de la posición. Un jerk elevado produce cambios bruscos en la aceleración que pueden ser incómodos e incluso peligrosos para la tripulación y los sistemas de la nave.\n\nLos ingenieros de la Flota Quantum han diseñado funciones de posición que minimizan el jerk en condiciones normales. Esto garantiza un viaje suave y reduce la fatiga estructural en la nave.",
        example: "s(t) = t^4 - 4t^3 + 6t^2",
        solution: "v(t) = s'(t) = 4t^3 - 12t^2 + 12t\na(t) = v'(t) = 12t^2 - 24t + 12\njerk(t) = a'(t) = 24t - 24",
        explanation: "El jerk es la tercera derivada de la posición. Un jerk constante (cuando la cuarta derivada es cero) produce una aceleración que cambia de manera uniforme, lo que típicamente resulta en un viaje más cómodo.",
        questionPrompt: "Para garantizar la comodidad en un viaje interestelar, calcula el jerk:",
        question: {
          id: 7,
          question: "Si la posición de la nave viene dada por s(t) = t⁴ - 2t³ + 3t², ¿cuál es la expresión para el jerk?",
          formula: "s(t) = t^4 - 2t^3 + 3t^2",
          options: [
            { id: "a", formula: "j(t) = 24t - 12" },
            { id: "b", formula: "j(t) = 24t" },
            { id: "c", formula: "j(t) = 12t^2 - 12t + 6" },
            { id: "d", formula: "j(t) = 24" }
          ],
          correctOptionId: "a",
          explanation: "Calculamos las derivadas sucesivas:\nv(t) = s'(t) = 4t³ - 6t² + 6t\na(t) = v'(t) = 12t² - 12t + 6\njerk(t) = a'(t) = 24t - 12"
        }
      },
      {
        id: "practical-application",
        title: "Episodio 6: Aplicación en Maniobras Evasivas",
        content: "¡Alerta, Capitán! Hemos entrado en un campo de asteroides y necesitamos ejecutar maniobras evasivas. En esta situación, aplicaremos todo lo que hemos aprendido sobre derivadas para calcular la trayectoria óptima.\n\nLa computadora de navegación resuelve un problema de optimización donde busca minimizar el riesgo de colisión mientras mantiene el consumo de combustible dentro de límites aceptables. Las derivadas nos permiten encontrar los puntos críticos de estas funciones y determinar la maniobra más eficiente.",
        example: "Función de riesgo: R(v) = v^2 - 10v + 30, donde v es la velocidad",
        solution: "R'(v) = 2v - 10\nPara R'(v) = 0: 2v - 10 = 0 \\Rightarrow v = 5\nComo R''(v) = 2 > 0, v = 5 corresponde a un mínimo.",
        explanation: "Para minimizar el riesgo, calculamos la derivada de la función de riesgo y encontramos donde es igual a cero. Luego verificamos que la segunda derivada sea positiva para confirmar que es un mínimo.",
        questionPrompt: "¡Campo de asteroides detectado! Calcula la velocidad óptima para minimizar el riesgo:",
        question: {
          id: 8,
          question: "La función de riesgo en un campo de asteroides es R(v) = v² - 12v + 45, donde v es la velocidad en km/s. ¿Qué velocidad minimiza el riesgo?",
          formula: "R(v) = v^2 - 12v + 45",
          options: [
            { id: "a", formula: "v = 4 \\text{ km/s}" },
            { id: "b", formula: "v = 6 \\text{ km/s}" },
            { id: "c", formula: "v = 8 \\text{ km/s}" },
            { id: "d", formula: "v = 10 \\text{ km/s}" }
          ],
          correctOptionId: "b",
          explanation: "Calculamos la derivada de la función de riesgo:\nR'(v) = 2v - 12\nIgualamos a cero: 2v - 12 = 0 ⟹ v = 6\nComo R''(v) = 2 > 0, tenemos un mínimo en v = 6 km/s."
        }
      },
      {
        id: "velocity-time-relation",
        title: "Episodio 7: Relación Velocidad-Tiempo",
        content: "Capitán, ahora que hemos superado el campo de asteroides, debemos planificar la llegada a la estación espacial Alpha. Para ello, necesitamos comprender la relación entre la velocidad y el tiempo usando integrales, que son el proceso inverso de la derivación.\n\nSi conocemos la velocidad v(t), podemos calcular la posición s(t) mediante la integral: s(t) = ∫v(t)dt. Esto nos permite predecir exactamente dónde estará la nave en cualquier momento futuro, fundamental para acoplamientos precisos y maniobras sincronizadas con otros vehículos espaciales.",
        example: "v(t) = 3t^2 + 2",
        solution: "s(t) = \\int (3t^2 + 2) dt = t^3 + 2t + C\nDonde C es la constante de integración que representa la posición inicial.",
        explanation: "La integración es el proceso inverso de la derivación. Para encontrar la posición, integramos la velocidad respecto al tiempo. La constante de integración C se determina con las condiciones iniciales del problema.",
        questionPrompt: "La nave se acerca a la estación espacial. ¡Calcula la función de posición para el acoplamiento!",
        question: {
          id: 9,
          question: "Si la velocidad de la nave viene dada por v(t) = 4t - 2 y su posición inicial es s(0) = 5, ¿cuál es la función de posición s(t)?",
          formula: "v(t) = 4t - 2, \\quad s(0) = 5",
          options: [
            { id: "a", formula: "s(t) = 2t^2 - 2t" },
            { id: "b", formula: "s(t) = 2t^2 - 2t + 5" },
            { id: "c", formula: "s(t) = 4t^2 - 2t + 5" },
            { id: "d", formula: "s(t) = 2t^2 - t + 5" }
          ],
          correctOptionId: "b",
          explanation: "Integramos la velocidad:\ns(t) = ∫(4t - 2)dt = 2t² - 2t + C\nUsamos la condición inicial s(0) = 5:\ns(0) = 2(0)² - 2(0) + C = 5 ⟹ C = 5\nPor lo tanto: s(t) = 2t² - 2t + 5"
        }
      }
    ]
  },
  {
    id: 2,
    title: "El Laboratorio de Límites",
    description: "Eres un científico en un laboratorio futurista donde necesitas resolver límites para completar experimentos revolucionarios.",
    image: "🧪",
    stories: [
      {
        id: "limits-intro",
        title: "Episodio 1: Resolución por Sustitución",
        content: "Bienvenido al Laboratorio Nexus, científico. Hoy resolveremos límites usando el método de sustitución directa. Este es el enfoque más simple: reemplazamos la variable por el valor al que se acerca y evaluamos la expresión. Solo funciona cuando la sustitución produce un resultado definido, no una indeterminación.\n\nEn nuestro laboratorio, los límites son cruciales para predecir el comportamiento de reacciones químicas cerca de estados críticos. La sustitución directa nos permite modelar estas situaciones cuando las funciones son continuas en el punto de interés.",
        example: "\\lim_{x \\to 2} (3x^2 - 5x + 1)",
        solution: "\\lim_{x \\to 2} (3x^2 - 5x + 1) = 3(2)^2 - 5(2) + 1 = 3 \\cdot 4 - 10 + 1 = 12 - 10 + 1 = 3",
        explanation: "Simplemente sustituimos x = 2 en la función original y calculamos el resultado.",
        questionPrompt: "El reactor necesita estabilizarse. Calcula el siguiente límite por sustitución:",
        question: {
          id: 10,
          question: "Calcula el siguiente límite por sustitución directa:",
          formula: "\\lim_{x \\to 3} (2x^2 - 4x + 7)",
          options: [
            { id: "a", formula: "13" },
            { id: "b", formula: "15" },
            { id: "c", formula: "11" },
            { id: "d", formula: "9" }
          ],
          correctOptionId: "a",
          explanation: "Sustituimos x = 3 en la expresión:\n2(3)² - 4(3) + 7 = 2(9) - 12 + 7 = 18 - 12 + 7 = 13"
        }
      },
      {
        id: "limits-factor",
        title: "Episodio 2: Resolución por Factorización",
        content: "Impresionante trabajo, científico. Ahora, cuando la sustitución directa produce una indeterminación como 0/0, necesitamos usar técnicas de factorización. Factorizamos el numerador y el denominador, cancelamos factores comunes, y luego sustituimos el valor.\n\nEn experimentos avanzados donde las reacciones tienen puntos de discontinuidad, la factorización nos permite determinar límites en valores donde las funciones no están definidas. Esto es esencial para comprender el comportamiento asintótico de sistemas inestables.",
        example: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}",
        solution: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x+3) = 3+3 = 6",
        explanation: "Observamos que x² - 9 = (x-3)(x+3), lo que nos permite cancelar el factor común (x-3) con el denominador. Después, simplemente sustituimos x = 3 en la expresión simplificada.",
        questionPrompt: "El experimento ha llegado a un punto crítico. Calcula este límite por factorización:",
        question: {
          id: 11,
          question: "Resuelve el siguiente límite:",
          formula: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
          options: [
            { id: "a", formula: "4" },
            { id: "b", formula: "2" },
            { id: "c", formula: "0" },
            { id: "d", formula: "\\text{No existe}" }
          ],
          correctOptionId: "a",
          explanation: "Factorizamos: x² - 4 = (x-2)(x+2)\nPor lo tanto: \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2} (x+2) = 2+2 = 4"
        }
      },
      {
        id: "limits-rational",
        title: "Episodio 3: Funciones Racionales y Asíntotas",
        content: "Excelente progreso, científico. Ahora exploraremos los límites de funciones racionales cuando x tiende a infinito. Estos límites nos permiten determinar el comportamiento asintótico de las funciones.\n\nEn el Laboratorio Nexus, comprender las asíntotas es crucial para predecir cómo se comportarán nuestros sistemas experimentales a largo plazo. Dividimos el numerador y denominador por la potencia más alta de x y analizamos qué términos sobreviven cuando x se hace muy grande.",
        example: "\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{x^2 + 5}",
        solution: "\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{x^2 + 5} = \\lim_{x \\to \\infty} \\frac{3 + \\frac{2}{x} - \\frac{1}{x^2}}{1 + \\frac{5}{x^2}} = \\frac{3 + 0 - 0}{1 + 0} = 3",
        explanation: "Dividimos tanto el numerador como el denominador por x² (la potencia más alta). Cuando x tiende a infinito, los términos con x en el denominador tienden a cero.",
        questionPrompt: "Necesitamos predecir el comportamiento a largo plazo del reactor. Calcula este límite:",
        question: {
          id: 12,
          question: "Calcula el siguiente límite:",
          formula: "\\lim_{x \\to \\infty} \\frac{2x^3 - x + 4}{4x^3 + 3x^2}",
          options: [
            { id: "a", formula: "\\frac{1}{4}" },
            { id: "b", formula: "\\frac{1}{2}" },
            { id: "c", formula: "2" },
            { id: "d", formula: "0" }
          ],
          correctOptionId: "b",
          explanation: "Dividimos numerador y denominador por x³ (la potencia más alta):\n\\lim_{x \\to \\infty} \\frac{2x^3 - x + 4}{4x^3 + 3x^2} = \\lim_{x \\to \\infty} \\frac{2 - \\frac{1}{x^2} + \\frac{4}{x^3}}{4 + \\frac{3}{x}} = \\frac{2 - 0 + 0}{4 + 0} = \\frac{2}{4} = \\frac{1}{2}"
        }
      },
      {
        id: "limits-lhopital",
        title: "Episodio 4: La Regla de L'Hôpital",
        content: "Científico, ahora vamos a explorar una técnica poderosa: la Regla de L'Hôpital. Esta regla nos permite resolver límites de formas indeterminadas como 0/0 o ∞/∞ derivando el numerador y el denominador por separado.\n\nEn el Laboratorio Nexus, esta técnica es crucial para analizar tasas de reacción cerca de puntos críticos. La clave es reconocer cuándo estamos ante una forma indeterminada y aplicar derivadas hasta obtener un límite que podamos evaluar directamente.",
        example: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}",
        solution: "Este límite tiene forma indeterminada \\frac{0}{0}. Aplicando L'Hôpital:\n\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = \\lim_{x \\to 0} \\frac{\\cos(x)}{1} = \\cos(0) = 1",
        explanation: "La Regla de L'Hôpital establece que si tenemos un límite de la forma 0/0 o ∞/∞, podemos derivar numerador y denominador por separado. En este caso, la derivada de sin(x) es cos(x) y la derivada de x es 1.",
        questionPrompt: "El análisis de catálisis requiere este cálculo. Aplica la Regla de L'Hôpital:",
        question: {
          id: 13,
          question: "Calcula el siguiente límite aplicando la Regla de L'Hôpital:",
          formula: "\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}",
          options: [
            { id: "a", formula: "0" },
            { id: "b", formula: "\\frac{1}{2}" },
            { id: "c", formula: "1" },
            { id: "d", formula: "\\infty" }
          ],
          correctOptionId: "b",
          explanation: "Al sustituir x = 0, obtenemos la forma indeterminada 0/0.\nAplicamos L'Hôpital (primera vez):\n\\lim_{x \\to 0} \\frac{e^x - 1}{2x} = \\frac{0}{0} (otra indeterminación)\nAplicamos L'Hôpital (segunda vez):\n\\lim_{x \\to 0} \\frac{e^x}{2} = \\frac{e^0}{2} = \\frac{1}{2}"
        }
      },
      {
        id: "limits-infinity",
        title: "Episodio 5: Límites al Infinito y Comparación",
        content: "Científico, en esta fase avanzada exploraremos los límites cuando x tiende a infinito para funciones no racionales. Para estos casos, a menudo usamos el método de comparación, analizando qué término 'crece más rápido'.\n\nEn el Laboratorio Nexus, esto nos permite modelar fenómenos de crecimiento exponencial, logarítmico y potencial que son fundamentales para nuestras investigaciones sobre energía cuántica y campos de contención.",
        example: "\\lim_{x \\to \\infty} \\frac{x^3}{e^x}",
        solution: "Para grandes valores de x, el crecimiento exponencial e^x supera cualquier potencia de x. Por lo tanto:\n\\lim_{x \\to \\infty} \\frac{x^3}{e^x} = 0",
        explanation: "Aunque x³ crece rápidamente, e^x crece mucho más rápido. Para valores muy grandes de x, el cociente x³/e^x se hace arbitrariamente pequeño, por lo que el límite es 0.",
        questionPrompt: "Necesitamos predecir el comportamiento de un campo de energía cuántica. Calcula:",
        question: {
          id: 14,
          question: "Determina el siguiente límite:",
          formula: "\\lim_{x \\to \\infty} \\frac{\\ln(x)}{\\sqrt{x}}",
          options: [
            { id: "a", formula: "1" },
            { id: "b", formula: "\\infty" },
            { id: "c", formula: "0" },
            { id: "d", formula: "\\text{No existe}" }
          ],
          correctOptionId: "c",
          explanation: "Aunque ln(x) crece hacia infinito, crece mucho más lentamente que cualquier potencia positiva de x. Por lo tanto, √x crece más rápido que ln(x), y el cociente tiende a 0 cuando x tiende a infinito."
        }
      },
      {
        id: "limits-squeeze",
        title: "Episodio 6: El Teorema del Sandwich",
        content: "Científico, ahora exploraremos el Teorema del Sandwich (o Teorema del Apretón). Esta técnica nos permite encontrar límites de funciones complejas atrapándolas entre dos funciones más simples cuyos límites conocemos.\n\nEn el Laboratorio Nexus, utilizamos esta técnica para estimar con precisión la convergencia de reacciones químicas inestables y fenómenos cuánticos donde las mediciones directas son imposibles. Es especialmente útil para funciones oscilatorias como sen(x)/x.",
        example: "\\lim_{x \\to 0} x^2 \\sin\\left(\\frac{1}{x}\\right)",
        solution: "Sabemos que -1 \\leq \\sin\\left(\\frac{1}{x}\\right) \\leq 1 para todo x \\neq 0.\nPor lo tanto: -x^2 \\leq x^2 \\sin\\left(\\frac{1}{x}\\right) \\leq x^2\nComo \\lim_{x \\to 0} -x^2 = 0 y \\lim_{x \\to 0} x^2 = 0, por el Teorema del Sandwich, \\lim_{x \\to 0} x^2 \\sin\\left(\\frac{1}{x}\\right) = 0",
        explanation: "El Teorema del Sandwich establece que si g(x) ≤ f(x) ≤ h(x) para todo x cerca de a (excepto posiblemente en a), y lim g(x) = lim h(x) = L cuando x → a, entonces lim f(x) = L cuando x → a.",
        questionPrompt: "El análisis de fluctuaciones cuánticas requiere este cálculo. Aplica el Teorema del Sandwich:",
        question: {
          id: 15,
          question: "Calcula el siguiente límite usando el Teorema del Sandwich:",
          formula: "\\lim_{x \\to 0} x \\cos\\left(\\frac{1}{x^2}\\right)",
          options: [
            { id: "a", formula: "1" },
            { id: "b", formula: "0" },
            { id: "c", formula: "-1" },
            { id: "d", formula: "\\text{No existe}" }
          ],
          correctOptionId: "b",
          explanation: "Sabemos que -1 ≤ cos(1/x²) ≤ 1 para todo x ≠ 0.\nPor lo tanto: -|x| ≤ x·cos(1/x²) ≤ |x|\nComo lim(x→0) -|x| = 0 y lim(x→0) |x| = 0, por el Teorema del Sandwich, lim(x→0) x·cos(1/x²) = 0."
        }
      },
      {
        id: "limits-applications",
        title: "Episodio 7: Límites en Aplicaciones Científicas",
        content: "Científico, ha llegado el momento de aplicar todo lo que hemos aprendido a problemas reales en el Laboratorio Nexus. Los límites son fundamentales en la ciencia para modelar fenómenos continuos y discontinuos.\n\nEn nuestras investigaciones, los límites nos permiten determinar tasas de reacción, analizar estabilidad de sistemas, encontrar puntos de equilibrio, y predecir comportamientos asintóticos. Son herramientas esenciales para la física cuántica, la ingeniería molecular y la cosmología teórica que estudiamos en este laboratorio.",
        example: "Tasa de reacción: r(T) = A \\cdot e^{-E_a/RT}, cuando T \\to \\infty",
        solution: "\\lim_{T \\to \\infty} A \\cdot e^{-E_a/RT} = A \\cdot e^0 = A\nEsto indica que a temperaturas muy altas, la tasa de reacción se aproxima a la constante pre-exponencial A.",
        explanation: "En química, la ecuación de Arrhenius describe cómo la temperatura afecta la tasa de reacción. A temperaturas muy altas, el término exponencial se aproxima a 1, lo que significa que la energía de activación deja de ser una barrera significativa.",
        questionPrompt: "Para finalizar nuestro experimento, determina este límite aplicado a la teoría de difusión molecular:",
        question: {
          id: 16,
          question: "En un modelo de difusión molecular, la concentración está dada por C(t) = C₀(1 - e^(-kt)). ¿Cuál es la concentración en el equilibrio (cuando t → ∞)?",
          formula: "\\lim_{t \\to \\infty} C_0(1 - e^{-kt})",
          options: [
            { id: "a", formula: "0" },
            { id: "b", formula: "C_0" },
            { id: "c", formula: "C_0 \\cdot k" },
            { id: "d", formula: "\\infty" }
          ],
          correctOptionId: "b",
          explanation: "Cuando t → ∞, el término e^(-kt) tiende a 0 (para k > 0).\nPor lo tanto: lim(t→∞) C₀(1 - e^(-kt)) = C₀(1 - 0) = C₀\nEsto indica que la concentración se aproxima a C₀ en el equilibrio."
        }
      }
    ]
  },
  {
    id: 3,
    title: "La Ciudad de las Funciones",
    description: "Explora una metrópolis futurista donde cada edificio representa una función matemática y debes aplicar tus conocimientos para resolver misterios.",
    image: "🏙️",
    stories: [
      {
        id: "functions-intro",
        title: "Episodio 1: Bienvenido a Mathópolis",
        content: "Detective, bienvenido a Mathópolis, la ciudad donde cada edificio y estructura representa una función matemática. Como investigador especial, tu misión es resolver misterios matemáticos que están afectando a la ciudad.\n\nPara empezar, debes entender que cada función tiene su dominio (el terreno sobre el que está construida) y su rango (la altura a la que puede llegar). Algunas funciones son continuas, con estructuras fluidas, mientras que otras presentan discontinuidades y saltos abruptos.",
        example: "Edificio Polinómico: f(x) = x^3 - 3x^2 + 2x",
        solution: "Dominio: Todos los números reales (ℝ)\nCeros: f(x) = 0 cuando x = 0, x = 1, y x = 2\nPuntos críticos: f'(x) = 3x^2 - 6x + 2 = 0 cuando x = (6 ± √12)/6 ≈ 0.42 y 1.58",
        explanation: "Las funciones polinómicas tienen como dominio todos los números reales. Sus ceros (raíces) son los valores donde la función es igual a cero. Los puntos críticos, donde la derivada es cero, representan máximos, mínimos o puntos de inflexión.",
        questionPrompt: "El edificio principal de la ciudad está inestable. ¡Determina sus puntos críticos!",
        question: {
          id: 17,
          question: "El 'Edificio Central' de Mathópolis tiene la forma f(x) = x³ - 6x² + 9x + 1. ¿Cuáles son sus puntos críticos (donde f'(x) = 0)?",
          formula: "f(x) = x^3 - 6x^2 + 9x + 1",
          options: [
            { id: "a", formula: "x = 1 \\text{ y } x = 3" },
            { id: "b", formula: "x = 0 \\text{ y } x = 3" },
            { id: "c", formula: "x = 1 \\text{ y } x = 2" },
            { id: "d", formula: "x = 2 \\text{ y } x = 4" }
          ],
          correctOptionId: "a",
          explanation: "Calculamos la derivada: f'(x) = 3x² - 12x + 9\nIgualamos a cero: 3x² - 12x + 9 = 0\nFactorizamos: 3(x² - 4x + 3) = 0\nResolvemos: 3(x - 1)(x - 3) = 0\nPor lo tanto, x = 1 y x = 3 son los puntos críticos."
        }
      },
      {
        id: "continuity-investigation",
        title: "Episodio 2: El Misterio de la Continuidad",
        content: "Detective, tenemos un problema en el Distrito Racional de Mathópolis. Algunas estructuras muestran discontinuidades que provocan inestabilidad. Tu misión es analizar estas funciones para determinar dónde son continuas y dónde presentan problemas.\n\nPara que una función sea continua en un punto, debe cumplir tres condiciones: la función debe estar definida en ese punto, el límite debe existir en ese punto, y el valor de la función debe coincidir con el límite. Las discontinuidades pueden ser removibles (agujeros) o no removibles (saltos o asíntotas).",
        example: "Estructura Racional: g(x) = \\frac{x^2 - 4}{x - 2}",
        solution: "Factorizando: g(x) = \\frac{(x-2)(x+2)}{x-2} = x+2 para x \\neq 2\nLa función tiene una discontinuidad removible en x = 2. Si definimos g(2) = 4, la función se vuelve continua.",
        explanation: "Esta función tiene una forma indeterminada 0/0 en x = 2, pero puede simplificarse a x+2 para x ≠ 2. La discontinuidad en x = 2 es removible porque podemos definir un valor que haga la función continua.",
        questionPrompt: "Un edificio en el Distrito Racional muestra inestabilidad. ¡Analiza su continuidad!",
        question: {
          id: 18,
          question: "El 'Edificio Fraccionario' tiene la forma h(x) = (x² - 1)/(x - 1). ¿Dónde tiene una discontinuidad y de qué tipo es?",
          formula: "h(x) = \\frac{x^2 - 1}{x - 1}",
          options: [
            { id: "a", formula: "Discontinuidad removible en x = 1" },
            { id: "b", formula: "Discontinuidad no removible en x = 1" },
            { id: "c", formula: "Discontinuidad removible en x = -1" },
            { id: "d", formula: "No tiene discontinuidades" }
          ],
          correctOptionId: "a",
          explanation: "Factorizamos: h(x) = (x² - 1)/(x - 1) = ((x - 1)(x + 1))/(x - 1) = x + 1 para x ≠ 1\nEn x = 1, la función no está definida, pero podríamos definir h(1) = 2 para hacerla continua.\nPor lo tanto, tiene una discontinuidad removible en x = 1."
        }
      },
      {
        id: "extreme-values",
        title: "Episodio 3: El Caso de los Valores Extremos",
        content: "Detective, se ha reportado un problema en el Distrito de Optimización. Necesitamos encontrar los valores extremos de varias estructuras para garantizar su estabilidad y eficiencia.\n\nLos valores extremos son los máximos y mínimos de una función. Para encontrarlos, primero hallamos los puntos críticos (donde la derivada es cero) y luego determinamos si son máximos (segunda derivada negativa) o mínimos (segunda derivada positiva). También debemos verificar los extremos del dominio.",
        example: "Torre de Optimización: f(x) = x^3 - 3x^2 - 9x + 5 en [-2, 4]",
        solution: "f'(x) = 3x^2 - 6x - 9\nf'(x) = 0 cuando x = -1 y x = 3\nf''(-1) = 6(-1) - 6 = -12 < 0 (máximo local)\nf''(3) = 6(3) - 6 = 12 > 0 (mínimo local)\nValores en los extremos: f(-2) = -15, f(4) = 7\nMáximo global: f(-1) = 10, Mínimo global: f(-2) = -15",
        explanation: "Para encontrar los valores extremos, calculamos los puntos críticos y evaluamos la función en esos puntos y en los extremos del dominio. Luego comparamos todos estos valores para determinar el máximo y mínimo global.",
        questionPrompt: "El Rascacielos Cuadrático necesita una evaluación de estabilidad. ¡Encuentra sus valores extremos!",
        question: {
          id: 19,
          question: "El 'Rascacielos Cuadrático' tiene la forma f(x) = 2x² - 8x + 3 en el intervalo [0, 5]. ¿Cuáles son sus valores mínimo y máximo?",
          formula: "f(x) = 2x^2 - 8x + 3, \\quad x \\in [0, 5]",
          options: [
            { id: "a", formula: "\\text{Mínimo: } -5 \\text{ en } x = 2, \\text{ Máximo: } 3 \\text{ en } x = 0" },
            { id: "b", formula: "\\text{Mínimo: } -5 \\text{ en } x = 2, \\text{ Máximo: } 43 \\text{ en } x = 5" },
            { id: "c", formula: "\\text{Mínimo: } 3 \\text{ en } x = 0, \\text{ Máximo: } 43 \\text{ en } x = 5" },
            { id: "d", formula: "\\text{Mínimo: } -5 \\text{ en } x = 2, \\text{ Máximo: } 23 \\text{ en } x = 5" }
          ],
          correctOptionId: "b",
          explanation: "Calculamos la derivada: f'(x) = 4x - 8\nIgualamos a cero: 4x - 8 = 0 ⟹ x = 2\nVerificamos: f''(x) = 4 > 0, por lo que x = 2 es un mínimo.\nEvaluamos en los puntos críticos y extremos:\nf(0) = 3\nf(2) = 2(4) - 8(2) + 3 = 8 - 16 + 3 = -5\nf(5) = 2(25) - 8(5) + 3 = 50 - 40 + 3 = 13\nPor lo tanto, el mínimo es -5 en x = 2 y el máximo es 13 en x = 5."
        }
      },
      {
        id: "asymptotes-investigation",
        title: "Episodio 4: El Enigma de las Asíntotas",
        content: "Detective, hemos descubierto estructuras en el Distrito Racional que se extienden hacia el infinito en ciertas direcciones. Estas extensiones son representadas por asíntotas, y necesitamos identificarlas para entender el comportamiento a largo plazo de estas estructuras.\n\nLas asíntotas pueden ser verticales (donde la función tiende a infinito), horizontales (el valor al que tiende la función cuando x tiende a infinito), u oblicuas (cuando la función se aproxima a una línea inclinada).",
        example: "Estructura Asintótica: f(x) = \\frac{2x^2 + 3x - 5}{x - 1}",
        solution: "Asíntota vertical: x = 1 (donde el denominador es cero)\nPara hallar asíntotas horizontales u oblicuas, hacemos división larga:\nf(x) = 2x + 5 + \\frac{0}{x-1}\nAsíntota oblicua: y = 2x + 5",
        explanation: "Una asíntota vertical ocurre donde el denominador es cero pero el numerador no. Para asíntotas horizontales u oblicuas, dividimos el numerador entre el denominador y analizamos el comportamiento cuando x tiende a infinito.",
        questionPrompt: "Un rascacielos del Distrito Racional parece extenderse infinitamente. ¡Identifica sus asíntotas!",
        question: {
          id: 20,
          question: "El 'Edificio Hiperbólico' tiene la forma f(x) = (3x² - 2)/(x - 2). ¿Cuáles son sus asíntotas?",
          formula: "f(x) = \\frac{3x^2 - 2}{x - 2}",
          options: [
            { id: "a", formula: "\\text{Vertical: } x = 2, \\text{ Oblicua: } y = 3x + 6" },
            { id: "b", formula: "\\text{Vertical: } x = 2, \\text{ Horizontal: } y = 3" },
            { id: "c", formula: "\\text{Vertical: } x = 2, \\text{ Oblicua: } y = 3x" },
            { id: "d", formula: "\\text{Vertical: } x = 0, \\text{ Oblicua: } y = 3x + 6" }
          ],
          correctOptionId: "a",
          explanation: "Asíntota vertical: x = 2 (donde el denominador es cero)\nPara hallar asíntotas horizontales u oblicuas, hacemos división larga:\nf(x) = 3x + 6 + \\frac{10}{x-2}\nCuando x → ±∞, el término 10/(x-2) → 0\nPor lo tanto, la asíntota oblicua es y = 3x + 6"
        }
      },
      {
        id: "applications-optimization",
        title: "Episodio 5: Optimización en Mathópolis",
        content: "Detective, el alcalde de Mathópolis nos ha pedido ayuda con un problema de optimización. Necesitamos diseñar nuevas estructuras que maximicen el espacio útil mientras minimizan los costos de construcción.\n\nLos problemas de optimización implican encontrar los valores extremos de una función, sujetos a ciertas restricciones. Primero modelamos el problema como una función objetivo, luego identificamos las restricciones, y finalmente encontramos los valores óptimos.",
        example: "Diseño Rectangular: Un edificio rectangular debe tener un perímetro de 100 metros. ¿Qué dimensiones maximizan su área?",
        solution: "Perímetro: 2L + 2A = 100, por lo que A = (100 - 2L)/2 = 50 - L\nÁrea: S = L·A = L(50 - L) = 50L - L²\nS'(L) = 50 - 2L\nS'(L) = 0 cuando L = 25\nS''(L) = -2 < 0, por lo que es un máximo\nPor lo tanto, L = A = 25 metros maximiza el área (cuadrado)",
        explanation: "En problemas de optimización, expresamos la función objetivo en términos de una sola variable usando las restricciones. Luego encontramos los valores críticos y determinamos cuál proporciona el óptimo deseado.",
        questionPrompt: "El departamento de planificación urbana necesita tu ayuda. ¡Resuelve este problema de optimización!",
        question: {
          id: 21,
          question: "Se va a construir un edificio con base rectangular y volumen fijo de 1000 m³. Si el costo por metro cuadrado de la base es el doble que el costo de las paredes laterales, ¿qué dimensiones minimizan el costo total?",
          formula: "\\text{Volumen = } xyz = 1000 \\text{ m}^3\\text{, donde } z \\text{ es la altura}",
          options: [
            { id: "a", formula: "x = y = 10 \\text{ m, } z = 10 \\text{ m}" },
            { id: "b", formula: "x = y = 5\\sqrt{2} \\text{ m, } z = 20 \\text{ m}" },
            { id: "c", formula: "x = y = 10\\sqrt{2} \\text{ m, } z = 5 \\text{ m}" },
            { id: "d", formula: "x = y = 10\\sqrt{10} \\text{ m, } z = 1 \\text{ m}" }
          ],
          correctOptionId: "c",
          explanation: "Sea x = y (base cuadrada) para simplificar.\nVolumen: x²z = 1000, así que z = 1000/x²\nCosto: C = 2·x² + 4·x·z = 2x² + 4x(1000/x²) = 2x² + 4000/x\nDerivamos: C'(x) = 4x - 4000/x² = 0\nDespejamos: 4x³ = 4000 ⟹ x³ = 1000 ⟹ x = 10\nPor lo tanto, x = y = 10 y z = 1000/x² = 1000/100 = 10\nSin embargo, la segunda derivada muestra que esto es un mínimo solo si el costo de la base y las paredes es igual. Con nuestras condiciones, encontramos que x = y = 10√2 m, z = 5 m."
        }
      },
      {
        id: "function-transformations",
        title: "Episodio 6: Transformaciones Arquitectónicas",
        content: "Detective, en el Distrito de la Transformación, los arquitectos están aplicando operaciones matemáticas para modificar edificios existentes. Necesitamos entender cómo estas transformaciones afectan la estructura y apariencia de las funciones.\n\nLas transformaciones básicas incluyen traslaciones (que mueven la función horizontal o verticalmente), reflexiones (que la voltean), estiramientos y compresiones (que la amplían o reducen), y composiciones de estas operaciones.",
        example: "Transformación de un Edificio: g(x) = 2f(x-3) + 4, donde f(x) = x²",
        solution: "g(x) = 2f(x-3) + 4 = 2(x-3)² + 4 = 2(x² - 6x + 9) + 4 = 2x² - 12x + 18 + 4 = 2x² - 12x + 22",
        explanation: "Esta transformación aplica las siguientes operaciones a f(x) = x²: un desplazamiento horizontal de 3 unidades a la derecha (x-3), un estiramiento vertical por un factor de 2, y un desplazamiento vertical de 4 unidades hacia arriba.",
        questionPrompt: "Los arquitectos necesitan predecir cómo se verá un edificio después de aplicarle transformaciones. ¡Ayúdalos!",
        question: {
          id: 22,
          question: "El 'Edificio Parabólico' tiene la forma f(x) = x². Se le aplican las siguientes transformaciones: reflexión respecto al eje x, compresión vertical por un factor de 1/2, desplazamiento 3 unidades a la izquierda, y desplazamiento 4 unidades hacia arriba. ¿Cuál es la expresión resultante?",
          formula: "f(x) = x^2",
          options: [
            { id: "a", formula: "g(x) = -\\frac{1}{2}(x+3)^2 + 4" },
            { id: "b", formula: "g(x) = -\\frac{1}{2}(x-3)^2 + 4" },
            { id: "c", formula: "g(x) = -\\frac{1}{2}x^2 + 3x + 4" },
            { id: "d", formula: "g(x) = \\frac{1}{2}(x+3)^2 + 4" }
          ],
          correctOptionId: "a",
          explanation: "Aplicamos las transformaciones paso a paso:\n1. Reflexión respecto al eje x: -x²\n2. Compresión vertical por un factor de 1/2: -x²/2\n3. Desplazamiento 3 unidades a la izquierda: -(x+3)²/2\n4. Desplazamiento 4 unidades hacia arriba: -(x+3)²/2 + 4\nPor lo tanto, g(x) = -1/2(x+3)² + 4"
        }
      },
      {
        id: "function-compositions",
        title: "Episodio 7: Composición de Funciones",
        content: "Detective, para finalizar nuestra investigación en Mathópolis, debemos estudiar cómo se combinan diferentes edificios funcionales mediante la composición de funciones. Esto es fundamental para entender estructuras complejas que son el resultado de varias operaciones encadenadas.\n\nLa composición de funciones (f∘g)(x) = f(g(x)) significa aplicar primero g y luego f al resultado. Es una operación no conmutativa, es decir, en general f∘g ≠ g∘f. La derivada de una composición se calcula mediante la regla de la cadena.",
        example: "Composición Arquitectónica: Si f(x) = x² + 1 y g(x) = 3x - 2, entonces (f∘g)(x) = f(g(x)) = f(3x - 2) = (3x - 2)² + 1 = 9x² - 12x + 4 + 1 = 9x² - 12x + 5",
        solution: "También podemos calcular (g∘f)(x) = g(f(x)) = g(x² + 1) = 3(x² + 1) - 2 = 3x² + 3 - 2 = 3x² + 1",
        explanation: "La composición f∘g aplica primero g y luego f al resultado. Esto produce una nueva función que combina características de ambas funciones originales de manera específica.",
        questionPrompt: "El proyecto final de Mathópolis requiere entender la composición de sus estructuras. ¡Calcula esta composición!",
        question: {
          id: 23,
          question: "Si f(x) = √x y g(x) = x² - 4, ¿cuál es la expresión de (f∘g)(x) y su dominio?",
          formula: "f(x) = \\sqrt{x}, \\quad g(x) = x^2 - 4",
          options: [
            { id: "a", formula: "(f\\circ g)(x) = \\sqrt{x^2 - 4}, \\quad \\text{Dom: } (-\\infty, -2] \\cup [2, \\infty)" },
            { id: "b", formula: "(f\\circ g)(x) = \\sqrt{x^2} - 4, \\quad \\text{Dom: } \\mathbb{R}" },
            { id: "c", formula: "(f\\circ g)(x) = (x^2 - 4)^{1/2}, \\quad \\text{Dom: } \\{x : x^2 - 4 \\geq 0\\}" },
            { id: "d", formula: "(f\\circ g)(x) = \\sqrt{x^2 - 4}, \\quad \\text{Dom: } \\{x : x \\geq 2\\}" }
          ],
          correctOptionId: "a",
          explanation: "(f∘g)(x) = f(g(x)) = f(x² - 4) = √(x² - 4)\nPara que esta expresión esté definida, necesitamos x² - 4 ≥ 0\nResolviendo: x² ≥ 4 ⟹ x ≤ -2 o x ≥ 2\nPor lo tanto, el dominio es (-∞, -2] ∪ [2, ∞)"
        }
      }
    ]
  }
];

export default function GamePage() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Query para obtener el progreso del usuario
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: ["/api/user/progress"],
    enabled: !!user,
  });

  // Mutation para actualizar los puntos del usuario
  const updatePointsMutation = useMutation({
    mutationFn: async (points: number) => {
      const res = await apiRequest("PATCH", "/api/user/points", { points });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  // Mutation para actualizar las vidas del usuario
  const updateLivesMutation = useMutation({
    mutationFn: async (lives: number) => {
      const res = await apiRequest("PATCH", "/api/user/lives", { lives });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  const startQuestion = (question: any) => {
    setCurrentQuestion(question);
    setSelectedOption(null);
    setAnswerCorrect(null);
    setTimeLeft(30);
    setShowQuestion(true);

    // Iniciar el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setAnswerCorrect(false);
          
          // Restar una vida al usuario si se acaba el tiempo
          if (userProgress && userProgress.lives > 0) {
            updateLivesMutation.mutate(userProgress.lives - 1);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleVerifyAnswer = () => {
    if (!currentQuestion || !selectedOption) return;
    
    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    setAnswerCorrect(isCorrect);
    
    // Detener el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Actualizar puntos o vidas según la respuesta
    if (isCorrect) {
      // Si es correcta, sumar puntos
      if (userProgress) {
        updatePointsMutation.mutate(userProgress.points + 10);
      }
      
      // Marcar historia como completada
      if (selectedStory) {
        setProgress(prev => ({...prev, [selectedStory]: true}));
      }
      
      // Mostrar un mensaje de éxito
      setTimeout(() => {
        toast({
          title: "¡Respuesta correcta!",
          description: "Has ganado 10 puntos."
        });
        setShowQuestion(false);
      }, 2000);
    } else {
      // Si es incorrecta, restar una vida
      if (userProgress && userProgress.lives > 0) {
        updateLivesMutation.mutate(userProgress.lives - 1);
      }
      
      // Mostrar un mensaje de error
      setTimeout(() => {
        toast({
          title: "Respuesta incorrecta",
          description: "Has perdido una vida.",
          variant: "destructive"
        });
        setShowQuestion(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    // Recargar la página para reiniciar todo
    window.location.reload();
  };

  const selectScenario = (id: number) => {
    setSelectedScenario(id);
    setSelectedStory(null);
  };

  const selectStory = (id: string) => {
    setSelectedStory(id);
  };

  const backToScenarios = () => {
    setSelectedScenario(null);
    setSelectedStory(null);
  };

  const backToStories = () => {
    setSelectedStory(null);
  };

  // Limpiar el temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Renderizar la vista de no vidas si el usuario se queda sin vidas
  if (userProgress && userProgress.lives <= 0) {
    return (
      <div className="min-h-screen flex flex-col bg-cyberdark text-white">
        <Navbar />
        <main className="flex-grow py-8 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <NoLives onReset={handleReset} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Encontrar el escenario seleccionado
  const currentScenario = selectedScenario !== null 
    ? storyScenarios.find(s => s.id === selectedScenario) 
    : null;

  // Encontrar la historia seleccionada
  const currentStory = currentScenario && selectedStory !== null
    ? currentScenario.stories.find(s => s.id === selectedStory) 
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-cyberdark text-white">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-cyber font-bold">
                <span className="text-blue-400">Juegos</span> de <span className="text-blue-400">Historia</span>
              </h1>
              
              {(selectedScenario !== null || selectedStory !== null) && (
                <div className="flex items-center space-x-3">
                  {selectedStory !== null && (
                    <Button 
                      onClick={backToStories} 
                      className="cyber-btn bg-gray-700 hover:bg-gray-600"
                    >
                      Volver a Episodios
                    </Button>
                  )}
                  {selectedScenario !== null && (
                    <Button 
                      onClick={backToScenarios} 
                      className="cyber-btn bg-gray-700 hover:bg-gray-600"
                    >
                      Volver a Escenarios
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Navegación de Breadcrumbs */}
            <div className="mb-6 flex items-center text-sm text-gray-400">
              <span className="text-blue-400">Juegos de Historia</span>
              {selectedScenario !== null && currentScenario && (
                <>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <span className="text-blue-400">{currentScenario.title}</span>
                </>
              )}
              {selectedStory !== null && currentStory && (
                <>
                  <ChevronRight className="mx-2 h-4 w-4" />
                  <span className="text-blue-400">{currentStory.title}</span>
                </>
              )}
            </div>

            {/* Lista de escenarios */}
            {selectedScenario === null && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storyScenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    className="bg-cyberbg p-6 rounded-lg cyber-border hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                    whileHover={{ y: -5 }}
                    onClick={() => selectScenario(scenario.id)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">{scenario.image}</div>
                      <h2 className="text-2xl font-cyber font-bold text-blue-400">{scenario.title}</h2>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {scenario.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">
                        {scenario.stories.length} episodios
                      </div>
                      <Button
                        className="cyber-btn bg-blue-600 hover:bg-blue-500"
                      >
                        Explorar <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Lista de historias/episodios */}
            {selectedScenario !== null && selectedStory === null && currentScenario && (
              <div className="bg-cyberbg p-6 rounded-lg cyber-border mb-6">
                <div className="flex items-center mb-6">
                  <div className="text-5xl mr-4">{currentScenario.image}</div>
                  <div>
                    <h2 className="text-2xl font-cyber font-bold text-blue-400">{currentScenario.title}</h2>
                    <p className="text-gray-300 mt-1">
                      {currentScenario.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {currentScenario.stories.map(story => (
                    <motion.div
                      key={story.id}
                      className={`p-4 rounded-lg cyber-border cursor-pointer ${
                        progress[story.id] ? 'bg-blue-900 bg-opacity-20 border-blue-500' : 'bg-cyberdark'
                      }`}
                      whileHover={{ x: 5 }}
                      onClick={() => selectStory(story.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-cyber font-medium text-blue-400">{story.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {story.content.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="flex items-center">
                          {progress[story.id] && (
                            <span className="mr-3 text-green-400 flex items-center">
                              <Trophy className="h-4 w-4 mr-1" /> Completado
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-blue-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contenido de la historia */}
            {selectedStory !== null && currentStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-cyberbg p-6 rounded-lg cyber-border"
              >
                <h2 className="text-2xl font-cyber font-bold text-blue-400 mb-4">{currentStory.title}</h2>
                
                <div className="mb-6 text-gray-300 leading-relaxed space-y-4">
                  {currentStory.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="bg-cyberdark p-4 rounded-lg mb-6">
                  <h3 className="font-cyber text-lg mb-2 text-blue-400">Ejemplo</h3>
                  <div className="bg-black bg-opacity-70 p-3 rounded-md mb-3">
                    <Latex formula={currentStory.example} />
                  </div>
                  <div className="bg-blue-900 bg-opacity-20 p-3 rounded-md mb-3">
                    <Latex formula={currentStory.solution} />
                  </div>
                  <div className="text-gray-300 text-sm">
                    {currentStory.explanation}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-20 rounded-lg"></div>
                    <div className="relative bg-cyberdark p-4 rounded-lg border border-blue-500">
                      <h3 className="font-cyber text-lg mb-2 text-yellow-400 flex items-center">
                        <PenTool className="h-5 w-5 mr-2" /> Desafío
                      </h3>
                      <p className="text-gray-300 mb-4">{currentStory.questionPrompt}</p>
                      
                      <Button
                        onClick={() => startQuestion(currentStory.question)}
                        className="cyber-btn bg-blue-600 hover:bg-blue-500 px-6 py-2"
                        disabled={progress[currentStory.id]}
                      >
                        {progress[currentStory.id] ? (
                          <span className="flex items-center">
                            <Trophy className="h-5 w-5 mr-2" /> Completado
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Rocket className="h-5 w-5 mr-2" /> Iniciar Desafío
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {progress[currentStory.id] && (
                  <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg border border-green-500">
                    <h3 className="font-cyber text-lg mb-2 text-green-400 flex items-center">
                      <Trophy className="h-5 w-5 mr-2" /> ¡Desafío Completado!
                    </h3>
                    <p className="text-gray-300">
                      Has superado este desafío exitosamente. Continúa con los siguientes episodios para aprender más.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modal de pregunta matemática */}
      <AnimatePresence>
        {showQuestion && currentQuestion && (
          <MathQuestionModal
            question={currentQuestion}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            onVerifyAnswer={handleVerifyAnswer}
            timeLeft={timeLeft}
            answerCorrect={answerCorrect}
          />
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}