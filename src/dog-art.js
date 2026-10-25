// Original tricolour basset hound: long back, short legs and hanging ears.
export const DOG_ART = `
  <span class="dog-bubble"></span>
  <span class="dog-dream" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span>
  <svg class="dog-sprite" viewBox="0 0 48 32" aria-hidden="true" shape-rendering="crispEdges">
    <ellipse cx="25" cy="30" rx="20" ry="1" fill="#000" opacity=".16"/>
    <g class="dog-awake">
      <g class="dog-tail"><path fill="#8d512f" d="M9 21H5v-4H3v-6h3v5h3z"/><path fill="#f7ead2" d="M3 9h3v5H3z"/></g>
      <g class="dog-body">
        <path fill="#f7ead2" d="M10 15h24v3h3v9H8v-9h2z"/>
        <path fill="#34302c" d="M12 15h17v3h3v5H13v-2h-3v-4h2z"/>
        <path fill="#ad6b3b" d="M8 20h7v7H8zM30 21h7v6h-7z"/>
        <g class="dog-back-leg"><path fill="#f7ead2" d="M10 25h5v5H8v-2h2z"/><path fill="#ad6b3b" d="M10 25h5v2h-5z"/></g>
        <g class="dog-front-leg"><path fill="#f7ead2" d="M29 24h5v4h3v2h-8z"/></g>
      </g>
      <g class="dog-squat">
        <path class="dog-squat-tail" fill="#8d512f" d="M10 21H7v-6H5V9h3v5h3v4h2v4z"/>
        <path fill="#f7ead2" d="M5 6h3v5H5z"/>
        <g class="dog-squat-body">
          <path fill="#f7ead2" d="M12 13h9v2h6v3h6v5h-2v4H16v-2h-5v-3H8v-5h4z"/>
          <path fill="#34302c" d="M13 13h8v2h6v3h4v4H18v-2h-6v-4h1z"/>
          <path fill="#ad6b3b" d="M9 20h7v3h3v5h-6v-2H9z"/>
          <path fill="#f7ead2" d="M13 26h6v2h3v2h-9z"/>
          <path fill="#b97541" d="M28 23h5v5h3v2h-7v-3h-1z"/>
          <path fill="#f7ead2" d="M29 28h7v2h-7z"/>
          <path fill="#8d512f" d="M13 24h3v2h-3z"/>
        </g>
      </g>
      <g class="dog-wave-paw"><path fill="#ad6b3b" d="M30 22h4v-7h4v3h-2v8h-6z"/><path fill="#f7ead2" d="M34 12h5v5h-5z"/></g>
      <g class="dog-toy"><path fill="#ed8b44" d="M38 27h6v4h-6z"/><path fill="#ffe285" d="M38 27h3v2h-3z"/></g>
      <g class="dog-head">
        <path fill="#b97541" d="M32 7h9v2h3v11h-2v4H31v-3h-3V11h4z"/>
        <path fill="#f7ead2" d="M37 7h3v9h-3zM36 16h10v8H34v-3h-2v-3h4z"/>
        <path fill="#e0b07a" d="M34 10h3v4h-3z"/>
        <g class="dog-ear"><path fill="#754329" d="M29 9h6v17h-2v2h-4v-3h-2V12h2z"/><path fill="#965631" d="M29 12h3v13h-3z"/></g>
        <path fill="#30281f" d="M43 15h5v4h-5z"/><path class="dog-eye" fill="#30281f" d="M39 11h2v3h-2z"/>
        <path fill="#8d512f" d="M38 14h4v1h-4z"/>
        <g class="dog-jaw"><path fill="#e1caaa" d="M36 23h9v2h-9z"/><path class="dog-tongue" fill="#e89594" d="M39 24h3v3h-3z"/></g>
        <g class="dog-carried-toy" transform="translate(37 22) scale(.28)"></g>
        <path class="dog-lick-tongue" fill="#e89594" d="M42 20h3v4h-2v-1h-1z"/>
        <path fill="#b84239" d="M31 23h5v3h-5z"/><path fill="#efce76" d="M34 26h2v2h-2z"/>
      </g>
    </g>
    <g class="dog-asleep">
      <path fill="#f7ead2" d="M10 21h24v7H7v-4h3zM12 27h32v3H12z"/>
      <path fill="#34302c" d="M12 20h17v5H10v-3h2z"/>
      <path fill="#ad6b3b" d="M6 24h7v4H6zM32 18h10v3h3v6H30v-6h2z"/>
      <path fill="#f7ead2" d="M38 22h9v6h-9z"/>
      <path fill="#754329" d="M29 20h6v9h-6z"/>
      <path fill="#30281f" d="M44 22h4v3h-4zM38 20h4v1h-4z"/>
    </g>
  </svg><span class="dog-name">Max</span>`;

export const BOWL_ART = `<svg viewBox="0 0 44 36" aria-hidden="true" shape-rendering="crispEdges"><g class="max-kibble" fill="#aa6838"><path d="M9 12h6v5H9zM18 10h6v7h-6zM28 12h6v6h-6z"/><path fill="#d5a15e" d="M14 13h5v5h-5zM24 12h5v6h-5z"/></g><path fill="#7b9b9b" d="M5 17h34l-4 12H9z"/><path fill="#a6c2bc" d="M4 17h36v4H4z"/><path fill="#446c71" d="M10 27h24v3H10z"/><path fill="#e5d8b8" d="M20 22h4v3h-4z"/></svg>`;
export const POOP_ART = `<svg viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges"><path fill="#75432a" d="M12 6h6v5h4v6h4v4h3v6H3v-6h4v-5h5z"/><path fill="#aa7145" d="M12 11h7v3h-7zM8 18h15v3H8zM5 24h21v2H5z"/></svg>`;

export const TOY_ART = {
  bone: `<svg viewBox="0 0 44 44" aria-hidden="true" shape-rendering="crispEdges"><path fill="#c9a66c" d="M9 10h7v5l13 10h6v10h-8v-4L14 21H8V11z"/><path fill="#f6e1af" d="M6 7h7v4h5v6l13 10h5v-4h6v7h-4v8h-7v-4h-5v-5L13 19H8v4H2v-7h4z"/></svg>`,
  bottle: `<svg viewBox="0 0 44 44" aria-hidden="true" shape-rendering="crispEdges"><path fill="#659cbb" d="M17 3h10v7H17z"/><path fill="#a4dbdf" d="M17 10h10v5l5 6v17H12V21l5-6z"/><path fill="#d3f4ed" d="M16 20h4v14h-4z"/><path fill="#638dba" d="M12 24h20v7H12z"/><path fill="#f4ead4" d="M18 25h9v5h-9z"/></svg>`,
};
