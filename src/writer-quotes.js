// Human-authored public-domain texts. Editions and excerpt policy: LITERATURE.md.
const MARTI_SOURCE = 'https://www.gutenberg.org/cache/epub/43861/pg43861-images.html';
const BECQUER_SOURCE = 'https://www.gutenberg.org/cache/epub/53552/pg53552-images.html';
const ROSALIA_SOURCE = 'https://www.gutenberg.org/cache/epub/70984/pg70984-images.html';
const marti = (text) => ({ text, author: 'José Martí', work: 'Granos de oro · pensamiento', source: MARTI_SOURCE });
const becquer = (text, rima) => ({ text, author: 'Gustavo Adolfo Bécquer', work: `Rima ${rima} · fragmento`, source: BECQUER_SOURCE });
const rosalia = (text, poem) => ({ text, author: 'Rosalía de Castro', work: `En las orillas del Sar · ${poem} · fragmento`, source: ROSALIA_SOURCE });
const CHAPTERS = {
  secret: ['Dentro de ti está el secreto', 'I_(Dentro_de_t%C3%AD_est%C3%A1_el_secreto)'],
  lamp: ['Enciende tu lámpara', 'IV_(Enciende_tu_l%C3%A1mpara)'],
  give: ['Dar', 'VI_(Dar)'],
  love: ['Yo no te digo...', 'XV_(Yo_no_te_digo...)'],
  gratitude: ['Cuenta lo que posees', 'XXXIII_(Cuenta_lo_que_posees)'],
  help: ['Facilita la vida de los otros', 'XXXVIII_(Facilita_la_vida_de_los_otros)'],
  steps: ['Los pasos', 'XLII_(Los_pasos)'],
  kindness: ['Levántate a conquistar', 'XLVI_(Levantate_a_conquistar)'],
  calm: ['Todo está haciéndose', 'XLIX_(Todo_est%C3%A1_haci%C3%A9ndose)'],
  surprise: ['Alégrate', 'LXI_(Al%C3%A9grate)'],
};
const nervo = (text, chapter) => ({
  text, author: 'Amado Nervo', work: `Plenitud · ${CHAPTERS[chapter][0]} · fragmento`,
  source: `https://es.wikisource.org/wiki/Plenitud/${CHAPTERS[chapter][1]}`,
});

const MARTI_SHORT = [
  'Todo está dicho ya; pero las cosas, cada vez que son sinceras, son nuevas.',
  'Dígase la verdad que se siente, con el mayor arte con que se pueda decirla.',
  'El primer trabajo del hombre es reconquistarse.',
  'En toda palabra ha de ir envuelto un acto.',
  'Pensar es abrir surcos, levantar cimientos y dar el santo y seña de los corazones.',
  'No hay más que una gloria cierta, y es la del alma que está contenta de sí.',
  'El egoísmo es la mancha del mundo, y el desinterés su sol.',
  'Reproducir no es crear, y crear es el deber del hombre.',
  'Con la imaginación se ven cosas que no se pueden ver con los ojos.',
  'Tener talento es tener buen corazón.',
  'Los buenos son los que ganan a la larga.',
  'El ser bueno da gusto y lo hace a uno fuerte y feliz.',
  'Agradecer es un gusto.',
  'Embellecer la vida es darle objeto.',
  'Sentirse amado fortalece y endulza.',
  'Honrar, honra.',
  'No hay como vivir para aprender a tener compasión de los que viven.',
  'Amar no es más que el modo de crecer.',
  'Amado será el que ama.',
  'Merecer la confianza no es más que el deber de continuar mereciéndola.',
  'El deber debe cumplirse sencilla y naturalmente.',
  'Sólo lo genuino es fructífero.',
  'Sólo lo directo es poderoso.',
  'Todo se afina, se purifica y crece.',
  'Para rendir tributo ninguna voz es débil.',
  'El que saca de sí lo que otro sacó de sí antes que él, es tan original como el otro.',
  'La fuerza del genio no se acaba con la juventud.',
  'La educación empieza con la vida, y no acaba sino con la muerte.',
  'La mente cambia sin cesar, y se enriquece y perfecciona con los años.',
  'Todo hombre tiene el deber de cultivar su inteligencia, por respeto a sí propio y al mundo.',
  'Las cosas buenas se deben hacer sin llamar al universo para que lo vea a uno pasar.',
  'Se hacen versos de la grandeza, pero sólo del sentimiento se hace poesía.',
  'Leer una buena revista es como leer decenas de buenos libros.',
  'Se siente correr por las venas una savia nueva cuando se contempla una nueva obra de arte.',
  'La vida es una agrupación lenta y un encadenamiento maravilloso.',
  'Los pueblos no se unen sino con lazos de amistad, de fraternidad y de amor.',
  'La instrucción, abriendo a los hombres vastos caminos desconocidos, les inspira el deseo de entrar por ellos.',
  'En poesía, como en pintura, se ha de trabajar con el modelo.',
  'Crear es la palabra de pase de esta generación.',
  'El que anda, vence.',
  'Lo real es lo que importa, no lo aparente.',
  'Para hacer poesía hermosa, no hay como volver los ojos fuera: a la Naturaleza; y dentro: al alma.',
  'No hay en la tierra más vía honrada que la que uno se abre con sus propios brazos.',
  'Saber leer es saber andar. Saber escribir es saber ascender.',
  'La educación es como un árbol: se siembra una semilla y se abre en muchas ramas.',
  'Los ojos de los hombres, una vez abiertos no se cierran.',
  'La paz es el deseo secreto de los corazones y el estado natural del hombre.',
  'El amor es el lazo de los hombres, el modo de enseñar y el centro del mundo.',
  'La vida es un himno.',
  'Un grano de poesía sazona un siglo.',
  'La alegría viene de la gente llana.',
  'Una gran montaña parece menor cuando está rodeada de colinas.',
  'Es más propio del hombre, aunque no lo parezca, el derramar consuelos que el recibirlos.',
  'Sin emoción se puede ser escultor en verso, o pintor en verso; pero no poeta.',
  'Es doble manera de hacer el bien, dar pan al cuerpo y darlo al alma.',
  'Una escuela es una fragua de espíritus.',
  'La dignidad nunca muere.',
  'No ha de temerse la sinceridad; sólo es tremendo lo oculto.',
  'La actividad es el símbolo de la juventud.',
  'Sólo para hacer el bien la fuerza es justa.',
];

const NERVO_SHORT = [
  nervo('Dentro de ti está el secreto.', 'secret'),
  nervo('Busca dentro de ti la solución de todos los problemas, hasta de aquellos que creas más exteriores y materiales.', 'secret'),
  nervo('Dentro de ti está siempre el secreto; dentro de ti están todos los secretos.', 'secret'),
  nervo('Dentro de ti hay tendidos ya todos los puentes.', 'secret'),
  nervo('Todas las arquitecturas están ya levantadas dentro de ti.', 'secret'),
  nervo('Pregunta al arquitecto escondido: él te dará sus fórmulas.', 'secret'),
  nervo('entra en tu interior y pregunta....', 'secret'),
  nervo('Y acertarás constantemente, pues que dentro de ti llevas la luz misteriosa de todos los secretos.', 'secret'),
  nervo('En cuanto caiga la noche, enciende tu lámpara.', 'lamp'),
  nervo('No permanezcas en la obscuridad.', 'lamp'),
  nervo('Enciende cuidadosamente tu lámpara.', 'lamp'),
  nervo('Muchos, al internarse en la selva, se sentirán confortados por tu luz.', 'lamp'),
  nervo('Bella tarea es aquella que facilita la vida de los otros.', 'help'),
  nervo('Gentil acto es aquel que facilita la vida de los otros.', 'help'),
  nervo('Cantando va el peregrino.', 'help'),
  nervo('¡tú puedes DAR!', 'give'),
  nervo('aunque sea una sonrisa, aunque sea un apretón de manos, aunque sea una palabra de aliento!', 'give'),
  nervo('Deja en cada una de las que encuentres una huella de luz.', 'kindness'),
  nervo('Lo imprevisto constituye la nobleza de la vida.', 'surprise'),
  nervo('No ves nunca nada en su totalidad.', 'calm'),
];

const VERSE_SHORT = [
  becquer('Mientras haya en el mundo primavera,\n¡Habrá poesía!', 'IV'),
  becquer('Podrá no haber poetas; pero siempre\nHabrá poesía.', 'IV'),
  becquer('Que el alma que hablar puede con los ojos,\nTambién puede besar con la mirada.', 'XX'),
  becquer('Por una mirada, un mundo;\nPor una sonrisa, un cielo;', 'XXIII'),
  becquer('¡Qué hermoso es ver el día\nCoronado de fuego levantarse,', 'LXVII'),
  becquer('Yo soy de la alta luna\nLa luz tibia y serena.', 'V'),
  becquer('¡Cuánta nota dormía en sus cuerdas,\nComo el pájaro duerme en las ramas,', 'VII'),
  becquer('Con palabras que fuesen a un tiempo\nSuspiros y risas, colores y notas.', 'I'),
  rosalia('Astros y fuentes y flores, no murmuréis de mis sueños;\nSin ellos, ¿cómo admiraros, ni cómo vivir sin ellos?', 'Dicen que no hablan las plantas'),
  rosalia('Cuando te apene lo que atrás dejas,\nRecuerda siempre\nQue es más dichoso quien de la vida\nMayor espacio corrido tiene.', 'Tiemblan las hojas, II'),
];

// Interleave the authors so the three pages have a varied daily selection.
const martiQuotes = MARTI_SHORT.map(marti);
export const WRITER_ENTRY_QUOTES = martiQuotes.flatMap((quote, index) => [
  quote, ...(NERVO_SHORT[index] ? [NERVO_SHORT[index]] : []), ...(VERSE_SHORT[index] ? [VERSE_SHORT[index]] : []),
]);

const NERVO_READINGS = [
  nervo('Busca dentro de ti la solución de todos los problemas, hasta de aquellos que creas más exteriores y materiales.\n\nDentro de ti está siempre el secreto; dentro de ti están todos los secretos.', 'secret'),
  nervo('Antes de ir a buscar el hacha de más filo, la piqueta más dura, la pala más resistente, entra en tu interior y pregunta....', 'secret'),
  nervo('En cuanto caiga la noche, enciende tu lámpara.\nNo permanezcas en la obscuridad.\nEnciende cuidadosamente tu lámpara.\nEl viajero que pase, dirá: "cuánto reposo debe haber cerca de esa luz, y cuánta paz".', 'lamp'),
  nervo('¡En cuantas horas tiene el día, tú das, aunque sea una sonrisa, aunque sea un apretón de manos, aunque sea una palabra de aliento!', 'give'),
  nervo('Bella tarea es aquella que facilita la vida de los otros.\nGentil acto es aquel que facilita la vida de los otros.', 'help'),
  nervo('Cantando va el peregrino.\n\nSin sentir recorre las rutas, y al atardecer se da cuenta, con jubilosa sorpresa, de que al apartar y remover los obstáculos que entorpecían los caminos de los otros, él despejó maravillosamente su propio camino.', 'help'),
  nervo('No enumeres jamás en tu imaginación lo que te falta. Cuenta, por el contrario, todo lo que posees: detállalo si es preciso hasta con nimiedad, y verás que, en suma, la Vida ha sido espléndida contigo.', 'gratitude'),
  nervo('Las cosas bellas se adueñan tan suavemente de nosotros, y nosotros con tal blandura entramos en su paraíso, que casi no advertimos su presencia. De allí que nunca les hagamos la justicia que merecen.', 'gratitude'),
  nervo('Es, por tanto, absurdo temer algo que todavía no sucede, que ignoras si sucederá y cómo sucederá.', 'calm'),
  nervo('La serenidad ante los sucesos es, por lo tanto, la más natural, la más congruente, la más humana actitud del hombre.', 'calm'),
  nervo('Y acertarás constantemente, pues que dentro de ti llevas la luz misteriosa de todos los secretos.', 'secret'),
  nervo('A unos los conquistarás con tus palabras amables, a otros con tus miradas afectuosas, a los de más allá con tus servicios.', 'kindness'),
  nervo('Además de la íntima alegría de estas conquistas, podrás, merced a los que te quieren, hacer mucho bien.', 'kindness'),
  nervo('El hombre que tiene amigos es todopoderoso para la caridad. Lo que él no puede dar, por amor a él lo darán con placer los otros; lo que él no puede hacer, por amor a él otros lo harán sonriendo.', 'kindness'),
  nervo('Yo no te digo que el amor no haga daño: lo que te digo es que estoy resuelto a amar mientras viva, amar siempre, siempre... Siempre.', 'love'),
  nervo('Son los pasos de la Dicha.\nSon los pasos de una dicha modesta, tímida, discreta, que desearía entrar.\nHay muchas dichas así.', 'steps'),
];

// Plain prose and complete thoughts, selected for an easy daily reading.
export const WRITER_READINGS = [
  ...NERVO_READINGS,
  ...martiQuotes.filter((quote) => quote.text.split(/\s+/).length >= 8),
  marti('Los hombres no pueden ser más perfectos que el sol. El sol quema con la misma luz con que calienta. El sol tiene manchas. Los desagradecidos no hablan más que de las manchas. Los agradecidos hablan de la luz.'),
  marti('Los hombres deben aprenderlo todo por sí mismos, y no creer sin preguntar, ni hablar sin entender, ni pensar como esclavos lo que les mandan pensar otros.'),
  marti('Se es bueno porque sí; y porque allá dentro se siente como un gusto cuando se ha hecho un bien, o se ha dicho algo útil a los demás.'),
  marti('Un libro, aunque sea de mente ajena, parece cosa como nacida de uno mismo, y se siente uno como mejorado y agrandado con cada libro nuevo.'),
  marti('Lo que hace crecer el mundo no es el descubrir cómo está hecho, sino el esfuerzo de cada uno para descubrirlo.'),
  marti('Lo que importa en poesía es sentir, parézcase o no a lo que haya sentido otro; y lo que se siente nuevamente, es nuevo.'),
];

function localDay(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}
const wrap = (index, length) => ((index % length) + length) % length;

export function getDailyWriterQuote(date = new Date()) {
  return WRITER_READINGS[wrap(localDay(date), WRITER_READINGS.length)];
}

export function getDailyWriterEntrance(date = new Date()) {
  const first = wrap(localDay(date) * 3, WRITER_ENTRY_QUOTES.length);
  return Array.from({ length: 3 }, (_, index) => WRITER_ENTRY_QUOTES[wrap(first + index, WRITER_ENTRY_QUOTES.length)]);
}
