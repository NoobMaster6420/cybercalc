// Gestión de autenticación y usuarios

// Función para registrar un nuevo usuario
function registerUser(username, password) {
  // Verificar si el usuario ya existe
  const userExists = appData.users.some(user => user.username === username);
  if (userExists) {
    return { success: false, message: 'El nombre de usuario ya está en uso' };
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: appData.users.length + 1,
    username,
    password, // En una aplicación real, esto debería estar hasheado
    points: 0,
    lives: 3,
    createdAt: new Date().toISOString()
  };
  
  // Guardar el usuario
  appData.users.push(newUser);
  saveData();
  
  // Retornar el usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = newUser;
  return { success: true, user: userWithoutPassword };
}

// Función para iniciar sesión
function loginUser(username, password) {
  // Buscar el usuario
  const user = appData.users.find(user => user.username === username && user.password === password);
  
  if (!user) {
    return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
  }
  
  // Guardar el usuario actual
  appData.currentUser = {...user};
  delete appData.currentUser.password; // No almacenar la contraseña en la sesión
  saveData();
  
  return { success: true, user: appData.currentUser };
}

// Función para cerrar sesión
function logoutUser() {
  appData.currentUser = null;
  saveData();
  return { success: true };
}

// Función para verificar si hay un usuario logueado
function getCurrentUser() {
  return appData.currentUser;
}

// Función para actualizar los puntos del usuario
function updateUserPoints(userId, pointsToAdd) {
  const userIndex = appData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  // Actualizar puntos
  appData.users[userIndex].points += pointsToAdd;
  
  // Si el usuario actual es el mismo, actualizamos también currentUser
  if (appData.currentUser && appData.currentUser.id === userId) {
    appData.currentUser.points += pointsToAdd;
  }
  
  // Actualizar el ranking
  updateLeaderboard();
  
  // Guardar los cambios
  saveData();
  
  return { success: true, points: appData.users[userIndex].points };
}

// Función para actualizar las vidas del usuario
function updateUserLives(userId, newLives) {
  const userIndex = appData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  // Actualizar vidas
  appData.users[userIndex].lives = newLives;
  
  // Si el usuario actual es el mismo, actualizamos también currentUser
  if (appData.currentUser && appData.currentUser.id === userId) {
    appData.currentUser.lives = newLives;
  }
  
  // Guardar los cambios
  saveData();
  
  return { success: true, lives: newLives };
}

// Función para actualizar el ranking
function updateLeaderboard() {
  // Ordenar usuarios por puntos (de mayor a menor)
  appData.leaderboard = [...appData.users]
    .sort((a, b) => b.points - a.points)
    .map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  
  saveData();
}

// Función para registrar un quiz completado
function registerQuizCompletion(userId, difficulty, score, pointsEarned) {
  // Verificar que el usuario existe
  const userExists = appData.users.some(user => user.id === userId);
  if (!userExists) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  // Crear registro del quiz
  const quizRecord = {
    id: appData.userActivity.quizzes.length + 1,
    userId,
    difficulty,
    score,
    pointsEarned,
    completedAt: new Date().toISOString()
  };
  
  // Guardar el registro
  appData.userActivity.quizzes.push(quizRecord);
  saveData();
  
  return { success: true, quiz: quizRecord };
}

// Función para registrar un reto completado
function registerChallengeCompletion(userId, challengeId, success, pointsEarned) {
  // Verificar que el usuario existe
  const userExists = appData.users.some(user => user.id === userId);
  if (!userExists) {
    return { success: false, message: 'Usuario no encontrado' };
  }
  
  // Crear registro del reto
  const challengeRecord = {
    id: appData.userActivity.challenges.length + 1,
    userId,
    challengeId,
    success,
    pointsEarned,
    completedAt: new Date().toISOString()
  };
  
  // Guardar el registro
  appData.userActivity.challenges.push(challengeRecord);
  saveData();
  
  return { success: true, challenge: challengeRecord };
}