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

En Ajustes → Apariencia puedes elegir Claro, Oscuro o Sistema. El cambio se muestra al instante y se conserva al guardar; cerrar sin guardar restaura el tema anterior. Sistema sigue la apariencia del dispositivo, incluso si cambia mientras usas Brota.

## Regalo para escritores

En Ajustes → Tengo un código, introduce **COBAYA** para desbloquear el espacio Escritor. La app revela un escritorio literario mediante una entrada animada: fondo de tinta, tres hojas con frases y aparición de la máquina de escribir. El temporizador se integra en el papel de la máquina y el manuscrito crece al completar sesiones. La entrada se puede saltar con el botón o Escape y respeta la preferencia de movimiento reducido. Se muestra al desbloquear el regalo, al volver desde Brota a Escritor y en cada recarga con el modo Escritor activo. Las tres hojas muestran citas de autores reales que cambian cada día: 90 frases, tres distintas por fecha, con autor y enlace a la obra. Cada hoja dura 3,2 segundos y la presentación completa unos diez segundos; el temporizador continúa durante la presentación.

Al comenzar o reanudar, varias teclas se presionan, el mecanismo golpea y el papel se mueve junto con el reloj. Al pausar, la máquina se acomoda y su indicador vuelve al reposo. Completar una sesión produce un avance de papel. Estas respuestas respetan la preferencia de movimiento reducido y no agregan animaciones continuas mientras escribes.

El escrito del día reúne 64 lecturas en prosa y pensamientos breves de José Martí y Amado Nervo, elegidos por su claridad y su mensaje de ánimo, creatividad y bondad. Cada lectura conserva las palabras del autor y muestra la obra y un enlace a la edición. Cambia a medianoche según la fecha local y funciona sin conexión. Las fuentes están documentadas en [LITERATURE.md](LITERATURE.md). El desbloqueo y el espacio activo se conservan en este navegador, incluso al restaurar los ajustes.

Después de desbloquearlo, Ajustes → Tu espacio permite volver a Brota o Escritor. La selección se guarda inmediatamente, sin guardar otros cambios pendientes del formulario ni reiniciar el temporizador. Ambas experiencias comparten tiempos, alarmas y progreso; el manuscrito ilustra sesiones de enfoque, no palabras escritas. El código se valida localmente y no es un mecanismo de autenticación. La misma PWA admite ambas experiencias y funciona sin conexión después de cargar sus recursos.

## Instalar como app (PWA)

Brota puede instalarse desde un navegador compatible y conserva una versión básica para usar sin conexión después de la primera visita. El botón de instalación aparece en la barra superior; en navegadores sin instalación directa muestra instrucciones. En Safari para iPhone, usa **Compartir → Añadir a pantalla de inicio**.

El sitio debe servirse por HTTPS para instalar la PWA; Netlify proporciona HTTPS para el dominio publicado. El temporizador calcula el tiempo transcurrido usando la hora de finalización, por lo que se pone al día cuando vuelves a Brota después de cambiar de app o bloquear el celular. El navegador puede retrasar el sonido o la notificación hasta que la app vuelva a ejecutarse.
