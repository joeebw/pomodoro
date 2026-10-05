# brota

Pomodoro minimalista con temporizador configurable, descansos, ciclos de enfoque y una planta que crece con cada sesión completada. La configuración y el progreso se guardan localmente en el navegador; no hay backend.

## Ejecutar

Desde esta carpeta, inicia un servidor estático:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Se requiere un servidor local porque la app carga módulos JavaScript.

## Personalización

Abre el engrane para configurar una duración de enfoque distinta por sesión del ciclo, además de las pausas, sesiones por ciclo, color de acento, sonido al terminar y notificaciones. Los botones de iniciar y pausar también dan una señal sonora breve. Al activar notificaciones, el navegador solicitará permiso; permite las notificaciones para recibir avisos del sistema al terminar sesiones y pausas. El temporizador en curso se recupera al recargar la página. La barra espaciadora inicia o pausa la sesión.

En Ajustes puedes elegir entre Campanas, Flauta y Melodía y escucharlas antes de guardar. La opción elegida se conserva en el navegador y se usa al terminar sesiones y pausas. Cada aviso reproduce dos veces un MP3 local de Mixkit; los tres funcionan sin conexión en la PWA. Sus créditos y licencia están en `assets/audio/ATTRIBUTION.md`.

Las secciones de sesiones y sonidos empiezan contraídas cada vez que abres Ajustes. Alarma sonora y notificaciones están activadas por defecto para nuevas configuraciones y al restaurar los valores. El permiso de notificaciones se solicita al comenzar una sesión o guardar los ajustes; los avisos necesitan autorización del navegador. Las preferencias previamente guardadas se conservan.

La frase motivadora cambia cada día y se elige localmente; no se necesita conexión.

## Instalar como app (PWA)

Brota puede instalarse desde un navegador compatible y conserva una versión básica para usar sin conexión después de la primera visita. El botón de instalación aparece en la barra superior; en navegadores sin instalación directa muestra instrucciones. En Safari para iPhone, usa **Compartir → Añadir a pantalla de inicio**.

El sitio debe servirse por HTTPS para instalar la PWA; Netlify proporciona HTTPS para el dominio publicado. El temporizador calcula el tiempo transcurrido usando la hora de finalización, por lo que se pone al día cuando vuelves a Brota después de cambiar de app o bloquear el celular. El navegador puede retrasar el sonido o la notificación hasta que la app vuelva a ejecutarse.
