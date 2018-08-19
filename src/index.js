import { fromEvent, of, timer } from 'rxjs';
import { map, concatMap, throttleTime, repeat } from 'rxjs/operators';
import Tone from 'tone';
import randomColor from 'randomcolor';

import './main.css';
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

const clickObservable = fromEvent(document, 'click')
  .pipe(map(click => click.clientX * click.clientY))
  .pipe(throttleTime(500))

clickObservable.subscribe((val) => {
  const note = createNote(val);
  synth.triggerAttackRelease(...note);
});

const dotObservable = of(null)
.pipe(concatMap(() => timer(Math.random() * 1500)))
.pipe(repeat());

const minXY = 20;
const maxX = window.innerWidth;
const maxY = window.innerHeight;

function createCoordinates() {
  const x = Math.floor(Math.random() * (maxX - minXY)) + minXY;
  const y = Math.floor(Math.random() * (maxY - minXY)) + minXY;
  return [x, y];
}

function createDot(x, y) {
  const dot = document.createElement('div');
  dot.setAttribute('class', 'dot');
  dot.setAttribute('style', `background:${randomColor()};top:${y};left:${x}`);
  setTimeout(() => {
    dot.remove();
  }, 1500);
  return dot;
}

dotObservable.subscribe((val) => {
  const [x, y] = createCoordinates();
  const dot = createDot(x, y);
  document.body.insertAdjacentElement('afterbegin', dot);
  console.log(dot);
});
