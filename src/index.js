import { fromEvent } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';
import Tone from 'tone';
import nr from 'normalize-range';

const synth = new Tone.Synth().toMaster();
const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function normalizeToNote(num) {
  const normalized = nr.wrap(0, notes.length - 1, num);
  return notes[normalized];
}

function normalizeToOctave(num) {
  return nr.wrap(2, 6, num);
}

function createNote(val) {
  const num = val.toString();
  return `${normalizeToNote(num[0])}${normalizeToOctave(num[1])}`;
}

const clickObservable = fromEvent(document, 'click')
  .pipe(map(click => click.clientX * click.clientY))
  .pipe(throttleTime(500))

clickObservable.subscribe((val) => {
  const note = createNote(val);
  synth.triggerAttackRelease(note, "8n");
});
