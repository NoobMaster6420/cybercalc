// Archivo principal de la aplicación

// Verificar si hay un usuario logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos guardados
  loadData();
  
  // Verificar si hay usuario logueado
  const user = getCurrentUser();
  if (user) {
    // Mostrar página principal si hay usuario logueado
    navigateTo('home');
    updateUserInfo();
  } else {
    // Mostrar página de login si no hay usuario
    navigateTo('auth');
  }
  
  // Configurar eventos de la interfaz
  setupEventListeners();
  
  // Comprobar que KaTeX está disponible
  checkKatexAvailability();
  
  // Renderizar fórmulas matemáticas
  renderMathFormulas();
});

// Función para comprobar que KaTeX está disponible
function checkKatexAvailability() {
  if (typeof katex === 'undefined') {
    console.error('ADVERTENCIA: KaTeX no está disponible. Intentando cargar dinámicamente...');
    
    // Agregar KaTeX CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(cssLink);
    
    // Agregar KaTeX JS
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
    document.head.appendChild(script1);
    
    // Agregar KaTeX Auto-render JS
    const script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
    script2.onload = function() {
      console.log('KaTeX cargado dinámicamente');
      // Intentar renderizar fórmulas después de cargar
      setTimeout(renderMathFormulas, 500);
    };
    document.head.appendChild(script2);
  }
}

// Configurar todos los listeners de eventos
function setupEventListeners() {
  // === Navegación ===
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.id.replace('nav-', '');
      navigateTo(page);
    });
  });
  
  // Botones de navegación en tarjetas de características
  document.querySelectorAll('[data-navigate]').forEach(button => {
    button.addEventListener('click', function() {
      const page = this.dataset.navigate;
      navigateTo(page);
    });
  });
  
  // === Tema ===
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // === Autenticación ===
  document.getElementById('switch-to-register').addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterForm();
  });
  
  document.getElementById('switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
  });
  
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const result = loginUser(username, password);
    
    if (result.success) {
      showNotification('Inicio de sesión exitoso', 'success');
      navigateTo('home');
      updateUserInfo();
    } else {
      showNotification(result.message, 'error');
    }
  });
  
  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    const result = registerUser(username, password);
    
    if (result.success) {
      showNotification('Registro exitoso, inicia sesión', 'success');
      showLoginForm();
    } else {
      showNotification(result.message, 'error');
    }
  });
  
  document.getElementById('logout-btn').addEventListener('click', function() {
    logoutUser();
    navigateTo('auth');
    showNotification('Sesión cerrada correctamente', 'success');
  });
  
  // === Quiz ===
  document.getElementById('easy-btn').addEventListener('click', function() {
    startQuiz('easy');
  });
  
  document.getElementById('medium-btn').addEventListener('click', function() {
    startQuiz('medium');
  });
  
  document.getElementById('hard-btn').addEventListener('click', function() {
    startQuiz('hard');
  });
  
  document.getElementById('verify-answer-btn').addEventListener('click', verifyQuizAnswer);
  document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
  document.getElementById('restart-quiz-btn').addEventListener('click', resetQuiz);
  
  // === Retos ===
  document.getElementById('verify-challenge-btn').addEventListener('click', verifyChallengeAnswer);
  document.getElementById('try-again-btn').addEventListener('click', function() {
    document.getElementById('challenge-result').style.display = 'none';
  });
  
  document.getElementById('back-to-challenges-btn').addEventListener('click', loadChallenges);
  
  // === Juegos Historia ===
  document.getElementById('verify-story-answer-btn').addEventListener('click', verifyStoryAnswer);
  document.getElementById('continue-story-btn').addEventListener('click', continueStory);
}

// Código para crear CSS para las notificaciones (ya que no está en el CSS principal)
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: var(--radius);
      background-color: var(--card);
      color: var(--card-foreground);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transform: translateY(-100px);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
    }
    
    .notification.show {
      transform: translateY(0);
      opacity: 1;
    }
    
    .notification.success {
      border-left: 4px solid var(--accent);
    }
    
    .notification.error {
      border-left: 4px solid var(--destructive);
    }
    
    .notification.info {
      border-left: 4px solid var(--primary);
    }
    
    .disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
})();