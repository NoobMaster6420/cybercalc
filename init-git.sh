#!/bin/bash
# Script para inicializar un repositorio git para CyberCalc

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Inicializando repositorio Git para CyberCalc ===${NC}"

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Git no está instalado. Por favor, instala Git antes de continuar.${NC}"
    exit 1
fi

# Pedir nombre de usuario de GitHub
echo -e "${BLUE}Ingresa tu nombre de usuario de GitHub:${NC}"
read github_username

# Pedir nombre del repositorio
echo -e "${BLUE}Ingresa el nombre del repositorio (por defecto: cybercalc):${NC}"
read repo_name
repo_name=${repo_name:-cybercalc}

# Inicializar repositorio Git local
echo -e "\n${BLUE}Inicializando repositorio Git local...${NC}"
git init

# Crear .gitignore si no existe
if [ ! -f .gitignore ]; then
    echo -e "\n${BLUE}Creando archivo .gitignore...${NC}"
    cat > .gitignore << EOL
# Dependencias
node_modules/
/.pnp
.pnp.js

# Producción
/dist
/build

# Archivos temporales y de caché
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vite/
.cache/

# Variables de entorno
.env

# Persistencia de datos local
cybercalc_data.json

# Assets generados automáticamente
/attached_assets

# Logs
logs
*.log
EOL
fi

# Añadir archivos al staging area
echo -e "\n${BLUE}Agregando archivos al staging area...${NC}"
git add .

# Crear commit inicial
echo -e "\n${BLUE}Creando commit inicial...${NC}"
git commit -m "Primer commit: CyberCalc - Plataforma educativa de cálculo"

# Configurar el repositorio remoto
echo -e "\n${BLUE}Configurando el repositorio remoto...${NC}"
git remote add origin https://github.com/$github_username/$repo_name.git
git branch -M main

echo -e "\n${GREEN}¡Repositorio Git configurado correctamente!${NC}"
echo -e "${YELLOW}Para subir los cambios a GitHub, ejecuta:${NC}"
echo -e "${BLUE}git push -u origin main${NC}"
echo -e "\n${YELLOW}Nota:${NC} Antes de hacer el push, asegúrate de crear el repositorio '$repo_name' en tu cuenta de GitHub."