# Guía para agentes — INVICTO

## Propósito y contexto

INVICTO es una PWA de Pomodoro en español con dos experiencias: INVICTO y Escritor. Comparte temporizador, sesiones, campeonato y Max, un basset hound animado. Es una aplicación estática con HTML, CSS y módulos JavaScript nativos; no tiene backend, compilación ni dependencias de producción instalables.

- Lee `README.md` y los módulos implicados antes de modificar comportamiento. Verifica el código actual; la documentación puede quedar desactualizada.
- Conserva el funcionamiento local y sin conexión. No introduzcas un framework, backend, gestor de paquetes o dependencia para resolver un cambio que cabe en la estructura actual.
- Comunícate con el usuario en español. Avanza con las tareas autorizadas; pregunta solo cuando una decisión importante no pueda resolverse con el contexto o el repositorio.

## Arranque y comprobaciones

Ejecuta los comandos desde la raíz del repositorio:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --test tests/*.test.mjs
git diff --check
```

Abre `http://127.0.0.1:8000`. No uses `file://`: la aplicación necesita cargar módulos y registrar el service worker. No hay comandos `npm test`, lint ni build configurados; no inventes resultados de esas herramientas. Los tests utilizan Node.js y su biblioteca estándar.

## Arquitectura y modularidad

| Responsabilidad | Ubicación |
| --- | --- |
| Orquestación del estado, eventos y transiciones del reloj | `src/main.js` |
| Cálculo de duraciones y formato del tiempo | `src/timer.js` |
| Carga, normalización, migraciones y guardado local | `src/storage.js` |
| Etapas, ciclos, cinturones y retroceso | `src/championship.js` |
| Ajuste manual de sesiones del día | `src/daily-session-controls.js` |
| Experiencias, identidad y tema | `src/experiences.js`, `src/brand.js`, `src/theme.js` |
| Celebración y experiencia Escritor | `src/session-celebration.js`, `src/writer-*.js`, `src/champion-art.js` |
| Conducta, cuidados, rutas, progreso, sonido y gráficos de Max | `src/dog-companion.js`, `src/dog-care.js`, `src/dog-fetch.js`, `src/dog-movement.js`, `src/dog-progress.js`, `src/dog-audio.js`, `src/dog-art.js` |
| Catálogos y selección de citas | `src/quotes.js`, `src/athlete-quotes.js`, `src/classic-quotes.js`, `src/writer-quotes.js` |
| Instalación y recursos sin conexión | `src/pwa.js`, `sw.js`, `manifest.webmanifest` |
| Estructura y presentación | `index.html`, `styles.css` y hojas CSS específicas de cada experiencia o función |

- Añade la lógica en el módulo responsable; evita convertir `main.js` en un contenedor de nuevas funcionalidades independientes.
- Mantén las reglas de negocio separadas del DOM, audio, animaciones y almacenamiento. Prefiere funciones puras para cálculos, normalización y progreso.
- Extrae un módulo cuando exista una responsabilidad independiente o duplicación real; no crees capas o archivos para envolver una única operación trivial.
- Reutiliza operaciones existentes, constantes y variables CSS. Mantén la convención del archivo y evita reformatear archivos enteros o refactorizar áreas ajenas a la tarea.
- Los módulos decorativos reciben los cambios del reloj; no deben gestionar el temporizador ni consultar continuamente su estado por su cuenta.

## Contratos que hay que preservar

Estas son las reglas actuales, salvo que el usuario solicite cambiarlas explícitamente:

- Conserva `brota-pomodoro-v1`, los identificadores internos `brota` y `writer`, y la identidad `/` de la PWA. Los nombres históricos no son un motivo para borrar o renombrar datos.
- Los campos nuevos deben tener valores por defecto y normalización compatible con instalaciones anteriores. No borres el progreso para resolver una migración; prueba cargar datos antiguos.
- El reloj en marcha se calcula desde `endsAt` y la hora real. Debe recuperarse al recargar o volver del segundo plano; no lo sustituyas por un contador basado solo en intervalos.
- Completar o adelantar un enfoque suma una sesión, una etapa y la recompensa de Max. Adelantar un descanso prepara el enfoque completo, detenido y sin alarma, notificación ni incrementos.
- Las sesiones de hoy se reinician según la fecha local del dispositivo, incluso con la aplicación abierta. Reiniciar el ciclo conserva sesiones acumuladas, sesiones del día, cinturones y progreso de Max.
- Los ajustes manuales de sesiones modifican los contadores y el campeonato, sin alterar el tiempo restante ni dar comida o crecimiento a Max. Ningún contador debe ser negativo.
- INVICTO y Escritor comparten datos y reloj; cambiar de experiencia no debe reiniciar el temporizador ni perder preferencias.
- Max duerme donde está durante el enfoque en marcha, permanece silencioso y no bloquea controles. Al abrir diálogos o esconder la pestaña, su actividad y audio se detienen.
- Una sesión completada desbloquea una comida; servir un plato válido la consume. Max empieza pequeño y llega a adulto en 60 sesiones. Su progreso persistente es independiente del total editable de sesiones; platos y popó son temporales.

## PWA, interfaz y recursos

- Si cambias recursos de ejecución precargados, incrementa la versión de caché en `sw.js`. Añade los recursos locales nuevos a `APP_FILES` y retira las referencias a los eliminados: una ruta inexistente puede impedir instalar toda la caché.
- Un cambio exclusivo de documentación o tests no necesita incrementar la caché ni añadirse a `APP_FILES`.
- Verifica una actualización desde una caché anterior y una recarga sin conexión cuando cambies la PWA. No basta con probar en una pestaña nueva conectada.
- Conserva temas claro y oscuro, ambas experiencias y diseño móvil sin desbordamientos. Reutiliza las secciones plegables de Ajustes y sus reglas de guardar o descartar cambios.
- Los controles deben tener etiquetas accesibles, foco visible y manejo por teclado; los paneles deben admitir el cierre esperado con Escape. Respeta `prefers-reduced-motion` y evita anuncios repetitivos de elementos decorativos.
- Para sonidos de perro, utiliza grabaciones de perros reales, no imitaciones humanas o síntesis. Verifica la descripción original, licencia y uso permitido; documenta autor, fuente y modificaciones en `assets/audio/ATTRIBUTION.md`.
- Verifica los audios mediante reproducción y, si puedes escucharlos, mediante escucha. No afirmes que un sonido resulta convincente si solo comprobaste que decodifica o se reproduce.
- Mantén las citas atribuidas y contrastadas; no inventes frases de autores reales. Actualiza `ATHLETES.md` o `LITERATURE.md` cuando corresponda.

## Validación proporcional al cambio

- Para reglas, persistencia o errores funcionales, añade o ajusta pruebas de comportamiento y regresión en `tests/`. No escribas tests que solo repitan la implementación.
- Tras cambiar JavaScript o reglas de negocio, ejecuta `node --test tests/*.test.mjs`; comprueba también la sintaxis de los archivos JavaScript modificados con `node --check ruta/al/archivo.js`.
- Los cambios de interfaz requieren comprobar el resultado en navegador: móvil y escritorio, ambas experiencias, temas pertinentes, teclado y movimiento reducido cuando haya animaciones. Los tests de Node no sustituyen esa revisión.
- Los cambios de reloj o progreso requieren revisar enfoque, descansos, pausa, adelanto, reinicio, recarga y ausencia de recompensas duplicadas. Los cambios de fecha requieren verificar el reinicio diario.
- Para documentación, revisa exactitud, enlaces, comandos y `git diff --check`; no hace falta ejecutar pruebas de navegador ni añadir tests.
- Si una herramienta, permiso o navegador impide validar algo, informa qué quedó sin comprobar. No presentes tests unitarios como evidencia de una comprobación visual, auditiva o de instalación que no hiciste.

## Commits durante el trabajo

- El usuario autoriza commits locales periódicos: crea uno al terminar cada cambio lógico completo y verificado. En tareas largas, divide el trabajo en hitos funcionales y haz commit al cerrar cada hito, antes de comenzar el siguiente.
- La frecuencia se basa en avance verificable, no en minutos. No hagas commits automáticos por reloj, vacíos, con cambios a medias o con pruebas fallidas. Si existe un bloqueo, conserva el trabajo y explica el estado.
- Antes de cada commit, revisa `git status`, el diff y las comprobaciones pertinentes. Añade rutas explícitas y revisa `git diff --cached`; incluye solo los archivos de tu tarea y conserva cambios ajenos.
- Usa mensajes breves en inglés que describan el cambio, siguiendo el historial actual. No hagas amend, rebase, reset destructivo ni force push sin una solicitud explícita.
- Trabaja en la rama acordada; cuando corresponda crear una rama nueva, usa el prefijo `codex/`. No crees ramas ni cambies de rama solo para un commit rutinario.
- Los commits locales no autorizan un push o despliegue. Haz push cuando el usuario lo solicite y verifica su resultado y la sincronización; no confundas un commit local con una publicación.
- No incluyas secretos, credenciales, archivos de entorno, capturas de prueba ni dependencias generadas en los commits. Usa archivos temporales fuera del repositorio para artefactos de validación.

## Cierre y mantenimiento

- Al entregar, resume qué cambió, qué verificaste, limitaciones pendientes y hashes de los commits creados. Distingue lo implementado localmente de lo subido al remoto.
- Actualiza `README.md` si cambia el comportamiento visible, la configuración o la forma de ejecutar la aplicación.
- Mantén esta guía breve y vigente cuando cambien las responsabilidades, comandos o acuerdos del proyecto. No la conviertas en un historial de tareas ni fijes aquí versiones de caché o rutas personales de herramientas.

Referencia de descubrimiento de instrucciones: [documentación oficial de OpenAI sobre AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
