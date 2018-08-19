import { fromEvent, of, timer, zip } from 'rxjs';
import { map, last, concatMap, throttleTime, repeat } from 'rxjs/operators';
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

const dots = [];

let score = 0;

const clickObservable = fromEvent(document, 'click')
  .pipe(map((click) => { return [click.clientX, click.clientY] }))
  // .pipe(throttleTime(500));

const minXY = 20;
const maxX = window.innerWidth;
const maxY = window.innerHeight;

function createCoordinates() {
  const x = Math.floor(Math.random() * (maxX - minXY)) + minXY;
  const y = Math.floor(Math.random() * (maxY - minXY)) + minXY;
  return [x, y];
}

const dotObservable = of(null)
  .pipe(concatMap(() => timer(Math.random() * 1500)))
  .pipe(repeat())
  .pipe(map(() => createCoordinates()));

function createDot(x, y) {
  const dot = document.createElement('div');
  dot.setAttribute('class', 'dot');
  dot.setAttribute('style', `background:${randomColor()};top:${y};left:${x}`);
  setTimeout(() => {
    dot.remove();
    dots.shift();
  }, 1500);
  return dot;
}

dotObservable.subscribe((coords) => {
  dots.push(coords);
  const dot = createDot(...coords);
  document.body.insertAdjacentElement('afterbegin', dot);
});

function updateScore() {
  score += 1;
  document.querySelector('#score').innerHTML = score;
}

function compareDotAndClick(clickArray) {
  const [clickX, clickY] = clickArray;
  const matchedDot = dots.find(dot => {
    const [dotX, dotY] = dot;
    const xMatch = clickX >= dotX - 40 && clickX <= dotX + 40;
    const yMatch = clickY >= dotY - 40 && clickY <= dotY + 40;
    return xMatch && yMatch;
  });
  const note = createNote(clickX * clickY);
  if (matchedDot) {
    updateScore();
    monoSynth.triggerAttackRelease(...note);
  } else {
    synth.triggerAttackRelease(...note);
  }
}

clickObservable.subscribe((val) => {
  compareDotAndClick(val)
});
