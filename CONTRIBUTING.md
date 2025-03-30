# Guía de contribución a CyberCalc

¡Gracias por tu interés en contribuir a CyberCalc! Este documento proporciona las directrices para contribuir al proyecto.

## Cómo contribuir

1. **Fork** del repositorio (https://github.com/tu-usuario/cybercalc/fork)
2. **Clona** tu fork: `git clone https://github.com/tu-usuario/cybercalc.git`
3. **Crea una rama** para tu característica: `git checkout -b mi-nueva-caracteristica`
4. **Realiza los cambios** necesarios, y asegúrate de seguir las convenciones de código
5. **Haz commit** de tus cambios: `git commit -am 'Añade alguna característica'`
6. **Haz push** a la rama: `git push origin mi-nueva-caracteristica`
7. Presenta un **Pull Request**

## Directrices de código

- Mantén el mismo estilo de código que el resto del proyecto
- Asegúrate de que tu código pasa los linters
- Escribe pruebas para tu código cuando sea posible
- Actualiza la documentación cuando sea necesario

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

## Tipos de contribuciones

### Informes de errores

Si encuentras un error, por favor, crea un issue detallando:

- **Título y descripción** claros y descriptivos
- **Pasos para reproducir** el problema
- **Comportamiento esperado** y qué ocurre en su lugar
- **Capturas de pantalla** si aplica
- **Información del entorno**: navegador, sistema operativo, etc.

### Solicitudes de características

- Usa un **título claro y descriptivo**
- Proporciona una **descripción detallada** de la característica sugerida
- Explica por qué esta característica sería útil para la mayoría de los usuarios

### Pull Requests

- Actualiza el README.md con detalles de los cambios si es necesario
- Actualiza el número de versión en los archivos relevantes siguiendo [SemVer](http://semver.org/)
- El PR será fusionado una vez que pase revisión

## Configuración del entorno de desarrollo

1. Clona el repositorio:
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

## Estilo de código

Este proyecto utiliza ESLint y Prettier para mantener un estilo de código consistente. Por favor, configura tu editor para respetar estas herramientas.

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones se licenciarán bajo la misma licencia que el proyecto (MIT).