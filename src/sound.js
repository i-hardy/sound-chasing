import nr from 'normalize-range';

const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function normalizeToNote(num) {
  const normalized = nr.wrap(0, notes.length - 1, num);
  return notes[normalized];
}

function normalizeToOctave(num) {
  return nr.wrap(2, 6, num);
}

function normalizeToDuration(num) {
  return nr.wrap(0.5, 2, num);
}

function createNote(val) {
  const num = val.toString();
  return [
    `${normalizeToNote(num[0])}${normalizeToOctave(num[1])}`,
    normalizeToDuration(num[num.length - 1]),
  ];
}

export default createNote;
