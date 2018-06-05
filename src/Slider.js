import React from 'react';
import styled from 'styled-components';

function track(isFill) {
  return `
    box-sizing: border-box;
    border: none;
    width: 100%;
    min-width: var(--track-w);
    height: var(--track-h);
    background: var(--track-c);
    ${fill && `
      background: linear-gradient(var(--fill-c), var(--fill-c))
                  0/ var(--sx) 100% no-repeat var(--track-c)
    `}
  `;
}

function fill() {
  return `
    height: var(--track-h);
    background: var(--fill-c)
  `;
}

function thumb() {
  return `
    box-sizing: border-box;
    border: none;
    width: var(--thumb-d); height: var(--thumb-d);
    border-radius: 50%;
    background: white;
  `;
}

const SliderStyle = styled.input`
  --track-w: 12em;
  --track-h: .25em;
  --thumb-d: 1em;
  --track-c: #ccc;
  --fill-c: white;
  
  --min: 0;
  --max: 1;
  --val: 0;

  &[type='range'] {
    &, &::-webkit-slider-thumb {
      -webkit-appearance: none;
    }
    
    --range: calc(var(--max) - var(--min));
    --ratio: calc((var(--val) - var(--min)) / var(--range));
    --sx: calc(.5 * var(--thumb-d) + var(--ratio) * (100% - var(--thumb-d)));
    margin: 0;
    padding: 0;
    width: var(--track-w);
    min-width: var(--track-w);
    height: var(--thumb-d);
    background: transparent;
    font: 1em/1 arial, sans-serif;
    
    &::-webkit-slider-runnable-track {
      ${track(1)}
    }
    &::-moz-range-track { ${track()} }
    &::-ms-track { ${track()} }
    
    &::-moz-range-progress { ${fill()} }
    &::-ms-fill-lower { ${fill()} }
    
    &::-webkit-slider-thumb {
      margin-top: calc(.5 * (var(--track-h) - var(--thumb-d)));
      ${thumb()}
    }
    &::-moz-range-thumb { ${thumb()} }
    &::-ms-thumb {
      margin-top: 0;
      ${thumb()}
    }
    
    &::-ms-tooltip { display: none }
  }
`;

const Slider = (props) => (
  <SliderStyle type="range" {...props} />
)

export default Slider;
