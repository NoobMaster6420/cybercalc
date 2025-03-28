// Funciones para la interfaz de usuario

// Función para mostrar una notificación
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Mostrar con animación
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Función para cambiar entre páginas
function navigateTo(pageId) {
  // Ocultar todas las páginas
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  
  // Mostrar la página solicitada
  const page = document.getElementById(`${pageId}-page`);
  if (page) {
    page.style.display = 'block';
  }
  
  // Actualizar enlaces de navegación activos
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.getElementById(`nav-${pageId}`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Acciones específicas por página
  switch (pageId) {
    case 'teoria':
      renderMathFormulas();
      break;
    case 'quiz':
      resetQuiz();
      break;
    case 'retos':
      loadChallenges();
      break;
    case 'juegos-historia':
      loadScenarios();
      break;
    case 'ranking':
      loadLeaderboard();
      break;
  }
}

// Función para activar/desactivar el tema oscuro
function toggleTheme() {
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  if (isDarkTheme) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }
}

// Función para actualizar la información del usuario en la UI
function updateUserInfo() {
  const user = getCurrentUser();
  const pointsElement = document.getElementById('user-points');
  const livesElement = document.getElementById('user-lives');
  
  if (user) {
    pointsElement.textContent = `${user.points} puntos`;
    livesElement.textContent = `${user.lives} vidas`;
  } else {
    pointsElement.textContent = '0 puntos';
    livesElement.textContent = '3 vidas';
  }
}

// ===== Funciones para la página de autenticación =====

// Función para mostrar el formulario de registro
function showRegisterForm() {
  document.querySelectorAll('.auth-form-container').forEach((container, index) => {
    container.style.display = index === 1 ? 'block' : 'none';
  });
}

// Función para mostrar el formulario de login
function showLoginForm() {
  document.querySelectorAll('.auth-form-container').forEach((container, index) => {
    container.style.display = index === 0 ? 'block' : 'none';
  });
}

// ===== Funciones para la página de quiz =====

// Variables para el estado del quiz
let currentQuiz = {
  questions: [],
  currentQuestionIndex: 0,
  selectedOption: null,
  score: 0,
  difficulty: null
};

// Función para iniciar un nuevo quiz
function startQuiz(difficulty) {
  // Generar preguntas aleatorias según la dificultad
  currentQuiz.questions = [];
  for (let i = 0; i < 5; i++) {
    currentQuiz.questions.push(generateMathQuestion(difficulty));
  }
  
  currentQuiz.currentQuestionIndex = 0;
  currentQuiz.selectedOption = null;
  currentQuiz.score = 0;
  currentQuiz.difficulty = difficulty;
  
  // Ocultar selector de dificultad y mostrar preguntas
  document.getElementById('difficulty-selector').style.display = 'none';
  document.getElementById('quiz-questions').style.display = 'block';
  document.getElementById('quiz-summary').style.display = 'none';
  
  // Cargar la primera pregunta
  loadCurrentQuestion();
}

// Función para cargar la pregunta actual
function loadCurrentQuestion() {
  const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
  
  // Actualizar número de pregunta
  document.getElementById('question-number').textContent = `Pregunta ${currentQuiz.currentQuestionIndex + 1}/${currentQuiz.questions.length}`;
  
  // Mostrar pregunta
  document.getElementById('question-text').textContent = question.question;
  
  // Renderizar fórmula
  const formulaDisplay = document.getElementById('formula-display');
  formulaDisplay.innerHTML = '';
  renderFormula(question.formula, formulaDisplay);
  
  // Generar opciones
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option-item';
    optionElement.dataset.optionId = option.id;
    
    const radioElement = document.createElement('div');
    radioElement.className = 'option-radio';
    
    const textElement = document.createElement('div');
    textElement.className = 'option-text formula-display';
    renderFormula(option.formula, textElement);
    
    optionElement.appendChild(radioElement);
    optionElement.appendChild(textElement);
    optionsContainer.appendChild(optionElement);
    
    // Agregar evento de selección
    optionElement.addEventListener('click', () => {
      selectQuizOption(option.id);
    });
  });
  
  // Ocultar resultado y resetear estado
  document.getElementById('question-result').style.display = 'none';
  currentQuiz.selectedOption = null;
  
  // Deshabilitar botón de verificar
  const verifyButton = document.getElementById('verify-answer-btn');
  verifyButton.disabled = true;
  verifyButton.classList.add('disabled');
}

// Función para seleccionar una opción
function selectQuizOption(optionId) {
  currentQuiz.selectedOption = optionId;
  
  // Actualizar UI para mostrar la selección
  document.querySelectorAll('.option-item').forEach(item => {
    if (item.dataset.optionId === optionId) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
  
  // Habilitar botón de verificar
  const verifyButton = document.getElementById('verify-answer-btn');
  verifyButton.disabled = false;
  verifyButton.classList.remove('disabled');
}

// Función para verificar la respuesta
function verifyQuizAnswer() {
  if (!currentQuiz.selectedOption) return;
  
  const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
  const isCorrect = currentQuiz.selectedOption === question.correctOptionId;
  
  // Actualizar puntuación
  if (isCorrect) {
    currentQuiz.score++;
  }
  
  // Mostrar resultado
  const resultElement = document.getElementById('question-result');
  const statusElement = document.getElementById('result-status');
  const correctAnswerElement = document.getElementById('correct-answer');
  const explanationElement = document.getElementById('explanation');
  const nextButton = document.getElementById('next-question-btn');
  
  // Configurar el estado (correcto/incorrecto)
  statusElement.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto';
  statusElement.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
  
  // Mostrar respuesta correcta si fue incorrecta
  correctAnswerElement.innerHTML = '';
  if (!isCorrect) {
    correctAnswerElement.textContent = 'Respuesta correcta: ';
    const correctOption = question.options.find(opt => opt.id === question.correctOptionId);
    const formulaSpan = document.createElement('span');
    formulaSpan.className = 'formula-display';
    correctAnswerElement.appendChild(formulaSpan);
    renderFormula(correctOption.formula, formulaSpan);
  } else {
    correctAnswerElement.style.display = 'none';
  }
  
  // Mostrar explicación
  explanationElement.textContent = question.explanation;
  
  // Actualizar texto del botón si es la última pregunta
  if (currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1) {
    nextButton.textContent = 'Ver Resultado Final';
  } else {
    nextButton.textContent = 'Siguiente Pregunta';
  }
  
  // Mostrar el resultado
  resultElement.style.display = 'block';
}

// Función para avanzar a la siguiente pregunta
function nextQuestion() {
  // Verificar si es la última pregunta
  if (currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1) {
    showQuizSummary();
  } else {
    // Avanzar a la siguiente pregunta
    currentQuiz.currentQuestionIndex++;
    loadCurrentQuestion();
  }
}

// Función para mostrar el resumen del quiz
function showQuizSummary() {
  // Ocultar preguntas y mostrar resumen
  document.getElementById('quiz-questions').style.display = 'none';
  document.getElementById('quiz-summary').style.display = 'block';
  
  // Actualizar resultados
  document.getElementById('correct-count').textContent = currentQuiz.score;
  
  // Calcular puntos ganados
  const pointsEarned = calculatePoints(currentQuiz.difficulty, true) * currentQuiz.score;
  document.getElementById('points-earned').textContent = pointsEarned;
  
  // Si hay un usuario logueado, actualizar sus puntos
  const user = getCurrentUser();
  if (user) {
    updateUserPoints(user.id, pointsEarned);
    registerQuizCompletion(user.id, currentQuiz.difficulty, currentQuiz.score, pointsEarned);
    updateUserInfo();
  }
}

// Función para reiniciar el quiz
function resetQuiz() {
  document.getElementById('difficulty-selector').style.display = 'block';
  document.getElementById('quiz-questions').style.display = 'none';
  document.getElementById('quiz-summary').style.display = 'none';
  
  currentQuiz = {
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: null,
    score: 0,
    difficulty: null
  };
}

// ===== Funciones para la página de retos =====

// Variables para el estado de los retos
let currentChallenge = null;

// Función para cargar la lista de retos
function loadChallenges() {
  const challengesListElement = document.getElementById('challenges-list');
  challengesListElement.innerHTML = '';
  
  // Mostrar la lista de retos y ocultar el detalle
  challengesListElement.style.display = 'grid';
  document.getElementById('challenge-detail').style.display = 'none';
  
  // Crear elementos para cada reto
  appData.challenges.forEach(challenge => {
    const challengeElement = document.createElement('div');
    challengeElement.className = 'challenge-item';
    
    const headerElement = document.createElement('div');
    headerElement.className = 'challenge-header';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = challenge.title;
    
    const pointsElement = document.createElement('span');
    pointsElement.className = 'challenge-points';
    pointsElement.textContent = `${challenge.points} pts`;
    
    headerElement.appendChild(titleElement);
    headerElement.appendChild(pointsElement);
    
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = challenge.question;
    
    const buttonElement = document.createElement('button');
    buttonElement.className = 'btn btn-primary';
    buttonElement.textContent = 'Intentar Reto';
    buttonElement.addEventListener('click', () => {
      openChallenge(challenge.id);
    });
    
    challengeElement.appendChild(headerElement);
    challengeElement.appendChild(descriptionElement);
    challengeElement.appendChild(buttonElement);
    
    challengesListElement.appendChild(challengeElement);
  });
}

// Función para abrir un reto específico
function openChallenge(challengeId) {
  // Buscar el reto
  currentChallenge = appData.challenges.find(c => c.id === challengeId);
  
  if (!currentChallenge) return;
  
  // Ocultar lista y mostrar detalle
  document.getElementById('challenges-list').style.display = 'none';
  document.getElementById('challenge-detail').style.display = 'block';
  
  // Actualizar UI con los datos del reto
  document.getElementById('challenge-title').textContent = currentChallenge.title;
  document.getElementById('challenge-question').textContent = currentChallenge.question;
  
  // Renderizar fórmula
  const formulaElement = document.getElementById('challenge-formula');
  formulaElement.innerHTML = '';
  renderFormula(currentChallenge.formula, formulaElement);
  
  // Generar opciones
  const optionsContainer = document.getElementById('challenge-options');
  optionsContainer.innerHTML = '';
  
  currentChallenge.options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option-item';
    optionElement.dataset.optionId = option.id;
    
    const radioElement = document.createElement('div');
    radioElement.className = 'option-radio';
    
    const textElement = document.createElement('div');
    textElement.className = 'option-text formula-display';
    renderFormula(option.formula, textElement);
    
    optionElement.appendChild(radioElement);
    optionElement.appendChild(textElement);
    optionsContainer.appendChild(optionElement);
    
    // Agregar evento de selección
    optionElement.addEventListener('click', () => {
      selectChallengeOption(option.id);
    });
  });
  
  // Ocultar resultado
  document.getElementById('challenge-result').style.display = 'none';
  
  // Deshabilitar botón de verificar
  const verifyButton = document.getElementById('verify-challenge-btn');
  verifyButton.disabled = true;
  verifyButton.classList.add('disabled');
}

// Función para seleccionar una opción en el reto
function selectChallengeOption(optionId) {
  // Guardar la opción seleccionada
  currentChallenge.selectedOption = optionId;
  
  // Actualizar UI para mostrar la selección
  document.querySelectorAll('#challenge-options .option-item').forEach(item => {
    if (item.dataset.optionId === optionId) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
  
  // Habilitar botón de verificar
  const verifyButton = document.getElementById('verify-challenge-btn');
  verifyButton.disabled = false;
  verifyButton.classList.remove('disabled');
}

// Función para verificar la respuesta del reto
function verifyChallengeAnswer() {
  if (!currentChallenge || !currentChallenge.selectedOption) return;
  
  const isCorrect = currentChallenge.selectedOption === currentChallenge.correctOptionId;
  
  // Mostrar resultado
  const resultElement = document.getElementById('challenge-result');
  const statusElement = document.getElementById('challenge-status');
  const correctAnswerElement = document.getElementById('challenge-correct-answer');
  const explanationElement = document.getElementById('challenge-explanation');
  
  // Configurar el estado (correcto/incorrecto)
  statusElement.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto';
  statusElement.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
  
  // Mostrar respuesta correcta si fue incorrecta
  correctAnswerElement.innerHTML = '';
  if (!isCorrect) {
    correctAnswerElement.textContent = 'Respuesta correcta: ';
    const correctOption = currentChallenge.options.find(opt => opt.id === currentChallenge.correctOptionId);
    const formulaSpan = document.createElement('span');
    formulaSpan.className = 'formula-display';
    correctAnswerElement.appendChild(formulaSpan);
    renderFormula(correctOption.formula, formulaSpan);
  } else {
    correctAnswerElement.style.display = 'none';
  }
  
  // Mostrar explicación
  explanationElement.textContent = currentChallenge.explanation;
  
  // Mostrar el resultado
  resultElement.style.display = 'block';
  
  // Si la respuesta es correcta y hay un usuario logueado, actualizar puntos
  if (isCorrect) {
    const user = getCurrentUser();
    if (user) {
      updateUserPoints(user.id, currentChallenge.points);
      registerChallengeCompletion(user.id, currentChallenge.id, true, currentChallenge.points);
      updateUserInfo();
    }
  }
}

// ===== Funciones para la página de juegos de historia =====

// Variables para el estado de los juegos de historia
let currentGameState = {
  selectedScenario: null,
  currentStoryIndex: 0
};

// Función para cargar los escenarios
function loadScenarios() {
  // Reiniciar estado
  currentGameState = {
    selectedScenario: null,
    currentStoryIndex: 0
  };
  
  // Mostrar lista de escenarios y ocultar detalle
  document.getElementById('scenarios-list').style.display = 'grid';
  document.getElementById('story-detail').style.display = 'none';
  
  // Configurar eventos de los botones de escenarios (ya están en el HTML)
  document.querySelectorAll('.select-scenario-btn').forEach(button => {
    button.addEventListener('click', function() {
      const scenarioCard = this.closest('.scenario-card');
      const scenarioId = parseInt(scenarioCard.dataset.scenarioId);
      selectScenario(scenarioId);
    });
  });
}

// Función para seleccionar un escenario
function selectScenario(scenarioId) {
  // Buscar el escenario en los datos
  currentGameState.selectedScenario = appData.scenarios.find(s => s.id === scenarioId);
  
  if (!currentGameState.selectedScenario) return;
  
  // Resetear índice de historia
  currentGameState.currentStoryIndex = 0;
  
  // Cargar la primera historia
  loadCurrentStory();
  
  // Ocultar lista y mostrar detalle
  document.getElementById('scenarios-list').style.display = 'none';
  document.getElementById('story-detail').style.display = 'block';
}

// Función para cargar la historia actual
function loadCurrentStory() {
  const scenario = currentGameState.selectedScenario;
  const storyIndex = currentGameState.currentStoryIndex;
  
  if (!scenario || storyIndex >= scenario.stories.length) return;
  
  const story = scenario.stories[storyIndex];
  
  // Actualizar UI con los datos de la historia
  document.getElementById('story-title').textContent = story.title;
  document.getElementById('story-content').textContent = story.content;
  document.getElementById('story-example').textContent = story.example;
  document.getElementById('question-prompt').textContent = story.questionPrompt;
  
  // Renderizar la pregunta
  const question = story.question;
  document.getElementById('story-question').textContent = question.question;
  
  // Renderizar fórmula
  const formulaElement = document.getElementById('story-formula');
  formulaElement.innerHTML = '';
  renderFormula(question.formula, formulaElement);
  
  // Generar opciones
  const optionsContainer = document.getElementById('story-options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach(option => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option-item';
    optionElement.dataset.optionId = option.id;
    
    const radioElement = document.createElement('div');
    radioElement.className = 'option-radio';
    
    const textElement = document.createElement('div');
    textElement.className = 'option-text formula-display';
    renderFormula(option.formula, textElement);
    
    optionElement.appendChild(radioElement);
    optionElement.appendChild(textElement);
    optionsContainer.appendChild(optionElement);
    
    // Agregar evento de selección
    optionElement.addEventListener('click', () => {
      selectStoryOption(option.id);
    });
  });
  
  // Ocultar resultado
  document.getElementById('story-result').style.display = 'none';
  
  // Deshabilitar botón de verificar
  const verifyButton = document.getElementById('verify-story-answer-btn');
  verifyButton.disabled = true;
  verifyButton.classList.add('disabled');
  
  // Guardar el estado
  story.selectedOption = null;
}

// Función para seleccionar una opción en la historia
function selectStoryOption(optionId) {
  const scenario = currentGameState.selectedScenario;
  const storyIndex = currentGameState.currentStoryIndex;
  
  if (!scenario || storyIndex >= scenario.stories.length) return;
  
  const story = scenario.stories[storyIndex];
  
  // Guardar la opción seleccionada
  story.selectedOption = optionId;
  
  // Actualizar UI para mostrar la selección
  document.querySelectorAll('#story-options .option-item').forEach(item => {
    if (item.dataset.optionId === optionId) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
  
  // Habilitar botón de verificar
  const verifyButton = document.getElementById('verify-story-answer-btn');
  verifyButton.disabled = false;
  verifyButton.classList.remove('disabled');
}

// Función para verificar la respuesta de la historia
function verifyStoryAnswer() {
  const scenario = currentGameState.selectedScenario;
  const storyIndex = currentGameState.currentStoryIndex;
  
  if (!scenario || storyIndex >= scenario.stories.length) return;
  
  const story = scenario.stories[storyIndex];
  
  if (!story.selectedOption) return;
  
  const isCorrect = story.selectedOption === story.question.correctOptionId;
  
  // Mostrar resultado
  const resultElement = document.getElementById('story-result');
  const statusElement = document.getElementById('story-status');
  const explanationElement = document.getElementById('story-explanation');
  
  // Configurar el estado (correcto/incorrecto)
  statusElement.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto';
  statusElement.className = `result-status ${isCorrect ? 'correct' : 'incorrect'}`;
  
  // Mostrar explicación
  explanationElement.textContent = isCorrect ? story.question.explanation : story.solution + ". " + story.explanation;
  
  // Actualizar botón continuar
  const continueButton = document.getElementById('continue-story-btn');
  if (storyIndex === scenario.stories.length - 1) {
    continueButton.textContent = 'Finalizar Historia';
  } else {
    continueButton.textContent = 'Continuar';
  }
  
  // Mostrar el resultado
  resultElement.style.display = 'block';
  
  // Si la respuesta es correcta y hay un usuario logueado, actualizar puntos
  if (isCorrect) {
    const user = getCurrentUser();
    if (user) {
      updateUserPoints(user.id, 10); // 10 puntos por cada respuesta correcta en historias
      updateUserInfo();
    }
  } else {
    // Si la respuesta es incorrecta, reducir vidas
    const user = getCurrentUser();
    if (user && user.lives > 0) {
      updateUserLives(user.id, user.lives - 1);
      updateUserInfo();
    }
  }
}

// Función para continuar a la siguiente historia
function continueStory() {
  const scenario = currentGameState.selectedScenario;
  const nextStoryIndex = currentGameState.currentStoryIndex + 1;
  
  // Verificar si hay más historias
  if (nextStoryIndex >= scenario.stories.length) {
    // Fin del escenario, volver a la lista
    loadScenarios();
  } else {
    // Avanzar a la siguiente historia
    currentGameState.currentStoryIndex = nextStoryIndex;
    loadCurrentStory();
  }
}

// ===== Funciones para la página de ranking =====

// Función para cargar el ranking
function loadLeaderboard() {
  // Asegurarse de que el ranking esté actualizado
  updateLeaderboard();
  
  const leaderboardBody = document.getElementById('leaderboard-body');
  leaderboardBody.innerHTML = '';
  
  // Crear filas para cada usuario
  appData.leaderboard.slice(0, 10).forEach((user, index) => {
    const row = document.createElement('tr');
    
    const positionCell = document.createElement('td');
    positionCell.className = `leaderboard-position ${index < 3 ? 'top-position' : ''}`;
    positionCell.textContent = index + 1;
    
    const usernameCell = document.createElement('td');
    usernameCell.textContent = user.username;
    
    const pointsCell = document.createElement('td');
    pointsCell.textContent = user.points;
    
    row.appendChild(positionCell);
    row.appendChild(usernameCell);
    row.appendChild(pointsCell);
    
    leaderboardBody.appendChild(row);
  });
}