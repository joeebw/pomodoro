// Original excerpts accompany our Spanish translations for attribution review.
const fromBook = (author, title, source, entries) => entries.map(([text, original]) => ({
  text, author, original,
  source: `${source}#:~:text=${encodeURIComponent(original)}`,
  work: `${title} · traducción al español`,
}));

const allen = fromBook('James Allen', 'As a Man Thinketh', 'https://www.gutenberg.org/cache/epub/4507/pg4507-images.html', [
  ['Concibe un propósito legítimo en tu corazón y ponte a realizarlo.', 'A man should conceive of a legitimate purpose in his heart, and set out to accomplish it.'],
  ['Incluso si fallas una y otra vez, la fuerza de carácter que ganes será la medida de tu verdadero éxito.', 'Even if he fails again and again to accomplish his purpose (as he necessarily must until weakness is overcome), the strength of character gained will be the measure of his true success'],
  ['La fuerza solo se desarrolla mediante el esfuerzo y la práctica.', 'strength can only be developed by effort and practice'],
  ['La voluntad de hacer nace del conocimiento de que podemos hacerlo.', 'The will to do springs from the knowledge that we can do.'],
  ['Reconoce en el fracaso uno de los caminos hacia el logro.', 'only recognize failure as one of the pathways to attainment'],
  ['No puede haber progreso ni logro sin sacrificio.', 'There can be no progress, no achievement without sacrifice'],
  ['El logro, de cualquier clase, es la corona del esfuerzo.', 'Achievement, of whatever kind, is the crown of effort'],
  ['Quien quiera lograr mucho tendrá que sacrificar mucho.', 'he who would achieve much must sacrifice much'],
  ['Sueña grandes sueños y, conforme sueñes, así llegarás a ser.', 'Dream lofty dreams, and as you dream, so shall you become.'],
  ['El mayor logro fue, al principio y durante un tiempo, un sueño.', 'The greatest achievement was at first and for a time a dream.'],
  ['Llegarás a ser tan pequeño como el deseo que te domina y tan grande como tu mayor aspiración.', 'You will become as small as your controlling desire; as great as your dominant aspiration'],
  ['El autocontrol es fuerza; el pensamiento correcto es dominio; la calma es poder.', 'Self-control is strength; Right Thought is mastery; Calmness is power.'],
  ["Quien ha vencido la duda y el miedo ha vencido el fracaso.", "He who has conquered doubt and fear has conquered failure."],
  ["Desarrolla con tu propio esfuerzo la fuerza que admiras en otros.", "he must, by his own efforts, develop the strength which he admires in another."],
  ["Piensa con fuerza, atrévete sin miedo y alcanza tus metas con maestría.", "think strongly, attempt fearlessly, and accomplish masterfully"],
  ["Solo puedes elevarte, vencer y alcanzar tus metas elevando tus pensamientos.", "A man can only rise, conquer, and achieve by lifting up his thoughts."],
]);

const franklin = fromBook('Benjamin Franklin', 'The Way to Wealth', 'https://www.gutenberg.org/cache/epub/43855/pg43855-images.html', [
  ['¿Amas la vida? Entonces no malgastes el tiempo, porque de eso está hecha.', 'dost thou love life? then do not squander time, for that is the stuff life is made of'],
  ['El tiempo perdido nunca vuelve a encontrarse.', 'Lost time is never found again'],
  ['La diligencia es la madre de la buena suerte.', 'Diligence is the mother of good luck'],
  ['Un hoy vale por dos mañanas.', 'One to-day is worth two to-morrows'],
  ['Persiste con constancia y verás grandes efectos.', 'stick to it steadily, and you will see great effects'],
  ['Los pequeños golpes derriban grandes robles.', 'little strokes fell great oaks'],
]);

const keller = fromBook('Helen Keller', 'Optimism', 'https://www.gutenberg.org/files/31622/31622-h/31622-h.htm', [
  ['La oscuridad no puede encerrarme otra vez. He vislumbrado la orilla y puedo vivir con la esperanza de alcanzarla.', 'Darkness cannot shut me in again. I have had a glimpse of the shore, and can now live by the hope of reaching it.'],
  ['Aunque el mundo está lleno de sufrimiento, también está lleno de su superación.', 'although the world is full of suffering, it is full also of the overcoming of it'],
  ['Nunca podrán convencerme de perder la esperanza.', 'I never can be argued into hopelessness.'],
  ['El optimista cree, intenta y consigue.', 'Thus the optimist believes, attempts, achieves.'],
  ['El optimismo es la fe que conduce al logro; nada puede hacerse sin esperanza.', 'Optimism is the faith that leads to achievement; nothing can be done without hope.'],
  ['Cada alto en el progreso ha sido una pausa antes de un gran salto hacia delante.', 'Each halt in his progress has been but a pause before a mighty leap forward.'],
]);

const epictetus = fromBook('Epicteto', 'Enquiridión', 'https://www.gutenberg.org/files/45109/45109-h/45109-h.htm', [
  ['Si perseveras, quienes al principio se burlaban terminarán admirándote.', 'if you are persistent, those very persons who at first ridiculed will afterwards admire you'],
  ['Después de sopesarlo todo, si tu decisión se mantiene, entra en el combate.', 'When you have reckoned up all this, if your inclination still holds, set about the combat.'],
  ['Cuando sepas que algo debe hacerse, no temas hacerlo a la vista de todos, aunque te malinterpreten.', 'When you do anything from a clear judgment that it ought to be done, never shrink from being seen to do it, even though the world should misunderstand it'],
  ['No hables mucho de tus principios: muéstralos con tus acciones.', 'nor make much talk among the ignorant about your principles, but show them by actions'],
  ['¿Cuánto tiempo seguirás posponiendo exigirte tus mejores progresos?', 'How long, then, will you delay to demand of yourself the noblest improvements'],
  ['Recuerda que el combate es ahora; ahora comienzan los Juegos y no pueden aplazarse.', 'remember that now is the combat, now the Olympiad comes on, nor can it be put off'],
]);

const marcus = fromBook('Marco Aurelio', 'Meditaciones', 'https://www.gutenberg.org/cache/epub/2680/pg2680-images.html', [
  ['Lo que antes estaba en tu camino se convierte ahora en tu mejor camino.', 'that which before was in her way, is now her readiest way'],
  ['Si algo es posible y propio de un ser humano, piensa que también es posible para ti.', 'whatsoever in general thou canst Conceive possible and proper unto any man, think that very possible unto thee also'],
  ['Practica incluso las cosas que al principio crees que no podrás hacer.', 'Use thyself even unto those things that thou doest at first despair of.'],
  ['Si la razón y la justicia te llevan a hacerlo, hazlo aunque se opongan.', 'if reason and justice lead thee to it, do it, though they be never so much against it'],
]);

const emerson = fromBook('Ralph Waldo Emerson', 'Ensayos', 'https://www.gutenberg.org/cache/epub/16643/pg16643-images.html', [
  ['Confía en ti: cada corazón vibra con esa cuerda de hierro.', 'Trust thyself: every heart vibrates to that iron string.'],
  ['Haz tu trabajo y te fortalecerás.', 'Do your work, and you shall reinforce yourself.'],
  ['Nunca se logró nada grande sin entusiasmo.', 'Nothing great was ever achieved without enthusiasm.'],
  ['Haz la tarea y adquirirás la capacidad para hacerla.', 'Do the thing, and you shall have the power'],
  ['Insiste en ser tú mismo; nunca imites.', 'Insist on yourself; never imitate.'],
  ['Lo que debo hacer es lo que me importa, no lo que piense la gente.', 'What I must do is all that concerns me, not what the people think.'],
  ['Nadie conoce lo que eres capaz de hacer, ni siquiera tú, hasta que lo intentas.', 'none but he knows what that is which he can do, nor does he know until he has tried'],
  ["Al ejercitar la confianza en ti, aparecerán nuevas fuerzas.", "with the exercise of self-trust, new powers shall appear"],
  ["La vida se nos escapa mientras nos preparamos para vivir.", "Life wastes itself whilst we are preparing to live."],
  ["Enfréntate a lo que más temes: tu valor a menudo dejará tus miedos sin fundamento.", "Let him front the object of his worst apprehension, and his stoutness will commonly make his fears groundless."],
]);

const smiles = fromBook('Samuel Smiles', 'Self-Help', 'https://www.gutenberg.org/cache/epub/935/pg935-images.html', [
  ['Los grandes resultados no llegan de golpe: avancemos en la vida como al caminar, paso a paso.', 'Great results cannot be achieved at once; and we must be satisfied to advance in life as we walk, step by step.'],
  ['Toda gran obra es el resultado de una extensa preparación.', 'Every great work is the result of vast preparatory training.'],
  ['Nada parece fácil, ni siquiera caminar, que no haya sido difícil al principio.', 'Nothing seems easy, not even walking, that was not difficult at first.'],
  ['Para triunfar importa más el propósito que el talento: la voluntad de trabajar con energía y perseverancia.', 'It is not eminent talent that is required to ensure success in any pursuit, so much as purpose,—not merely the power to achieve, but the will to labour energetically and perseveringly.'],
  ['Unos minutos al día, bien empleados, pueden lograr muchísimo.', 'a few minutes a day, well employed, can effect a great deal'],
  ["Un intento enérgico vale más que mil aspiraciones.", "one energetic attempt is worth a thousand aspirations"],
  ["Nos forja el esfuerzo, no la comodidad; la dificultad, no la facilidad.", "It is not ease, but effort—not facility, but difficulty, that makes men."],
  ["Las dificultades suelen desvanecerse ante la determinación de superarlas.", "Thus difficulties often fall away of themselves before the determination to overcome them."],
  ["El camino al éxito puede ser empinado y pone a prueba las fuerzas de quien quiere llegar a la cima.", "The road to success may be steep to climb, and it puts to the proof the energies of him who would reach the summit."],
  ["La fuerza y la fortaleza llegan con el esfuerzo repetido.", "strength and fortitude with repeated effort"],
  ["Si no hubiera nada por lo que luchar, no habría nada que conquistar.", "if there were nothing to struggle for, there would be nothing to be achieved."],
  ["Quien nunca cometió un error probablemente nunca hizo un descubrimiento.", "probably he who never made a mistake never made a discovery."],
]);

const marden = fromBook('Orison Swett Marden', 'Pushing to the Front', 'https://www.gutenberg.org/cache/epub/21291/pg21291-images.html', [
  ['Si la oportunidad no viene a ti, créala.', 'If the chance does not come to you, make it.'],
  ['No esperes hasta estar mejor preparado: nunca lo estarás.', 'Do not wait until you are better prepared. You never will be.'],
  ['Dirige tu mente hacia tu meta y mantenla allí con firmeza y persistencia.', 'Force your mind toward your goal; hold it there steadily, persistently'],
  ['Lo que deseamos y perseguimos con toda nuestra fuerza suele acercarse, aunque no lo alcancemos por completo.', 'what we long for and strive for with all our strength, we usually approximate, if we do not fully reach'],
  ['No te quedes al fondo: da un paso al frente.', 'Do not remain way back on the back seat. Go up front.'],
  ["Superar una barrera nos da más capacidad para superar la siguiente.", "To overcome one barrier gives us greater ability to overcome the next."],
  ["Las circunstancias adversas crean fuerza.", "Opposing circumstances create strength."],
  ["El genio se lanza, vacila y se cansa; la perseverancia resiste y vence.", "Genius darts, flutters, and tires; but perseverance wears and wins."],
  ["El espíritu de nuestras conquistas entra en nosotros y nos ayuda a ganar la siguiente victoria.", "So the spirit of our conquests enters us, and helps us to win the next victory."],
  ["No importa si te llaman visionario, excéntrico o soñador: debes creer en ti.", "No matter if they call you a visionary, a crank, or a dreamer; you must believe in yourself."],
  ["Nunca permitas que nadie ni ninguna desgracia sacudan tu confianza en ti.", "Never allow anybody or any misfortune to shake your belief in yourself."],
  ["Si aspiras a hacer grandes cosas, traza un gran plan para ti y asume el papel que exige.", "If you are ambitious to do big things, you must make a large program for yourself, and assume the part it demands."],
  ["Tus logros nunca llegarán más alto que tu confianza en ti.", "Your achievement will never rise higher than your self-faith."],
  ["Cuando intentamos con todas nuestras fuerzas dar lo mejor, todo nuestro ser mejora.", "When we are trying with all our might to do our level best, our whole nature improves."],
  ["El valor que nace de la confianza en ti saca hasta la última reserva de tus fuerzas.", "Courage, born of self-confidence, is the prod which brings out the last ounce of reserve force."],
  ["El miedo, la duda y la timidez deben salir de tu mente.", "Fear, doubt, and timidity must be turned out of your mind."],
  ["La lucha constante por triunfar, a pesar de todas las barreras, es el precio de los grandes logros.", "A constant struggle, a ceaseless battle to win success in spite of every barrier, is the price of all great achievements."],
  ["No llegarás a ser un gigante si solo esperas cosas pequeñas de ti.", "You will never become a giant if you only make a pygmy's claim for yourself; if you only expect small things of yourself."],
]);

const roosevelt = fromBook('Theodore Roosevelt', 'The Strenuous Life', 'https://www.gutenberg.org/files/58821/58821-h/58821-h.htm', [
  ['Es duro fracasar, pero es peor no haber intentado nunca triunfar.', 'It is hard to fail, but it is worse never to have tried to succeed.'],
  ['En esta vida no conseguimos nada sin esfuerzo.', 'In this life we get nothing save by effort.'],
  ['Es mucho mejor atreverse a grandes cosas y ganar triunfos gloriosos, aunque estén salpicados de fracasos.', 'Far better it is to dare mighty things, to win glorious triumphs, even though checkered by failure'],
  ['No evitemos las dificultades: aprendamos a superarlas.', 'endeavor, not to shirk difficulties, but to overcome them'],
]);

export const CLASSIC_QUOTES = [
  ...allen, ...franklin, ...keller, ...epictetus, ...marcus, ...emerson, ...smiles, ...marden, ...roosevelt,
];
