// Motivational excerpts about perseverance, discipline, confidence, and pursuing dreams. Translations are identified in the visible source label.
const quote = (text, author, source, translated = false) => ({
  text, author, source, work: translated ? 'Fragmento · traducción al español' : 'Fragmento · fuente original',
});
const ilia = (text, source, translated = false) => quote(text, 'Ilia Topuria', source, translated);
const sources = {
  topuriaTVE: 'https://www.rtve.es/deportes/20240404/entrevista-ilia-topuria-tve/16045081.shtml',
  topuriaTraining: 'https://www.antena3.com/noticias/deportes/ilia-topuria-desvela-antena-3-sus-secretos-ser-invencible_2025032767e572de8ba0d30001ffbf5d.html',
  topuriaMind: 'https://www.antena3.com/programas/el-hormiguero/entrevista/ilia-topuria-motivacion-filosofia-vida-miedo-poder-ver-mejor-version_20231009652462ee90d39d00010c1cf9.html',
  topuriaDream: 'https://www.antena3internacional.com/programas/el-hormiguero/noticias/ilia-topuria-en-el-hormiguero-30-me-tengo-que-exigir-todo-el-tiempo-porque-el-premio-es-mi-sueno_2024022765ddc3bb344c980001c30123.html',
  topuriaPreparation: 'https://www.antena3internacional.com/programas/el-hormiguero/noticias/ilia-topuria-vuelve-a-el-hormiguero-tras-su-victoria-contra-max-holloway-si-nadie-lo-ha-hecho-yo-sere-el-primero-en-hacerlo_2024111567374b6fb747ad00018361ae.html',
  topuriaStart: 'https://www.antena3.com/noticias/deportes/le-comparan-con-mcgregor_202012125fd4e847d4aa1e00012b47a5.html',
  topuriaSER: 'https://cadenaser.com/cataluna/2024/09/20/ilia-topuria-yo-respeto-a-todos-mis-rivales-como-profesionales-pero-yo-estoy-luchando-por-mis-suenos-sercat/',
  topuriaDirection: 'https://www.telecinco.es/noticias/deportes/20240228/ilia-topuria-influencia-campeon-ufc_18_011820061.html',
  federer: 'https://home.dartmouth.edu/news/2024/06/2024-commencement-address-roger-federer',
  serena: 'https://www.wtatennis.com/news/1447037/im-a-fighter-i-never-give-up-serena-quells-teen-juvan-at-wimbledon',
  nadal: 'https://www.rtve.es/deportes/20130920/nadal-gusta-ganar-con-esfuerzo/748368.shtml',
  nadalSpeech: 'https://comunicacion.usal.es/filessp/Doctorado_honoris_causa_a_Rafael_Nadal.pdf',
  kipchogeLimits: 'https://worldathletics.org/competitions/awards/news/eliud-kipchoge-athlete-of-year-2019',
  rudisha: 'https://worldathletics.org/spikes/news/david-rudishas-words-of-wisdom',
  phillips: 'https://worldathletics.org/spikes/news/dwight-phillips-words-of-wisdom',
  alcaraz: 'https://www.rolandgarros.com/en-us/article/rg2025-carlos-alcaraz-2024-champion-interview-magazine-career-ambition',
  coventry: 'https://newsroom.olympics.com/record/3169/media_id/6799',
};

const TOPURIA_QUOTES = [
  ilia('Tienes que seguir porque el premio es tu sueño.', sources.topuriaDream),
  ilia('Siempre he creído en mí y he estado preparado para lo que pudiera pasar en el camino.', sources.topuriaTVE),
  ilia('Entreno mis pensamientos de no darme por vencido en ningún momento de mi vida.', sources.topuriaTraining),
  ilia('He preparado mi cuerpo y mi mente para ser el maestro de mi destino.', sources.topuriaMind),
  ilia('Si nadie lo ha hecho, seré el primero en hacerlo.', sources.topuriaPreparation),
  ilia('La única forma de vencer el miedo es a través de la preparación.', sources.topuriaPreparation),
  ilia('Cada sacrificio tiene su recompensa.', sources.topuriaStart),
  ilia('Con el trabajo todo se puede conseguir en la vida.', sources.topuriaSER, true),
  ilia('Da igual de dónde vengas si sabes hacia dónde vas.', sources.topuriaDirection),
];

const OTHER_ATHLETES = [
  quote('No llegué adonde llegué solo por mi talento. Llegué intentando trabajar más que mis oponentes.', 'Roger Federer', sources.federer, true),
  quote('Soy una luchadora y nunca me rindo.', 'Serena Williams', sources.serena, true),
  quote('Hay que esforzarse día a día y levantarse con actitud positiva para cambiar la situación.', 'Rafael Nadal', sources.nadal),
  quote('Nada se consigue sin esfuerzo diario.', 'Rafael Nadal', sources.nadalSpeech),
  quote('Ningún ser humano está limitado.', 'Eliud Kipchoge', sources.kipchogeLimits, true),
  quote('Para triunfar, todo se basa en trabajo duro, disciplina y determinación.', 'David Rudisha', sources.rudisha, true),
  quote('El trabajo duro vence al talento cuando el talento no trabaja duro.', 'Dwight Phillips', sources.phillips, true),
  quote('Hay que tener talento, obviamente, pero no te lleva a ninguna parte si no trabajas.', 'Carlos Alcaraz', sources.alcaraz, true),
  quote('Siempre aprender, siempre mejorar, nunca quedarse quieto.', 'Kirsty Coventry', sources.coventry, true),
];

// Spread Topuria's excerpts throughout the rotation instead of grouping one author.
export const ATHLETE_QUOTES = OTHER_ATHLETES.flatMap((entry, index) => [
  ...(TOPURIA_QUOTES[index] ? [TOPURIA_QUOTES[index]] : []), entry,
]);
