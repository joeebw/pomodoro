# INVICTO

Pomodoro minimalista con temporizador configurable, descansos, ciclos de enfoque y el camino del campeón: etapas de preparación y un cinturón por ciclo completado. La configuración y el progreso se guardan localmente en el navegador; no hay backend.

## Ejecutar

Desde esta carpeta, inicia un servidor estático:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Se requiere un servidor local porque la app carga módulos JavaScript.

## Personalización

La identidad de INVICTO combina grafito, marfil y cuatro acentos: Oro, Cobre, Plata y Azul acero. El reloj, los controles, el cinturón y las celebraciones comparten el tono seleccionado. Las instalaciones nuevas empiezan en modo oscuro; las existentes conservan su apariencia guardada. Escritor mantiene su composición literaria y sus colores originales.

La marca y los nombres de las paletas se centralizan en `src/brand.js`; la presentación de la arena está en `invicto.css`. Se conservan la clave `brota-pomodoro-v1`, los identificadores internos de experiencia y color y la identidad `/` de la PWA para mantener los datos y la instalación existentes. Los colores anteriores se corresponden con Oro (salvia), Cobre (rosa), Plata (lavanda) y Azul acero (océano).

Abre el engrane para configurar una duración de enfoque distinta por sesión del ciclo, además de las pausas, sesiones por ciclo, color de acento, sonido al terminar y notificaciones. Los botones de iniciar y pausar también dan una señal sonora breve. Al activar notificaciones, el navegador solicitará permiso; permite las notificaciones para recibir avisos del sistema al terminar sesiones y pausas. El temporizador en curso se recupera al recargar la página. La barra espaciadora inicia o pausa la sesión.

En Ajustes puedes elegir entre Campanas, Flauta y Melodía y escucharlas antes de guardar. La opción elegida se conserva en el navegador y se usa al terminar sesiones y pausas. Cada aviso reproduce dos veces un MP3 local de Mixkit; los tres funcionan sin conexión en la PWA. Sus créditos y licencia están en `assets/audio/ATTRIBUTION.md`.

Las secciones de sesiones y sonidos empiezan contraídas cada vez que abres Ajustes. Alarma sonora y notificaciones están activadas por defecto para nuevas configuraciones y al restaurar los valores. El permiso de notificaciones se solicita al comenzar una sesión o guardar los ajustes; los avisos necesitan autorización del navegador. Las preferencias previamente guardadas se conservan.

INVICTO muestra 46 citas breves de deportistas, incluidas 17 de Ilia Topuria, y pensamientos de Serena Williams, Rafael Nadal, Roger Federer, Eliud Kipchoge, Simone Biles y otros atletas. La frase cambia cada día según la fecha local y funciona sin conexión. Cada cita tiene autor, enlace a la fuente y una indicación cuando se tradujo al español. El catálogo sustituye las frases generales anteriores; las lecturas del modo Escritor conservan su propio catálogo. Las fuentes están en [ATHLETES.md](ATHLETES.md).

Al completar una sesión de enfoque en INVICTO aparece una celebración con luces de arena, un cinturón y destellos del color elegido. Muestra los minutos dedicados, una cita distinta por sesión y un botón para comenzar el descanso que corresponde al ciclo. Se puede cerrar con Escape o volver al temporizador, y la lectura permanece hasta que decidas continuar. Respeta el movimiento reducido y los temas y colores elegidos. Si termina en segundo plano o con otro diálogo abierto, espera a que vuelvas o cierres ese diálogo; la celebración pendiente se guarda en el navegador para sobrevivir a una recarga. Las pausas terminadas conservan su aviso habitual.

En Ajustes → Apariencia puedes elegir Claro, Oscuro o Sistema. El cambio se muestra al instante y se conserva al guardar; cerrar sin guardar restaura el tema anterior. Sistema sigue la apariencia del dispositivo, incluso si cambia mientras usas INVICTO.

## El camino del campeón

El botón **Adelantar enfoque**, debajo de los controles del reloj, permite finalizar manualmente la sesión y pasar al descanso correspondiente. Cuenta como una sesión completada y una etapa; si cierra el ciclo, concede el cinturón y ofrece la pausa larga. La celebración muestra los minutos transcurridos, redondeados hacia abajo, en lugar de la duración planificada. Está disponible con el enfoque activo o pausado, también en Escritor, y se oculta durante los descansos.

El botón **Reiniciar ciclo**, debajo del progreso, pide confirmación antes de volver a la primera sesión. Al confirmar se detiene el reloj, se recupera la duración configurada para esa sesión y se borra únicamente el avance del ciclo actual. Los cinturones, las sesiones completadas y la configuración se conservan. Cancelar, cerrar con la X, pulsar Escape o tocar fuera del modal permite seguir con el ciclo; abrir la confirmación no pausa ni reinicia el reloj. Está disponible también en Escritor.

INVICTO presenta una arena minimalista con un cinturón como objetivo. Cada sesión de enfoque ilumina una etapa del camino, con tantas etapas como sesiones tenga tu ciclo (2 a 8). Al completar el ciclo ganas un cinturón, aparece una celebración especial de unos cuatro segundos con luces, brillo y una cita deportiva, y comienza la opción de pausa larga. La cita permanece hasta que decidas continuar. La barra superior cuenta cinturones y la tarjeta conserva el total de sesiones de enfoque.

La preparación se guarda en el navegador y continúa entre días y recargas. Las sesiones de hoy se cuentan por separado. Al actualizar, las sesiones del día se convierten en el avance del ciclo actual (el resto al dividir entre el tamaño del ciclo); el historial de cinturones empieza en cero y las sesiones anteriores se conservan. Los cambios al tamaño del ciclo se aplican a la siguiente preparación; el ciclo en curso conserva su tamaño. El camino permanece completo durante la pausa larga y se prepara de nuevo al comenzar la siguiente sesión de enfoque. Ambas experiencias comparten ciclos, duraciones por etapa y progreso; Escritor mantiene su manuscrito y sus animaciones.

Las reglas del campeonato están en `src/championship.js` y el dibujo SVG local compartido en `src/champion-art.js`. La arena y las celebraciones funcionan sin conexión, respetan el tema elegido, los colores de acento y el movimiento reducido. Cerrar Ajustes sin guardar, pausar, reiniciar o cambiar de modalidad no concede cinturones.

## Regalo para escritores

En Ajustes → Tengo un código, introduce **COBAYA** para desbloquear el espacio Escritor. La app revela un escritorio literario mediante una entrada animada: fondo de tinta, tres hojas con frases y aparición de la máquina de escribir. El temporizador se integra en el papel de la máquina y el manuscrito crece al completar sesiones. La entrada se puede saltar con el botón o Escape y respeta la preferencia de movimiento reducido. Se muestra al desbloquear el regalo, al volver desde INVICTO a Escritor y en cada recarga con el modo Escritor activo. Las tres hojas muestran citas de autores reales que cambian cada día: 90 frases, tres distintas por fecha, con autor y enlace a la obra. Cada hoja dura 3,2 segundos y la presentación completa unos diez segundos; el temporizador continúa durante la presentación.

Al comenzar o reanudar, varias teclas se presionan, el mecanismo golpea y el papel se mueve junto con el reloj. Al pausar, la máquina se acomoda y su indicador vuelve al reposo. Completar una sesión produce un avance de papel. Estas respuestas respetan la preferencia de movimiento reducido y no agregan animaciones continuas mientras escribes.

El escrito del día reúne 64 lecturas en prosa y pensamientos breves de José Martí y Amado Nervo, elegidos por su claridad y su mensaje de ánimo, creatividad y bondad. Cada lectura conserva las palabras del autor y muestra la obra y un enlace a la edición. Cambia a medianoche según la fecha local y funciona sin conexión. Las fuentes están documentadas en [LITERATURE.md](LITERATURE.md). El desbloqueo y el espacio activo se conservan en este navegador, incluso al restaurar los ajustes.

Después de desbloquearlo, Ajustes → Tu espacio permite volver a INVICTO o Escritor. La selección se guarda inmediatamente, sin guardar otros cambios pendientes del formulario ni reiniciar el temporizador. Ambas experiencias comparten tiempos, alarmas y progreso; el manuscrito ilustra sesiones de enfoque, no palabras escritas. El código se valida localmente y no es un mecanismo de autenticación. La misma PWA admite ambas experiencias y funciona sin conexión después de cargar sus recursos.

## Instalar como app (PWA)

INVICTO puede instalarse desde un navegador compatible y conserva una versión básica para usar sin conexión después de la primera visita. El botón de instalación aparece en la barra superior; en navegadores sin instalación directa muestra instrucciones. En Safari para iPhone, usa **Compartir → Añadir a pantalla de inicio**.

El sitio debe servirse por HTTPS para instalar la PWA; Netlify proporciona HTTPS para el dominio publicado. El temporizador calcula el tiempo transcurrido usando la hora de finalización, por lo que se pone al día cuando vuelves a INVICTO después de cambiar de app o bloquear el celular. El navegador puede retrasar el sonido o la notificación hasta que la app vuelva a ejecutarse.
