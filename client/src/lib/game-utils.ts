// Utilidades para generar problemas matemáticos aleatorios
type MathQuestion = {
  id: number;
  question: string;
  formula: string;
  options: {
    id: string;
    formula: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: string;
};

// Generar un número aleatorio entero entre min y max (inclusive)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generar un problema de matemáticas básico aleatorio
export function generateBasicMathProblem(): MathQuestion {
  const operations = [
    { symbol: "+", name: "suma", operation: (a: number, b: number) => a + b },
    { symbol: "-", name: "resta", operation: (a: number, b: number) => a - b },
    { symbol: "\\times", name: "multiplicación", operation: (a: number, b: number) => a * b },
    { symbol: "\\div", name: "división", operation: (a: number, b: number) => a / b }
  ];
  
  const operationIndex = getRandomInt(0, 3);
  const operation = operations[operationIndex];
  
  let a, b, result;
  
  // Asegurar que los números y resultados sean razonables
  switch (operationIndex) {
    case 0: // suma
      a = getRandomInt(10, 50);
      b = getRandomInt(10, 50);
      result = operation.operation(a, b);
      break;
    case 1: // resta
      a = getRandomInt(20, 100);
      b = getRandomInt(1, a - 1); // b debe ser menor que a para evitar negativos
      result = operation.operation(a, b);
      break;
    case 2: // multiplicación
      a = getRandomInt(2, 12);
      b = getRandomInt(2, 12);
      result = operation.operation(a, b);
      break;
    case 3: // división
      b = getRandomInt(2, 10);
      result = getRandomInt(1, 10);
      a = b * result; // asegurar que la división sea exacta
      break;
    default:
      a = 1;
      b = 1;
      result = 2;
  }
  
  // Generar opciones (una correcta, tres incorrectas)
  const correctOption = result;
  const options = [];
  
  // Opción correcta
  options.push({
    id: "a",
    formula: correctOption.toString()
  });
  
  // Opciones incorrectas (asegurarse de que sean diferentes)
  const usedValues = new Set([correctOption]);
  
  for (let i = 1; i <= 3; i++) {
    let wrongOption;
    do {
      // Generar una respuesta incorrecta basada en errores comunes
      const error = getRandomInt(-5, 5);
      wrongOption = correctOption + error;
      
      // Si es división y el error da 0, generar otro valor
      if (operationIndex === 3 && wrongOption === 0) {
        wrongOption = getRandomInt(1, 15);
      }
    } while (usedValues.has(wrongOption));
    
    usedValues.add(wrongOption);
    
    options.push({
      id: String.fromCharCode(97 + i), // 'b', 'c', 'd'
      formula: wrongOption.toString()
    });
  }
  
  // Barajar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Encontrar el índice de la respuesta correcta después de barajar
  const correctIndex = options.findIndex(option => parseFloat(option.formula) === correctOption);
  const correctOptionId = options[correctIndex].id;
  
  return {
    id: Date.now(),
    question: `Calcula el resultado de la siguiente operación:`,
    formula: `${a} ${operation.symbol} ${b}`,
    options,
    correctOptionId,
    explanation: `El resultado de ${a} ${operation.symbol} ${b} es ${result}`,
    difficulty: "easy"
  };
}

// Generar un problema de probabilidad básica
export function generateProbabilityProblem(): MathQuestion {
  const scenarios = [
    {
      question: "En una caja hay 5 bolas rojas, 3 azules y 2 verdes. ¿Cuál es la probabilidad de sacar una bola roja?",
      formula: "P(roja) = \\frac{\\text{bolas rojas}}{\\text{total de bolas}}",
      total: 10,
      favorable: 5,
      answer: "\\frac{5}{10} = \\frac{1}{2}",
      explanation: "La probabilidad es el número de casos favorables entre el número de casos posibles. Hay 5 bolas rojas de un total de 10 bolas."
    },
    {
      question: "En un dado de 6 caras, ¿cuál es la probabilidad de obtener un número par?",
      formula: "P(par) = \\frac{\\text{números pares}}{\\text{total de posibilidades}}",
      total: 6,
      favorable: 3,
      answer: "\\frac{3}{6} = \\frac{1}{2}",
      explanation: "Los números pares en un dado son 2, 4 y 6. Hay 3 números pares de un total de 6 posibilidades."
    },
    {
      question: "En una baraja de 52 cartas, ¿cuál es la probabilidad de sacar un as?",
      formula: "P(as) = \\frac{\\text{cantidad de ases}}{\\text{total de cartas}}",
      total: 52,
      favorable: 4,
      answer: "\\frac{4}{52} = \\frac{1}{13}",
      explanation: "En una baraja estándar hay 4 ases de un total de 52 cartas."
    }
  ];
  
  const scenario = scenarios[getRandomInt(0, scenarios.length - 1)];
  
  // Crear opciones
  const correctAnswer = scenario.answer;
  const options = [
    { id: "a", formula: correctAnswer }
  ];
  
  // Opciones incorrectas
  if (scenario.total === 10 && scenario.favorable === 5) {
    options.push({ id: "b", formula: "\\frac{5}{15} = \\frac{1}{3}" });
    options.push({ id: "c", formula: "\\frac{3}{10}" });
    options.push({ id: "d", formula: "\\frac{1}{5}" });
  } else if (scenario.total === 6 && scenario.favorable === 3) {
    options.push({ id: "b", formula: "\\frac{2}{6} = \\frac{1}{3}" });
    options.push({ id: "c", formula: "\\frac{4}{6} = \\frac{2}{3}" });
    options.push({ id: "d", formula: "\\frac{1}{3}" });
  } else {
    options.push({ id: "b", formula: "\\frac{4}{13}" });
    options.push({ id: "c", formula: "\\frac{1}{52}" });
    options.push({ id: "d", formula: "\\frac{4}{26} = \\frac{2}{13}" });
  }
  
  // Barajar opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Encontrar el id de la respuesta correcta
  const correctIndex = options.findIndex(option => option.formula === correctAnswer);
  const correctOptionId = options[correctIndex].id;
  
  return {
    id: Date.now(),
    question: scenario.question,
    formula: scenario.formula,
    options,
    correctOptionId,
    explanation: scenario.explanation,
    difficulty: "medium"
  };
}

// Generar un problema de derivada simple
export function generateSimpleDerivativeProblem(): MathQuestion {
  const problems = [
    {
      question: "Calcula la derivada de la función:",
      formula: "f(x) = x^2",
      answer: "f'(x) = 2x",
      explanation: "La regla para derivar x^n es n·x^(n-1). Para x^2, tenemos 2·x^(2-1) = 2x."
    },
    {
      question: "Calcula la derivada de la función:",
      formula: "f(x) = 3x + 2",
      answer: "f'(x) = 3",
      explanation: "La derivada de una función lineal de la forma ax + b es a. Por lo tanto, la derivada de 3x + 2 es 3."
    },
    {
      question: "Calcula la derivada de la función:",
      formula: "f(x) = \\sin(x)",
      answer: "f'(x) = \\cos(x)",
      explanation: "La derivada de sin(x) es cos(x)."
    },
    {
      question: "Calcula la derivada de la función:",
      formula: "f(x) = e^x",
      answer: "f'(x) = e^x",
      explanation: "La derivada de e^x es e^x, es decir, se mantiene igual."
    }
  ];
  
  const problem = problems[getRandomInt(0, problems.length - 1)];
  
  // Crear opciones
  const correctAnswer = problem.answer;
  let options = [];
  
  // Opciones específicas para cada problema
  if (problem.formula === "f(x) = x^2") {
    options = [
      { id: "a", formula: "f'(x) = 2x" },
      { id: "b", formula: "f'(x) = x" },
      { id: "c", formula: "f'(x) = 2" },
      { id: "d", formula: "f'(x) = x^2" }
    ];
  } else if (problem.formula === "f(x) = 3x + 2") {
    options = [
      { id: "a", formula: "f'(x) = 3" },
      { id: "b", formula: "f'(x) = 3x" },
      { id: "c", formula: "f'(x) = 5" },
      { id: "d", formula: "f'(x) = 0" }
    ];
  } else if (problem.formula === "f(x) = \\sin(x)") {
    options = [
      { id: "a", formula: "f'(x) = \\cos(x)" },
      { id: "b", formula: "f'(x) = -\\sin(x)" },
      { id: "c", formula: "f'(x) = -\\cos(x)" },
      { id: "d", formula: "f'(x) = \\sin(x)" }
    ];
  } else {
    options = [
      { id: "a", formula: "f'(x) = e^x" },
      { id: "b", formula: "f'(x) = xe^x" },
      { id: "c", formula: "f'(x) = e^{x-1}" },
      { id: "d", formula: "f'(x) = 1" }
    ];
  }
  
  // Barajar opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Encontrar el id de la respuesta correcta
  const correctIndex = options.findIndex(option => option.formula === correctAnswer);
  const correctOptionId = options[correctIndex].id;
  
  return {
    id: Date.now(),
    question: problem.question,
    formula: problem.formula,
    options,
    correctOptionId,
    explanation: problem.explanation,
    difficulty: "hard"
  };
}

// Función principal para generar una pregunta matemática según el nivel
export function generateMathQuestion(level: number): MathQuestion {
  if (level <= 3) {
    return generateBasicMathProblem();
  } else if (level <= 6) {
    return Math.random() < 0.7 
      ? generateProbabilityProblem() 
      : generateBasicMathProblem();
  } else {
    const rand = Math.random();
    if (rand < 0.5) {
      return generateSimpleDerivativeProblem();
    } else if (rand < 0.8) {
      return generateProbabilityProblem();
    } else {
      return generateBasicMathProblem();
    }
  }
}