# CyberCalc: Plataforma Educativa de Cálculo

Una plataforma educativa interactiva para aprender cálculo diferencial a través de una interfaz inmersiva inspirada en el cyberpunk. La aplicación utiliza tecnologías web de vanguardia para transformar el aprendizaje matemático en una experiencia atractiva y visualmente dinámica.

<div align="center">
  <img src="public/logo.svg" alt="CyberCalc Logo" width="200" height="200">
</div>

## Características principales

- 🚀 **Sistema interactivo de quiz**: Preguntas de opción múltiple con diferentes niveles de dificultad
- 📊 **Renderizado de fórmulas LaTeX**: Visualiza fórmulas matemáticas complejas
- 🎮 **Elementos de gamificación**: Sistema de puntos, vidas y tabla de clasificación
- 🎧 **API de Audio HTML5**: Efectos de sonido y música de fondo para una experiencia inmersiva
- 🏆 **Retos matemáticos**: Desafíos especiales para poner a prueba tus conocimientos
- 📱 **Diseño web responsivo**: Funciona en dispositivos móviles y de escritorio
- 🔐 **Sistema de autenticación**: Registro y inicio de sesión de usuarios
- 💾 **Persistencia de datos**: Almacenamiento de información del usuario

## Tecnologías utilizadas

- **Frontend**: React, TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: Express.js (Node.js)
- **Autenticación**: Passport.js
- **Gestión de estado**: React Query
- **Renderizado de fórmulas**: KaTeX
- **Enrutamiento**: Wouter
- **Validación de datos**: Zod
- **Estilos**: TailwindCSS con tema cyberpunk personalizado

## Requisitos previos

- Node.js (v16 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/cybercalc.git
   cd cybercalc
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

4. Abre tu navegador en [http://localhost:5000](http://localhost:5000)

## Estructura del proyecto

```
├── client/                # Código del frontend
│   ├── src/
│   │   ├── components/    # Componentes de React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilidades y funciones
│   │   ├── pages/         # Páginas de la aplicación
│   │   └── ...
├── server/                # Código del backend
│   ├── auth.ts            # Configuración de autenticación
│   ├── routes.ts          # Rutas de la API
│   ├── storage.ts         # Almacenamiento de datos
│   └── ...
├── shared/                # Código compartido
│   └── schema.ts          # Esquemas y tipos de datos
└── ...
```

## Despliegue

Para construir la aplicación para producción:

```
npm run build
npm start
```

## Subir a GitHub

Puedes usar el script incluido para inicializar y configurar el repositorio Git:

```bash
# Hacer el script ejecutable (si no lo has hecho)
chmod +x init-git.sh

# Ejecutar el script
./init-git.sh
```

El script te pedirá tu nombre de usuario de GitHub y el nombre del repositorio, y configurará todo lo necesario para que puedas hacer push a GitHub.

Alternativamente, puedes hacerlo manualmente:

```bash
git init
git add .
git commit -m "Primer commit: CyberCalc"
git remote add origin https://github.com/tu-usuario/cybercalc.git
git branch -M main
git push -u origin main
```

## Licencia

MIT