import { fromEvent } from 'rxjs';
import Tone from 'tone';

import createNote from './sound.js';

const synth = new Tone.Synth().toMaster();
const monoSynth = new Tone.MonoSynth({
  "oscillator" : {
    "type" : "square8"
  },
  "envelope" : {
    "attack" : 0.05,
    "decay" : 0.3,
    "sustain" : 0.4,
    "release" : 0.8,
  },
  "filterEnvelope" : {
    "attack" : 0.001,
    "decay" : 0.7,
    "sustain" : 0.1,
    "release" : 0.8,
    "baseFrequency" : 300,
    "octaves" : 4
  }
}).toMaster();
const clickObservable = fromEvent(document, 'click');
let score = 0;

function updateScore() {
  score += 1;
  document.querySelector('#score').innerHTML = score;
}

function handleClick(click) {
  const clickedDot = click.target.getAttribute('class') === 'dot';
  const note = createNote(click.clientX * click.clientY);
  if (clickedDot) {
    updateScore();
    monoSynth.triggerAttackRelease(...note);
  } else {
    synth.triggerAttackRelease(...note);
  }
}

clickObservable.subscribe((click) => {
  handleClick(click)
});
