// Estructura para almacenar los datos de la aplicación
const appData = {
  // Usuarios registrados
  users: [],
  // Usuario actual
  currentUser: null,
  // Ranking de usuarios
  leaderboard: [],
  
  // Historial de actividades de usuarios
  userActivity: {
    quizzes: [],
    challenges: []
  },
  
  // Niveles de dificultad
  difficulties: ['easy', 'medium', 'hard'],
  
  // Escenarios para juegos de historia
  scenarios: [
    {
      id: 1,
      title: "La Nave del Futuro",
      description: "Explora conceptos de velocidad y aceleración a través de una misión espacial.",
      image: "img/nave-futuro.jpg",
      stories: [
        {
          id: "nave-1",
          title: "El Despegue",
          content: "Bienvenido a Nueva Terra en el año 2250. Eres un ingeniero en la nave espacial 'Quantum Leap', la nave más avanzada jamás construida. El Capitán se acerca a ti con urgencia.\n\n'Ingeniero, necesitamos despegar inmediatamente. Los sensores muestran un aumento en la radiación solar que podría dañar nuestros sistemas. Necesito que calcules nuestra velocidad después de 10 segundos de aceleración constante para programar la trayectoria de escape.'",
          example: "Recordemos que la velocidad bajo aceleración constante se calcula como:\n\nv = v₀ + a·t\n\nDonde v es la velocidad final, v₀ es la velocidad inicial, a es la aceleración, y t es el tiempo transcurrido.",
          solution: "v = 0 + 20·10 = 200 m/s",
          explanation: "La nave parte del reposo (v₀ = 0), con una aceleración constante de 20 m/s². Después de 10 segundos, su velocidad será v = 0 + 20·10 = 200 m/s. Esta es la velocidad que permitirá a la nave escapar de la zona de peligro a tiempo.",
          questionPrompt: "El Capitán te informa que la nave partirá del reposo con una aceleración de 20 m/s². ¿Cuál será la velocidad de la nave después de 10 segundos?",
          question: {
            id: 1,
            question: "¿Cuál será la velocidad de la nave después de 10 segundos con una aceleración de 20 m/s² partiendo del reposo?",
            formula: "v = v_0 + a \\cdot t",
            options: [
              { id: "a", formula: "100\\text{ m/s}" },
              { id: "b", formula: "200\\text{ m/s}" },
              { id: "c", formula: "2000\\text{ m/s}" },
              { id: "d", formula: "20\\text{ m/s}" }
            ],
            correctOptionId: "b",
            explanation: "Aplicando la fórmula v = v₀ + a·t, donde v₀ = 0 (partimos del reposo), a = 20 m/s² y t = 10 s, obtenemos v = 0 + 20·10 = 200 m/s."
          }
        },
        {
          id: "nave-2",
          title: "La Travesía",
          content: "La nave ha despegado con éxito y ahora viaja a través del espacio. El Capitán vuelve a consultarte.\n\n'Buen trabajo con el cálculo anterior. Ahora necesitamos ajustar la velocidad para el encuentro con la estación espacial. Según nuestros instrumentos, hemos estado acelerando durante los últimos 30 segundos. Necesito que calcules la distancia que hemos recorrido para calibrar los sensores de aproximación.'",
          example: "Para calcular la distancia recorrida con aceleración constante, podemos usar la fórmula:\n\nd = v₀·t + ½·a·t²\n\nDonde d es la distancia, v₀ es la velocidad inicial, a es la aceleración, y t es el tiempo.",
          solution: "d = 100·30 + ½·5·30² = 3000 + 2250 = 5250 m",
          explanation: "La nave parte con una velocidad inicial de 100 m/s y acelera a razón de 5 m/s². En 30 segundos, recorre d = 100·30 + ½·5·30² = 3000 + 2250 = 5250 metros, lo que equivale a 5.25 km.",
          questionPrompt: "El Capitán te dice que la nave partió con una velocidad inicial de 100 m/s y ha estado acelerando a razón de 5 m/s². ¿Qué distancia ha recorrido la nave en 30 segundos?",
          question: {
            id: 2,
            question: "¿Qué distancia ha recorrido la nave en 30 segundos si partió con una velocidad de 100 m/s y una aceleración constante de 5 m/s²?",
            formula: "d = v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2",
            options: [
              { id: "a", formula: "4500\\text{ m}" },
              { id: "b", formula: "5250\\text{ m}" },
              { id: "c", formula: "6000\\text{ m}" },
              { id: "d", formula: "3750\\text{ m}" }
            ],
            correctOptionId: "b",
            explanation: "Aplicando la fórmula d = v₀·t + ½·a·t², donde v₀ = 100 m/s, a = 5 m/s² y t = 30 s, obtenemos d = 100·30 + ½·5·30² = 3000 + 2250 = 5250 m."
          }
        },
        {
          id: "nave-3",
          title: "El Aterrizaje",
          content: "Después de un largo viaje, es hora de aterrizar en el planeta Beta Centauri. El Capitán te pide un último cálculo.\n\n'Estamos aproximándonos al planeta y necesitamos reducir nuestra velocidad de 500 m/s a 0 en un tiempo de 25 segundos para un aterrizaje suave. ¿Cuál debe ser nuestra desaceleración para lograr detenernos completamente?'",
          example: "Para calcular la aceleración (o desaceleración) necesaria, podemos despejar a de la fórmula de velocidad:\n\nv = v₀ + a·t\n\nDespejando a, obtenemos:\n\na = (v - v₀) / t",
          solution: "a = (0 - 500) / 25 = -20 m/s²",
          explanation: "Para reducir la velocidad de 500 m/s a 0 en 25 segundos, necesitamos una desaceleración de a = (0 - 500) / 25 = -20 m/s². El signo negativo indica que es una desaceleración, es decir, la velocidad disminuye con el tiempo.",
          questionPrompt: "El Capitán quiere reducir la velocidad de la nave de 500 m/s a 0 en un tiempo de 25 segundos. ¿Cuál debe ser la desaceleración de la nave?",
          question: {
            id: 3,
            question: "¿Cuál debe ser la desaceleración de la nave para reducir su velocidad de 500 m/s a 0 en 25 segundos?",
            formula: "a = \\frac{v - v_0}{t}",
            options: [
              { id: "a", formula: "-10\\text{ m/s}^2" },
              { id: "b", formula: "-15\\text{ m/s}^2" },
              { id: "c", formula: "-20\\text{ m/s}^2" },
              { id: "d", formula: "-25\\text{ m/s}^2" }
            ],
            correctOptionId: "c",
            explanation: "Aplicando la fórmula a = (v - v₀) / t, donde v = 0 m/s (velocidad final), v₀ = 500 m/s (velocidad inicial) y t = 25 s, obtenemos a = (0 - 500) / 25 = -20 m/s². El signo negativo indica que es una desaceleración."
          }
        }
      ]
    },
    {
      id: 2,
      title: "El Laboratorio de Límites",
      description: "Descubre cómo resolver límites mientras ayudas a un científico a completar sus experimentos.",
      image: "img/laboratorio-limites.jpg",
      stories: [
        {
          id: "limites-1",
          title: "El Experimento Inicial",
          content: "Bienvenido al Laboratorio Cuántico de Nueva Shanghai, año 2185. El Dr. Zhao, un brillante científico, te ha contratado como su asistente matemático para un revolucionario experimento sobre manipulación cuántica.\n\n'Necesito tu ayuda con un cálculo crucial', dice el Dr. Zhao mientras ajusta unos controles. 'Estamos trabajando con partículas que se comportan siguiendo un patrón matemático. Necesito que calcules el límite de esta función cuando x se aproxima a 2 para calibrar el siguiente paso del experimento.'",
          example: "Para calcular el límite de una función, debemos evaluar qué valor se aproxima la función cuando la variable se acerca a un número específico.\n\nPor ejemplo, para calcular lim(x→2) (x² - 4)/(x - 2), podemos factorizar el numerador:\n\n(x² - 4)/(x - 2) = ((x - 2)(x + 2))/(x - 2) = x + 2 para x ≠ 2\n\nPor lo tanto, lim(x→2) (x² - 4)/(x - 2) = 2 + 2 = 4",
          solution: "lim(x→3) (x² - 9)/(x - 3) = lim(x→3) ((x - 3)(x + 3))/(x - 3) = lim(x→3) (x + 3) = 3 + 3 = 6",
          explanation: "Al factorizar el numerador, obtenemos (x² - 9)/(x - 3) = ((x - 3)(x + 3))/(x - 3) = x + 3 para x ≠ 3. Al evaluar este resultado cuando x tiende a 3, obtenemos lim(x→3) (x + 3) = 3 + 3 = 6.",
          questionPrompt: "El Dr. Zhao necesita que calcules el siguiente límite para continuar con el experimento: lim(x→3) (x² - 9)/(x - 3)",
          question: {
            id: 4,
            question: "Calcula el límite: lim(x→3) (x² - 9)/(x - 3)",
            formula: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}",
            options: [
              { id: "a", formula: "0" },
              { id: "b", formula: "3" },
              { id: "c", formula: "6" },
              { id: "d", formula: "\\text{No existe}" }
            ],
            correctOptionId: "c",
            explanation: "Factorizando el numerador: (x² - 9)/(x - 3) = ((x - 3)(x + 3))/(x - 3) = x + 3 para x ≠ 3. Evaluando cuando x → 3: lim(x→3) (x + 3) = 3 + 3 = 6."
          }
        },
        {
          id: "limites-2",
          title: "La Barrera Cuántica",
          content: "El experimento avanza bien. El Dr. Zhao está emocionado con tus resultados anteriores.\n\n'¡Excelente trabajo! Ahora nos enfrentamos a la barrera cuántica', explica mientras señala una pantalla con ecuaciones. 'Nuestras partículas se comportan de manera extraña cerca de ciertos valores. Necesito que calcules este límite para predecir el comportamiento cuando nos acercamos a ese punto crítico.'",
          example: "Para límites de funciones racionales donde tanto el numerador como el denominador tienden a cero, aplicamos la regla de L'Hôpital.\n\nPor ejemplo, para calcular lim(x→0) (sin x)/x, aplicamos L'Hôpital:\nlim(x→0) (sin x)/x = lim(x→0) (cos x)/1 = 1",
          solution: "lim(x→0) (1 - cos x)/x² = lim(x→0) (sin x)/2x = lim(x→0) (cos x)/2 = 1/2",
          explanation: "Esta es una indeterminación del tipo 0/0. Aplicando la regla de L'Hôpital una vez: lim(x→0) (1 - cos x)/x² = lim(x→0) (sin x)/2x. Aplicando nuevamente L'Hôpital: lim(x→0) (sin x)/2x = lim(x→0) (cos x)/2 = 1/2.",
          questionPrompt: "El Dr. Zhao necesita que calcules el siguiente límite para entender el comportamiento de las partículas en la barrera cuántica: lim(x→0) (1 - cos x)/x²",
          question: {
            id: 5,
            question: "Calcula el límite: lim(x→0) (1 - cos x)/x²",
            formula: "\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}",
            options: [
              { id: "a", formula: "0" },
              { id: "b", formula: "\\frac{1}{2}" },
              { id: "c", formula: "1" },
              { id: "d", formula: "\\infty" }
            ],
            correctOptionId: "b",
            explanation: "Aplicando L'Hôpital dos veces: lim(x→0) (1 - cos x)/x² = lim(x→0) (sin x)/2x = lim(x→0) (cos x)/2 = 1/2."
          }
        },
        {
          id: "limites-3",
          title: "El Descubrimiento Final",
          content: "El Dr. Zhao está preparando la fase final del experimento. Los resultados anteriores han sido cruciales.\n\n'Estamos a punto de hacer un descubrimiento revolucionario', dice con entusiasmo. 'Este último cálculo determinará si nuestra teoría es correcta. Necesito que calcules el comportamiento de nuestra función cuando x tiende al infinito.'",
          example: "Para calcular límites cuando x tiende a infinito, a menudo dividimos el numerador y el denominador por la potencia más alta de x.\n\nPor ejemplo, para calcular lim(x→∞) (3x² + 2x)/(x² + 1), dividimos por x²:\nlim(x→∞) (3 + 2/x)/(1 + 1/x²) = 3/1 = 3",
          solution: "lim(x→∞) (2x³ + x)/(x² + 5x + 3) = lim(x→∞) (2x + 1/x²)/(1 + 5/x + 3/x²) = lim(x→∞) 2x = ∞",
          explanation: "Dividiendo numerador y denominador por x²: lim(x→∞) (2x³ + x)/(x² + 5x + 3) = lim(x→∞) (2x + 1/x²)/(1 + 5/x + 3/x²). Cuando x tiende a infinito, los términos con potencias negativas tienden a cero, quedando: lim(x→∞) 2x/1 = ∞. Esto indica que la función crece sin límite cuando x tiende a infinito.",
          questionPrompt: "El Dr. Zhao necesita calcular el siguiente límite para completar su teoría: lim(x→∞) (2x³ + x)/(x² + 5x + 3)",
          question: {
            id: 6,
            question: "Calcula el límite: lim(x→∞) (2x³ + x)/(x² + 5x + 3)",
            formula: "\\lim_{x \\to \\infty} \\frac{2x^3 + x}{x^2 + 5x + 3}",
            options: [
              { id: "a", formula: "0" },
              { id: "b", formula: "2" },
              { id: "c", formula: "\\infty" },
              { id: "d", formula: "\\text{No existe}" }
            ],
            correctOptionId: "c",
            explanation: "Dividiendo por x²: (2x³ + x)/(x² + 5x + 3) = (2x + 1/x²)/(1 + 5/x + 3/x²). Cuando x→∞, esto se aproxima a 2x/1, que tiende a infinito."
          }
        }
      ]
    }
  ],
  
  // Preguntas de quiz por dificultad
  quizQuestions: {
    easy: [
      {
        id: 101,
        question: "¿Cuál es la derivada de f(x) = x²?",
        formula: "f(x) = x^2",
        options: [
          { id: "a", formula: "f'(x) = x" },
          { id: "b", formula: "f'(x) = 2x" },
          { id: "c", formula: "f'(x) = 2" },
          { id: "d", formula: "f'(x) = x^2" }
        ],
        correctOptionId: "b",
        explanation: "La derivada de x² es 2x, aplicando la regla de la potencia: d/dx(x^n) = n·x^(n-1)"
      },
      {
        id: 102,
        question: "¿Cuál es la derivada de f(x) = 5x + 3?",
        formula: "f(x) = 5x + 3",
        options: [
          { id: "a", formula: "f'(x) = 5" },
          { id: "b", formula: "f'(x) = 3" },
          { id: "c", formula: "f'(x) = 5x" },
          { id: "d", formula: "f'(x) = 8" }
        ],
        correctOptionId: "a",
        explanation: "La derivada de 5x + 3 es 5, ya que d/dx(5x) = 5 y d/dx(3) = 0"
      },
      {
        id: 103,
        question: "¿Cuál es la derivada de f(x) = sen(x)?",
        formula: "f(x) = \\sin(x)",
        options: [
          { id: "a", formula: "f'(x) = \\cos(x)" },
          { id: "b", formula: "f'(x) = -\\sin(x)" },
          { id: "c", formula: "f'(x) = -\\cos(x)" },
          { id: "d", formula: "f'(x) = \\tan(x)" }
        ],
        correctOptionId: "a",
        explanation: "La derivada de sen(x) es cos(x)"
      },
      {
        id: 104,
        question: "¿Cuál es la derivada de f(x) = e^x?",
        formula: "f(x) = e^x",
        options: [
          { id: "a", formula: "f'(x) = xe^x" },
          { id: "b", formula: "f'(x) = e^x" },
          { id: "c", formula: "f'(x) = e^{x-1}" },
          { id: "d", formula: "f'(x) = \\ln(x)e^x" }
        ],
        correctOptionId: "b",
        explanation: "La derivada de e^x es e^x, es la única función que es igual a su derivada"
      },
      {
        id: 105,
        question: "¿Cuál es la derivada de f(x) = ln(x)?",
        formula: "f(x) = \\ln(x)",
        options: [
          { id: "a", formula: "f'(x) = \\frac{1}{x}" },
          { id: "b", formula: "f'(x) = \\ln(x)" },
          { id: "c", formula: "f'(x) = x" },
          { id: "d", formula: "f'(x) = \\frac{1}{\\ln(x)}" }
        ],
        correctOptionId: "a",
        explanation: "La derivada de ln(x) es 1/x"
      }
    ],
    medium: [
      {
        id: 201,
        question: "¿Cuál es la derivada de f(x) = x^3 - 2x^2 + 4x - 7?",
        formula: "f(x) = x^3 - 2x^2 + 4x - 7",
        options: [
          { id: "a", formula: "f'(x) = 3x^2 - 4x + 4" },
          { id: "b", formula: "f'(x) = 3x^2 - 4x" },
          { id: "c", formula: "f'(x) = 3x^2 - 4x + 4 - 7" },
          { id: "d", formula: "f'(x) = x^2 - 4x + 4" }
        ],
        correctOptionId: "a",
        explanation: "Derivando término a término: d/dx(x³) = 3x², d/dx(-2x²) = -4x, d/dx(4x) = 4, d/dx(-7) = 0. Sumando todos los términos: 3x² - 4x + 4"
      },
      {
        id: 202,
        question: "¿Cuál es la derivada de f(x) = (2x + 3)(x - 1)?",
        formula: "f(x) = (2x + 3)(x - 1)",
        options: [
          { id: "a", formula: "f'(x) = 2(x - 1) + (2x + 3)" },
          { id: "b", formula: "f'(x) = 2(x - 1)(2x + 3)" },
          { id: "c", formula: "f'(x) = 3x - 2" },
          { id: "d", formula: "f'(x) = 2(x - 1) + 1(2x + 3)" }
        ],
        correctOptionId: "d",
        explanation: "Usando la regla del producto: f'(x) = (2x + 3)'(x - 1) + (2x + 3)(x - 1)' = 2(x - 1) + (2x + 3)(1) = 2x - 2 + 2x + 3 = 4x + 1"
      },
      {
        id: 203,
        question: "¿Cuál es la derivada de f(x) = cos(2x)?",
        formula: "f(x) = \\cos(2x)",
        options: [
          { id: "a", formula: "f'(x) = -\\sin(2x)" },
          { id: "b", formula: "f'(x) = -2\\sin(2x)" },
          { id: "c", formula: "f'(x) = -\\sin(x)" },
          { id: "d", formula: "f'(x) = 2\\cos(2x)" }
        ],
        correctOptionId: "b",
        explanation: "Aplicando la regla de la cadena: f'(x) = -sin(2x) · (2x)' = -sin(2x) · 2 = -2sin(2x)"
      },
      {
        id: 204,
        question: "¿Cuál es la derivada de f(x) = \\frac{x}{x+1}?",
        formula: "f(x) = \\frac{x}{x+1}",
        options: [
          { id: "a", formula: "f'(x) = \\frac{1}{(x+1)^2}" },
          { id: "b", formula: "f'(x) = \\frac{1}{(x+1)}" },
          { id: "c", formula: "f'(x) = \\frac{x+1-x}{(x+1)^2} = \\frac{1}{(x+1)^2}" },
          { id: "d", formula: "f'(x) = \\frac{x}{(x+1)^2}" }
        ],
        correctOptionId: "c",
        explanation: "Aplicando la regla del cociente: f'(x) = \\frac{(x+1) - x}{(x+1)^2} = \\frac{1}{(x+1)^2}"
      },
      {
        id: 205,
        question: "¿Cuál es la derivada de f(x) = e^{-x^2}?",
        formula: "f(x) = e^{-x^2}",
        options: [
          { id: "a", formula: "f'(x) = -x e^{-x^2}" },
          { id: "b", formula: "f'(x) = -2x e^{-x^2}" },
          { id: "c", formula: "f'(x) = -e^{-x^2}" },
          { id: "d", formula: "f'(x) = -x^2 e^{-x^2}" }
        ],
        correctOptionId: "b",
        explanation: "Aplicando la regla de la cadena: f'(x) = e^{-x²} · (-x²)' = e^{-x²} · (-2x) = -2x·e^{-x²}"
      }
    ],
    hard: [
      {
        id: 301,
        question: "¿Cuál es la derivada de f(x) = ln(cos(x))?",
        formula: "f(x) = \\ln(\\cos(x))",
        options: [
          { id: "a", formula: "f'(x) = -\\tan(x)" },
          { id: "b", formula: "f'(x) = \\frac{-\\sin(x)}{\\cos(x)}" },
          { id: "c", formula: "f'(x) = -\\sin(x)" },
          { id: "d", formula: "f'(x) = -\\sec^2(x)" }
        ],
        correctOptionId: "a",
        explanation: "Aplicando la regla de la cadena: f'(x) = \\frac{1}{\\cos(x)} · (-\\sin(x)) = -\\frac{\\sin(x)}{\\cos(x)} = -\\tan(x)"
      },
      {
        id: 302,
        question: "¿Cuál es la derivada de f(x) = x^x?",
        formula: "f(x) = x^x",
        options: [
          { id: "a", formula: "f'(x) = x^x \\cdot (1 + \\ln(x))" },
          { id: "b", formula: "f'(x) = x^{x-1}" },
          { id: "c", formula: "f'(x) = x^x \\cdot \\ln(x)" },
          { id: "d", formula: "f'(x) = x \\cdot x^{x-1}" }
        ],
        correctOptionId: "a",
        explanation: "Escribimos x^x como e^{x\\ln(x)} y aplicamos la regla de la cadena: f'(x) = e^{x\\ln(x)} · (x\\ln(x))' = x^x · (\\ln(x) + x·\\frac{1}{x}) = x^x · (\\ln(x) + 1)"
      },
      {
        id: 303,
        question: "¿Cuál es la derivada de f(x) = arctan(e^x)?",
        formula: "f(x) = \\arctan(e^x)",
        options: [
          { id: "a", formula: "f'(x) = \\frac{e^x}{1 + e^{2x}}" },
          { id: "b", formula: "f'(x) = \\frac{1}{1 + e^{2x}}" },
          { id: "c", formula: "f'(x) = \\frac{e^{-x}}{1 + e^{-2x}}" },
          { id: "d", formula: "f'(x) = \\frac{1}{1 + (e^x)^2}" }
        ],
        correctOptionId: "a",
        explanation: "Aplicando la regla de la cadena: f'(x) = \\frac{1}{1 + (e^x)^2} · e^x = \\frac{e^x}{1 + e^{2x}}"
      },
      {
        id: 304,
        question: "¿Cuál es la derivada implícita de x^2 + y^2 = 25 respecto a x?",
        formula: "x^2 + y^2 = 25",
        options: [
          { id: "a", formula: "\\frac{dy}{dx} = -\\frac{y}{x}" },
          { id: "b", formula: "\\frac{dy}{dx} = -\\frac{x}{y}" },
          { id: "c", formula: "\\frac{dy}{dx} = \\frac{y}{x}" },
          { id: "d", formula: "\\frac{dy}{dx} = \\frac{x}{y}" }
        ],
        correctOptionId: "b",
        explanation: "Derivando implícitamente: 2x + 2y·\\frac{dy}{dx} = 0 → \\frac{dy}{dx} = -\\frac{x}{y}"
      },
      {
        id: 305,
        question: "¿Cuál es la segunda derivada de f(x) = \\frac{1}{x}?",
        formula: "f(x) = \\frac{1}{x}",
        options: [
          { id: "a", formula: "f''(x) = \\frac{1}{x^3}" },
          { id: "b", formula: "f''(x) = \\frac{2}{x^3}" },
          { id: "c", formula: "f''(x) = -\\frac{1}{x^2}" },
          { id: "d", formula: "f''(x) = \\frac{2}{x^2}" }
        ],
        correctOptionId: "b",
        explanation: "Primera derivada: f'(x) = -\\frac{1}{x^2}. Segunda derivada: f''(x) = -(-\\frac{2}{x^3}) = \\frac{2}{x^3}"
      }
    ]
  },
  
  // Retos disponibles
  challenges: [
    {
      id: 401,
      title: "Derivada de una Función Compuesta",
      question: "Encuentra la derivada de f(x) = sin(x²).",
      formula: "f(x) = \\sin(x^2)",
      options: [
        { id: "a", formula: "f'(x) = \\cos(x^2)" },
        { id: "b", formula: "f'(x) = 2x\\cos(x^2)" },
        { id: "c", formula: "f'(x) = 2\\sin(x)\\cos(x)" },
        { id: "d", formula: "f'(x) = 2x^2\\cos(x^2)" }
      ],
      correctOptionId: "b",
      explanation: "Usando la regla de la cadena: f'(x) = cos(x²) · (x²)' = cos(x²) · 2x = 2x·cos(x²)",
      points: 10
    },
    {
      id: 402,
      title: "Límite con Indeterminación",
      question: "Calcula el límite: lim(x→0) (e^x - 1 - x)/x²",
      formula: "\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}",
      options: [
        { id: "a", formula: "0" },
        { id: "b", formula: "\\frac{1}{2}" },
        { id: "c", formula: "1" },
        { id: "d", formula: "\\infty" }
      ],
      correctOptionId: "b",
      explanation: "Aplicando la regla de L'Hôpital dos veces: lim(x→0) (e^x - 1 - x)/x² = lim(x→0) (e^x - 1)/2x = lim(x→0) e^x/2 = 1/2",
      points: 15
    },
    {
      id: 403,
      title: "Optimización",
      question: "Un rectángulo tiene perímetro fijo de 20 unidades. ¿Cuáles son las dimensiones que maximizan su área?",
      formula: "P = 2(l + w) = 20",
      options: [
        { id: "a", formula: "l = w = 5" },
        { id: "b", formula: "l = 6, w = 4" },
        { id: "c", formula: "l = 7, w = 3" },
        { id: "d", formula: "l = 8, w = 2" }
      ],
      correctOptionId: "a",
      explanation: "Sea P = 2(l + w) = 20, entonces l + w = 10. El área es A = l·w = l·(10-l) = 10l - l². Para máxima área, A'(l) = 10 - 2l = 0, por lo que l = 5 y w = 5. La forma cuadrada maximiza el área para un perímetro fijo.",
      points: 20
    },
    {
      id: 404,
      title: "Valores Extremos",
      question: "Encuentra los valores extremos locales de f(x) = x³ - 6x² + 9x + 1 en el intervalo [0, 4].",
      formula: "f(x) = x^3 - 6x^2 + 9x + 1",
      options: [
        { id: "a", formula: "\\text{Mínimo en } x = 1, \\text{ máximo en } x = 3" },
        { id: "b", formula: "\\text{Mínimo en } x = 3, \\text{ máximo en } x = 0" },
        { id: "c", formula: "\\text{Mínimo en } x = 0, \\text{ máximo en } x = 3" },
        { id: "d", formula: "\\text{Mínimo en } x = 1, \\text{ máximo en } x = 4" }
      ],
      correctOptionId: "a",
      explanation: "f'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3). Los puntos críticos son x = 1 y x = 3. Evaluando f''(x) = 6x - 12 en estos puntos: f''(1) = 6 - 12 = -6 < 0 (máximo local), f''(3) = 18 - 12 = 6 > 0 (mínimo local).",
      points: 25
    },
    {
      id: 405,
      title: "Integrales Definidas",
      question: "Calcula ∫(0 a π/2) sin²(x) dx",
      formula: "\\int_{0}^{\\pi/2} \\sin^2(x) dx",
      options: [
        { id: "a", formula: "\\frac{\\pi}{2}" },
        { id: "b", formula: "\\frac{\\pi}{4}" },
        { id: "c", formula: "1" },
        { id: "d", formula: "\\frac{1}{2}" }
      ],
      correctOptionId: "b",
      explanation: "Usando la identidad sin²(x) = (1 - cos(2x))/2, tenemos ∫(0 a π/2) sin²(x) dx = ∫(0 a π/2) (1 - cos(2x))/2 dx = [x/2 - sin(2x)/4](0 a π/2) = π/4 - 0 = π/4.",
      points: 30
    }
  ]
};

// Función para guardar los datos en el almacenamiento local
function saveData() {
  localStorage.setItem('cybercalcData', JSON.stringify(appData));
}

// Función para cargar los datos desde el almacenamiento local
function loadData() {
  const savedData = localStorage.getItem('cybercalcData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    // Mezclamos los datos guardados con los datos por defecto (para mantener nuevos retos/preguntas)
    appData.users = parsedData.users || [];
    appData.currentUser = parsedData.currentUser || null;
    appData.leaderboard = parsedData.leaderboard || [];
    appData.userActivity = parsedData.userActivity || { quizzes: [], challenges: [] };
  }
}

// Inicializar los datos al cargar
loadData();