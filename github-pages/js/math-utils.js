// Utilidades para generación de problemas matemáticos y renderizado de fórmulas

// Función para renderizar fórmulas LaTeX en el DOM
function renderMathFormulas() {
  // Verificar si KaTeX está disponible
  if (typeof katex !== 'undefined') {
    // Usar KaTeX para renderizar todas las fórmulas matemáticas
    document.querySelectorAll('.math-formula').forEach(elem => {
      katex.render(elem.textContent, elem, {
        throwOnError: false,
        displayMode: true
      });
    });
    
    // También renderizar fórmulas en los elementos con clase .formula-display
    document.querySelectorAll('.formula-display').forEach(elem => {
      if (elem.textContent) {
        katex.render(elem.textContent, elem, {
          throwOnError: false,
          displayMode: true
        });
      }
    });
    
    console.log('KaTeX inicializado correctamente');
  } else {
    console.error('Error: KaTeX no está disponible. Las fórmulas no se mostrarán correctamente.');
  }
}

// Función para renderizar una fórmula específica
function renderFormula(formula, element) {
  if (typeof katex !== 'undefined') {
    try {
      katex.render(formula, element, {
        throwOnError: false,
        displayMode: true
      });
    } catch (error) {
      console.error('Error al renderizar fórmula:', error);
      element.textContent = formula; // Mostrar la fórmula como texto plano si falla
    }
  } else {
    console.error('Error: KaTeX no está disponible. Las fórmulas no se mostrarán correctamente.');
    element.textContent = formula; // Mostrar la fórmula como texto plano
  }
}

// Función para generar un número aleatorio entre min y max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar un problema matemático básico
function generateBasicMathProblem() {
  const operations = ['+', '-', '*'];
  const operation = operations[getRandomInt(0, operations.length - 1)];
  const a = getRandomInt(1, 20);
  const b = getRandomInt(1, 20);
  
  let question, answer, formula;
  
  switch (operation) {
    case '+':
      question = `¿Cuánto es ${a} + ${b}?`;
      answer = a + b;
      formula = `${a} + ${b}`;
      break;
    case '-':
      question = `¿Cuánto es ${a} - ${b}?`;
      answer = a - b;
      formula = `${a} - ${b}`;
      break;
    case '*':
      question = `¿Cuánto es ${a} \\times ${b}?`;
      answer = a * b;
      formula = `${a} \\times ${b}`;
      break;
  }
  
  // Generar opciones (una correcta y tres incorrectas)
  const options = [
    { id: 'a', formula: `${answer}` },
    { id: 'b', formula: `${answer + getRandomInt(1, 5)}` },
    { id: 'c', formula: `${answer - getRandomInt(1, 5)}` },
    { id: 'd', formula: `${answer * 2}` }
  ];
  
  // Mezclar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Encontrar el ID de la opción correcta después de mezclar
  const correctOptionId = options.find(option => option.formula === `${answer}`).id;
  
  return {
    id: getRandomInt(1000, 9999),
    question,
    formula,
    options,
    correctOptionId,
    explanation: `El resultado de ${formula} es ${answer}.`,
    difficulty: 'easy'
  };
}

// Función para generar un problema de derivada simple
function generateSimpleDerivativeProblem() {
  const functions = [
    { fn: 'x^2', derivative: '2x', desc: 'aplicando la regla de la potencia: d/dx(x^n) = n·x^(n-1)' },
    { fn: 'x^3', derivative: '3x^2', desc: 'aplicando la regla de la potencia: d/dx(x^n) = n·x^(n-1)' },
    { fn: '\\sin(x)', derivative: '\\cos(x)', desc: 'la derivada de sen(x) es cos(x)' },
    { fn: '\\cos(x)', derivative: '-\\sin(x)', desc: 'la derivada de cos(x) es -sen(x)' },
    { fn: 'e^x', derivative: 'e^x', desc: 'la derivada de e^x es e^x' },
    { fn: '\\ln(x)', derivative: '\\frac{1}{x}', desc: 'la derivada de ln(x) es 1/x' }
  ];
  
  const selectedFunction = functions[getRandomInt(0, functions.length - 1)];
  
  const question = `¿Cuál es la derivada de f(x) = ${selectedFunction.fn}?`;
  const formula = `f(x) = ${selectedFunction.fn}`;
  
  // Generar opciones (una correcta y tres incorrectas)
  const incorrectOptions = functions
    .filter(f => f.derivative !== selectedFunction.derivative)
    .map(f => f.derivative)
    .slice(0, 3);
  
  const options = [
    { id: 'a', formula: `f'(x) = ${selectedFunction.derivative}` },
    { id: 'b', formula: `f'(x) = ${incorrectOptions[0]}` },
    { id: 'c', formula: `f'(x) = ${incorrectOptions[1]}` },
    { id: 'd', formula: `f'(x) = ${incorrectOptions[2]}` }
  ];
  
  // Mezclar las opciones
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  // Encontrar el ID de la opción correcta después de mezclar
  const correctOptionId = options.find(option => 
    option.formula === `f'(x) = ${selectedFunction.derivative}`
  ).id;
  
  return {
    id: getRandomInt(1000, 9999),
    question,
    formula,
    options,
    correctOptionId,
    explanation: `La derivada de ${selectedFunction.fn} es ${selectedFunction.derivative}, ${selectedFunction.desc}.`,
    difficulty: 'medium'
  };
}

// Función para generar un problema basado en la dificultad
function generateMathQuestion(difficulty) {
  switch (difficulty) {
    case 'easy':
      // Seleccionar una pregunta al azar de las preguntas fáciles
      return appData.quizQuestions.easy[getRandomInt(0, appData.quizQuestions.easy.length - 1)];
    case 'medium':
      // Seleccionar una pregunta al azar de las preguntas medias
      return appData.quizQuestions.medium[getRandomInt(0, appData.quizQuestions.medium.length - 1)];
    case 'hard':
      // Seleccionar una pregunta al azar de las preguntas difíciles
      return appData.quizQuestions.hard[getRandomInt(0, appData.quizQuestions.hard.length - 1)];
    default:
      // Si la dificultad no está especificada, devolver una pregunta de dificultad fácil
      return appData.quizQuestions.easy[getRandomInt(0, appData.quizQuestions.easy.length - 1)];
  }
}

// Función para obtener los puntos basados en la dificultad y el acierto
function calculatePoints(difficulty, isCorrect) {
  if (!isCorrect) return 0;
  
  switch (difficulty) {
    case 'easy':
      return 5;
    case 'medium':
      return 10;
    case 'hard':
      return 15;
    default:
      return 5;
  }
}