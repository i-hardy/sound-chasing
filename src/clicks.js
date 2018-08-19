import { fromEvent } from 'rxjs';
import { map, scan, throttleTime } from 'rxjs/operators';
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

function updateScore(score) {
  document.querySelector('#score').innerHTML = score;
}

function handleClick(click) {
  const clickedDot = click.target.getAttribute('class') === 'dot';
  const note = createNote(click.clientX * click.clientY);
  if (clickedDot) {
    monoSynth.triggerAttackRelease(...note);
    return 1;
  }
  synth.triggerAttackRelease(...note);
  return 0;
}

fromEvent(document, 'click')
  .pipe(throttleTime(250))
  .pipe(map(click => handleClick(click)))
  .pipe(scan((acc, curr) => acc + curr, 0))
  .subscribe(sum => {
    updateScore(sum)
  });
