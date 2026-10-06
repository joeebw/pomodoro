# Textos del escritorio literario

## Selección

- **Hojas de entrada:** 90 citas cortas: 60 de José Martí, 20 de Amado Nervo,
  ocho de Gustavo Adolfo Bécquer y dos de Rosalía de Castro. Las frases se
  intercalan por autor. Cada fecha local elige tres distintas; se recorre todo
  el catálogo sin repetir una cita durante 30 días.
- **Escrito del día:** 64 lecturas: 16 fragmentos de Amado Nervo y 48
  pensamientos o pasajes de José Martí. Se elige prosa y lenguaje directo
  sobre creatividad, aprendizaje, gratitud, calma, amistad y bondad.
  La lectura cambia cada día y el ciclo se repite después de 64 días.

Son palabras originales de autores humanos, seleccionadas de las ediciones
indicadas abajo. No se generan frases ni se reescriben con IA. La interfaz
muestra autor, obra y fuente. Los pasajes recortados se identifican como
fragmentos; se corrigen únicamente tildes obsoletas y espacios que parten
palabras en las transcripciones. No se unen pasajes separados para presentarlos
como si fueran un párrafo continuo del autor.

## Ediciones consultadas

- **José Martí**, *Granos de oro: pensamientos seleccionados en las obras de
  José Martí*, recopilación de Rafael G. Argilagos (1918):
  [Project Gutenberg, 43861](https://www.gutenberg.org/cache/epub/43861/pg43861-images.html).
  Se extraen pensamientos del cuerpo de la recopilación, sin utilizar el proemio.
- **Gustavo Adolfo Bécquer**, *Obras escogidas*, sección *Rimas*:
  [Project Gutenberg, 53552](https://www.gutenberg.org/cache/epub/53552/pg53552-images.html).
  Las hojas usan versos de las rimas I, IV, V, VII, XX, XXIII y LXVII.
- **Rosalía de Castro**, *En las orillas del Sar*, edición de 1909:
  [Project Gutenberg, 70984](https://www.gutenberg.org/cache/epub/70984/pg70984-images.html).
  Las hojas usan fragmentos de «Dicen que no hablan las plantas» y
  «Tiemblan las hojas», parte II.
- **Amado Nervo**, *Plenitud* (1919),
  [edición de Wikisource](https://es.wikisource.org/wiki/Plenitud).
  Cada cita enlaza el capítulo exacto:

| Capítulo | Título y fuente |
| --- | --- |
| I | [Dentro de ti está el secreto](https://es.wikisource.org/wiki/Plenitud/I_(Dentro_de_t%C3%AD_est%C3%A1_el_secreto)) |
| IV | [Enciende tu lámpara](https://es.wikisource.org/wiki/Plenitud/IV_(Enciende_tu_l%C3%A1mpara)) |
| VI | [Dar](https://es.wikisource.org/wiki/Plenitud/VI_(Dar)) |
| XV | [Yo no te digo…](https://es.wikisource.org/wiki/Plenitud/XV_(Yo_no_te_digo...)) |
| XXXIII | [Cuenta lo que posees](https://es.wikisource.org/wiki/Plenitud/XXXIII_(Cuenta_lo_que_posees)) |
| XXXVIII | [Facilita la vida de los otros](https://es.wikisource.org/wiki/Plenitud/XXXVIII_(Facilita_la_vida_de_los_otros)) |
| XLII | [Los pasos](https://es.wikisource.org/wiki/Plenitud/XLII_(Los_pasos)) |
| XLVI | [Levántate a conquistar](https://es.wikisource.org/wiki/Plenitud/XLVI_(Levantate_a_conquistar)) |
| XLIX | [Todo está haciéndose](https://es.wikisource.org/wiki/Plenitud/XLIX_(Todo_est%C3%A1_haci%C3%A9ndose)) |
| LXI | [Alégrate](https://es.wikisource.org/wiki/Plenitud/LXI_(Al%C3%A9grate)) |

Se incorporan únicamente textos literarios originales de dominio público,
sin notas editoriales ni materiales adicionales de las plataformas. Las
ediciones digitales contienen sus respectivos avisos en los enlaces.

## Funcionamiento

La fecha se calcula con el calendario del dispositivo: recargar durante el
mismo día conserva las tres frases y la lectura. Las lecturas se renuevan a
medianoche o al regresar a la app; las hojas se seleccionan cada vez que se
abre la presentación. Todo el catálogo reside en `src/writer-quotes.js` y
funciona sin conexión con la PWA. Leer las obras completas requiere conexión.

Cada hoja permanece 3,2 segundos. La presentación puede saltarse con el botón
o Escape y el temporizador sigue corriendo durante ella.
