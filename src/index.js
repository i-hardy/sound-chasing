import { fromEvent, of, timer } from 'rxjs';
import { tap, map, concatMap, throttleTime, repeat } from 'rxjs/operators';
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
  .pipe(throttleTime(500));

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

const dotObservable = of(null)
  .pipe(concatMap(() => timer(Math.random() * 1500)))
  .pipe(repeat())
  .pipe(map(() => createCoordinates()))

dotObservable
  .subscribe(coords => dots.push(coords));

dotObservable
  .pipe(map(coords => createDot(...coords)))
  .subscribe(dotEl => document.body.insertAdjacentElement('afterbegin', dotEl));

function updateScore() {
  score += 1;
  document.querySelector('#score').innerHTML = score;
}

function compareDotAndClick(clickArray) {
  const [clickX, clickY] = clickArray;
  const matchedDot = dots.find(dot => {
    const [dotX, dotY] = dot;
    const xMatch = clickX >= dotX && clickX <= dotX + 20;
    const yMatch = clickY >= dotY && clickY <= dotY + 20;
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
