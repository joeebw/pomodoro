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

INVICTO muestra **100 frases motivadoras de 18 autores**, incluidas 9 de Ilia Topuria, junto con otros campeones, Helen Keller, Marco Aurelio, Epicteto, Benjamin Franklin y grandes autores sobre esfuerzo y superación. El catálogo mezcla los autores y recorre todas las frases antes de repetir, tanto en la frase diaria como al completar una sesión o ganar un cinturón. Funciona sin conexión. Cada cita tiene autor, enlace a la fuente e indicación cuando se tradujo al español. Las lecturas del modo Escritor conservan su propio catálogo. Las fuentes y el reparto por autor están en [ATHLETES.md](ATHLETES.md).

Pulsa «sesiones hoy» en la cabecera para ajustar la cuenta con − y +. Cada ajuste cambia también las sesiones acumuladas y las etapas del campeonato; completar un ciclo suma un cinturón y retroceder desde cero etapas descuenta uno. Si cambiaste el tamaño del ciclo, al deshacer la victoria reciente se usa su tamaño original; para cinturones anteriores se usa el tamaño actual, porque no se guarda un historial. Los cambios se guardan inmediatamente, funcionan en ambas experiencias y no alteran el temporizador ni reproducen alarmas. La cuenta de hoy se reinicia al cambiar de día según la hora local.

Al completar una sesión de enfoque en INVICTO aparece una celebración con luces de arena, un cinturón y destellos del color elegido. Muestra los minutos dedicados, una cita distinta por sesión y un botón para comenzar el descanso que corresponde al ciclo. Se puede cerrar con Escape o volver al temporizador, y la lectura permanece hasta que decidas continuar. Respeta el movimiento reducido y los temas y colores elegidos. Si termina en segundo plano o con otro diálogo abierto, espera a que vuelvas o cierres ese diálogo; la celebración pendiente se guarda en el navegador para sobrevivir a una recarga. Las pausas terminadas conservan su aviso habitual.

En Ajustes → Apariencia puedes elegir Claro, Oscuro o Sistema. El cambio se muestra al instante y se conserva al guardar; cerrar sin guardar restaura el tema anterior. Sistema sigue la apariencia del dispositivo, incluso si cambia mientras usas INVICTO.

## El camino del campeón

El botón **Adelantar enfoque**, debajo de los controles del reloj, permite finalizar manualmente la sesión y pasar al descanso correspondiente. Cuenta como una sesión completada y una etapa; si cierra el ciclo, concede el cinturón y ofrece la pausa larga. La celebración muestra los minutos transcurridos, redondeados hacia abajo, en lugar de la duración planificada. Está disponible con el enfoque activo o pausado, también en Escritor.

En las pausas corta y larga ese mismo botón cambia a **Adelantar descanso**. Termina la pausa y prepara el siguiente enfoque con su duración completa y el reloj detenido, incluso si aún no iniciaste el descanso o lo pausaste. No suma sesiones ni cinturones y no reproduce alarmas ni envía notificaciones.

**Max** es un basset hound tricolor de pixel art, con cuerpo alargado, patas cortas y orejas caídas. Camina y trota por rutas que rodean los controles; favorece el interior de la pantalla y evita repetir sus últimos destinos. Olfatea, juega, se sienta, bosteza, se rasca, se sacude y mueve la cola. Al acercarte con el mouse puede apartarse, saltar o ladrar; debes alejar el puntero para provocar otra aproximación. También ladra por su cuenta cada 45–90 segundos de actividad despierto, con un límite compartido de diez segundos entre ladridos.

Al comenzar el enfoque, Max se detiene y **duerme exactamente donde está**, con respiración suave y letras de sueño flotantes. Despierta al pausar o entrar en descanso. Se oculta con los diálogos y detiene actividad y audio con la pestaña oculta. Con movimiento reducido usa poses estáticas.

En la barra superior, junto a Ajustes, pulsa el **icono del plato** para darle de comer y elige un espacio libre con clic o toque; también puedes usar las flechas y Enter o cancelar con Escape. Solo habrá un plato. Max camina hasta él, come durante unos siete segundos con una grabación real de un perro masticando y después retoma su actividad. Puedes retirar el plato tocándolo. Si está dormido, la comida espera a que despierte. Si comienza el enfoque mientras come, duerme ahí mismo y conserva la porción pendiente.

Cada 3–6 minutos de actividad despierto puede hacer popó, con un máximo de tres piezas. Max arquea el lomo, flexiona las patas traseras y levanta la cola; se agacha, hace popó y se incorpora durante unos tres segundos. Los sonidos de rascado y lamidos acompañan sus gestos sin superponerse con la comida o los ladridos, y se detienen al dormir. Límpialas con clic, toque o teclado. Se retiran al comenzar el enfoque; al ocultar a Max o recargar se retiran también la comida y todas las piezas. Estos objetos no se guardan entre visitas.

En Ajustes, **Mostrar a Max** y **Sonidos de Max** conservan las preferencias anteriores y permiten ocultarlo o silenciarlo. Los ladridos, la comida, el rascado y los lamidos usan grabaciones locales; la popó lleva un efecto cómico breve. Todos respetan el ajuste de sonidos de Max y son independientes de la alarma. Puedes probar cada uno en Ajustes. Sus fuentes y licencias están en `assets/audio/ATTRIBUTION.md`. Max, la comida y sus sonidos funcionan sin conexión.

El botón **Reiniciar ciclo**, debajo del progreso, pide confirmación antes de volver a la primera sesión. Al confirmar se detiene el reloj, se recupera la duración configurada para esa sesión y se borra únicamente el avance del ciclo actual. Los cinturones, las sesiones completadas y la configuración se conservan. Cancelar, cerrar con la X, pulsar Escape o tocar fuera del modal permite seguir con el ciclo; abrir la confirmación no pausa ni reinicia el reloj. Está disponible también en Escritor.

INVICTO presenta una arena minimalista con un cinturón como objetivo. Cada sesión de enfoque ilumina una etapa del camino, con tantas etapas como sesiones tenga tu ciclo (2 a 8). Al completar el ciclo ganas un cinturón, aparece una celebración especial de unos cuatro segundos con luces, brillo y una cita deportiva, y comienza la opción de pausa larga. La cita permanece hasta que decidas continuar. La barra superior cuenta cinturones y la tarjeta conserva el total de sesiones de enfoque.

La preparación se guarda en el navegador y continúa entre días y recargas. Las sesiones de hoy se cuentan por separado. Al actualizar, las sesiones del día se convierten en el avance del ciclo actual (el resto al dividir entre el tamaño del ciclo); el historial de cinturones empieza en cero y las sesiones anteriores se conservan. Los cambios al tamaño del ciclo se aplican a la siguiente preparación; el ciclo en curso conserva su tamaño. El camino permanece completo durante la pausa larga y se prepara de nuevo al comenzar la siguiente sesión de enfoque. Ambas experiencias comparten ciclos, duraciones por etapa y progreso; Escritor mantiene su manuscrito y sus animaciones.

Las reglas del campeonato están en `src/championship.js` y el dibujo SVG local compartido en `src/champion-art.js`. La arena y las celebraciones funcionan sin conexión, respetan el tema elegido, los colores de acento y el movimiento reducido. Cerrar Ajustes sin guardar, pausar, reiniciar o cambiar de modalidad no concede cinturones.

La barra superior muestra también las sesiones de hoy, tanto en INVICTO como en Escritor. El contador suma al completar o adelantar un enfoque, se conserva al recargar y al reiniciar el ciclo, y vuelve a cero al cambiar de día según la hora local del dispositivo. Los descansos no suman sesiones.

## Regalo para escritores

En Ajustes → Tengo un código, introduce **COBAYA** para desbloquear el espacio Escritor. La app revela un escritorio literario mediante una entrada animada: fondo de tinta, tres hojas con frases y aparición de la máquina de escribir. El temporizador se integra en el papel de la máquina y el manuscrito crece al completar sesiones. La entrada se puede saltar con el botón o Escape y respeta la preferencia de movimiento reducido. Se muestra al desbloquear el regalo, al volver desde INVICTO a Escritor y en cada recarga con el modo Escritor activo. Las tres hojas muestran citas de autores reales que cambian cada día: 90 frases, tres distintas por fecha, con autor y enlace a la obra. Cada hoja dura 3,2 segundos y la presentación completa unos diez segundos; el temporizador continúa durante la presentación.

Al comenzar o reanudar, varias teclas se presionan, el mecanismo golpea y el papel se mueve junto con el reloj. Al pausar, la máquina se acomoda y su indicador vuelve al reposo. Completar una sesión produce un avance de papel. Estas respuestas respetan la preferencia de movimiento reducido y no agregan animaciones continuas mientras escribes.

El escrito del día reúne 64 lecturas en prosa y pensamientos breves de José Martí y Amado Nervo, elegidos por su claridad y su mensaje de ánimo, creatividad y bondad. Cada lectura conserva las palabras del autor y muestra la obra y un enlace a la edición. Cambia a medianoche según la fecha local y funciona sin conexión. Las fuentes están documentadas en [LITERATURE.md](LITERATURE.md). El desbloqueo y el espacio activo se conservan en este navegador, incluso al restaurar los ajustes.

Después de desbloquearlo, Ajustes → Tu espacio permite volver a INVICTO o Escritor. La selección se guarda inmediatamente, sin guardar otros cambios pendientes del formulario ni reiniciar el temporizador. Ambas experiencias comparten tiempos, alarmas y progreso; el manuscrito ilustra sesiones de enfoque, no palabras escritas. El código se valida localmente y no es un mecanismo de autenticación. La misma PWA admite ambas experiencias y funciona sin conexión después de cargar sus recursos.

## Instalar como app (PWA)

INVICTO puede instalarse desde un navegador compatible y conserva una versión básica para usar sin conexión después de la primera visita. El botón de instalación aparece en la barra superior; en navegadores sin instalación directa muestra instrucciones. En Safari para iPhone, usa **Compartir → Añadir a pantalla de inicio**.

El sitio debe servirse por HTTPS para instalar la PWA; Netlify proporciona HTTPS para el dominio publicado. El temporizador calcula el tiempo transcurrido usando la hora de finalización, por lo que se pone al día cuando vuelves a INVICTO después de cambiar de app o bloquear el celular. El navegador puede retrasar el sonido o la notificación hasta que la app vuelva a ejecutarse.

## Verificar el catálogo de frases

Con Node.js instalado, ejecuta `node --test tests/quotes.test.mjs` para comprobar cantidad, textos únicos, atribución, rotación y recursos del catálogo disponibles sin conexión.
