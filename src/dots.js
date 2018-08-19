import { timer } from 'rxjs';
import { map, repeat, delay } from 'rxjs/operators';
import randomColor from 'randomcolor';

const dotTimeout = 900;

function createCoordinates() {
  const minXY = 40;
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;

  const x = Math.floor(Math.random() * (maxX - minXY)) + minXY;
  const y = Math.floor(Math.random() * (maxY - minXY)) + minXY;
  return [x, y];
}

function createDot(x, y) {
  const dot = document.createElement('div');
  dot.setAttribute('class', 'dot');
  dot.setAttribute('style', `background:${randomColor()};top:${y}px;left:${x}px`);
  return dot;
}

timer(dotTimeout)
  .pipe(repeat())
  .pipe(map(() => createCoordinates()))
  .pipe(map(coords => createDot(...coords)))
  .pipe(map(dot => {
    return document.querySelector('#dotsContainer')
      .insertAdjacentElement('afterbegin', dot);
  }))
  .pipe(delay(dotTimeout))
  .subscribe((dot) =>{
    dot.remove();
  });
