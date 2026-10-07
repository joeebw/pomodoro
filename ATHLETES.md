# Citas deportivas de INVICTO

Selección documentada el 7 de octubre de 2026: 46 fragmentos breves, 17 de Ilia Topuria y 29 de otros deportistas. No es un archivo exhaustivo de todas las declaraciones de Topuria. Sustituye el catálogo anterior de INVICTO.

Se seleccionaron declaraciones recogidas en entrevistas, conferencias de prensa y discursos. Se conservan fragmentos breves y se normalizan mayúsculas y tildes. Las traducciones al español se identifican en la interfaz; no se presentan como transcripciones originales en español. No se añaden lemas inventados atribuidos a deportistas ni frases de recopilaciones sin fuente.

## Fuentes

- [Ilia Topuria — TVE, confianza](https://www.rtve.es/deportes/20240404/entrevista-ilia-topuria-tve/16045081.shtml)
- [Ilia Topuria — Antena 3 Deportes, entrenamiento](https://www.antena3.com/noticias/deportes/ilia-topuria-desvela-antena-3-sus-secretos-ser-invencible_2025032767e572de8ba0d30001ffbf5d.html)
- [Ilia Topuria — El Hormiguero, mentalidad](https://www.antena3.com/programas/el-hormiguero/entrevista/ilia-topuria-motivacion-filosofia-vida-miedo-poder-ver-mejor-version_20231009652462ee90d39d00010c1cf9.html)
- [Ilia Topuria — El Hormiguero, sueños](https://www.antena3internacional.com/programas/el-hormiguero/noticias/ilia-topuria-en-el-hormiguero-30-me-tengo-que-exigir-todo-el-tiempo-porque-el-premio-es-mi-sueno_2024022765ddc3bb344c980001c30123.html)
- [Ilia Topuria — El Hormiguero, preparación](https://www.antena3internacional.com/programas/el-hormiguero/noticias/ilia-topuria-vuelve-a-el-hormiguero-tras-su-victoria-contra-max-holloway-si-nadie-lo-ha-hecho-yo-sere-el-primero-en-hacerlo_2024111567374b6fb747ad00018361ae.html)
- [Ilia Topuria — El Hormiguero, dudas](https://www.antena3.com/programas/el-hormiguero/entrevista/dudas-son-impulso-ilia-topuria-desvela-secreto-combatir-miedo_2024111467366d30b747ad0001817696.html)
- [Ilia Topuria — Antena 3 Deportes, comienzos](https://www.antena3.com/noticias/deportes/le-comparan-con-mcgregor_202012125fd4e847d4aa1e00012b47a5.html)
- [Ilia Topuria — entrevista en Cadena SER](https://cadenaser.com/cataluna/2024/09/20/ilia-topuria-yo-respeto-a-todos-mis-rivales-como-profesionales-pero-yo-estoy-luchando-por-mis-suenos-sercat/)
- [Ilia Topuria — El Hormiguero, críticas](https://www.antena3.com/programas/el-hormiguero/invitados/ilia-topuria_20250508681c487d5d71dc778a9cf6d2.html)
- [Ilia Topuria — Telecinco, rumbo](https://www.telecinco.es/noticias/deportes/20240228/ilia-topuria-influencia-campeon-ufc_18_011820061.html)
- [Roger Federer — discurso en Dartmouth](https://home.dartmouth.edu/news/2024/06/2024-commencement-address-roger-federer)
- [Allyson Felix — entrevista en World Athletics](https://worldathletics.org/women-in-athletics/news/allyson-felix-usa-sprinter-mother-olympics-20)
- [Serena Williams — conferencia de prensa, WTA](https://www.wtatennis.com/news/1447037/im-a-fighter-i-never-give-up-serena-quells-teen-juvan-at-wimbledon)
- [Rafael Nadal — entrevista recogida por RTVE](https://www.rtve.es/deportes/20130920/nadal-gusta-ganar-con-esfuerzo/748368.shtml)
- [Rafael Nadal — discurso en la Universidad de Salamanca](https://comunicacion.usal.es/filessp/Doctorado_honoris_causa_a_Rafael_Nadal.pdf)
- [Eliud Kipchoge — entrevista en CITIUS Mag](https://citiusmag.com/articles/eliud-kipchoge-2025-interview)
- [Eliud Kipchoge — World Athletics, límites](https://worldathletics.org/awards/news/eliud-kipchoge-athlete-of-year-2019)
- [Eliud Kipchoge — Words of Wisdom](https://worldathletics.org/spikes/news/words-of-wisdom-eliud-kipchoge)
- [David Rudisha — Words of Wisdom](https://worldathletics.org/spikes/news/david-rudishas-words-of-wisdom)
- [Dwight Phillips — Words of Wisdom](https://worldathletics.org/spikes/news/dwight-phillips-words-of-wisdom)
- [Novlene Williams-Mills — Words of Wisdom](https://worldathletics.org/spikes/news/novlene-williams-mills-words-of-wisdom)
- [Simone Biles — entrevista de Associated Press](https://apnews.com/article/1c7d4352a67c062bcc65fb7f56c9a1a3)
- [Aryna Sabalenka — perfil oficial WTA](https://www.wtatennis.com/players/320760/-aryna-sabalenka-)
- [Andrea Petkovic — entrevista WTA](https://www.wtatennis.com/news/2441012/petkovic-relishing-every-moment-im-seeing-the-finish-line)
- [Iga Świątek — declaraciones recogidas por US Open](https://www.usopen.org/en_US/news/articles/2024-05-20/iga_swiatek_rolls_to_rome_title_cementing_status_as_roland_garros_favorite.html)
- [Carlos Alcaraz — entrevista Roland-Garros](https://www.rolandgarros.com/en-us/article/rg2025-carlos-alcaraz-2024-champion-interview-magazine-career-ambition)
- [Kirsty Coventry — discurso recogido por IOC Newsroom](https://newsroom.olympics.com/record/3169/media_id/6799)

## Rotación y celebración

El catálogo local está en `src/athlete-quotes.js`. `src/quotes.js` selecciona una cita por fecha local; recorrerá las 46 antes de repetir. Para celebraciones usa el total de sesiones de enfoque completadas y un salto de 17 posiciones, coprimo con 46, por lo que visita todo el catálogo antes de repetir. Recargar no reinicia el progreso.

Las citas funcionan sin conexión. Los enlaces a las entrevistas completas requieren internet. La presentación está aislada en `src/session-celebration.js` y `celebration.css`; recibe el resultado de cada etapa desde el campeonato y no controla los cálculos del reloj.
